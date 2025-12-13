// ===== GLOBAL ERROR HANDLERS =====
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
const uri = process.env.MONGO_URI || "mongodb+srv://bonbonmanding23_db_user:bNVcNiLhhct4yAYV@cluster0.uhfvung.mongodb.net/qolh?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('✅ MongoDB Atlas connected successfully!');
  // Ensure admin account exists
  ensureAdmin().catch(err => console.warn('Error ensuring admin user:', err.message));
})
.catch(err => {
  console.warn('⚠️  MongoDB connection failed:', err.message);
  console.warn('📝 Troubleshooting:');
  console.warn('1. Check IP is whitelisted in Network Access');
  console.warn('2. Verify cluster is not paused');
  console.warn('3. Check internet connection');
});

// ===== SCHEMAS =====

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' },
  schoolId: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Ensure admin user exists (created after DB connection)
async function ensureAdmin() {
  try {
    const adminEmail = 'emily.pascua002@deped.gov.ph';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin user already exists:', adminEmail);
      return;
    }
    const plain = 'Emp.082289';
    const hash = await bcrypt.hash(plain, 10);
    const admin = await User.create({
      name: 'Emily Pascua',
      email: adminEmail,
      password: hash,
      role: 'admin'
    });
    console.log('Created admin user:', adminEmail);
  } catch (err) {
    console.warn('Failed to create admin user:', err.message);
  }
}

// Book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String,
  category: String,
  description: String,
  quantity: Number,
  available: Number,
  createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.model('Book', bookSchema);

// eBook schema
const ebookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  description: String,
  filePath: String,
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Ebook = mongoose.model('Ebook', ebookSchema);

// Borrow Record schema
const borrowSchema = new mongoose.Schema({
  studentId: String,
  bookId: String,
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: { type: String, default: 'borrowed' },
  forceReturnByAdmin: { type: Boolean, default: false }
});
const BorrowRecord = mongoose.model('BorrowRecord', borrowSchema);

// ===== AUTH MIDDLEWARE =====
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'secret');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ===== USER ENDPOINTS =====

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, schoolId, phone, address } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hash, role, schoolId, phone, address });
    res.json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials' });
  if (role && user.role !== role) return res.status(401).json({ success: false, error: 'Invalid role' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ success: true, token, user: { ...user.toObject(), password: undefined } });
});

// Get current user
app.get('/api/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
});

// Update user
app.put('/api/users/:id', auth, async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, phone, address }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Get all students
app.get('/api/students', auth, async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  res.json({ students });
});

// Delete student
app.delete('/api/students/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Get all teachers
app.get('/api/teachers', auth, async (req, res) => {
  const teachers = await User.find({ role: 'teacher' }).select('-password');
  res.json({ teachers });
});

// Add teacher
app.post('/api/teachers', auth, async (req, res) => {
  const { name, email, password, schoolId, phone, address } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const teacher = await User.create({
      name,
      email,
      password: hash,
      role: 'teacher',
      schoolId,
      phone,
      address
    });
    res.json({ success: true, teacher: { ...teacher.toObject(), password: undefined } });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Update teacher
app.put('/api/teachers/:id', auth, async (req, res) => {
  const { name, email, schoolId, phone, address } = req.body;
  try {
    const teacher = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, schoolId, phone, address },
      { new: true }
    ).select('-password');
    res.json({ success: true, teacher });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Delete teacher
app.delete('/api/teachers/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// ===== BOOK ENDPOINTS =====

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (e) {
    console.error('Error fetching books:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json({ book });
});

// Add book
app.post('/api/books', auth, async (req, res) => {
  const { title, author, isbn, category, description, quantity } = req.body;
  try {
    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      description,
      quantity: parseInt(quantity),
      available: parseInt(quantity)
    });
    res.json({ success: true, book });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Update book
app.put('/api/books/:id', auth, async (req, res) => {
  const { title, author, isbn, category, description, quantity, available } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, isbn, category, description, quantity: parseInt(quantity), available: parseInt(available) },
      { new: true }
    );
    res.json({ success: true, book });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Delete book
app.delete('/api/books/:id', auth, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// ===== EBOOK ENDPOINTS =====

// Get all eBooks
app.get('/api/ebooks', async (req, res) => {
    // Get all books (with error handling)
    try {
      const books = await Book.find();
      res.json({ books });
    } catch (err) {
      console.error('Error fetching books:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch books', details: err.message });
    }
});

// Get eBook by ID
app.get('/api/ebooks/:id', async (req, res) => {
  const ebook = await Ebook.findById(req.params.id);
  res.json({ ebook });
});

// Add eBook
app.post('/api/ebooks', auth, async (req, res) => {
  const { title, author, category, description, filePath } = req.body;
  try {
    const ebook = await Ebook.create({ title, author, category, description, filePath });
    res.json({ success: true, ebook });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Update eBook
app.put('/api/ebooks/:id', auth, async (req, res) => {
  const { title, author, category, description, filePath } = req.body;
  try {
    const ebook = await Ebook.findByIdAndUpdate(
      req.params.id,
      { title, author, category, description, filePath },
      { new: true }
    );
    res.json({ success: true, ebook });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Delete eBook
app.delete('/api/ebooks/:id', auth, async (req, res) => {
  try {
    await Ebook.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Increment eBook downloads
app.put('/api/ebooks/:id/download', async (req, res) => {
  try {
    const ebook = await Ebook.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
    res.json({ success: true, ebook });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// ===== BORROW ENDPOINTS =====

// Borrow book
app.post('/api/borrow', auth, async (req, res) => {
  const { studentId, bookId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) {
      return res.status(400).json({ success: false, error: 'Book not available' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const record = await BorrowRecord.create({
      studentId,
      bookId,
      borrowDate: new Date(),
      dueDate,
      status: 'borrowed'
    });

    await Book.findByIdAndUpdate(bookId, { $inc: { available: -1 } });

    res.json({ success: true, record });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Return book
app.put('/api/borrow/:id/return', auth, async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);
    if (!record) return res.status(400).json({ success: false, error: 'Record not found' });

    const book = await Book.findById(record.bookId);
    if (book) {
      await Book.findByIdAndUpdate(record.bookId, { $inc: { available: 1 } });
    }

    const updated = await BorrowRecord.findByIdAndUpdate(
      req.params.id,
      { returnDate: new Date(), status: 'returned' },
      { new: true }
    );

    res.json({ success: true, record: updated });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Get student borrow records
app.get('/api/borrow/student/:studentId', async (req, res) => {
  try {
    const records = await BorrowRecord.find({ studentId: req.params.studentId });
    res.json({ records });
  } catch (err) {
    console.error('Error fetching student borrow records:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch borrow records', details: err.message });
  }
});

// Get all borrow records
app.get('/api/borrow', async (req, res) => {
  try {
    const records = await BorrowRecord.find();
    res.json({ records });
  } catch (err) {
    console.error('Error fetching all borrow records:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch borrow records', details: err.message });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));
