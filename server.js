// ===== GLOBAL ERROR HANDLERS =====
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
const fs = require('fs');
const dotenv = require('dotenv');
// Prefer `.env.local` for local developer secrets (kept out of VCS), fall back to default `.env`.
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
// Read from environment variable (set in .env or deployment platform)
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ MONGO_URI environment variable not set. Cannot connect to MongoDB.');
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  // Ensure admin account exists
  ensureAdmin().catch(err => console.warn('Error ensuring admin user:', err.message));
})
.catch(err => {
  console.warn('⚠️  MongoDB connection failed:', err.message);
  if (err.message && err.message.toLowerCase().includes('auth')) {
    console.warn('🔐 Authentication error connecting to MongoDB. Check that MONGO_URI is correct and credentials are valid.');
  }
  // Handle DNS SRV resolution errors (common when using placeholder hostnames or when DNS lookup fails)
  if (err.message && /querySrv|EBADNAME|ENOTFOUND|EAI_AGAIN/i.test(err.message)) {
    console.warn('🛠️  SRV/DNS lookup failed when using an `mongodb+srv:[//]` style URI. Common causes:');
    console.warn('- The MONGO_URI contains a placeholder like `<cluster>` (replace it with your cluster host).');
    console.warn('- DNS is blocking SRV lookups. Try using the standard `mongodb://host:port` connection string instead.');
    console.warn('- Ensure your network/DNS supports SRV lookups (some corporate networks block them).');
    console.warn('If you recently copied the example connection string, replace the `<cluster>` placeholder with the actual cluster name shown in Atlas.');
  }
  console.warn('📝 Troubleshooting:');
  console.warn('1. If using Atlas, ensure your IP is whitelisted in Network Access');
  console.warn('2. Verify cluster is not paused');
  console.warn('3. Check internet connection');
  console.warn('4. If using a connection string, ensure it is set in the MONGO_URI environment variable or in a .env file');
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
    const adminEmail = process.env.ADMIN_EMAIL || 'emily.pascua002@deped.gov.ph';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.warn('⚠️  ADMIN_PASSWORD is not set. Skipping automatic admin creation.');
      console.warn('To create an admin, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` and restart, or run `node scripts/create-admin.js`.');
      return;
    }

    const hash = await bcrypt.hash(adminPassword, 10);

    const update = {
      name: process.env.ADMIN_NAME || 'Emily Pascua',
      email: adminEmail,
      password: hash,
      role: 'admin'
    };

    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

    const admin = await User.findOneAndUpdate({ email: adminEmail }, update, opts);
    if (admin) {
      console.log('✅ Ensured admin user exists:', adminEmail);
    } else {
      console.log('✅ Created admin user:', adminEmail);
    }
  } catch (err) {
    console.warn('Failed to ensure admin user:', err.message);
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

// Change Request schema (for teacher requests to edit books/ebooks)
const changeRequestSchema = new mongoose.Schema({
  requesterId: String,
  requesterName: String,
  resourceType: { type: String, enum: ['book', 'ebook'] },
  resourceId: String,
  resourceTitle: String,
  changeType: { type: String, enum: ['create', 'update', 'delete'] },
  currentData: mongoose.Schema.Types.Mixed,
  proposedData: mongoose.Schema.Types.Mixed,
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: String,
  reviewNotes: String,
  createdAt: { type: Date, default: Date.now },
  reviewedAt: Date
});
const ChangeRequest = mongoose.model('ChangeRequest', changeRequestSchema);

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
    try {
      const ebooks = await Ebook.find();
      res.json({ ebooks });
    } catch (err) {
      console.error('Error fetching ebooks:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch ebooks', details: err.message });
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
    
    // Enrich records with book titles
    const enrichedRecords = await Promise.all(
      records.map(async (record) => {
        const book = await Book.findById(record.bookId);
        return {
          ...record.toObject(),
          bookTitle: book ? book.title : 'Unknown Book'
        };
      })
    );
    
    res.json({ records: enrichedRecords });
  } catch (err) {
    console.error('Error fetching student borrow records:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch borrow records', details: err.message });
  }
});

