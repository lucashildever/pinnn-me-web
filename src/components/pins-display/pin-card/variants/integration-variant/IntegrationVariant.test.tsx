import IntegrationVariant from './IntegrationVariant';
import { render, screen } from '@testing-library/react';
import { EmbedConfig } from './types/embed';

describe('IntegrationVariant', () => {
  it('Should render provided caption', () => {
    const mockConfig: EmbedConfig = {
      url: 'https://spotify.com',
      html: '<div>embed</div>',
      platform: 'spotify',
    };

    render(
      <IntegrationVariant embedConfig={mockConfig} caption="Card caption" />,
    );

    expect(screen.getByText('Card caption')).toBeInTheDocument();
  });

  it('Should render the Embed component', () => {
    const mockConfig: EmbedConfig = {
      url: 'https://spotify.com',
      html: '<div>embed content</div>',
      platform: 'spotify',
    };

    const { container } = render(
      <IntegrationVariant embedConfig={mockConfig} caption="Teste" />,
    );

    expect(container.querySelector('.embed-container')).toBeInTheDocument();
  });
});
