


# Auto-Generated Code Documentation

This document describes all the auto-generated utility files and features added to the Quirino Online Library Hub project.

## Files Generated

### 1. `js/api-client.js`
Centralized API client for all backend communication. Provides consistent error handling and token management.

**Features:**
- Authentication endpoints (register, login, getCurrentUser)
- User management (updateProfile)
- Student management (getAll, delete)
- Book management (CRUD operations)
- eBook management (CRUD operations, download tracking)
- Borrow record management (borrow, return, view records)
- Teacher management (CRUD operations)
- Change request management (create, approve, reject)

**Usage:**
```javascript
// Import the file in your HTML
<script src="js/api-client.js"></script>

// Use API functions
const result = await getAllBooks();
if (result.success) {
    console.log(result.data);
} else {
    console.error(result.message);
}
```

**Key Benefits:**
- Consistent error handling across all requests
- Automatic token management
- Centralized base URL configuration
- Standardized response format

### 2. `js/validation.js`
Input validation and sanitization utilities for form data and user inputs.

**Features:**
- Email validation
- Password strength validation
- Phone number validation
- URL validation
- ISBN validation
- Required field validation
- Number range validation
- Date validation
- Form schema validation
- HTML sanitization
- File type and size validation

**Usage:**
```javascript
// Validate email
if (!validateEmail(email)) {
    console.error('Invalid email');
}

// Validate form data
const schema = {
    email: { type: 'email' },
    password: { type: 'password' },
    age: { type: 'number', min: 18, max: 120 }
};

const validation = validateFormData(formData, schema);
if (!validation.valid) {
    console.error(validation.errors);
}

// Sanitize user input
const safe = sanitizeInput(userInput);
```

### 3. `js/utils.js`
General-purpose utility functions for common operations.

**Categories:**

#### Date & Time
- `formatDateUtil()` - Format date to readable string
- `formatDateTimeUtil()` - Format date and time
- `getTimeAgo()` - Get "time ago" format
- `isOverdue()` - Check if date is overdue
- `getDaysUntilDue()` - Calculate days until due date

#### String Operations
- `truncateString()` - Truncate with ellipsis
- `capitalizeFirst()` - Capitalize first letter
- `toTitleCase()` - Convert to title case
- `generateId()` - Generate random ID
- `slugify()` - Create URL-friendly string

#### Storage Management
- `saveToStorage()` - Save to localStorage
- `getFromStorage()` - Retrieve from localStorage
- `removeFromStorage()` - Delete from localStorage
- `clearStorage()` - Clear all localStorage

#### DOM Manipulation
- `showElement()` / `hideElement()` - Show/hide elements
- `toggleElement()` - Toggle visibility
- `addClass()` / `removeClass()` / `toggleClass()` - Class management
- `clearElement()` - Clear HTML content
- `setElementText()` / `setElementHtml()` - Set content
- `getElementValue()` / `setElementValue()` - Work with form values

#### Numbers & Currency
- `formatNumber()` - Format with commas
- `formatCurrency()` - Format as currency
- `roundNumber()` - Round to decimals

#### Array & Object Operations
- `sortByProperty()` - Sort array by property
- `filterByProperty()` - Filter array by property
- `groupByProperty()` - Group array by property
- `uniqueByProperty()` - Get unique items
- `findByProperty()` - Find item in array
- `removeByProperty()` - Remove item from array

#### Performance
- `debounce()` - Debounce function calls
- `throttle()` - Throttle function calls

#### Miscellaneous
- `copyToClipboard()` - Copy text to clipboard
- `downloadFile()` - Download file to user
- `deepClone()` - Deep clone object
- `isEmptyObject()` - Check if object is empty
- `mergeObjects()` - Merge two objects
- `getQueryParam()` - Get URL query parameter

## Integration

To use these utilities in your pages, add the following script tags:

```html
<!-- API Client -->
<script src="../js/api-client.js"></script>

<!-- Validation Utilities -->
<script src="../js/validation.js"></script>

<!-- General Utilities -->
<script src="../js/utils.js"></script>
```

## Examples

