/**
 * Configuration Module - TypeScript version
 * Centralized configuration with full type safety
 */

export interface ApiConfig {
  BASE_URL: string;
  TIMEOUT: number;
  RETRY_COUNT: number;
}

export interface AuthConfig {
  TOKEN_KEY: string;
  USER_KEY: string;
  LOGIN_URL: string;
}

export interface PaginationConfig {
  PAGE_SIZE: number;
  MAX_PAGES: number;
}

export interface ValidationConfig {
  EMAIL_PATTERN: RegExp;
  PHONE_PATTERN: RegExp;
  PASSWORD_MIN_LENGTH: number;
  ISBN_PATTERN: RegExp;
}

export interface FileUploadConfig {
  ALLOWED_TYPES: string[];
  MAX_SIZE_MB: number;
  CATEGORIES: string[];
}

export interface BorrowConfig {
  MAX_BOOKS_PER_USER: number;
  LOAN_DURATION_DAYS: number;
  FINE_PER_DAY: number;
}

export interface UIConfig {
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  THEME: 'light' | 'dark';
}

export interface FeaturesConfig {
  ADMIN: boolean;
  TEACHER: boolean;
  STUDENT: boolean;
  ANALYTICS: boolean;
  EBOOKS: boolean;
  CHANGE_REQUESTS: boolean;
}

export interface RolesConfig {
  ADMIN: string;
  TEACHER: string;
  STUDENT: string;
}

export interface StatusConfig {
  ACTIVE: string;
  INACTIVE: string;
  BORROWED: string;
  RETURNED: string;
  OVERDUE: string;
}

export interface MessagesConfig {
  LOGIN_SUCCESS: string;
  LOGOUT_SUCCESS: string;
  REGISTER_SUCCESS: string;
  ERROR_GENERIC: string;
  [key: string]: string;
}

export interface ColorsConfig {
  PRIMARY: string;
  SECONDARY: string;
  SUCCESS: string;
  ERROR: string;
  WARNING: string;
}

export interface HttpStatusConfig {
  OK: number;
  CREATED: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  NOT_FOUND: number;
  SERVER_ERROR: number;
}

export interface AppConfig {
  API: ApiConfig;
  AUTH: AuthConfig;
  PAGINATION: PaginationConfig;
  VALIDATION: ValidationConfig;
  FILE_UPLOAD: FileUploadConfig;
  BORROW: BorrowConfig;
  UI: UIConfig;
  FEATURES: FeaturesConfig;
  ROLES: RolesConfig;
  STATUS: StatusConfig;
  MESSAGES: MessagesConfig;
  COLORS: ColorsConfig;
  HTTP_STATUS: HttpStatusConfig;
}

const CONFIG: AppConfig = {
  API: {
    BASE_URL: 'http://localhost:3001/api',
    TIMEOUT: 30000,
    RETRY_COUNT: 3
  },
  AUTH: {
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data',
    LOGIN_URL: '/pages/admin-login.html'
  },
  PAGINATION: {
    PAGE_SIZE: 20,
    MAX_PAGES: 100
  },
  VALIDATION: {
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_PATTERN: /^[0-9\-\+\(\)\s]{7,}$/,
    PASSWORD_MIN_LENGTH: 6,
    ISBN_PATTERN: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[X0-9]$/
  },
  FILE_UPLOAD: {
    ALLOWED_TYPES: ['application/pdf', 'application/epub+zip', 'text/plain'],
    MAX_SIZE_MB: 50,
    CATEGORIES: ['ebooks', 'documents', 'media']
  },
  BORROW: {
    MAX_BOOKS_PER_USER: 5,
    LOAN_DURATION_DAYS: 14,
    FINE_PER_DAY: 10
  },
  UI: {
    PRIMARY_COLOR: '#E67E22',
    SECONDARY_COLOR: '#D35400',
    THEME: 'light'
  },
  FEATURES: {
    ADMIN: true,
    TEACHER: true,
    STUDENT: true,
    ANALYTICS: true,
    EBOOKS: true,
    CHANGE_REQUESTS: true
  },
  ROLES: {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
  },
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BORROWED: 'borrowed',
    RETURNED: 'returned',
    OVERDUE: 'overdue'
  },
  MESSAGES: {
    LOGIN_SUCCESS: 'Login successful!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Registration successful!',
    ERROR_GENERIC: 'An error occurred. Please try again.'
  },
  COLORS: {
    PRIMARY: '#E67E22',
    SECONDARY: '#D35400',
    SUCCESS: '#27AE60',
    ERROR: '#E74C3C',
    WARNING: '#F39C12'
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
};

export function getApiUrl(): string {
  return CONFIG.API.BASE_URL;
}

export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    teacher: 'Teacher',
    student: 'Student'
  };
  return roleNames[role] || role;
}

export function hasRole(role: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(role);
}

export function isAdmin(role: string): boolean {
  return role === CONFIG.ROLES.ADMIN;
}

export function isTeacher(role: string): boolean {
  return role === CONFIG.ROLES.TEACHER;
}

export function isStudent(role: string): boolean {
  return role === CONFIG.ROLES.STUDENT;
}

export function getMessage(key: string): string {
  return CONFIG.MESSAGES[key] || key;
}

export default CONFIG;
