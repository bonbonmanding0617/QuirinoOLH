/**
 * Advanced Features - Complex business logic helpers
 * Provides advanced operations for library management
 */

// ===== BORROW MANAGEMENT =====

/**
 * Calculate due date based on borrow date
 */
function calculateDueDate(borrowDate, durationDays = 14) {
    const date = new Date(borrowDate);
    date.setDate(date.getDate() + durationDays);
    return date;
}

/**
 * Check if book is overdue
 */
function isBookOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

/**
 * Get overdue status object
 */
function getOverdueStatus(dueDate) {
    const daysOverdue = getDaysUntilDue(dueDate);
    const isOverdue = daysOverdue < 0;
    
    return {
        isOverdue,
        daysOverdue: Math.abs(daysOverdue),
        dueDate: formatDateUtil(dueDate),
        status: isOverdue ? 'overdue' : 'on-time'
    };
}

/**
 * Filter borrow records by status
 */
function filterBorrowByStatus(records, status) {
    return records.filter(r => r.status === status);
}

/**
 * Get overdue borrow records
 */
function getOverdueBorrows(records) {
    return records.filter(r => 
        r.status === 'borrowed' && isBookOverdue(r.dueDate)
    );
}

/**
 * Get active borrow records for user
 */
function getActiveBorrows(records, userId) {
    return records.filter(r => 
        r.studentId === userId && r.status === 'borrowed'
    );
}

/**
 * Calculate fine for overdue book
 */
function calculateFine(dueDate, finePerDay = 0) {
    if (finePerDay === 0) return 0;
    
    const daysOverdue = getDaysUntilDue(dueDate);
    if (daysOverdue >= 0) return 0; // Not overdue
    
    return Math.abs(daysOverdue) * finePerDay;
}

/**
 * Get borrow summary statistics
 */
function getBorrowSummary(records) {
    const totalBorrows = records.length;
    const activeBorrows = records.filter(r => r.status === 'borrowed').length;
    const returnedBooks = records.filter(r => r.status === 'returned').length;
    const overdueBorrows = records.filter(r => 
        r.status === 'borrowed' && isBookOverdue(r.dueDate)
    ).length;
    
    return {
        totalBorrows,
        activeBorrows,
        returnedBooks,
        overdueBorrows,
        completionRate: Math.round((returnedBooks / totalBorrows) * 100) || 0
    };
}

// ===== BOOK MANAGEMENT =====

/**
 * Check if book is available
 */
function isBookAvailable(book) {
    return book.available > 0;
}

/**
 * Get book availability percentage
 */
function getAvailabilityPercentage(book) {
    return Math.round((book.available / book.quantity) * 100);
}

/**
 * Get book availability status
 */
function getAvailabilityStatus(book) {
    const percentage = getAvailabilityPercentage(book);
    
    if (percentage === 100) return 'In Stock';
    if (percentage >= 50) return 'Available';
    if (percentage > 0) return 'Limited';
    return 'Out of Stock';
}

/**
 * Get most borrowed books
 */
function getMostBorrowedBooks(books, records) {
    const borrowCount = {};
    
    records.forEach(record => {
        borrowCount[record.bookId] = (borrowCount[record.bookId] || 0) + 1;
    });
    
    return books
        .map(book => ({
            ...book,
            borrowCount: borrowCount[book._id] || 0
        }))
        .sort((a, b) => b.borrowCount - a.borrowCount);
}

/**
 * Get least borrowed books
 */
function getLeastBorrowedBooks(books, records) {
    return getMostBorrowedBooks(books, records).reverse();
}

/**
 * Suggest books based on borrowing patterns
 */
function suggestBooks(userBorrows, allBooks) {
    // Get categories user has borrowed
    const userCategories = userBorrows
        .map(b => b.category)
        .filter((c, i, a) => a.indexOf(c) === i);
    
    // Find books in similar categories not borrowed
    return allBooks.filter(book => 
        userCategories.includes(book.category) &&
        !userBorrows.find(b => b._id === book._id)
    );
}

// ===== USER MANAGEMENT =====

/**
 * Check if user is active
 */
function isUserActive(user, lastActivityDate) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastActivityDate) > thirtyDaysAgo;
}

/**
 * Get user statistics
 */
function getUserStats(user, records) {
    const userRecords = records.filter(r => r.studentId === user._id);
    
    return {
        totalBorrows: userRecords.length,
        activeBorrows: userRecords.filter(r => r.status === 'borrowed').length,
        returnedBooks: userRecords.filter(r => r.status === 'returned').length,
        overdueBooks: userRecords.filter(r => 
            r.status === 'borrowed' && isBookOverdue(r.dueDate)
        ).length
    };
}

