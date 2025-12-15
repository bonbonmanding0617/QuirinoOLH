const fs = require('fs');
const dotenv = require('dotenv');
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ MONGO_URI environment variable not set.');
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  // User schema (same as server.js)
  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'student' },
    age: Number,
    birthday: Date,
    address: {
      province: { type: String, default: 'Quirino' },
      municipality: {
        type: String,
        enum: ['Aglipay', 'Cabarroguis', 'Diffun', 'Maddela', 'Nagtipunan', 'Saguday']
      }
    },
    schoolId: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
  });

  const User = mongoose.model('User', userSchema);

  try {
    // Check if super admin already exists
    const existing = await User.findOne({ email: 'superadmin@qolh.com' });
    if (existing) {
      console.log('✅ Super admin already exists');
      process.exit(0);
    }

    // Hash password
    const hash = await bcrypt.hash('QOLH.Sadmin', 10);

    // Create super admin
    const superAdmin = await User.create({
      name: 'Super Administrator',
      email: 'superadmin@qolh.com',
      password: hash,
      role: 'super-admin',
      age: 40,
      address: {
        province: 'Quirino',
        municipality: 'Cabarroguis'
      }
    });

    console.log('✅ Super admin created successfully');
    console.log('📧 Email: superadmin@qolh.com');
    console.log('🔐 Password: QOLH.Sadmin');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating super admin:', err.message);
    process.exit(1);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});
