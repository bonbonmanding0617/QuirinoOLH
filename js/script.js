// ===== LOCAL STORAGE DATABASE FUNCTIONS =====

// Initialize default data if not exists
function initializeDatabase() {
    if (!localStorage.getItem('libraryDB')) {
        const defaultDB = {
            users: [
                {
                    id: 'ADMIN001',
                    name: 'Admin User',
                    email: 'admin@qolh.com',
                    password: 'admin123',
                    role: 'admin',
                    schoolId: 'ADMIN001',
                    phone: '09123456789',
                    address: '123 Admin Street',
                    profilePicture: null,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'TEACHER001',
                    name: 'Teacher One',
                    email: 'teacher1@qolh.com',
                    password: 'teacher123',
                    role: 'teacher',
                    schoolId: 'TEACHER001',
                    phone: '09234567890',
                    address: '456 Teacher Ave',
                    profilePicture: null,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'STU001',
                    name: 'Sample Student',
                    email: 'student@qolh.com',
                    password: 'student123',
                    role: 'student',
                    schoolId: 'STU001',
                    phone: '09345678901',
                    address: '789 Student Road',
                    profilePicture: null,
                    createdAt: new Date().toISOString()
                }
            ],
            books: [
                {
                    id: 'BOOK001',
                    title: 'Introduction to Programming',
                    author: 'John Smith',
                    isbn: '978-1234567890',
                    category: 'Technology',
                    description: 'Learn the basics of programming with real-world examples',
                    quantity: 5,
                    available: 5,
                    image: null,
                    addedAt: new Date().toISOString()
                },
                {
                    id: 'BOOK002',
                    title: 'The Art of Reading',
                    author: 'Jane Doe',
                    isbn: '978-0987654321',
                    category: 'Literature',
                    description: 'Discover the joy of reading and literature appreciation',
                    quantity: 3,
                    available: 3,
                    image: null,
                    addedAt: new Date().toISOString()
                }
            ],
            ebooks: [
                {
                    id: 'EBOOK001',
                    title: 'Digital Guide to Web Development',
                    author: 'Web Expert',
                    category: 'Technology',
                    description: 'Complete guide to modern web development',
                    fileUrl: '#',
                    filePath: 'uploads/ebooks/web-development.pdf',
                    downloads: 0,
                    addedAt: new Date().toISOString()
                }
            ],
            borrowRecords: [
                {
                    id: 'BOR001',
                    studentId: 'STU001',
                    bookId: 'BOOK001',
                    borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
                    returnDate: null,
                    status: 'borrowed',
                    forceReturnByAdmin: false
                }
            ]
        };
        localStorage.setItem('libraryDB', JSON.stringify(defaultDB));
    }
}

// Get database
function getDatabase() {
    const db = localStorage.getItem('libraryDB');
    return db ? JSON.parse(db) : null;
}

// Save database
function saveDatabase(db) {
    localStorage.setItem('libraryDB', JSON.stringify(db));
    // Emit a global event so UI pages can refresh when the DB changes
    try {
        const event = new CustomEvent('databaseUpdated', { detail: { timestamp: Date.now() } });
        window.dispatchEvent(event);
    } catch (e) {
        // ignore if dispatching fails in older environments
        console.warn('Could not dispatch databaseUpdated event', e);
    }
}

// ===== USER FUNCTIONS =====

function getUserById(userId) {
    const db = getDatabase();
    return db.users.find(u => u.id === userId);
}

function getUserByEmail(email) {
    const db = getDatabase();
    return db.users.find(u => u.email === email);
}

function createStudent(student) {
    const db = getDatabase();
    const id = 'STU' + String(db.users.filter(u => u.role === 'student').length + 1).padStart(3, '0');
    // Allow providing a schoolId during creation, but ensure it's unique.
    let providedSchoolId = student.schoolId && String(student.schoolId).trim();
    if (providedSchoolId) {
        const exists = db.users.some(u => u.schoolId === providedSchoolId);
        if (exists) {
            // If provided schoolId is taken, throw an error to caller
            throw new Error('School ID already exists');
        }
    }
    const schoolId = providedSchoolId || id;

    const newStudent = {
        id,
        ...student,
        role: 'student',
        schoolId,
        profilePicture: null,
        createdAt: new Date().toISOString()
    };
    db.users.push(newStudent);
    saveDatabase(db);
    return newStudent;
}

