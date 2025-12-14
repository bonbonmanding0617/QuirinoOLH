/**
 * Utility Functions - TypeScript version
 * Comprehensive helper functions
 */

// ===== DATE & TIME UTILITIES =====

export function formatDateUtil(date: Date | string): string {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatDateTimeUtil(date: Date | string): string {
  const d = new Date(date);
  const dateStr = formatDateUtil(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

export function getTimeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDateUtil(d);
}

export function isOverdue(dueDate: Date | string): boolean {
  return new Date(dueDate) < new Date();
}

export function getDaysUntilDue(dueDate: Date | string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ===== STRING UTILITIES =====

export function truncateString(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => capitalizeFirst(word)).join(' ');
}

export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ===== LOCAL STORAGE UTILITIES =====

export function saveToStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage<T = any>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}

export function clearStorage(): void {
  localStorage.clear();
}

// ===== DOM UTILITIES =====

export function showElement(element: HTMLElement | string): void {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) el.style.display = '';
}

export function hideElement(element: HTMLElement | string): void {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) el.style.display = 'none';
}

export function toggleElement(element: HTMLElement | string): void {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
}

export function addClass(element: HTMLElement | string, className: string): void {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) el.classList.add(className);
}

export function removeClass(element: HTMLElement | string, className: string): void {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) el.classList.remove(className);
}

export function setText(element: HTMLElement | string, text: string): void {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) el.textContent = text;
}

export function getText(element: HTMLElement | string): string {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  return el ? el.textContent || '' : '';
}

export function setElementValue(element: HTMLInputElement | string, value: any): void {
  const el = typeof element === 'string' ? document.getElementById(element) as HTMLInputElement : element;
  if (el) el.value = value;
}

export function getElementValue(element: HTMLInputElement | string): string {
  const el = typeof element === 'string' ? document.getElementById(element) as HTMLInputElement : element;
  return el ? el.value : '';
}

// ===== NUMBER UTILITIES =====

export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

export function roundNumber(num: number, decimals = 0): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ===== ARRAY UTILITIES =====

export function sortByProperty<T extends Record<string, any>>(
  arr: T[],
  property: keyof T,
  ascending = true
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

export function filterByProperty<T extends Record<string, any>>(
  arr: T[],
  property: keyof T,
  value: any
): T[] {
  return arr.filter(item => item[property] === value);
}

export function groupByProperty<T extends Record<string, any>>(
  arr: T[],
  property: keyof T
): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = String(item[property]);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function uniqueByProperty<T extends Record<string, any>>(
  arr: T[],
  property: keyof T
): T[] {
  return arr.filter((item, index, self) =>
    index === self.findIndex(t => t[property] === item[property])
  );
}

// ===== OBJECT UTILITIES =====

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function mergeObjects<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  return Object.assign({}, target, ...sources) as T;
}

// ===== PERFORMANCE UTILITIES =====

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== MISCELLANEOUS =====

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(content: string, filename: string, type = 'text/plain'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getQueryParam(param: string, url = window.location.href): string | null {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get(param);
}
