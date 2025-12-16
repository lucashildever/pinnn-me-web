import { render, screen } from '@testing-library/react';
import { EmbedConfig } from '../types/embed';
import Embed from './Embed';

describe('Embed', () => {
  it("Should show message when 'config-html' is empty", () => {
    const mockConfig: EmbedConfig = {
      url: 'www.spotify.com',
      platform: 'spotify',
      html: '',
    };

    render(<Embed config={mockConfig} />);

    expect(screen.getByText('Embed unavailable')).toBeInTheDocument();
  });

  it('should render HTML when provided', () => {
    const mockConfig: EmbedConfig = {
      url: 'www.spotify.com',
      platform: 'spotify',
      html: '<div>Embed content</div>',
    };

    const { container } = render(<Embed config={mockConfig} />);

    expect(container.innerHTML).toContain('Embed content');
  });

  it('Should apply correct platform class', () => {
    const mockConfig: EmbedConfig = {
      url: 'www.spotify.com',
      platform: 'spotify',
      html: '<div>Embed content</div>',
    };

    const { container } = render(<Embed config={mockConfig} />);

    const embedDiv = container.querySelector('.spotify');

    expect(embedDiv).toBeInTheDocument();
  });
});
