/**
 * API Types - TypeScript type definitions for API client
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
  error?: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'teacher' | 'student';
  schoolId: string;
  phone?: string;
  address?: string;
  createdAt?: Date | string;
  profilePicture?: string | null;
}

export interface Book {
  _id: string;
  id?: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  description?: string;
  quantity: number;
  available: number;
  createdAt?: Date | string;
  image?: string | null;
}

export interface Ebook {
  _id: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  filePath: string;
  downloads: number;
  createdAt?: Date | string;
}

export interface BorrowRecord {
  _id: string;
  id?: string;
  studentId: string;
  bookId: string;
  borrowDate: Date | string;
  dueDate: Date | string;
  returnDate?: Date | string | null;
  status: 'borrowed' | 'returned' | 'overdue' | 'force_returned';
  forceReturnByAdmin?: boolean;
  bookTitle?: string;
}

export interface ChangeRequest {
  _id: string;
  id?: string;
  requesterId: string;
  requesterName: string;
  resourceType: 'book' | 'ebook' | 'student';
  resourceId: string;
  resourceTitle: string;
  changeType: 'update' | 'delete';
  currentData: any;
  proposedData: any;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: Date | string;
  createdAt?: Date | string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'admin' | 'teacher' | 'student';
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface BorrowData {
  bookId: string;
  studentId: string;
  borrowDate?: Date;
  dueDate?: Date;
}

export interface CreateChangeRequestData {
  resourceType: 'book' | 'ebook' | 'student';
  resourceId: string;
  resourceTitle: string;
  changeType: 'update' | 'delete';
  currentData: any;
  proposedData: any;
  reason: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  filter?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface BorrowSummary {
  totalBorrows: number;
  activeBorrows: number;
  returnedBooks: number;
  overdueBorrows: number;
  completionRate: number;
}

export interface UserStats {
  totalBorrows: number;
  activeBorrows: number;
  returnedBooks: number;
  overdueBooks: number;
}

export interface OverdueStatus {
  isOverdue: boolean;
  daysOverdue: number;
  dueDate: string;
  status: 'overdue' | 'on-time';
}

export interface AvailabilityInfo {
  isAvailable: boolean;
  percentage: number;
  status: 'In Stock' | 'Available' | 'Limited' | 'Out of Stock';
}

export interface Analytics {
  summary: BorrowSummary;
  topBooks: (Book & { borrowCount: number })[];
  topBorrowers: (User & { stats: UserStats })[];
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[] | { [key: string]: string };
}

export interface FileValidation {
  type: 'valid' | 'invalid';
  message: string;
  file?: File;
}

export type ApiEndpoint = string;
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
