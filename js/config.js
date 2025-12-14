/**
 * Configuration File - Central configuration management
 * Contains all configurable constants for the application
 */

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
        TIMEOUT: 30000, // 30 seconds
        RETRY_COUNT: 3,
        RETRY_DELAY: 1000
    },

    // Authentication
    AUTH: {
        TOKEN_KEY: 'token',
        USER_KEY: 'currentUser',
        TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
        REDIRECT_TO_LOGIN: '/pages/student-login.html'
    },

    // Pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZES: [10, 25, 50, 100]
    },

    // Validation Rules
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 6,
        PHONE_PATTERN: /^[\d\s\-\+\(\)]{7,}$/,
        EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        ISBN_PATTERN: /^\d{10}(\d{3})?$/
    },

    // File Upload
    FILE_UPLOAD: {
        MAX_FILE_SIZE_MB: 50,
        ALLOWED_TYPES: {
            EBOOK: ['application/pdf', 'application/epub+zip'],
            IMAGE: ['image/jpeg', 'image/png', 'image/gif']
        },
        UPLOAD_DIRECTORY: '/uploads'
    },

    // Borrow Settings
    BORROW: {
        DEFAULT_DURATION_DAYS: 14,
        MAX_ACTIVE_BORROWS: 5,
        OVERDUE_FINE_PER_DAY: 0 // Set to amount if applicable
    },

    // UI Settings
    UI: {
        TOAST_DURATION_MS: 5000,
        MODAL_ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 500
    },

    // Features
    FEATURES: {
        ENABLE_EBOOK_DOWNLOAD: true,
        ENABLE_FORCE_RETURN: true,
        ENABLE_APPROVAL_WORKFLOW: true,
        ENABLE_ANALYTICS: true
    },

    // Roles
    ROLES: {
        ADMIN: 'admin',
        TEACHER: 'teacher',
        STUDENT: 'student'
    },

    // Status Constants
    STATUS: {
        BORROW: {
            BORROWED: 'borrowed',
            RETURNED: 'returned',
            OVERDUE: 'overdue',
            FORCE_RETURNED: 'force_returned'
        },
        REQUEST: {
            PENDING: 'pending',
            APPROVED: 'approved',
            REJECTED: 'rejected'
        }
    },

    // Messages
    MESSAGES: {
        SUCCESS: {
            LOGIN: 'Login successful!',
            REGISTER: 'Registration successful!',
            UPDATE: 'Updated successfully!',
            DELETE: 'Deleted successfully!',
            BORROW: 'Book borrowed successfully!',
            RETURN: 'Book returned successfully!'
        },
        ERROR: {
            NETWORK: 'Network error. Please check your connection.',
            UNAUTHORIZED: 'Your session has expired. Please login again.',
            FORBIDDEN: 'You do not have permission to perform this action.',
            NOT_FOUND: 'The requested resource was not found.',
            VALIDATION: 'Please check your input and try again.',
            SERVER_ERROR: 'Server error. Please try again later.'
        },
        WARNING: {
            UNSAVED_CHANGES: 'You have unsaved changes. Are you sure?',
            DELETE_CONFIRMATION: 'Are you sure you want to delete this?',
            OVERDUE_REMINDER: 'You have overdue books to return.'
        }
    },

    // Date/Time Formats
    FORMATS: {
        DATE: 'MM/DD/YYYY',
        DATE_TIME: 'MM/DD/YYYY HH:mm:ss',
        TIME: 'HH:mm:ss',
        ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ'
    },

    // Color Scheme
    COLORS: {
        PRIMARY_ORANGE: '#E67E22',
        SECONDARY_ORANGE: '#D35400',
        SUCCESS: '#27AE60',
        DANGER: '#E74C3C',
        WARNING: '#F39C12',
        INFO: '#3498DB',
        GRAY: '#95A5A6'
    },

    // API Response Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500
    }
};

/**
 * Get API URL for endpoint
 */
function getApiUrl(endpoint) {
    return `${CONFIG.API.BASE_URL}${endpoint}`;
}

/**
 * Get role display name
 */
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrator',
        'teacher': 'Teacher',
        'student': 'Student'
    };
    return roleNames[role] || 'User';
}

/**
 * Check if user has role
 */
function hasRole(userRole, requiredRole) {
    return userRole === requiredRole;
}

/**
 * Check if user is admin
 */
function isAdmin(userRole) {
    return userRole === CONFIG.ROLES.ADMIN;
}

/**
 * Check if user is teacher
 */
function isTeacher(userRole) {
    return userRole === CONFIG.ROLES.TEACHER;
}

/**
 * Check if user is student
 */
function isStudent(userRole) {
    return userRole === CONFIG.ROLES.STUDENT;
}

/**
 * Get message by key path
 */
function getMessage(path, defaultMessage = 'Operation completed') {
    const keys = path.split('.');
    let value = CONFIG.MESSAGES;
    
    for (const key of keys) {
        value = value?.[key];
        if (!value) return defaultMessage;
    }
    
    return value || defaultMessage;
}