function updateUser(userId, updates) {
    const db = getDatabase();
    const user = db.users.find(u => u.id === userId);
    if (user) {
        // Don't allow changing schoolId
        delete updates.schoolId;
        Object.assign(user, updates);
        saveDatabase(db);
        // If the updated user is the current session user, update sessionStorage
        try {
            const current = getCurrentUser();
            if (current && current.id === userId) {
                // Merge current with updated values and persist
                const merged = Object.assign({}, current, user);
                setCurrentUser(merged);
            }
        } catch (e) {
            console.warn('Failed to sync session user after update', e);
        }

        return user;
    }
    return null;
}

function getAllStudents() {
    const db = getDatabase();
    return db.users.filter(u => u.role === 'student');
}

function validateLogin(email, password, role) {
    const user = getUserByEmail(email);
    if (user && user.password === password && user.role === role) {
        return user;
    }
    return null;
}

// ===== BOOK FUNCTIONS =====

function getBooks() {
    const db = getDatabase();
    return db.books;
}

function getBookById(bookId) {
    const db = getDatabase();
    return db.books.find(b => b.id === bookId);
}

function addBook(bookData) {
    const db = getDatabase();
    const id = 'BOOK' + String(db.books.length + 1).padStart(3, '0');
    const newBook = {
        id,
        ...bookData,
        quantity: parseInt(bookData.quantity),
        available: parseInt(bookData.quantity),
        image: null,
        addedAt: new Date().toISOString()
    };
    db.books.push(newBook);
    saveDatabase(db);
    return newBook;
}

function updateBook(bookId, updates) {
    const db = getDatabase();
    const book = db.books.find(b => b.id === bookId);
    if (book) {
        Object.assign(book, updates);
        saveDatabase(db);
        return book;
    }
    return null;
}

function deleteBook(bookId) {
    const db = getDatabase();
    db.books = db.books.filter(b => b.id !== bookId);
    saveDatabase(db);
}

// ===== EBOOK FUNCTIONS =====

function getEbooks() {
    const db = getDatabase();
    return db.ebooks;
}

function getEbookById(ebookId) {
    const db = getDatabase();
    return db.ebooks.find(e => e.id === ebookId);
}

function addEbook(ebookData) {
    const db = getDatabase();
    const id = 'EBOOK' + String(db.ebooks.length + 1).padStart(3, '0');
    const newEbook = {
        id,
        ...ebookData,
        downloads: 0,
        addedAt: new Date().toISOString()
    };
    db.ebooks.push(newEbook);
    saveDatabase(db);
    return newEbook;
}

function updateEbook(ebookId, updates) {
    const db = getDatabase();
    const ebook = db.ebooks.find(e => e.id === ebookId);
    if (ebook) {
        Object.assign(ebook, updates);
        saveDatabase(db);
        return ebook;
    }
    return null;
}

function deleteEbook(ebookId) {
    const db = getDatabase();
    db.ebooks = db.ebooks.filter(e => e.id !== ebookId);
    saveDatabase(db);
}

function incrementEbookDownloads(ebookId) {
    const db = getDatabase();
    const ebook = db.ebooks.find(e => e.id === ebookId);
    if (ebook) {
        ebook.downloads += 1;
        saveDatabase(db);
    }
}

// ===== BORROW FUNCTIONS =====

function borrowBook(studentId, bookId) {
    const db = getDatabase();
    const book = db.books.find(b => b.id === bookId);
    
    if (!book || book.available <= 0) {
        return { success: false, message: 'Book not available' };
    }

    // Check if student already borrowed this book
    const existingBorrow = db.borrowRecords.find(
        r => r.studentId === studentId && r.bookId === bookId && r.status === 'borrowed'
    );
    if (existingBorrow) {
        return { success: false, message: 'You already borrowed this book' };
    }

    const id = 'BOR' + String(db.borrowRecords.length + 1).padStart(3, '0');
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrow period

    const record = {
        id,
        studentId,
        bookId,
        borrowDate: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        returnDate: null,
        status: 'borrowed',
        forceReturnByAdmin: false
    };

    book.available -= 1;
    db.borrowRecords.push(record);
    saveDatabase(db);

    return { success: true, message: 'Book borrowed successfully', record };
}

function returnBook(borrowRecordId) {
    const db = getDatabase();
    const record = db.borrowRecords.find(r => r.id === borrowRecordId);
    
    if (!record || record.status !== 'borrowed') {
        return { success: false, message: 'Invalid borrow record' };
    }

    const book = db.books.find(b => b.id === record.bookId);
    if (book) {
        book.available += 1;
    }

    record.returnDate = new Date().toISOString();
    record.status = 'returned';
    saveDatabase(db);

    return { success: true, message: 'Book returned successfully' };
}

