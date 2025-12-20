import { AppIcon, IconMetadata } from './types/app-icon';
import { iconLibrary } from './utils/iconLibrary';

interface IconProps {
  iconName: AppIcon;
}

/**
 * Renders an icon based on the provided name.
 * It serves to create a SimpleIcons component (from SVG path) or return an existing Lucide component
 * from the library.
 */
export default function Icon({ iconName }: IconProps) {
  const iconEntry = Object.values(iconLibrary).find(
    (category) => category[iconName],
  );

  const iconData: IconMetadata | undefined = iconEntry?.[iconName];

  if (!iconData) {
    console.warn(`Icon "${iconName}" not found in library.`);
    return null;
  }

  if (iconData.type === 'simple') {
    return <SimpleIconsComponent iconData={iconData} />;
  } else {
    const LucideComponent = iconData.icon;
    return <LucideComponent size="100%" />;
  }
}

interface SimpleIconsComponentProps {
  iconData: Extract<IconMetadata, { type: 'simple' }>;
}

function SimpleIconsComponent({ iconData }: SimpleIconsComponentProps) {
  const { title, path } = iconData.icon;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
    >
      <title>{title}</title>
      <path d={path} />
    </svg>
  );
}