// Get all borrow records
app.get('/api/borrow', async (req, res) => {
  try {
    const records = await BorrowRecord.find();
    
    // Enrich records with book titles
    const enrichedRecords = await Promise.all(
      records.map(async (record) => {
        const book = await Book.findById(record.bookId);
        return {
          ...record.toObject(),
          bookTitle: book ? book.title : 'Unknown Book'
        };
      })
    );
    
    res.json({ records: enrichedRecords });
  } catch (err) {
    console.error('Error fetching all borrow records:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch borrow records', details: err.message });
  }
});

// ===== TEACHER ENDPOINTS =====

// Get all teachers
app.get('/api/teachers', auth, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json({ teachers });
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch teachers', details: err.message });
  }
});

// Get teacher by ID
app.get('/api/teachers/:id', auth, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select('-password');
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(400).json({ success: false, error: 'Teacher not found' });
    }
    res.json({ teacher });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch teacher', details: err.message });
  }
});

// Update teacher
app.put('/api/teachers/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, address, schoolId } = req.body;

    // Check if email already exists (excluding current teacher)
    const existing = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    const updates = { name, email, phone, address };
    if (schoolId) updates.schoolId = schoolId;

    const teacher = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(400).json({ success: false, error: 'Teacher not found' });
    }

    res.json({ success: true, teacher });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update teacher', details: err.message });
  }
});

// Delete teacher
app.delete('/api/teachers/:id', auth, async (req, res) => {
  try {
    const teacher = await User.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(400).json({ success: false, error: 'Teacher not found' });
    }
    res.json({ success: true, message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete teacher', details: err.message });
  }
});

// ===== CHANGE REQUEST ENDPOINTS (for teacher approval workflow) =====

// Create change request (teacher requesting book/ebook modification)
app.post('/api/change-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ success: false, error: 'Only teachers can request changes' });
    }

    const { resourceType, resourceId, resourceTitle, changeType, currentData, proposedData, reason } = req.body;

    const changeRequest = new ChangeRequest({
      requesterId: user._id,
      requesterName: user.name,
      resourceType,
      resourceId,
      resourceTitle,
      changeType,
      currentData,
      proposedData,
      reason
    });

    const saved = await changeRequest.save();
    res.json({ success: true, request: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create change request', details: err.message });
  }
});

// Get pending change requests (admin only)
app.get('/api/change-requests/pending', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can view change requests' });
    }

    const requests = await ChangeRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch requests', details: err.message });
  }
});

// Get all change requests (admin only)
app.get('/api/change-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can view change requests' });
    }

    const requests = await ChangeRequest.find().sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch requests', details: err.message });
  }
});

// Approve change request (admin only)
app.put('/api/change-requests/:id/approve', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can approve requests' });
    }

    const request = await ChangeRequest.findById(req.params.id);
    if (!request) {
      return res.status(400).json({ success: false, error: 'Request not found' });
    }

    const { reviewNotes } = req.body;

    // Apply the change to the actual resource
    if (request.changeType === 'delete') {
      // Handle deletion
      if (request.resourceType === 'book') {
        await Book.findByIdAndDelete(request.resourceId);
      } else if (request.resourceType === 'ebook') {
        await Ebook.findByIdAndDelete(request.resourceId);
      } else if (request.resourceType === 'student') {
        await User.findByIdAndDelete(request.resourceId);
      }
    } else {
      // Handle updates
      if (request.resourceType === 'book') {
        await Book.findByIdAndUpdate(request.resourceId, request.proposedData);
      } else if (request.resourceType === 'ebook') {
        await Ebook.findByIdAndUpdate(request.resourceId, request.proposedData);
      } else if (request.resourceType === 'student') {
        await User.findByIdAndUpdate(request.resourceId, request.proposedData);
      }
    }

    // Update the change request
    request.status = 'approved';
    request.reviewedBy = user._id;
    request.reviewNotes = reviewNotes || '';
    request.reviewedAt = new Date();
    await request.save();

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to approve request', details: err.message });
  }
});

// Reject change request (admin only)
app.put('/api/change-requests/:id/reject', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can reject requests' });
    }

    const request = await ChangeRequest.findById(req.params.id);
    if (!request) {
      return res.status(400).json({ success: false, error: 'Request not found' });
    }

    const { reviewNotes } = req.body;

    request.status = 'rejected';
    request.reviewedBy = user._id;
    request.reviewNotes = reviewNotes || '';
    request.reviewedAt = new Date();
    await request.save();

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reject request', details: err.message });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Root route - redirect to login page
app.get('/', (req, res) => {
  res.redirect('/pages/admin-login.html');
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));
