# 🎓 College Admission Portal - React Frontend

A complete React frontend for the Spring Boot College Admission backend.

---

## 📁 Project Structure

```
src/
├── index.js                    ← Entry point, wraps app with AuthProvider
├── App.jsx                     ← Page router (controls which page is shown)
├── api.js                      ← ALL backend API calls in one file
│
├── context/
│   └── AuthContext.jsx         ← Stores logged-in user across all pages
│
├── components/
│   └── Navbar.jsx              ← Top navigation bar
│
└── pages/
    ├── HomePage.jsx            ← Landing page (no login needed)
    ├── LoginPage.jsx           ← Login for Student & Officer
    ├── RegisterPage.jsx        ← Register new Student or Officer
    ├── ApplyPage.jsx           ← Student selects & applies for a course
    ├── MyApplicationsPage.jsx  ← Student views applications, pays fee, cancels
    ├── UploadDocPage.jsx       ← Student uploads documents
    └── OfficerDashboardPage.jsx← Officer views all apps & updates status
```

---

## 🚀 How to Run

### Step 1: Start your Spring Boot Backend
Make sure your backend is running on: `http://localhost:8080`

> 💡 If it runs on a different port, open `src/api.js` and change:
> ```js
> const BASE_URL = "http://localhost:8080";
> ```

### Step 2: Install Node.js
Download from https://nodejs.org (LTS version recommended)

### Step 3: Install & Run Frontend
Open a terminal in this folder and run:

```bash
npm install
npm start
```

Your browser will open at `http://localhost:3000`

---

## 🔌 Backend API Endpoints Used

| Page                  | Method | Endpoint                              |
|-----------------------|--------|---------------------------------------|
| Register Student      | POST   | /students                             |
| Register Officer      | POST   | /officers                             |
| Login (Student)       | GET    | /students  (matched client-side)      |
| Login (Officer)       | GET    | /officers  (matched client-side)      |
| Get All Courses       | GET    | /courses                              |
| Apply for Course      | POST   | /applications/{studentId}/{courseId}  |
| Get All Applications  | GET    | /applications                         |
| Update App Status     | PUT    | /applications/{id}/status?status=...  |
| Pay Fee               | POST   | /applications/{id}/payment?mode=...   |
| Cancel Application    | DELETE | /applications/{id}                    |
| Upload Document       | POST   | /documents                            |

---

## 📝 Pages Explained

### 🏠 Home Page
- Welcome screen with feature cards
- Buttons to Login or Register

### 🔑 Login Page
- Tab to switch between Student / Officer login
- Fetches all users from backend and matches email + password
- Redirects student → Apply Page, officer → Dashboard

### 📋 Register Page
- Tab to switch between Student / Officer registration
- Student fields: name, dob, phone, email, password, gender, address
- Officer fields: name, phone, email (mail), password

### 📝 Apply for Course (Student only)
- Shows list of courses from backend
- Click a course card to select it
- Submit → calls POST /applications/{studentId}/{courseId}

### 📋 My Applications (Student only)
- Shows all applications for the logged-in student
- Colored status badges (PENDING, APPROVED, REJECTED)
- Pay Fee button (only appears if status = APPROVED)
- Cancel Application button

### 📄 Upload Documents (Student only)
- Select which application to attach document to
- Choose document type: Marksheet, ID Proof, Photo, Certificate
- Saves to backend via POST /documents

### 👮 Officer Dashboard (Officer only)
- Summary cards: total, pending, approved, rejected counts
- Filter applications by status
- Table with all student applications
- Dropdown to change status → click Update to save

---

## ⚠️ Important Notes

1. **Login works by matching email+password client-side** because the backend 
   doesn't have a `/login` endpoint. This is fine for learning purposes.

2. **Password is returned by the backend** because `@JsonIgnore` is only on 
   the Student entity, not Officer. For Student login, we do a workaround.

3. **File upload is simulated** - the backend Document entity only stores 
   document type (string), not actual file bytes. A proper file upload 
   would need a `MultipartFile` endpoint in Spring Boot.

4. **CORS** - If you get CORS errors, add this to your Spring Boot app:
   ```java
   @CrossOrigin(origins = "http://localhost:3000")
   ```
   Add it above each `@RestController` class in the backend.
