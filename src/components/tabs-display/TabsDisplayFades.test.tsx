import { act, render } from '@testing-library/react';

import TabsDisplay from './TabsDisplay';
import { ActiveTabData, CollectionTab } from './types/collectionTab';

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

function setScrollState(
  element: HTMLElement,
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
) {
  Object.defineProperties(element, {
    scrollLeft: { configurable: true, value: scrollLeft, writable: true },
    clientWidth: { configurable: true, value: clientWidth },
    scrollWidth: { configurable: true, value: scrollWidth },
  });
}

describe('TabsDisplay fades', () => {
  beforeEach(() => {
    // Prevents the IntersectionObserver timeout from running.
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function renderTabsDisplay() {
    const { container } = render(
      <TabsDisplay
        collectionTabs={collectionTabs}
        activeTabData={activeTabData}
        handleTabChange={jest.fn()}
      />,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    const scroller = container.querySelector('.tabs-container') as HTMLElement;

    return { wrapper, scroller };
  }

  function scrollTo(
    scroller: HTMLElement,
    scrollLeft: number,
    clientWidth = 500,
    scrollWidth = 1000,
  ) {
    setScrollState(scroller, scrollLeft, clientWidth, scrollWidth);

    act(() => {
      scroller.dispatchEvent(new Event('scroll'));
    });
  }

  it('hides the left fade when the list is at the start', () => {
    const { wrapper, scroller } = renderTabsDisplay();

    scrollTo(scroller, 0);

    expect(wrapper.classList.contains('hide-left-fade')).toBe(true);
    expect(wrapper.classList.contains('hide-right-fade')).toBe(false);
  });

  it('shows both fades when the list is scrolled to the middle', () => {
    const { wrapper, scroller } = renderTabsDisplay();

    scrollTo(scroller, 250);

    expect(wrapper.classList.contains('hide-left-fade')).toBe(false);
    expect(wrapper.classList.contains('hide-right-fade')).toBe(false);
  });

  it('hides the right fade when the list is at the end', () => {
    const { wrapper, scroller } = renderTabsDisplay();

    scrollTo(scroller, 500);

    expect(wrapper.classList.contains('hide-left-fade')).toBe(false);
    expect(wrapper.classList.contains('hide-right-fade')).toBe(true);
  });

  it('hides both fades when the tabs fit inside the container', () => {
    const { wrapper, scroller } = renderTabsDisplay();

    scrollTo(scroller, 0, 500, 500);

    expect(wrapper.classList.contains('hide-left-fade')).toBe(true);
    expect(wrapper.classList.contains('hide-right-fade')).toBe(true);
  });
});