/**
 * Get top borrowers
 */
function getTopBorrowers(users, records) {
    return users
        .map(user => ({
            ...user,
            stats: getUserStats(user, records)
        }))
        .sort((a, b) => b.stats.totalBorrows - a.stats.totalBorrows);
}

// ===== ANALYTICS =====

/**
 * Get analytics dashboard data
 */
function getAnalyticsDashboard(books, users, records) {
    const borrowSummary = getBorrowSummary(records);
    const topBooks = getMostBorrowedBooks(books, records).slice(0, 5);
    const topBorrowers = getTopBorrowers(users, records).slice(0, 5);
    
    return {
        summary: borrowSummary,
        topBooks,
        topBorrowers,
        timestamp: new Date()
    };
}

/**
 * Get borrowing trends (last N days)
 */
function getBorrowingTrends(records, days = 30) {
    const trends = {};
    const now = new Date();
    
    // Initialize dates
    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = formatDateUtil(date);
        trends[dateStr] = 0;
    }
    
    // Count borrows per day
    records.forEach(record => {
        const dateStr = formatDateUtil(record.borrowDate);
        if (trends.hasOwnProperty(dateStr)) {
            trends[dateStr]++;
        }
    });
    
    return trends;
}

/**
 * Get popular categories
 */
function getPopularCategories(books, records) {
    const categoryCount = {};
    
    records.forEach(record => {
        const book = books.find(b => b._id === record.bookId);
        if (book) {
            categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
        }
    });
    
    return Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
}

// ===== DATA VALIDATION FOR OPERATIONS =====

/**
 * Validate borrow operation
 */
function validateBorrowOperation(user, book, activeRecords) {
    const errors = [];
    
    // Check if book is available
    if (!isBookAvailable(book)) {
        errors.push('This book is currently out of stock');
    }
    
    // Check active borrow limit
    const activeCount = activeRecords.filter(r => r.studentId === user._id).length;
    if (activeCount >= 5) {
        errors.push('You have reached the maximum active borrow limit (5)');
    }
    
    // Check for existing borrow of same book
    if (activeRecords.find(r => r.studentId === user._id && r.bookId === book._id)) {
        errors.push('You have already borrowed this book');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate return operation
 */
function validateReturnOperation(record) {
    const errors = [];
    
    if (record.status !== 'borrowed') {
        errors.push('This book has already been returned');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate book creation
 */
function validateBookCreation(bookData) {
    const errors = [];
    
    if (!bookData.title || bookData.title.trim() === '') {
        errors.push('Book title is required');
    }
    
    if (!bookData.author || bookData.author.trim() === '') {
        errors.push('Author is required');
    }
    
    if (!bookData.quantity || bookData.quantity < 1) {
        errors.push('Quantity must be at least 1');
    }
    
    if (bookData.quantity && bookData.available && bookData.available > bookData.quantity) {
        errors.push('Available count cannot exceed total quantity');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// ===== REPORTING =====

/**
 * Generate user activity report
 */
function generateUserActivityReport(users, records) {
    return users.map(user => {
        const userRecords = records.filter(r => r.studentId === user._id);
        const overdueBorrows = userRecords.filter(r => 
            r.status === 'borrowed' && isBookOverdue(r.dueDate)
        );
        
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            totalBorrows: userRecords.length,
            activeBorrows: userRecords.filter(r => r.status === 'borrowed').length,
            overdueCount: overdueBorrows.length,
            lastBorrowDate: userRecords.length > 0 ? 
                new Date(userRecords[userRecords.length - 1].borrowDate) : null
        };
    });
}

/**
 * Generate inventory report
 */
function generateInventoryReport(books) {
    return {
        totalBooks: books.length,
        totalCopies: books.reduce((sum, b) => sum + b.quantity, 0),
        totalAvailable: books.reduce((sum, b) => sum + b.available, 0),
        outOfStock: books.filter(b => !isBookAvailable(b)).length,
        lowStock: books.filter(b => getAvailabilityPercentage(b) < 20 && getAvailabilityPercentage(b) > 0).length,
        categories: [...new Set(books.map(b => b.category))].length
    };
}

/**
 * Export data to CSV format
 */
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                return typeof value === 'string' && value.includes(',') ? 
                    `"${value.replace(/"/g, '""')}"` : value;
            }).join(',')
        )
    ].join('\n');
    
    downloadFile(filename, csvContent);
}
