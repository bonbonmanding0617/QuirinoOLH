/**
 * Utility Functions - Common helpers for various operations
 * Includes formatting, storage, DOM manipulation, and misc utilities
 */

// ===== DATE & TIME UTILITIES =====

/**
 * Format date to readable string
 */
function formatDateUtil(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format date and time
 */
function formatDateTimeUtil(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Get time ago string (e.g., "2 hours ago")
 */
function getTimeAgo(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    
    return formatDateUtil(date);
}

/**
 * Check if date is overdue
 */
function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

/**
 * Get days until due date
 */
function getDaysUntilDue(dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ===== STRING UTILITIES =====

/**
 * Truncate string to max length with ellipsis
 */
function truncateString(str, maxLength = 100) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to title case
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => capitalizeFirst(txt.toLowerCase()));
}

/**
 * Generate random ID
 */
function generateId(prefix = '') {
    return prefix + Math.random().toString(36).substr(2, 9);
}

/**
 * Slugify string for URLs
 */
function slugify(str) {
    return str.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ===== STORAGE UTILITIES =====

/**
 * Save object to localStorage with JSON serialization
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Storage error:', error);
        return false;
    }
}

/**
 * Get object from localStorage with JSON parsing
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Storage error:', error);
        return defaultValue;
    }
}

/**
 * Remove item from localStorage
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Storage error:', error);
        return false;
    }
}

/**
 * Clear all localStorage
 */
function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Storage error:', error);
        return false;
    }
}

// ===== DOM UTILITIES =====

/**
 * Show element
 */
function showElement(elementId) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.style.display = 'block';
}

/**
 * Hide element
 */
function hideElement(elementId) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.style.display = 'none';
}

/**
 * Toggle element visibility
 */
function toggleElement(elementId) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Add class to element
 */
function addClass(elementId, className) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.classList.add(className);
}

/**
 * Remove class from element
 */
function removeClass(elementId, className) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.classList.remove(className);
}

/**
 * Toggle class on element
 */
function toggleClass(elementId, className) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.classList.toggle(className);
}

/**
 * Clear element content
 */
function clearElement(elementId) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.innerHTML = '';
}

/**
 * Set element text content
 */
function setElementText(elementId, text) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.textContent = text;
}

/**
 * Set element HTML content
 */
function setElementHtml(elementId, html) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.innerHTML = html;
}

/**
 * Get element value
 */
function getElementValue(elementId) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    return el ? el.value : '';
}

/**
 * Set element value
 */
function setElementValue(elementId, value) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (el) el.value = value;
}

// ===== NUMBER & CURRENCY UTILITIES =====

/**
 * Format number with commas
 */
function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Round number to decimals
 */
function roundNumber(num, decimals = 2) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ===== ARRAY & OBJECT UTILITIES =====

/**
 * Sort array of objects by property
 */
function sortByProperty(arr, property, ascending = true) {
    return [...arr].sort((a, b) => {
        if (ascending) {
            return a[property] > b[property] ? 1 : -1;
        } else {
            return a[property] < b[property] ? 1 : -1;
        }
    });
}

/**
 * Filter array of objects by property value
 */
function filterByProperty(arr, property, value) {
    return arr.filter(item => item[property] === value);
}

/**
 * Group array by property
 */
function groupByProperty(arr, property) {
    return arr.reduce((acc, item) => {
        const key = item[property];
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}

/**
 * Unique items from array by property
 */
function uniqueByProperty(arr, property) {
    return [...new Map(arr.map(item => [item[property], item])).values()];
}

/**
 * Find item in array by property
 */
function findByProperty(arr, property, value) {
    return arr.find(item => item[property] === value);
}

/**
 * Check if array contains item
 */
function arrayContains(arr, item) {
    return arr.includes(item);
}

/**
 * Remove item from array by property value
 */
function removeByProperty(arr, property, value) {
    return arr.filter(item => item[property] !== value);
}

// ===== DEBOUNCE & THROTTLE =====

/**
 * Debounce function
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== MISC UTILITIES =====

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Copy error:', error);
        return false;
    }
}

/**
 * Download file
 */
function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Merge objects
 */
function mergeObjects(obj1, obj2) {
    return { ...obj1, ...obj2 };
}

/**
 * Get query parameter from URL
 */
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}
