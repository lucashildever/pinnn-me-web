import { AppIcon, IconMetadata } from './types/app-icon';
import { iconLibrary } from './utils/iconLibrary';
import Image from 'next/image';

interface IconProps {
  iconName: AppIcon;
  strokeWidth?: number;
  color?: string;
}

/**
 * Renders an icon based on the provided name.
 * It serves to create a SimpleIcons component (from SVG path) or return an existing Lucide component
 * from the library.
 */
export default function Icon({ iconName, strokeWidth, color }: IconProps) {
  const iconEntry = Object.values(iconLibrary).find(
    (category) => category[iconName],
  );

  const iconData: IconMetadata | undefined = iconEntry?.[iconName];

  if (!iconData) {
    console.warn(`Icon "${iconName}" not found in library.`);
    return null;
  }

  if (iconData.type === 'simple') {
    return <SimpleIconsComponent iconData={iconData} color={color} />;
  } else if (iconData.type === 'custom-svg') {
    return <CustomSvgIcon iconData={iconData} />;
  } else {
    const LucideComponent = iconData.icon;
    return (
      <LucideComponent size="100%" strokeWidth={strokeWidth} color={color} />
    );
  }
}

interface SimpleIconsComponentProps {
  iconData: Extract<IconMetadata, { type: 'simple' }>;
  color?: string;
}

function SimpleIconsComponent({ iconData, color }: SimpleIconsComponentProps) {
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
      fill={color || 'currentColor'}
    >
      <title>{title}</title>
      <path d={path} />
    </svg>
  );
}

interface CustomSvgIconProps {
  iconData: Extract<IconMetadata, { type: 'custom-svg' }>;
}

function CustomSvgIcon({ iconData }: CustomSvgIconProps) {
  return (
    <Image
      src={iconData.path}
      alt={iconData.label}
      width={24}
      height={24}
      style={{ width: '100%', height: '100%' }}
      unoptimized
      draggable={false}
    />
  );
}
