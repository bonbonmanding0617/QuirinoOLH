/**
 * Validation Utilities - TypeScript version
 * Input validation and sanitization with full type safety
 */

import { ValidationResult, ValidationError } from './types';
import CONFIG from './config';

export function validateEmail(email: string): boolean {
  return CONFIG.VALIDATION.EMAIL_PATTERN.test(email);
}

export function validatePassword(password: string): boolean {
  return !!(password && password.length >= CONFIG.VALIDATION.PASSWORD_MIN_LENGTH);
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  return CONFIG.VALIDATION.PHONE_PATTERN.test(phone);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateISBN(isbn: string): boolean {
  if (!isbn) return false;
  const cleaned = isbn.replace(/[\s\-]/g, '');
  return CONFIG.VALIDATION.ISBN_PATTERN.test(cleaned);
}

export function validateRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

export function validateNumberRange(value: any, min: number, max: number): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

export function validateDate(dateString: string, requiredFuture?: boolean): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  const now = new Date();
  if (requiredFuture === true) {
    return date > now;
  } else if (requiredFuture === false) {
    return date < now;
  }
  return true;
}

export interface ValidationSchema {
  [key: string]: {
    type: 'email' | 'required' | 'phone' | 'number' | 'password' | 'date';
    min?: number;
    max?: number;
    custom?: (value: any) => boolean;
  };
}

export function validateFormData(
  formData: Record<string, any>,
  schema: ValidationSchema
): ValidationResult {
  const errors: Record<string, string> = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    
    if (rules.type === 'required') {
      if (!validateRequired(value)) {
        errors[field] = `${field} is required`;
      }
    } else if (rules.type === 'email') {
      if (value && !validateEmail(value)) {
        errors[field] = `${field} is not a valid email`;
      }
    } else if (rules.type === 'phone') {
      if (value && !validatePhone(value)) {
        errors[field] = `${field} is not a valid phone number`;
      }
    } else if (rules.type === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        errors[field] = `${field} must be a number`;
      } else if (rules.min !== undefined && num < rules.min) {
        errors[field] = `${field} must be at least ${rules.min}`;
      } else if (rules.max !== undefined && num > rules.max) {
        errors[field] = `${field} must be at most ${rules.max}`;
      }
    } else if (rules.type === 'password') {
      if (!validatePassword(value)) {
        errors[field] = `${field} must be at least ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} characters`;
      }
    } else if (rules.type === 'date') {
      if (!validateDate(value)) {
        errors[field] = `${field} must be a valid date`;
      }
    }
    
    if (rules.custom && !rules.custom(value)) {
      errors[field] = `${field} is invalid`;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

export function getValidationErrorMessage(fieldName: string, errorType: string): string {
  const messages: Record<string, string> = {
    'required': `${fieldName} is required`,
    'email': `${fieldName} must be a valid email`,
    'phone': `${fieldName} must be a valid phone number`,
    'password': `${fieldName} must be at least ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    'url': `${fieldName} must be a valid URL`,
    'isbn': `${fieldName} must be a valid ISBN`,
    'number': `${fieldName} must be a valid number`,
    'date': `${fieldName} must be a valid date`
  };
  return messages[errorType] || `${fieldName} is invalid`;
}

export function validatePasswordStrength(password: string): {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 6) score++;
  else feedback.push('At least 6 characters');
  
  if (password.length >= 12) score++;
  else feedback.push('At least 12 characters recommended');
  
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('Add special characters');
  
  const strengthLevels: Array<'weak' | 'fair' | 'good' | 'strong'> = ['weak', 'weak', 'fair', 'good', 'good', 'strong'];
  
  return {
    score,
    strength: strengthLevels[score] || 'weak',
    feedback
  };
}

export function validateCreditCard(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}
