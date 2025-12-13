# 🚀 Quick Start Guide - Quirino Online Library Hub

## Getting Started in 3 Steps

### Step 1: Open the Application
1. Navigate to the project folder: `c:\Users\RBE-EaPN\Desktop\Codes\QOLH`
2. Open `index.html` in your web browser (Chrome, Firefox, Safari, or Edge)
3. You should see the Quirino Online Library Hub landing page

### Step 2: Choose Your Role

**As a Student:**
1. Click "Login Portal" button
2. Choose to:
   - **Login**: Use `student@qolh.com` / `student123`
   - **Create Account**: Register with your information
   - **Guest Login**: Browse without logging in

**As an Administrator/Teacher:**
1. Click "Login Portal" → "Login as Administrator/Teacher"
2. Select your role (Admin or Teacher)
3. Use demo credentials:
   - Admin: `admin@qolh.com` / `admin123`
   - Teacher: `teacher1@qolh.com` / `teacher123`

### Step 3: Start Using the System!

---

## 📚 Student User Guide

### View Available Books
1. Go to "Browse Books" tab
2. See all available books with:
   - Title and author
   - Description
   - Availability count
3. Use search bar to find specific books

### Borrow a Book
1. Click "View Details" on any book card
2. Review book information in modal
3. Click "Borrow Book" button
4. Book appears in "My Borrowed Books"

### Return a Book
1. Go to "My Borrowed Books" tab
2. Find the book to return
3. Click "Return Book" button
4. Book is removed from your borrowed list

### Read or Download eBooks
1. Go to "eBooks" tab
2. Browse available digital books
3. Click "📖 Read Online" to read immediately
4. Click "⬇️ Download" to save for offline reading

### Manage Your Profile
1. Go to "Profile" tab
2. Edit your information:
   - Full Name
   - Email
   - Phone Number
   - Address
3. Note: School ID cannot be changed
4. Click "Save Changes"

---

## 👨‍💼 Administrator/Teacher User Guide

### Dashboard Overview
- Quick statistics: Students, Books, Active Borrows, Overdue Items
- Recent borrowing activities
- Quick action buttons for common tasks

### Manage Students
1. Go to "Student Management"
2. Search for students by name, email, or ID
3. **Add Student**: Click "Add Student" button
4. **Edit Student**: Click "Edit" button on any student
5. **View Records**: Click "Records" to see borrowing history
6. **Force Return**: Issue force returns on overdue books

### Manage Physical Books
1. Go to "Books Management"
2. View all books in library inventory
3. **Add Book**: Click "Add Book" button
4. **Edit Book**: Click "Edit" to update info or quantities
5. **Delete Book**: Remove books from inventory

### Manage eBooks
1. Go to "eBooks Management"
2. View all digital books
3. **Upload eBook**: Click "Upload eBook" button
4. **Edit eBook**: Update title, author, description, file
5. **Delete eBook**: Remove from library
6. Track download statistics

### View Analytics
1. Go to "Analytics"
2. See key statistics:
   - Total borrows/returns
   - Active and overdue borrows
3. **Top Students**: Most active borrowers (ranked)
4. **Popular Books**: Most borrowed titles (ranked)
5. **Activity Table**: Recent borrowing events

### Update Your Profile
1. Go to "My Profile"
2. Edit your information (except School ID)
3. View account creation date
4. Save changes

### System Settings
1. Go to "Settings"
2. Configure:
   - Library name
   - Borrow duration (default: 14 days)
   - Late fees
   - Notifications
   - Security options
3. Save all settings

---

## 🔑 Demo Accounts

### Student Account
```
Email: student@qolh.com
Password: student123
School ID: STU001
```

### Administrator Account
```
Email: admin@qolh.com
Password: admin123
School ID: ADMIN001
```

### Teacher Account
```
Email: teacher1@qolh.com
Password: teacher123
School ID: TEACHER001
```

---

## ⚙️ System Features Checklist

