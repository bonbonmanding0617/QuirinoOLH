/**
 * API Client - Centralized API communication module
 * Handles all HTTP requests to the backend with error handling and token management
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Get authorization headers with token
 */
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

/**
 * Handle API errors consistently
 */
function handleApiError(error) {
    if (error.response) {
        // Server responded with error status
        const message = error.response.data?.error || error.response.statusText || 'Server error';
        const status = error.response.status;
        
        if (status === 401) {
            // Unauthorized - token expired
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/pages/student-login.html';
        }
        
        return {
            success: false,
            message,
            status
        };
    } else if (error.request) {
        // Request made but no response
        return {
            success: false,
            message: 'No response from server. Check your connection.',
            status: 0
        };
    } else {
        // Error in request setup
        return {
            success: false,
            message: error.message || 'An error occurred',
            status: 0
        };
    }
}

// ===== AUTHENTICATION ENDPOINTS =====

/**
 * Register a new user
 */
async function registerUser(userData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Login user
 */
async function loginUser(email, password) {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return {
            success: true,
            data: { token, user }
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get current user
 */
async function getCurrentUserData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/me`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.user
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// ===== USER ENDPOINTS =====

/**
 * Update user profile
 */
async function updateUserProfile(userId, profileData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, profileData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.user
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// ===== STUDENTS ENDPOINTS =====

/**
 * Get all students
 */
async function getAllStudents() {
    try {
        const response = await axios.get(`${API_BASE_URL}/students`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.students
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Delete a student
 */
async function deleteStudent(studentId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/students/${studentId}`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// ===== BOOKS ENDPOINTS =====

/**
 * Get all books
 */
async function getAllBooks() {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        return {
            success: true,
            data: response.data.books
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get single book by ID
 */
async function getBook(bookId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
        return {
            success: true,
            data: response.data.book
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Create a new book
 */
async function createBook(bookData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/books`, bookData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.book
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Update a book
 */
async function updateBook(bookId, bookData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/books/${bookId}`, bookData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.book
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Delete a book
 */
async function deleteBook(bookId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/books/${bookId}`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// ===== EBOOKS ENDPOINTS =====

/**
 * Get all ebooks
 */
async function getAllEbooks() {
    try {
        const response = await axios.get(`${API_BASE_URL}/ebooks`);
        return {
            success: true,
            data: response.data.ebooks
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get single ebook by ID
 */
async function getEbook(ebookId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/ebooks/${ebookId}`);
        return {
            success: true,
            data: response.data.ebook
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Create a new ebook
 */
async function createEbook(ebookData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/ebooks`, ebookData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.ebook
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Update an ebook
 */
async function updateEbook(ebookId, ebookData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/ebooks/${ebookId}`, ebookData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.ebook
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Delete an ebook
 */
async function deleteEbook(ebookId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/ebooks/${ebookId}`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Increment ebook download count
 */
async function incrementEbookDownload(ebookId) {
    try {
        const response = await axios.put(`${API_BASE_URL}/ebooks/${ebookId}/download`, {}, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// ===== BORROW ENDPOINTS =====

/**
 * Borrow a book
 */
async function borrowBook(borrowData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/borrow`, borrowData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.record
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get all borrow records (admin only)
 */
async function getAllBorrowRecords() {
    try {
        const response = await axios.get(`${API_BASE_URL}/borrow`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.records
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get student's borrow records
 */
async function getStudentBorrowRecords(studentId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/borrow/student/${studentId}`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.records
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Return a borrowed book
 */
async function returnBook(borrowRecordId) {
    try {
        const response = await axios.put(`${API_BASE_URL}/borrow/${borrowRecordId}/return`, {}, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.record
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// ===== TEACHER ENDPOINTS =====

/**
 * Get all teachers
 */
async function getAllTeachers() {
    try {
        const response = await axios.get(`${API_BASE_URL}/teachers`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.teachers
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get teacher by ID
 */
async function getTeacher(teacherId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/teachers/${teacherId}`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.teacher
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Create a new teacher
 */
async function createTeacher(teacherData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/teachers`, teacherData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.teacher
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Update a teacher
 */
async function updateTeacher(teacherId, teacherData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/teachers/${teacherId}`, teacherData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.teacher
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Delete a teacher
 */
async function deleteTeacher(teacherId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/teachers/${teacherId}`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return handleApiError(error);
    }
}

// ===== CHANGE REQUEST ENDPOINTS =====

/**
 * Create a change request
 */
async function createChangeRequest(requestData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/change-requests`, requestData, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.request
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get pending change requests
 */
async function getPendingChangeRequests() {
    try {
        const response = await axios.get(`${API_BASE_URL}/change-requests/pending`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.requests
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get all change requests
 */
async function getAllChangeRequests() {
    try {
        const response = await axios.get(`${API_BASE_URL}/change-requests`, {
            headers: getAuthHeaders()
        });
        return {
            success: true,
            data: response.data.requests
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Approve a change request
 */
async function approveChangeRequest(requestId, reviewNotes) {
    try {
        const response = await axios.put(`${API_BASE_URL}/change-requests/${requestId}/approve`, 
            { reviewNotes }, 
            { headers: getAuthHeaders() }
        );
        return {
            success: true,
            data: response.data.request
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Reject a change request
 */
async function rejectChangeRequest(requestId, reviewNotes) {
    try {
        const response = await axios.put(`${API_BASE_URL}/change-requests/${requestId}/reject`, 
            { reviewNotes }, 
            { headers: getAuthHeaders() }
        );
        return {
            success: true,
            data: response.data.request
        };
    } catch (error) {
        return handleApiError(error);
    }
}
