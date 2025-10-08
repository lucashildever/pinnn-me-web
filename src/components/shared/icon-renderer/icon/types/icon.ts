import { LucideIcon } from 'lucide-react';

const ICONS: Record<string, string> = {
  Tiktok: 'tiktok',
  Instagram: 'instagram',
  ArrowUpRight: 'arrowUpRight',
  Download: 'download',
  Options: 'options',
  Message: 'message',
  Pinterest: 'pinterest',
  Twitch: 'twitch',
  Link: 'link',
} as const;

export type AppIcon = (typeof ICONS)[keyof typeof ICONS];

const ICON_CATEGORIES = {
  Arrows: 'arrows',
  Social: 'social',
  Action: 'actions',
  Navigation: 'navigation',
  Communication: 'communication',
} as const;

type IconCategoryType = (typeof ICON_CATEGORIES)[keyof typeof ICON_CATEGORIES];

interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
  svg: string;
  path: string;
  source?: string;
  guidelines?: string | null;
}

type LucideComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type IconData =
  | {
      type: 'simple';
      icon: SimpleIcon;
      label: string;
      category: IconCategoryType;
    }
  | {
      type: 'lucide';
      icon: LucideComponent;
      label: string;
      category: IconCategoryType;
    };
