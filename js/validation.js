/**
 * Validation Utilities - Input validation and sanitization
 * Provides functions for validating common data types
 */

/**
 * Validate email format
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password strength
 * Requirements: At least 6 characters
 */
function validatePassword(password) {
    return password && password.length >= 6;
}

/**
 * Validate phone number format
 * Supports various formats
 */
function validatePhone(phone) {
    if (!phone) return false;
    const regex = /^[\d\s\-\+\(\)]{7,}$/;
    return regex.test(phone);
}

/**
 * Validate URL format
 */
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate ISBN format (simplified)
 */
function validateISBN(isbn) {
    if (!isbn) return false;
    // Remove hyphens and spaces
    const cleaned = isbn.replace(/[\s\-]/g, '');
    // Check for ISBN-10 or ISBN-13 format
    return /^\d{10}(\d{3})?$/.test(cleaned);
}

/**
 * Validate required field is not empty
 */
function validateRequired(value) {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
}

/**
 * Validate number is within range
 */
function validateNumberRange(value, min, max) {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
}

/**
 * Validate date is valid and optionally in future or past
 */
function validateDate(dateString, requiredFuture = null) {
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

/**
 * Validate form data against schema
 * Schema format: { fieldName: { type: 'email'|'required'|'phone'|'number', min?, max? }, ... }
 */
function validateFormData(formData, schema) {
    const errors = {};
    
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
                errors[field] = `${field} must be at least 6 characters`;
            }
        }
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Sanitize HTML to prevent XSS
 */
function sanitizeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Sanitize user input by removing dangerous characters
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .trim();
}

/**
 * Validate file type
 */
function validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
}

/**
 * Validate file size (in bytes)
 */
function validateFileSize(file, maxSizeInMB) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
}

/**
 * Get validation error message
 */
function getValidationErrorMessage(fieldName, errorType) {
    const messages = {
        'required': `${fieldName} is required`,
        'email': `${fieldName} must be a valid email`,
        'phone': `${fieldName} must be a valid phone number`,
        'password': `${fieldName} must be at least 6 characters`,
        'url': `${fieldName} must be a valid URL`,
        'isbn': `${fieldName} must be a valid ISBN`,
        'number': `${fieldName} must be a valid number`,
        'date': `${fieldName} must be a valid date`
    };
    return messages[errorType] || `${fieldName} is invalid`;
}
