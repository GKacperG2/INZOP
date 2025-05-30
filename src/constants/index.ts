// Constants used throughout the application

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp']
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'To pole jest wymagane',
  INVALID_FILE_TYPE: 'Nieprawidłowy typ pliku',
  FILE_TOO_LARGE: 'Plik jest za duży',
  INVALID_YEAR: 'Nieprawidłowy rok',
  TITLE_TOO_SHORT: 'Tytuł musi mieć co najmniej 3 znaki',
  CONTENT_TOO_SHORT: 'Treść notatki musi mieć co najmniej 10 znaków'
} as const;

export const UI_CONSTANTS = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  MAX_TITLE_LENGTH: 100,
  MAX_CONTENT_LENGTH: 10000
} as const;

export const ROUTES = {
  HOME: '/',
  ADD_NOTE: '/add-note',
  VIEW_NOTE: '/note',
  LOGIN: '/login',
  REGISTER: '/register',
  SETTINGS: '/settings'
} as const;
