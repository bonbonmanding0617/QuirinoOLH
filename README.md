# Quirino Online Library Hub - Complete Documentation

## 🎯 Project Overview

**Quirino Online Library Hub** is a comprehensive web-based library management system designed for educational institutions. It enables students to borrow and return books, read and download eBooks, while providing administrators and teachers with tools to manage the library inventory, monitor student activities, and generate analytics reports.

## 🎨 Design & Branding

- **Logo**: Quirino Province Official Logo
- **Color Scheme**: Orange shades (Primary: #E67E22, Secondary: #D35400)
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop devices
- **Base Reference**: www.libib.com

## 📂 Project Structure

```
QOLH/
├── index.html                 # Landing page with welcome board
├── css/
│   └── style.css             # Complete styling with orange color scheme
├── js/
│   └── script.js             # Database functions and utilities
├── pages/
│   ├── student-login.html    # Student login/signup portal
│   ├── student-dashboard.html # Student main dashboard
│   ├── admin-login.html      # Administrator/Teacher login
│   ├── admin-dashboard.html  # Admin main dashboard
│   ├── admin-students.html   # Student management
│   ├── admin-books.html      # Physical books management
│   ├── admin-ebooks.html     # Digital books management
│   ├── admin-analytics.html  # Analytics and reports
│   ├── admin-profile.html    # Admin profile management
│   └── admin-settings.html   # System settings
├── uploads/
│   └── ebooks/              # Directory for eBook files
└── images/                   # Logo and media files
```

## 🚀 Getting Started

### 1. Opening the Application
- Open `index.html` in any modern web browser
- The application uses localStorage for data persistence

### 2. Demo Credentials

**Administrator Account:**
- Email: `admin@qolh.com`
- Password: `(use ADMIN_PASSWORD or run scripts/create-admin.js)`
- Role: Full system access

**Teacher Account:**
- Email: `teacher1@qolh.com`
- Password: `(example placeholder)`
- Role: Student management and monitoring

**Student Account (Sample):**
- Email: `student@qolh.com`
- Password: `(example placeholder)`
- Role: Borrow books, read eBooks

### 3. Creating New Accounts
- Students can self-register through the student login page
- School ID is automatically generated and cannot be changed
- Administrators add teachers and manage accounts

## 📖 Feature Overview

### 👤 Student Features

1. **Landing Page** (`index.html`)
   - Welcome banner with logo
   - Login and Learn More buttons
   - Features, Mission, and Benefits sections

2. **Student Login** (`student-login.html`)
   - Create account (self-registration)
   - Login with credentials
   - Guest login (limited access)
   - Link to admin/teacher login

3. **Student Dashboard** (`student-dashboard.html`)
   
   **Browse Books Tab:**
   - View all available physical books
   - Search and filter books
   - View book details
   - Borrow books (with availability check)
   
   **Borrowed Books Tab:**
   - View all borrowed books
   - Track due dates
   - Return books
   - See borrowing history
   - Overdue notifications
   
   **eBooks Tab:**
   - Browse digital books
   - Read eBooks online
   - Download eBooks for offline reading
   - Search functionality
   
   **Profile Tab:**
   - Edit personal information
   - Update contact details
   - View school ID (read-only)
   - Cannot change School ID

### 👨‍💼 Administrator/Teacher Features

1. **Admin Dashboard** (`admin-dashboard.html`)
   - Quick statistics overview
   - Recent borrowing activities
   - Quick action buttons
   - System status

2. **Student Management** (`admin-students.html`)
   - View all students in searchable table
   - Add new student accounts
   - Edit student information
   - Delete student accounts
   - View individual student borrow records
   - Issue force returns on overdue books
   - Monitor student activity

3. **Books Management** (`admin-books.html`)
   - Add new physical books
   - Edit book information
   - Delete books from inventory
   - Track available copies
   - Manage book categories

4. **eBooks Management** (`admin-ebooks.html`)
   - Upload new eBooks
   - Edit eBook metadata
   - Delete eBooks
   - Track download statistics

5. **Analytics** (`admin-analytics.html`)
   - Total borrow/return statistics
   - Active and overdue borrow counts
   - Top borrowing students (ranked)
   - Most borrowed books (ranked)
   - Recent borrowing activity table
   - Visual statistics cards

6. **Profile** (`admin-profile.html`)
   - View and edit profile information
   - Update name, email, phone, address
   - School ID is read-only
   - Account information display
   - Member since date

7. **Settings** (`admin-settings.html`)
   - Library name configuration
   - Borrow duration settings (default: 14 days)
   - Late return fee settings
   - Maximum concurrent borrows
   - Notification preferences
   - Security settings
   - Data backup options

## 💾 Database Structure

The application uses localStorage with the following data structure:

### Users Object
```javascript
{
    id: "STU001",
    name: "John Doe",
    email: "john@email.com",
    password: "hashed_password",
    role: "student|teacher|admin",
    schoolId: "STU001",
    phone: "09123456789",
    address: "123 Street",
    profilePicture: null,
    createdAt: "2024-01-01T00:00:00Z"
}
```

### Books Object
```javascript
{
    id: "BOOK001",
    title: "Book Title",
    author: "Author Name",
    isbn: "123-456",
    category: "Category",
    description: "Description",
    quantity: 5,
    available: 3,
    image: null,
    addedAt: "2024-01-01T00:00:00Z"
}
```

### eBooks Object
```javascript
{
    id: "EBOOK001",
    title: "eBook Title",
    author: "Author Name",
    category: "Category",
    description: "Description",
    filePath: "uploads/ebooks/file.pdf",
    downloads: 10,
    addedAt: "2024-01-01T00:00:00Z"
}
```

### Borrow Records Object
```javascript
{
    id: "BOR001",
    studentId: "STU001",
    bookId: "BOOK001",
    borrowDate: "2024-01-01T00:00:00Z",
    dueDate: "2024-01-15T00:00:00Z",
    returnDate: null,
    status: "borrowed|returned",
    forceReturnByAdmin: false
}
```

## 🛠️ Core Functions

### Authentication Functions
- `validateLogin(email, password, role)` - Authenticate users
- `getCurrentUser()` - Get logged-in user from session
- `setCurrentUser(user)` - Set current user session
- `logout()` - Clear session and redirect to login

### Book Management
- `getBooks()` - Get all books
- `getBookById(bookId)` - Get single book
- `addBook(bookData)` - Add new book
- `updateBook(bookId, updates)` - Update book info
- `deleteBook(bookId)` - Delete book

### Borrow Management
- `borrowBook(studentId, bookId)` - Borrow a book
- `returnBook(borrowRecordId)` - Return a book
- `forceReturnBook(borrowRecordId)` - Admin force return
- `getStudentBorrowRecords(studentId)` - Get student's records
- `getAllBorrowRecords()` - Get all records

### eBook Management
- `getEbooks()` - Get all eBooks
- `getEbookById(ebookId)` - Get single eBook
- `addEbook(ebookData)` - Add new eBook
- `updateEbook(ebookId, updates)` - Update eBook
- `deleteEbook(ebookId)` - Delete eBook
- `incrementEbookDownloads(ebookId)` - Track downloads

### Analytics Functions
- `getAnalyticsData()` - Get comprehensive analytics

### Utility Functions
- `formatDate(dateString)` - Format dates
- `formatDateTime(dateString)` - Format date and time
- `getDaysUntilDue(dueDate)` - Calculate days until due
- `isOverdue(dueDate)` - Check if overdue
- `showNotification(message, type)` - Display notifications
- `generateId(prefix)` - Generate unique IDs

## 🔐 Security Features

1. **Password Management**
   - Passwords stored in localStorage (for demo purposes)
   - Implement proper hashing in production
   
2. **Session Management**
   - User session stored in sessionStorage
   - Auto-logout on browser close

3. **Role-Based Access**
   - Three user roles: student, teacher, admin
   - Different access levels for each role
   - Protected dashboard routes

4. **Data Validation**
   - Form validation on all inputs
   - Email uniqueness checks
   - Password confirmation on signup

## 🎯 Key Features Summary

✅ **Student Features:**
- Self-registration and login
- Guest access option
- Browse and search books
- Borrow and return books
- Read and download eBooks
- Manage profile (except School ID)
- Track borrowing history
- Overdue notifications

✅ **Teacher/Admin Features:**
- Comprehensive student management
- Add/edit/delete books and eBooks
- Monitor all borrowing activities
- Force return overdue books
- Advanced analytics and reporting
- System settings management
- Profile management
- Dashboard with quick statistics

✅ **System Features:**
- Responsive mobile-friendly design
- Orange color theme matching Quirino branding
- Persistent data storage using localStorage
- Real-time notifications
- Modal-based forms
- Sidebar navigation
- Search and filter functionality
- Date calculations for due dates
- Activity logging

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment Notes

### For Production:
1. Replace localStorage with a real backend database
2. Implement proper password hashing (bcrypt)
3. Add HTTPS encryption
4. Implement proper authentication (JWT tokens)
5. Add server-side validation
6. Set up regular backups
7. Implement actual file upload for eBooks
8. Add email notification service
9. Implement 2FA for admin accounts
10. Add audit logging

### Current Limitations (Demo):
- Data stored locally only
- Passwords not encrypted
- Single-browser sessions only
- No file upload (use file paths instead)
- No email notifications
- Limited to one device per user

## 📚 Usage Examples

### Adding a Book (Admin)
1. Go to Admin Dashboard → Books Management
2. Click "Add Book" button
3. Fill in: Title, Author, ISBN, Category, Description, Quantity
4. Click "Save Book"

### Borrowing a Book (Student)
1. Go to Student Dashboard → Browse Books
2. Click "View Details" on a book
3. Click "Borrow Book" if available
4. Book appears in "My Borrowed Books"

### Uploading an eBook (Admin)
1. Go to Admin Dashboard → eBooks Management
2. Click "Upload eBook"
3. Fill in: Title, Author, Category, Description, File Path
4. Click "Upload eBook"

### Viewing Analytics (Admin)
1. Go to Admin Dashboard → Analytics
2. View statistics cards and charts
3. Check top students and popular books
4. Review recent activity table

## 🐛 Troubleshooting

**Issue: Data not persisting**
- Solution: Check browser's localStorage is enabled
- Clear cache and try again

**Issue: Login not working**
- Solution: Check spelling of email and password
- Use demo credentials to verify setup

**Issue: Styling not loading**
- Solution: Ensure css/style.css path is correct
- Check file hasn't been moved

**Issue: Functions not working**
- Solution: Ensure js/script.js is loaded
- Check browser console for errors
- Verify database is initialized

## 📞 Support & Maintenance

For issues or feature requests:
1. Check error messages in browser console
2. Review function documentation in script.js
3. Verify file structure matches project layout
4. Test with demo accounts first

## 📄 License

This project is created for Quirino Province Educational Institution.

---

**Version**: 1.0.0
**Last Updated**: December 2024
**Created for**: Quirino Online Library Hub
"# QuirinoOnlineLibHub-Mongodb-" 
"# QuirinoOnlineLibHub-Mongodb-" 
"# QuirinoOnlineLibHub-Mongodb-" 
"# QuirinoOnlineLibHub-Mongodb-" 
"# QOLH" 
"# QuirinoOLH" 
"# QuirinoOLH" 
#   Q u i r i n o O L H  
 