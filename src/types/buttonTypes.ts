const BUTTON_TYPES = {
  Theme: 'theme',
  Message: 'message',
  OnlyText: 'only-text',
} as const;

export type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];
