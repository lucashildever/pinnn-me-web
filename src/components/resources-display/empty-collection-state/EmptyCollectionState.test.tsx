import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

import authReducer from '@/lib/state/slices/authSlice';
import muralReducer from '@/lib/state/slices/muralSlice';
import EmptyCollectionState from './EmptyCollectionState';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const renderWithAuth = (token: string) => {
  const store = configureStore({
    reducer: { auth: authReducer, mural: muralReducer },
    preloadedState: {
      auth: { token, subscription: null },
      mural: { activeMuralId: '' },
    },
  });

  return render(
    <Provider store={store}>
      <EmptyCollectionState />
    </Provider>,
  );
};

describe('EmptyCollectionState', () => {
  it('shows the empty state message', () => {
    renderWithAuth('');

    expect(
      screen.getByText(/nenhum pin encontrado nesta coleção/i),
    ).toBeInTheDocument();
  });

  it('renders the create pin CTA when the user is authenticated', () => {
    renderWithAuth('a-valid-token');

    const cta = screen.getByRole('link', { name: /criar pin/i });

    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/create/resource');
  });

  it('does not render the create pin CTA when the user is not authenticated', () => {
    renderWithAuth('');

    expect(
      screen.queryByRole('link', { name: /criar pin/i }),
    ).not.toBeInTheDocument();
  });
});
