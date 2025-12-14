# ⚡ Quick Reference Guide - Auto-Generated Utilities

## 🚀 5-Minute Quick Start

### 1. Include in Your HTML (in order)
```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="../js/config.js"></script>
<script src="../js/validation.js"></script>
<script src="../js/utils.js"></script>
<script src="../js/api-client.js"></script>
<script src="../js/advanced-features.js"></script>
```

### 2. Common Operations

#### Login
```javascript
const result = await loginUser(email, password);
if (result.success) {
    console.log(result.data.user);
}
```

#### Get All Books
```javascript
const result = await getAllBooks();
const books = result.success ? result.data : [];
```

#### Validate Email
```javascript
if (!validateEmail(email)) {
    console.error('Invalid email');
}
```

#### Format Date
```javascript
const formatted = formatDateUtil(new Date());
// "Dec 15, 2025"
```

#### Show Notification
```javascript
showNotification('Success!', 'success');
```

---

## 📚 API Functions Quick Reference

### Authentication
| Function | Usage |
|----------|-------|
| `loginUser(email, password)` | Login user |
| `registerUser(userData)` | Register new user |
| `getCurrentUserData()` | Get current user info |

### Books
| Function | Usage |
|----------|-------|
| `getAllBooks()` | Get all books |
| `getBook(id)` | Get single book |
| `createBook(data)` | Create new book |
| `updateBook(id, data)` | Update book |
| `deleteBook(id)` | Delete book |

### eBooks
| Function | Usage |
|----------|-------|
| `getAllEbooks()` | Get all ebooks |
| `getEbook(id)` | Get single ebook |
| `createEbook(data)` | Create ebook |
| `updateEbook(id, data)` | Update ebook |
| `deleteEbook(id)` | Delete ebook |
| `incrementEbookDownload(id)` | Track download |

### Borrow
| Function | Usage |
|----------|-------|
| `borrowBook(data)` | Borrow a book |
| `returnBook(id)` | Return a book |
| `getAllBorrowRecords()` | Get all records (admin) |
| `getStudentBorrowRecords(id)` | Get student records |

### Users
| Function | Usage |
|----------|-------|
| `getAllStudents()` | Get all students |
| `deleteStudent(id)` | Delete student |
| `updateUserProfile(id, data)` | Update profile |

### Teachers
| Function | Usage |
|----------|-------|
| `getAllTeachers()` | Get all teachers |
| `getTeacher(id)` | Get single teacher |
| `createTeacher(data)` | Create teacher |
| `updateTeacher(id, data)` | Update teacher |
| `deleteTeacher(id)` | Delete teacher |

### Change Requests
| Function | Usage |
|----------|-------|
| `createChangeRequest(data)` | Create request |
| `getPendingChangeRequests()` | Get pending |
| `getAllChangeRequests()` | Get all |
| `approveChangeRequest(id, notes)` | Approve |
| `rejectChangeRequest(id, notes)` | Reject |

---

## ✅ Validation Quick Reference

### Simple Validation
```javascript
validateEmail(email)           // Email format
validatePassword(pwd)          // Min 6 chars
validatePhone(phone)           // Phone format
validateUrl(url)               // URL format
validateISBN(isbn)             // ISBN format
validateRequired(value)        // Not empty
validateDate(date)             // Valid date
```

### Form Validation
```javascript
const validation = validateFormData(
    { email: 'test@example.com', password: 'pass123' },
    {
        email: { type: 'email' },
        password: { type: 'password' }
    }
);

if (!validation.valid) {
    console.error(validation.errors);
}
```

### File Validation
```javascript
validateFileType(file, ['application/pdf'])
validateFileSize(file, 50) // 50MB
```

---

## 🛠️ Utility Functions Quick Reference

### Date/Time
```javascript
formatDateUtil(date)           // "Dec 15, 2025"
formatDateTimeUtil(date)       // "Dec 15, 2025 03:45:23"
getTimeAgo(date)               // "2 hours ago"
isOverdue(dueDate)             // true/false
getDaysUntilDue(dueDate)       // number of days
```

### Strings
```javascript
truncateString(str, 100)       // Truncate with "..."
capitalizeFirst(str)           // "Hello"
toTitleCase(str)               // "Hello World"
generateId('USR_')             // "USR_a1b2c3d4e"
slugify(str)                   // "url-friendly-string"
```

