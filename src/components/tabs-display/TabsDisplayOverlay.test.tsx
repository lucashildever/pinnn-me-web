import { act, render, within } from '@testing-library/react';

import TabsDisplay from './TabsDisplay';
import { ActiveTabData, CollectionTab } from './types/collectionTab';

// Must match OVERLAY_FADE_DURATION_MS in TabsDisplay.tsx.
const OVERLAY_FADE_MS = 350;

const collectionTabs: CollectionTab[] = [
  {
    id: '1',
    order: 'a0',
    isMain: true,
    displayElement: { content: 'Tab 1', iconConfig: { type: 'none' } },
  },
  {
    id: '2',
    order: 'a1',
    isMain: false,
    displayElement: { content: 'Tab 2', iconConfig: { type: 'none' } },
  },
];

const activeTabData: ActiveTabData = {
  id: '1',
  displayElement: collectionTabs[0].displayElement,
};

let observerCallback: IntersectionObserverCallback;
let observedTarget: Element | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];

  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe(target: Element) {
    observedTarget = target;
  }

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

function rect(left: number, right: number) {
  return {
    x: left,
    y: 0,
    top: 0,
    bottom: 40,
    left,
    right,
    width: right - left,
    height: 40,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('TabsDisplay overlay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function renderTabsDisplay(active: ActiveTabData = activeTabData) {
    const { container, rerender } = render(
      <TabsDisplay
        collectionTabs={collectionTabs}
        activeTabData={active}
        handleTabChange={jest.fn()}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const getOverlay = () =>
      container.querySelector('.collection-tab-overlay') as HTMLElement;
    const tabsContainer = container.querySelector(
      '.tabs-container',
    ) as HTMLElement;

    const rerenderWithTab = (next: ActiveTabData) =>
      rerender(
        <TabsDisplay
          collectionTabs={collectionTabs}
          activeTabData={next}
          handleTabChange={jest.fn()}
        />,
      );

    return { container, getOverlay, tabsContainer, rerenderWithTab };
  }

  function emitIntersection(ratio: number) {
    act(() => {
      observerCallback(
        [
          {
            intersectionRatio: ratio,
            isIntersecting: ratio > 0,
            target: observedTarget!,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });
  }

  function mockActiveTabBox(tabsContainer: HTMLElement, tabRect: DOMRect) {
    jest
      .spyOn(tabsContainer, 'getBoundingClientRect')
      .mockReturnValue(rect(0, 500));

    return jest
      .spyOn(observedTarget as HTMLElement, 'getBoundingClientRect')
      .mockReturnValue(tabRect);
  }

  it('renders a single overlay element', () => {
    const { container } = renderTabsDisplay();

    expect(
      container.querySelectorAll('.collection-tab-overlay').length,
    ).toBe(1);
  });

  it('keeps the overlay hidden while more than 20% of the active tab is visible', () => {
    const { getOverlay, tabsContainer } = renderTabsDisplay();

    mockActiveTabBox(tabsContainer, rect(-120, 80));

    emitIntersection(0.3);

    expect(getOverlay().className).not.toContain('visible');
  });

  it('shows the overlay once 80% of the active tab is out of view', () => {
    const { getOverlay, tabsContainer } = renderTabsDisplay();

    mockActiveTabBox(tabsContainer, rect(-160, 40));

    emitIntersection(0.2);

    expect(getOverlay().className).toContain('visible');
  });

  it('shows the overlay when the page loads with the active tab already out of view', () => {
    const { getOverlay, tabsContainer } = renderTabsDisplay({
      id: '2',
      displayElement: collectionTabs[1].displayElement,
    });

    // The last tab is laid out past the right edge and never crossed the
    // threshold: the observer reports it as not intersecting (ratio 0).
    mockActiveTabBox(tabsContainer, rect(520, 720));

    emitIntersection(0);

    const overlay = getOverlay();
    expect(overlay.className).toContain('visible');
    expect(overlay.className).toContain('right');
    expect(within(overlay).getByText('Tab 2')).toBeInTheDocument();
  });

  it('shows the overlay on the left when the page loads with the active tab behind the start', () => {
    const { getOverlay, tabsContainer } = renderTabsDisplay();

    mockActiveTabBox(tabsContainer, rect(-220, -20));

    emitIntersection(0);

    const overlay = getOverlay();
    expect(overlay.className).toContain('visible');
    expect(overlay.className).toContain('left');
  });

  it('hides the overlay again when the active tab becomes fully visible', () => {
    const { getOverlay, tabsContainer } = renderTabsDisplay();

    mockActiveTabBox(tabsContainer, rect(-160, 40));

    emitIntersection(0.2);
    expect(getOverlay().className).toContain('visible');

    emitIntersection(1);
    expect(getOverlay().className).not.toContain('visible');
  });

  it('only shows the overlay on the other side after the current one disappears', () => {
    const { getOverlay, tabsContainer } = renderTabsDisplay();
    const overlay = getOverlay();

    const tabRectSpy = mockActiveTabBox(tabsContainer, rect(-160, 40));

    emitIntersection(0.2);
    expect(overlay.className).toContain('visible');
    expect(overlay.className).toContain('left');

    // The active tab is now leaving through the right edge.
    tabRectSpy.mockReturnValue(rect(460, 660));

    emitIntersection(0.2);

    // Old overlay still holds its own content while fading out.
    expect(overlay.className).not.toContain('visible');
    expect(within(overlay).getByText('Tab 1')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(OVERLAY_FADE_MS);
    });

    expect(overlay.className).toContain('visible');
    expect(overlay.className).toContain('right');
    expect(overlay.className).not.toContain('left');
  });

  it('only updates the overlay content after the previous one disappears on tab change', () => {
    const { getOverlay, tabsContainer, rerenderWithTab } = renderTabsDisplay();
    const overlay = getOverlay();

    mockActiveTabBox(tabsContainer, rect(-160, 40));

    emitIntersection(0.2);
    expect(within(overlay).getByText('Tab 1')).toBeInTheDocument();

    rerenderWithTab({
      id: '2',
      displayElement: collectionTabs[1].displayElement,
    });

    // The old overlay is fading out with the old data.
    expect(overlay.className).not.toContain('visible');
    expect(within(overlay).getByText('Tab 1')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    mockActiveTabBox(tabsContainer, rect(-160, 40));
    emitIntersection(0.2);

    // Still fading out: no content swap yet.
    expect(overlay.className).not.toContain('visible');
    expect(within(overlay).getByText('Tab 1')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(OVERLAY_FADE_MS - 100);
    });

    expect(overlay.className).toContain('visible');
    expect(within(overlay).getByText('Tab 2')).toBeInTheDocument();
    expect(within(overlay).queryByText('Tab 1')).not.toBeInTheDocument();
  });

  it('updates the overlay content in place when the active tab itself changes', () => {
    const { getOverlay, tabsContainer, rerenderWithTab } = renderTabsDisplay();
    const overlay = getOverlay();

    mockActiveTabBox(tabsContainer, rect(-160, 40));

    emitIntersection(0.2);
    expect(within(overlay).getByText('Tab 1')).toBeInTheDocument();

    rerenderWithTab({
      id: '1',
      displayElement: { content: 'Tab 1 renamed', iconConfig: { type: 'none' } },
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    mockActiveTabBox(tabsContainer, rect(-160, 40));
    emitIntersection(0.2);

    expect(overlay.className).toContain('visible');
    expect(within(overlay).getByText('Tab 1 renamed')).toBeInTheDocument();
  });
});
