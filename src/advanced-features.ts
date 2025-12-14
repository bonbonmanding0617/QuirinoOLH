/**
 * Advanced Features - TypeScript version
 * Business logic, analytics, and complex operations
 */

import { User, Book, BorrowRecord } from './types';
import CONFIG from './config';
import * as Utils from './utils';

/**
 * Calculate reading statistics for a student
 */
export function calculateReadingStats(borrows: BorrowRecord[]) {
  const totalBorrows = borrows.length;
  const activeBorrows = borrows.filter(b => !b.returnDate).length;
  const completedBorrows = borrows.filter(b => b.returnDate).length;
  const overdueBooks = borrows.filter(b => !b.returnDate && Utils.isOverdue(b.dueDate)).length;

  return {
    totalBorrows,
    activeBorrows,
    completedBorrows,
    overdueBooks,
    completionRate: totalBorrows > 0 ? (completedBorrows / totalBorrows) * 100 : 0
  };
}

/**
 * Get recommended books based on borrowing history
 */
export function getRecommendedBooks(borrowHistory: Book[], allBooks: Book[]): Book[] {
  if (borrowHistory.length === 0) return allBooks.slice(0, 5);

  const categories = new Set(borrowHistory.map(b => b.category));
  const recommended = allBooks.filter(b => categories.has(b.category));

  return recommended.slice(0, 5);
}

/**
 * Check if user has overdue books
 */
export function hasOverdueBooks(borrows: BorrowRecord[]): boolean {
  return borrows.some(b => !b.returnDate && Utils.isOverdue(b.dueDate));
}

/**
 * Calculate fine for overdue book
 */
export function calculateFine(dueDate: Date): number {
  const daysOverdue = Math.floor((new Date().getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysOverdue <= 0) return 0;

  const finePerDay = CONFIG.BORROW.FINE_PER_DAY || 10;
  const maxFine = 500;
  const fine = Math.min(daysOverdue * finePerDay, maxFine);

  return fine;
}

/**
 * Generate student report
 */
export function generateStudentReport(student: User, borrows: BorrowRecord[]) {
  return {
    studentId: student._id,
    studentName: student.name,
    studentEmail: student.email,
    stats: calculateReadingStats(borrows),
    hasOverdue: hasOverdueBooks(borrows),
    generatedAt: new Date(),
    generatedAtFormatted: Utils.formatDateTimeUtil(new Date())
  };
}

/**
 * Check if student is eligible for more borrows
 */
export function isEligibleForMoreBorrows(user: User, activeBorrows: BorrowRecord[]): boolean {
  const maxBorrows = CONFIG.BORROW.MAX_BOOKS_PER_USER || 5;
  const hasOverdue = hasOverdueBooks(activeBorrows);

  return !hasOverdue && activeBorrows.length < maxBorrows;
}

/**
 * Search books by multiple criteria
 */
export function advancedSearch(
  books: Book[],
  query: string,
  filters?: { category?: string; author?: string; year?: number }
): Book[] {
  let results = books;

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      b =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery) ||
        (b.isbn && b.isbn.includes(lowerQuery))
    );
  }

  if (filters?.category) {
    results = results.filter(b => b.category === filters.category);
  }

  if (filters?.author) {
    results = results.filter(b => b.author.toLowerCase().includes(filters.author!.toLowerCase()));
  }

  if (filters?.year) {
    results = results.filter(b => {
      const createdAt = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
      return createdAt && createdAt.getFullYear() === filters.year;
    });
  }

  return results;
}

/**
 * Export data utilities
 */
export function exportReportAsJSON(report: any): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Format report for display
 */
export function formatReportForDisplay(report: any): string {
  return `
Student Report
==============
Student: ${report.studentName} (${report.studentEmail})
Generated: ${report.generatedAtFormatted}

Reading Statistics
------------------
Total Borrows: ${report.stats.totalBorrows}
Active Borrows: ${report.stats.activeBorrows}
Completed Borrows: ${report.stats.completedBorrows}
Overdue Books: ${report.stats.overdueBooks}
Completion Rate: ${report.stats.completionRate.toFixed(2)}%

Status: ${report.hasOverdue ? 'Has Overdue Books' : 'All Books On Time'}
  `.trim();
}
