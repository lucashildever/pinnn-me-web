import IntegrationVariant from './IntegrationVariant';
import { render, screen } from '@testing-library/react';
import { IntegrationConfig } from '@/components/resources-display/pin/types/variant';

describe('IntegrationVariant', () => {
  it('Should render Spotify embed with valid URL', () => {
    const mockData: IntegrationConfig['embedConfig'] = {
      url: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
      platform: 'spotify',
    };

    const { container } = render(<IntegrationVariant data={mockData} />);

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh',
    );
  });

  it('Should render HTML when provided by backend', () => {
    const mockData: IntegrationConfig['embedConfig'] = {
      url: 'https://spotify.com',
      html: '<div data-testid="backend-html">embed content</div>',
      platform: 'spotify',
    };

    render(<IntegrationVariant data={mockData} />);

    expect(screen.getByTestId('backend-html')).toBeInTheDocument();
  });

  it('Should render fallback for unsupported platform', () => {
    const mockData: IntegrationConfig['embedConfig'] = {
      url: 'https://example.com/some-content',
      platform: 'linkedin',
    };

    render(<IntegrationVariant data={mockData} />);

    expect(screen.getByText('linkedin')).toBeInTheDocument();
    expect(screen.getByText('Abrir link')).toBeInTheDocument();
  });
});