### Example 1: Register a New Student
```javascript
const registerStudent = async (email, password, name) => {
    // Validate inputs
    if (!validateEmail(email)) {
        showNotification('Invalid email address', 'danger');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Password must be at least 6 characters', 'danger');
        return;
    }
    
    // Call API
    const result = await registerUser({
        email,
        password,
        name,
        role: 'student'
    });
    
    if (result.success) {
        showNotification('Registration successful!', 'success');
    } else {
        showNotification(result.message, 'danger');
    }
};
```

### Example 2: Update Book with Validation
```javascript
const updateBookData = async (bookId, bookData) => {
    // Validate form
    const schema = {
        title: { type: 'required' },
        author: { type: 'required' },
        quantity: { type: 'number', min: 1 }
    };
    
    const validation = validateFormData(bookData, schema);
    if (!validation.valid) {
        Object.entries(validation.errors).forEach(([field, error]) => {
            showNotification(error, 'danger');
        });
        return;
    }
    
    // Call API
    const result = await updateBook(bookId, bookData);
    if (result.success) {
        showNotification('Book updated successfully', 'success');
    }
};
```

### Example 3: Filter and Sort Books
```javascript
const displayBooks = async () => {
    const result = await getAllBooks();
    if (!result.success) return;
    
    let books = result.data;
    
    // Sort by title
    books = sortByProperty(books, 'title', true);
    
    // Filter by category
    books = filterByProperty(books, 'category', 'Technology');
    
    // Display
    renderBooks(books);
};
```

### Example 4: Display Overdue Books
```javascript
const displayOverdueBooks = async () => {
    const result = await getAllBorrowRecords();
    if (!result.success) return;
    
    const overdueBooks = result.data.filter(record => 
        record.status === 'borrowed' && isOverdue(record.dueDate)
    );
    
    const html = overdueBooks.map(record => `
        <div class="overdue-item">
            <p>${record.bookTitle}</p>
            <p class="overdue-days">
                Overdue by ${Math.abs(getDaysUntilDue(record.dueDate))} days
            </p>
            <p class="overdue-date">
                Due date: ${formatDateUtil(record.dueDate)}
            </p>
        </div>
    `).join('');
    
    document.getElementById('overdue-container').innerHTML = html;
};
```

## Best Practices

1. **Always check success flag** - API functions return `{ success, data, message }`
2. **Handle errors gracefully** - Display user-friendly error messages
3. **Validate before API calls** - Prevent unnecessary server requests
4. **Use debounce for search** - Improve performance with search inputs
5. **Store sensitive data safely** - Don't store passwords in localStorage
6. **Sanitize user input** - Always sanitize before displaying or storing
7. **Cache API responses** - Reduce server load by caching when appropriate

## Error Handling

The `api-client.js` automatically handles:
- Network errors
- 401 Unauthorized (redirects to login)
- Server errors (returns error message)
- Timeout errors

Example:
```javascript
const result = await getAllBooks();
if (!result.success) {
    if (result.status === 401) {
        // User logged out, redirected automatically
    } else {
        showNotification(result.message, 'danger');
    }
}
```

## Performance Optimization

Use these utilities for better performance:

```javascript
// Debounce search input
const searchBooks = debounce(async (query) => {
    const result = await getAllBooks();
    const filtered = result.data.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase())
    );
    displayBooks(filtered);
}, 300);

// Throttle scroll events
window.addEventListener('scroll', throttle(() => {
    // Heavy operation
}, 500));
```

## Configuration

### API Base URL
To change the API server, edit `js/api-client.js`:
```javascript
const API_BASE_URL = 'http://your-server:3001/api';
```

### Storage Keys
Common storage keys used:
- `token` - JWT authentication token
- `currentUser` - Current logged-in user object
- Any custom keys your app defines

## Testing

Test the utilities using browser console:
```javascript
// Load utilities
<script src="js/api-client.js"></script>
<script src="js/validation.js"></script>
<script src="js/utils.js"></script>

// Test in console
validateEmail('test@example.com'); // true
formatNumber(1000000); // "1,000,000"
generateId('USR_'); // "USR_a1b2c3d4e"
```

## Future Enhancements

Potential additions:
- Analytics tracking
- Caching layer
- Request queueing
- Offline support
- Data encryption
- Advanced date/time utilities
- Chart/graph helpers
- Export to CSV/PDF utilities