function forceReturnBook(borrowRecordId) {
    const db = getDatabase();
    const record = db.borrowRecords.find(r => r.id === borrowRecordId);
    
    if (!record || record.status !== 'borrowed') {
        return { success: false, message: 'Invalid borrow record' };
    }

    const book = db.books.find(b => b.id === record.bookId);
    if (book) {
        book.available += 1;
    }

    record.returnDate = new Date().toISOString();
    record.status = 'returned';
    record.forceReturnByAdmin = true;
    saveDatabase(db);

    return { success: true, message: 'Book force returned successfully' };
}

function getStudentBorrowRecords(studentId) {
    const db = getDatabase();
    return db.borrowRecords.filter(r => r.studentId === studentId);
}

function getAllBorrowRecords() {
    const db = getDatabase();
    return db.borrowRecords;
}

function getBorrowRecordById(recordId) {
    const db = getDatabase();
    return db.borrowRecords.find(r => r.id === recordId);
}

// ===== ANALYTICS FUNCTIONS =====

function getAnalyticsData() {
    const db = getDatabase();
    const borrowRecords = db.borrowRecords;
    const students = db.users.filter(u => u.role === 'student');
    const books = db.books;

    const totalBorrows = borrowRecords.length;
    const totalReturns = borrowRecords.filter(r => r.status === 'returned').length;
    const activeBorrows = borrowRecords.filter(r => r.status === 'borrowed').length;
    const overdueBorrows = borrowRecords.filter(r => {
        if (r.status === 'borrowed') {
            return new Date(r.dueDate) < new Date();
        }
        return false;
    }).length;

    const studentBorrowCount = {};
    borrowRecords.forEach(r => {
        studentBorrowCount[r.studentId] = (studentBorrowCount[r.studentId] || 0) + 1;
    });

    const bookPopularity = {};
    borrowRecords.forEach(r => {
        bookPopularity[r.bookId] = (bookPopularity[r.bookId] || 0) + 1;
    });

    const topStudents = Object.entries(studentBorrowCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({
            student: getUserById(id),
            borrowCount: count
        }));

    const topBooks = Object.entries(bookPopularity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({
            book: getBookById(id),
            borrowCount: count
        }));

    return {
        totalBorrows,
        totalReturns,
        activeBorrows,
        overdueBorrows,
        totalStudents: students.length,
        totalBooks: books.length,
        topStudents,
        topBooks,
        studentBorrowCount,
        bookPopularity
    };
}

// ===== UTILITY FUNCTIONS =====

// ===== BACKUP & RESTORE FUNCTIONS =====
// Export the current libraryDB as a JSON file
function exportLibraryDB() {
    const db = getDatabase();
    const dataStr = JSON.stringify(db, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'libraryDB-backup-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import a JSON file and restore the DB
function importLibraryDB(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data && typeof data === 'object' && data.users && data.books && data.ebooks && data.borrowRecords) {
                localStorage.setItem('libraryDB', JSON.stringify(data));
                if (typeof callback === 'function') callback(true);
                window.dispatchEvent(new CustomEvent('databaseUpdated', { detail: { timestamp: Date.now() } }));
            } else {
                if (typeof callback === 'function') callback(false);
            }
        } catch (err) {
            if (typeof callback === 'function') callback(false);
        }
    };
    reader.readAsText(file);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getDaysUntilDue(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

function generateId(prefix = 'ID') {
    return prefix + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Persistent login: use localStorage for currentUser

function getCurrentUser() {
    // Try localStorage first, then sessionStorage for compatibility
    let user = localStorage.getItem('currentUser');
    if (!user) user = sessionStorage.getItem('currentUser');
    if (user) {
        try {
            const parsed = JSON.parse(user);
            console.log('[QOLH] getCurrentUser:', parsed);
            return parsed;
        } catch (e) {
            console.warn('[QOLH] getCurrentUser: failed to parse', user, e);
            return null;
        }
    } else {
        console.log('[QOLH] getCurrentUser: no user found');
        return null;
    }
}


function setCurrentUser(user) {
    // Save to both for compatibility
    const str = JSON.stringify(user);
    localStorage.setItem('currentUser', str);
    sessionStorage.setItem('currentUser', str);
    console.log('[QOLH] setCurrentUser:', user);
}

function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'http://127.0.0.1:5500/';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideInLeft 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Initialize database on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDatabase);
} else {
    initializeDatabase();
}
