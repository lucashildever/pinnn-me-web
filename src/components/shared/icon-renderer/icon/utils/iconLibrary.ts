import { 
  Download, ArrowUpRight, EllipsisVertical,
  SendHorizonal, Link, File, LoaderCircle
} from 'lucide-react';
import { 
  siInstagram, siTiktok, siPinterest, siTwitch,
  siYoutube, siX
} from 'simple-icons'

import { IconData } from '../types/icon';

export const iconLibrary: Record<string, IconData> = {
  // Motion
  arrowUpRight: { type: 'lucide', icon: ArrowUpRight, label: 'Arrow Up Right', category: 'motion' },
  loading: { type: 'lucide', icon: LoaderCircle, label: 'Arrow Up Right', category: 'motion' },
  
  // Social
  instagram: { type: 'simple', icon: siInstagram, label: 'Instagram', category: 'social' },
  tiktok: { type: 'simple', icon: siTiktok, label: 'Tiktok', category: 'social' },
  pinterest: { type: 'simple', icon: siPinterest, label: 'Pinterest', category: 'social' },
  twitch: { type: 'simple', icon: siTwitch, label: 'Twitch', category: 'social' },
  youtube: { type: 'simple', icon: siYoutube, label: 'YouTube', category: 'social' },
  x: { type: 'simple', icon: siX, label: 'X (Twitter)', category: 'social' },

  // Actions
  download: { type: 'lucide', icon: Download, label: 'Download', category: 'actions' },

  // Navigation
  options: {type: 'lucide', icon: EllipsisVertical, label: 'Options icon', category: 'navigation'},
  link: {type: 'lucide', icon: Link, label: 'Link icon', category: 'navigation'},
  
  // Communication
  message: {type: 'lucide', icon: SendHorizonal, label: 'Message Icon', category: 'communication'},
  
  // Documents
  file: { type: 'lucide', icon: File, label: 'File Icon', category: 'documents' },
};