### Storage
```javascript
saveToStorage('key', value)    // Save to localStorage
getFromStorage('key', null)    // Get from localStorage
removeFromStorage('key')       // Delete from localStorage
clearStorage()                 // Clear all
```

### DOM
```javascript
showElement('id')              // Display element
hideElement('id')              // Hide element
toggleElement('id')            // Toggle visibility
addClass('id', 'active')       // Add class
removeClass('id', 'active')    // Remove class
toggleClass('id', 'active')    // Toggle class
clearElement('id')             // Clear HTML
setElementText('id', 'text')   // Set text
setElementHtml('id', '<html>')// Set HTML
getElementValue('id')          // Get input value
setElementValue('id', 'value') // Set input value
```

### Numbers
```javascript
formatNumber(1000000)          // "1,000,000"
formatCurrency(100)            // "$100.00"
roundNumber(3.14159, 2)        // 3.14
```

### Arrays
```javascript
sortByProperty(arr, 'name')    // Sort array
filterByProperty(arr, 'type', 'book') // Filter
groupByProperty(arr, 'category') // Group by property
uniqueByProperty(arr, 'id')    // Get unique items
findByProperty(arr, 'id', 1)   // Find item
arrayContains(arr, item)       // Check contains
removeByProperty(arr, 'id', 1) // Remove item
```

### Performance
```javascript
const search = debounce(loadResults, 300)
const scroll = throttle(handleScroll, 500)
```

### Misc
```javascript
copyToClipboard(text)          // Copy to clipboard
downloadFile('name.csv', csv)  // Download file
deepClone(obj)                 // Deep copy object
isEmptyObject(obj)             // Check if empty
mergeObjects(obj1, obj2)       // Merge objects
getQueryParam('id')            // Get URL param
```

---

## 🎯 Advanced Features Quick Reference

### Borrow Management
```javascript
calculateDueDate(borrowDate, 14)           // Calculate due date
isBookOverdue(dueDate)                     // Check if overdue
getOverdueStatus(dueDate)                  // Get status object
filterBorrowByStatus(records, 'borrowed')  // Filter records
getOverdueBorrows(records)                 // Get overdue
getActiveBorrows(records, userId)         // Get active
calculateFine(dueDate, perDay)             // Calculate fine
getBorrowSummary(records)                  // Summary stats
```

### Book Management
```javascript
isBookAvailable(book)                      // Check availability
getAvailabilityPercentage(book)            // Get percentage
getAvailabilityStatus(book)                // Get status string
getMostBorrowedBooks(books, records)       // Ranking
getLeastBorrowedBooks(books, records)      // Reverse ranking
suggestBooks(userBorrows, allBooks)        // Recommendations
```

### User Management
```javascript
isUserActive(user, lastActivityDate)       // Check activity
getUserStats(user, records)                // Get statistics
getTopBorrowers(users, records)            // Top borrowers
```

### Analytics
```javascript
getAnalyticsDashboard(books, users, records) // Dashboard data
getBorrowingTrends(records, 30)            // Last 30 days
getPopularCategories(books, records)       // Category stats
```

### Validation
```javascript
validateBorrowOperation(user, book, records)
validateReturnOperation(record)
validateBookCreation(bookData)
```

### Reporting
```javascript
generateUserActivityReport(users, records) // User report
generateInventoryReport(books)             // Inventory report
exportToCSV(data, 'filename.csv')          // Export to CSV
```

---

## 🔧 Configuration Quick Reference

```javascript
CONFIG.API.BASE_URL                 // API endpoint
CONFIG.BORROW.DEFAULT_DURATION_DAYS // 14 days
CONFIG.VALIDATION.PASSWORD_MIN_LENGTH // 6
CONFIG.ROLES.ADMIN                  // 'admin'
CONFIG.ROLES.TEACHER                // 'teacher'
CONFIG.ROLES.STUDENT                // 'student'
CONFIG.STATUS.BORROW.BORROWED       // 'borrowed'
CONFIG.STATUS.BORROW.RETURNED       // 'returned'

getMessage('SUCCESS.LOGIN')         // "Login successful!"
getMessage('ERROR.NETWORK')         // Error message
getRoleDisplayName('admin')         // "Administrator"
hasRole(userRole, 'admin')          // true/false
isAdmin(userRole)                   // true/false
isTeacher(userRole)                 // true/false
isStudent(userRole)                 // true/false
```

