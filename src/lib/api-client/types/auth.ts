export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  activeMuralId: string;
}

export interface SubscriptionLimits {
  variants_per_pin: number;
  overlapping_variants: number;
  pins_per_group: number;
  overlapping_pins: number;
  own_mural_share_sequence: number | 'unlimited';
  image_size_limit: number;
  video_size_limit: number;
  file_size_limit: number;
  title_variant_max_length: number;
  text_variant_max_length: number;
}

export type SubscriptionFeature = 'basic_pins' | 'basic_murals' | string;

export interface Subscription {
  planType: 'free' | 'pro';
  limits: SubscriptionLimits;
  features: SubscriptionFeature[];
}

export interface AuthResponseData {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
  subscription: Subscription;
}

export interface RefreshResponseData {
  access_token: string;
  refresh_token: string;
  subscription?: Subscription;
}

export interface ValidateResponseData {
  user: AuthUser;
}
