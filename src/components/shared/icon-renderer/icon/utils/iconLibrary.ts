import { Download, ArrowUpRight, EllipsisVertical, SendHorizonal, Link, File } from 'lucide-react';
import { siInstagram, siTiktok, siPinterest, siTwitch, siYoutube, siX } from 'simple-icons'

// usar campo "label" no alt do componente/svg
import { IconData } from '../types/icon';

export const iconLibrary: Record<string, IconData> = {
  // Arrows
  arrowUpRight: { type: 'lucide', icon: ArrowUpRight, label: 'Arrow Up Right', category: 'arrows' },
  
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
  ////
  
  // // Navegação
  // home: { type: 'lucide', icon: Home, label: 'Home', category: 'navigation' },
  // search: { type: 'lucide', icon: Search, label: 'Buscar', category: 'navigation' },
  
  // // Usuário
  // user: { type: 'lucide', icon: User, label: 'Usuário', category: 'user' },
  // settings: { type: 'lucide', icon: Settings, label: 'Configurações', category: 'user' },
  // logIn: { type: 'lucide', icon: LogIn, label: 'Entrar', category: 'user' },
  // logOut: { type: 'lucide', icon: LogOut, label: 'Sair', category: 'user' },
  
  // // Comunicação
  // bell: { type: 'lucide', icon: Bell, label: 'Notificação', category: 'communication' },
  // mail: { type: 'lucide', icon: Mail, label: 'Email', category: 'communication' },
  // messageCircle: { type: 'lucide', icon: MessageCircle, label: 'Mensagem', category: 'communication' },
  // phone: { type: 'lucide', icon: Phone, label: 'Telefone', category: 'communication' },
  
  // // Ações
  // edit: { type: 'lucide', icon: Edit, label: 'Editar', category: 'actions' },
  // trash2: { type: 'lucide', icon: Trash2, label: 'Excluir', category: 'actions' },
  // plus: { type: 'lucide', icon: Plus, label: 'Adicionar', category: 'actions' },
  // minus: { type: 'lucide', icon: Minus, label: 'Remover', category: 'actions' },
  // check: { type: 'lucide', icon: Check, label: 'Confirmar', category: 'actions' },
  // x: { type: 'lucide', icon: X, label: 'Fechar', category: 'actions' },
  // save: { type: 'lucide', icon: Save, label: 'Salvar', category: 'actions' },
  // send: { type: 'lucide', icon: Send, label: 'Enviar', category: 'actions' },
  // copy: { type: 'lucide', icon: Copy, label: 'Copiar', category: 'actions' },

  
  // // Favoritos
  // star: { type: 'lucide', icon: Star, label: 'Estrela', category: 'favorites' },
  // heart: { type: 'lucide', icon: Heart, label: 'Coração', category: 'favorites' },
  // bookmark: { type: 'lucide', icon: Bookmark, label: 'Favorito', category: 'favorites' },
  
  // // Arquivos
  // fileText: { type: 'lucide', icon: FileText, label: 'Documento', category: 'files' },
  // folder: { type: 'lucide', icon: Folder, label: 'Pasta', category: 'files' },
  // image: { type: 'lucide', icon: Image, label: 'Imagem', category: 'files' },
  // video: { type: 'lucide', icon: Video, label: 'Vídeo', category: 'files' },
  // music: { type: 'lucide', icon: Music, label: 'Música', category: 'files' },
  
  // // Segurança
  // lock: { type: 'lucide', icon: Lock, label: 'Bloqueado', category: 'security' },
  // unlock: { type: 'lucide', icon: Unlock, label: 'Desbloqueado', category: 'security' },
  // eye: { type: 'lucide', icon: Eye, label: 'Visível', category: 'security' },
  // eyeOff: { type: 'lucide', icon: EyeOff, label: 'Oculto', category: 'security' },
  
  // // Tech
  // code: { type: 'lucide', icon: Code, label: 'Código', category: 'tech' },
  // database: { type: 'lucide', icon: Database, label: 'Banco de Dados', category: 'tech' },
  // server: { type: 'lucide', icon: Server, label: 'Servidor', category: 'tech' },
  // cloud: { type: 'lucide', icon: Cloud, label: 'Nuvem', category: 'tech' },
  // wifi: { type: 'lucide', icon: Wifi, label: 'WiFi', category: 'tech' },
  
  // // Outros
  // calendar: { type: 'lucide', icon: Calendar, label: 'Calendário', category: 'other' },
  // clock: { type: 'lucide', icon: Clock, label: 'Relógio', category: 'other' },
  // mapPin: { type: 'lucide', icon: MapPin, label: 'Localização', category: 'other' },
  // sun: { type: 'lucide', icon: Sun, label: 'Sol', category: 'other' },
  // moon: { type: 'lucide', icon: Moon, label: 'Lua', category: 'other' },
  // coffee: { type: 'lucide', icon: Coffee, label: 'Café', category: 'other' },
  // smile: { type: 'lucide', icon: Smile, label: 'Sorriso', category: 'other' },
};