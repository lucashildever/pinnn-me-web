import type { LucideIcon } from 'lucide-react';

export const ICONS = {
  Tiktok: 'tiktok',
  Instagram: 'instagram',
  ArrowUpRight: 'arrowUpRight',
  ArrowLeft: 'arrowLeft',
  Download: 'download',
  Options: 'options',
  Close: 'close',
  Plus: 'plus',
  ChevronDown: 'chevronDown',
  ChevronUp: 'chevronUp',
  Trash: 'trash',
  Heading: 'heading',
  AlignLeft: 'alignLeft',
  Image: 'image',
  Video: 'video',
  Puzzle: 'puzzle',
  Message: 'message',
  Pinterest: 'pinterest',
  Twitch: 'twitch',
  Link: 'link',
  File: 'file',
  Forward: 'forward',
  FileDown: 'fileDown',
  Loading: 'loading',
  Youtube: 'youtube',
  X: 'x',
  Share: 'share',
  Title: 'title',
  Text: 'text',
  Settings: 'settings',
  Pencil: 'pencil',
  ImageUp: 'imageUp',
  RefreshCw: 'refreshCw',
  Pin: 'pin',
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
    }
  | {
      type: 'custom-svg';
      path: string;
      label: string;
    };

export type IconConfig =
  | { type: 'none' }
  | { type: 'predefined'; icon: AppIcon }
  | { type: 'custom'; url: string }
  | { type: 'emoji'; unicode: string };

// not available for user selection
export const RESERVED_ICONS: AppIcon[] = [
  'arrowUpRight',
  'arrowLeft',
  'loading',
  'options',
  'close',
  'plus',
  'chevronDown',
  'chevronUp',
  'trash',
  'heading',
  'alignLeft',
  'settings',
  'pencil',
  'imageUp',
  'refreshCw',
  'forward',
  'title',
  'text',
];