### Student Features
- ✅ Browse library books
- ✅ Search and filter books
- ✅ Borrow physical books
- ✅ Return borrowed books
- ✅ Track due dates
- ✅ Read eBooks online
- ✅ Download eBooks
- ✅ Manage profile
- ✅ View borrowing history
- ✅ See overdue notifications

### Admin/Teacher Features
- ✅ Add/edit/delete students
- ✅ Add/edit/delete books
- ✅ Add/edit/delete eBooks
- ✅ Monitor student activities
- ✅ View borrowing statistics
- ✅ Force return overdue books
- ✅ Track download statistics
- ✅ View analytics reports
- ✅ Manage system settings
- ✅ Update profile

---

## 📋 Common Tasks

### Create a New Student Account
1. Go to student login page
2. Click "Create Account" tab
3. Fill in all required fields:
   - Full Name
   - Email
   - Phone Number
   - Address
   - Password
4. Click "Create Account"
5. Login with new credentials

### Add a New Book to Library
1. Go to Admin Dashboard
2. Click "Books Management" in sidebar
3. Click "Add Book" button
4. Enter book details:
   - Title
   - Author
   - ISBN
   - Category
   - Description
   - Quantity
5. Click "Save Book"

### Upload a New eBook
1. Go to Admin Dashboard
2. Click "eBooks Management" in sidebar
3. Click "Upload eBook" button
4. Enter eBook details:
   - Title
   - Author
   - Category
   - Description
   - File path (e.g., uploads/ebooks/filename.pdf)
5. Click "Upload eBook"

### Check Overdue Books
1. Go to Admin Dashboard
2. Click "Analytics"
3. Check "Overdue Borrows" statistic
4. Go to "Student Management"
5. Click "Records" on a student to see overdue items
6. Click "Force Return" to resolve

### Generate Report
1. Go to Admin Dashboard
2. Click "Analytics"
3. View:
   - Key statistics
   - Top borrowing students
   - Most popular books
   - Recent activity

---

## 🎨 Color Scheme

- **Primary Orange**: #E67E22
- **Secondary Orange**: #D35400
- **Dark Orange**: #BA4A00
- **Light Orange**: #F39C12
- **Very Light Orange**: #FCE5CD

---

## 🛡️ Important Notes

1. **Data Storage**: All data is stored locally in your browser
   - Clear browser cache = lose all data
   - Data not synced across devices
   - Data lost if browser storage is cleared

2. **Security**: 
   - Passwords visible in storage (demo only)
   - Use proper authentication in production
   - Always use HTTPS in production

3. **Backup**: Save important data regularly
   - Screenshots of key information
   - Export data if needed

4. **School ID**: 
   - Automatically generated on account creation
   - Cannot be changed after creation
   - Unique per student/admin

---

## ❓ FAQ

**Q: Can I change my School ID?**
A: No, School ID is permanent and cannot be modified after account creation.

**Q: How long can I borrow books?**
A: Default is 14 days. Check system settings for current duration.

**Q: What happens if I don't return on time?**
A: Book marked as overdue. Admin can issue force return.

**Q: Can guests borrow books?**
A: No, guests can only view books. Must create account to borrow.

**Q: Where are eBooks stored?**
A: In `uploads/ebooks/` folder. File paths in database.

**Q: Can I download eBooks?**
A: Yes, click "Download" button in eBooks section.

**Q: How do I recover my password?**
A: Contact administrator. Password recovery not implemented.

**Q: Can multiple people use one account?**
A: Possible but not recommended. Each user should have own account.

---

## 📞 Need Help?

1. Check the README.md file for detailed documentation
2. Review error messages in browser console (F12)
3. Verify all files are in correct locations
4. Test with demo accounts to verify setup
5. Check browser compatibility (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

---

## 🎯 Next Steps

1. ✅ Explore the landing page features
2. ✅ Create a student account and test borrowing
3. ✅ Login as admin and add books/students
4. ✅ Check analytics and reports
5. ✅ Test all features and functionality

Enjoy using Quirino Online Library Hub! 📚📱
