import { AppIcon, IconData } from './types/icon';
import { iconLibrary } from './utils/iconLibrary';

interface IconProps {
  iconName: AppIcon;
}

export default function Icon({ iconName }: IconProps) {
  const iconData: IconData = iconLibrary[iconName];

  if (iconData.type === 'simple') {
    return <SimpleIconsComponent iconData={iconData} size={24} />;
  } else {
    const LucideComponent = iconData.icon;
    return <LucideComponent />;
  }
}

interface SimpleIconsComponentProps {
  iconData: Extract<IconData, { type: 'simple' }>;
  size?: number;
}

function SimpleIconsComponent({
  iconData,
  size = 24,
}: SimpleIconsComponentProps) {
  const { title, path } = iconData.icon;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="#272727"
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
    >
      <title>{title}</title>
      <path d={path} />
    </svg>
  );
}
