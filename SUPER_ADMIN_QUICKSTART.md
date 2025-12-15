# Quick Start - Super Admin & Profile Features

## 🔐 Super Admin Login
1. Go to `/pages/admin-login.html`
2. Enter credentials:
   - Email: `superadmin@qolh.com`
   - Password: `QOLH.Sadmin`
3. You'll be redirected to `/pages/super-admin-dashboard.html`

## 👥 User Management Dashboard

### View All Users
- Dashboard automatically loads all users from database
- Shows: Profile pic, Name, Email, Role (color-coded), Age, Municipality

### Search Users
- Type name, email, or role in search box
- Real-time filtering as you type

### Filter by Role
- Use the role dropdown to show only specific roles:
  - Super Admin (red badge)
  - Admin (orange badge)
  - Teacher (blue badge)
  - Student (green badge)

### Edit User
1. Click **Edit** button on user row
2. Modal opens with editable fields:
   - Name, Email, Role
   - Age, Birthday, Municipality
3. Change fields and click **Save Changes**
4. Dashboard updates automatically

### Delete User
1. Click **Delete** button on user row
2. Confirmation modal appears
3. Click **Delete User** to confirm (irreversible)
4. User removed from database

### Add New User
1. Click **+ Add New User** button at top
2. Fill in required fields:
   - Name ✓
   - Email ✓
   - Password ✓
   - Role (student/teacher/admin) ✓
   - Age, Birthday, Municipality (optional)
3. Click **Create User**
4. New user appears in dashboard

## 📸 Profile Picture Upload

### For Any User
1. Go to their dashboard (student/teacher/admin)
2. Look for "Upload Profile Picture" button
3. Select image file (JPG, PNG, or GIF)
   - Max size: 5MB
4. Click upload
5. Image displays immediately in profile and super-admin dashboard

### View in Super Admin Dashboard
- Profile pictures show as thumbnails in user table
- Falls back to user initial avatar if no picture uploaded
- Click on picture to see full size (optional)

## 🔧 Backend Endpoints (for API testing)

### Get All Users
```
GET http://localhost:3001/api/admin/users
Headers: Authorization: Bearer {token}
Response: { success: true, users: [...] }
```

### Edit User
```
PUT http://localhost:3001/api/admin/users/{userId}
Headers: 
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body: { name, email, role, age, birthday, address }
```

### Delete User
```
DELETE http://localhost:3001/api/admin/users/{userId}
Headers: Authorization: Bearer {token}
Response: { success: true, message: "User deleted successfully" }
```

### Upload Profile Picture
```
POST http://localhost:3001/api/users/{userId}/upload-profile-pic
Headers: Authorization: Bearer {token}
Body: multipart/form-data with 'profilePicture' file
Max size: 5MB (JPEG/PNG/GIF only)
```

## 📋 User Roles Explained

| Role | Capabilities | Dashboard |
|------|--------------|-----------|
| **Super Admin** | Manage ALL users, edit roles, delete users | `/pages/super-admin-dashboard.html` |
| **Admin** | View analytics, manage library system | `/pages/admin-dashboard.html` |
| **Teacher** | View student progress, manage books | `/pages/teacher-dashboard.html` |
| **Student** | Borrow books, view profile | `/pages/student-dashboard.html` |

## 🛡️ Security Notes

- Only super-admin can access user management
- All API calls require valid JWT token
- Passwords are hashed with bcryptjs
- File uploads validated (type & size)
- MongoDB connection encrypted via .env
- Profile pictures stored locally (for production, use cloud storage)

## 🚨 Important

- **Never share super-admin credentials** in public repos
- Use `.env` file for sensitive data (not in code)
- Credentials stored in Azure Key Vault for production
- MongoDB Atlas whitelist: 0.0.0.0/0 (for Railway deployment)

## 📱 Responsive Design

Dashboard works on:
- ✅ Desktop (1920px, 1440px)
- ✅ Tablet (768px)
- ✅ Mobile (320px)

Tables auto-scroll on smaller screens, modals adjust to viewport.

## 🆘 Troubleshooting

### "Not authorized" error
- Ensure you're logged in as super-admin
- Check token in localStorage: `localStorage.getItem('token')`
- Try logging out and back in

### Profile picture not uploading
- Check file size (max 5MB)
- Check file format (JPEG, PNG, or GIF only)
- Ensure `/uploads/profiles/` directory exists
- Check server logs for multer errors

### Users not loading
- Verify MongoDB connection string in `.env`
- Check if server is running on port 3001
- Look for CORS errors in browser console

---

**Need help?** Check SUPER_ADMIN_GUIDE.md for detailed documentation
