import type { LucideIcon } from 'lucide-react';

export const ICONS = {
  Tiktok: 'tiktok',
  Instagram: 'instagram',
  ArrowUpRight: 'arrowUpRight',
  Download: 'download',
  Options: 'options',
  Message: 'message',
  Pinterest: 'pinterest',
  Twitch: 'twitch',
  Link: 'link',
  File: 'file',
  Loading: 'loading',
  Youtube: 'youtube',
  X: 'x',
  Repeat: 'repeat',
} as const;

export type AppIcon = (typeof ICONS)[keyof typeof ICONS];

interface SimpleIcon {
  title: string;
  slug?: string;
  hex?: string;
  svg?: string;
  path: string;
  source?: string;
  guidelines?: string | null;
}

export type IconMetadata =
  | {
      type: 'simple';
      icon: SimpleIcon;
      label: string;
    }
  | {
      type: 'lucide';
      icon: LucideIcon;
      label: string;
    };

export type IconConfig =
  | { type: 'none' }
  | { type: 'predefined'; icon: AppIcon }
  | { type: 'custom'; url: string }
  | { type: 'emoji'; unicode: string };
