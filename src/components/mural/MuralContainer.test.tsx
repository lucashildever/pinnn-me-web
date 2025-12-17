import { render } from '@testing-library/react';
import MuralContainer from './MuralContainer';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('../../lib/state/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}));

describe('MuralContainer', () => {
  it('should throw error if muralId is missing', () => {
    // Suppress console.error for the expected error
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(
        <MuralContainer
          muralId=""
          displayName="Test Mural"
          description="Test Description"
          collections={[]}
          paramCollectionId={undefined}
        />,
      );
    }).toThrow('MuralId is required');

    consoleSpy.mockRestore();
  });
});
