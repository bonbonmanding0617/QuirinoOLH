/**
 * API Client - TypeScript version
 * Centralized API communication with error handling and type safety
 */

/// <reference lib="dom" />

import {
  User,
  Book,
  Ebook,
  BorrowRecord,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  BorrowData,
  ApiResponse,
  PaginatedResponse
} from './types';
import CONFIG from './config';

const API_BASE_URL = CONFIG.API.BASE_URL;

/**
 * Get authorization headers
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(CONFIG.AUTH.TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * Handle API errors
 */
function handleApiError(error: any): void {
  console.error('API Error:', error);
  
  if (error.response?.status === 401) {
    localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(CONFIG.AUTH.USER_KEY);
    if (typeof window !== 'undefined') {
      (window as any).location.href = CONFIG.AUTH.LOGIN_URL;
    }
  }
  
  throw {
    status: error.response?.status || 500,
    message: error.response?.data?.message || error.message || 'An error occurred',
    data: error.response?.data
  };
}

/**
 * Make API request
 */
async function apiRequest<T = any>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    
    const json: any = await response.json();
    
    if (!response.ok) {
      throw new Error(json.message || `HTTP ${response.status}`);
    }
    
    return json.data || json;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// ===== AUTHENTICATION ENDPOINTS =====

export async function registerUser(data: RegisterData): Promise<User> {
  return apiRequest<User>('POST', '/register', data);
}

export async function loginUser(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  const response = await apiRequest<{ user: User; token: string }>(
    'POST',
    '/login',
    credentials
  );
  
  if (response.token) {
    localStorage.setItem(CONFIG.AUTH.TOKEN_KEY, response.token);
    localStorage.setItem(CONFIG.AUTH.USER_KEY, JSON.stringify(response.user));
  }
  
  return response;
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
  localStorage.removeItem(CONFIG.AUTH.USER_KEY);
}

// ===== USER ENDPOINTS =====

export async function getUserProfile(): Promise<User> {
  return apiRequest<User>('GET', '/me');
}

export async function updateUserProfile(data: UpdateProfileData): Promise<User> {
  const user = JSON.parse(localStorage.getItem(CONFIG.AUTH.USER_KEY) || '{}');
  return apiRequest<User>('PUT', `/users/${user._id}`, data);
}

export async function getAllUsers(): Promise<User[]> {
  return apiRequest<User[]>('GET', '/users');
}

export async function getUserById(userId: string): Promise<User> {
  return apiRequest<User>('GET', `/users/${userId}`);
}

export async function updateUser(userId: string, data: Partial<User>): Promise<User> {
  return apiRequest<User>('PUT', `/users/${userId}`, data);
}

export async function deleteUser(userId: string): Promise<void> {
  return apiRequest('DELETE', `/users/${userId}`);
}

// ===== STUDENT ENDPOINTS =====

export async function getAllStudents(): Promise<User[]> {
  return apiRequest<User[]>('GET', '/students');
}

export async function getStudentById(studentId: string): Promise<User> {
  return apiRequest<User>('GET', `/students/${studentId}`);
}

export async function updateStudent(studentId: string, data: Partial<User>): Promise<User> {
  return apiRequest<User>('PUT', `/students/${studentId}`, data);
}

export async function deleteStudent(studentId: string): Promise<void> {
  return apiRequest('DELETE', `/students/${studentId}`);
}

// ===== TEACHER ENDPOINTS =====

export async function getAllTeachers(): Promise<User[]> {
  return apiRequest<User[]>('GET', '/teachers');
}

export async function getTeacherById(teacherId: string): Promise<User> {
  return apiRequest<User>('GET', `/teachers/${teacherId}`);
}

export async function updateTeacher(teacherId: string, data: Partial<User>): Promise<User> {
  return apiRequest<User>('PUT', `/teachers/${teacherId}`, data);
}

export async function deleteTeacher(teacherId: string): Promise<void> {
  return apiRequest('DELETE', `/teachers/${teacherId}`);
}

export async function createTeacher(data: Partial<User>): Promise<User> {
  return apiRequest<User>('POST', '/teachers', data);
}

// ===== BOOK ENDPOINTS =====

export async function getAllBooks(): Promise<Book[]> {
  const response = await apiRequest<{ books: Book[] }>('GET', '/books');
  return response.books || [];
}

export async function getBookById(bookId: string): Promise<Book> {
  const response = await apiRequest<{ book: Book }>('GET', `/books/${bookId}`);
  return response.book || {};
}

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await apiRequest<{ books: Book[] }>('GET', `/books/search?q=${encodeURIComponent(query)}`);
  return response.books || [];
}

export async function createBook(data: Partial<Book>): Promise<Book> {
  return apiRequest<Book>('POST', '/books', data);
}

export async function updateBook(bookId: string, data: Partial<Book>): Promise<Book> {
  return apiRequest<Book>('PUT', `/books/${bookId}`, data);
}

export async function deleteBook(bookId: string): Promise<void> {
  return apiRequest('DELETE', `/books/${bookId}`);
}

// ===== EBOOK ENDPOINTS =====

export async function getAllEbooks(): Promise<Ebook[]> {
  const response = await apiRequest<{ ebooks: Ebook[] }>('GET', '/ebooks');
  return response.ebooks || [];
}

export async function getEbookById(ebookId: string): Promise<Ebook> {
  const response = await apiRequest<{ ebook: Ebook }>('GET', `/ebooks/${ebookId}`);
  return response.ebook || {};
}

export async function createEbook(data: Partial<Ebook>): Promise<Ebook> {
  return apiRequest<Ebook>('POST', '/ebooks', data);
}

export async function updateEbook(ebookId: string, data: Partial<Ebook>): Promise<Ebook> {
  return apiRequest<Ebook>('PUT', `/ebooks/${ebookId}`, data);
}

export async function deleteEbook(ebookId: string): Promise<void> {
  return apiRequest('DELETE', `/ebooks/${ebookId}`);
}

export async function downloadEbook(ebookId: string): Promise<void> {
  return apiRequest('PUT', `/ebooks/${ebookId}/download`);
}

// ===== BORROW ENDPOINTS =====

export async function borrowBook(data: BorrowData): Promise<BorrowRecord> {
  return apiRequest<BorrowRecord>('POST', '/borrow', data);
}

export async function returnBook(borrowId: string): Promise<BorrowRecord> {
  return apiRequest<BorrowRecord>('PUT', `/borrow/${borrowId}/return`);
}

export async function getAllBorrows(): Promise<BorrowRecord[]> {
  const response = await apiRequest<{ records: BorrowRecord[] }>('GET', '/borrow');
  return response.records || [];
}

export async function getUserBorrows(userId: string): Promise<BorrowRecord[]> {
  const response = await apiRequest<{ records: BorrowRecord[] }>('GET', `/borrow/student/${userId}`);
  return response.records || [];
}

export async function getBorrowById(borrowId: string): Promise<BorrowRecord> {
  const response = await apiRequest<BorrowRecord>('GET', `/borrow/${borrowId}`);
  return response;
}