---

## 📋 Common Patterns

### Pattern 1: Fetch and Display
```javascript
async function loadAndDisplay() {
    const result = await getAllBooks();
    if (!result.success) {
        showNotification(result.message, 'danger');
        return;
    }
    const books = result.data;
    displayBooks(books);
}
```

### Pattern 2: Form Submission
```javascript
async function submitForm(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value
    };
    
    const validation = validateFormData(formData, {
        title: { type: 'required' },
        author: { type: 'required' }
    });
    
    if (!validation.valid) {
        Object.entries(validation.errors).forEach(([field, error]) => {
            showNotification(error, 'danger');
        });
        return;
    }
    
    const result = await createBook(formData);
    if (result.success) {
        showNotification('Created successfully!', 'success');
    } else {
        showNotification(result.message, 'danger');
    }
}
```

### Pattern 3: Search with Debounce
```javascript
const handleSearch = debounce(async (query) => {
    const result = await getAllBooks();
    const filtered = result.data.filter(b =>
        b.title.toLowerCase().includes(query.toLowerCase())
    );
    displayBooks(filtered);
}, 300);

document.getElementById('search').addEventListener('keyup', (e) => {
    handleSearch(e.target.value);
});
```

### Pattern 4: Role-Based Redirect
```javascript
const user = JSON.parse(localStorage.getItem('currentUser'));
if (isAdmin(user.role)) {
    window.location.href = '/pages/admin-dashboard.html';
} else if (isTeacher(user.role)) {
    window.location.href = '/pages/teacher-dashboard.html';
} else {
    window.location.href = '/pages/student-dashboard.html';
}
```

### Pattern 5: Analytics Dashboard
```javascript
async function loadDashboard() {
    const books = await getAllBooks();
    const users = await getAllStudents();
    const records = await getAllBorrowRecords();
    
    if (!books.success || !users.success || !records.success) {
        showNotification('Failed to load data', 'danger');
        return;
    }
    
    const analytics = getAnalyticsDashboard(
        books.data,
        users.data,
        records.data
    );
    
    document.getElementById('total-borrows').textContent = 
        analytics.summary.totalBorrows;
    document.getElementById('top-books').innerHTML = 
        analytics.topBooks.map(b => `<div>${b.title}</div>`).join('');
}
```

---

## 🚨 Error Handling Examples

```javascript
// Example 1: Simple error handling
const result = await getAllBooks();
if (!result.success) {
    console.error(result.message);
    showNotification(result.message, 'danger');
}

// Example 2: Validation errors
const validation = validateFormData(data, schema);
if (!validation.valid) {
    Object.entries(validation.errors).forEach(([field, error]) => {
        showNotification(error, 'danger');
    });
}

// Example 3: API error with status code
const result = await loginUser(email, password);
if (!result.success) {
    if (result.status === 401) {
        showNotification('Invalid credentials', 'danger');
    } else if (result.status === 0) {
        showNotification(getMessage('ERROR.NETWORK'), 'danger');
    } else {
        showNotification(result.message, 'danger');
    }
}
```

---

## 📱 Mobile-Friendly Tips

1. **Use responsive classes** from existing CSS
2. **Test on mobile devices** before production
3. **Use debounce** for better mobile performance
4. **Optimize images** for smaller screens
5. **Use appropriate font sizes** (min 16px)
6. **Make buttons large** enough to tap (min 44x44px)

---

## 🎓 Learning Resources

1. **Full Documentation**: See `GENERATED_CODE_README.md`
2. **Code Comments**: Check inline documentation in each file
3. **Examples**: Search for function usage in existing pages
4. **Browser Console**: Test functions directly

---

## ⚡ Performance Tips

1. Use `debounce()` for search inputs
2. Cache API responses when possible
3. Load data only when needed
4. Use `throttle()` for scroll events
5. Minimize DOM manipulations
6. Validate before API calls
7. Use `async/await` for readable code

---

## 🔒 Security Tips

1. Always validate user input
2. Sanitize HTML before displaying
3. Check user roles before actions
4. Use HTTPS in production
5. Don't store sensitive data in localStorage
6. Validate on both client and server
7. Use CSRF tokens for state-changing requests

---

**Pro Tip**: Bookmark this page for quick reference while coding!

Generated: December 15, 2025 | Version: 1.0
