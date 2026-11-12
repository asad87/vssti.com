# VSSTI Web Application

A full-stack, responsive web application inspired by **[vssti.com](https://vssti.com)** (Vector Safety Solutions and Technical Training Institute, Rawalpindi), built with an authentic industrial safety color scheme, interactive student admission management, safety blog with real-time discussions, and a password-protected executive Admin Portal.

---

## 🎨 Color Scheme & Design System
Matches the exact branding of **vssti.com**:
- **Primary Safety Orange**: `#F15A25` / `#D94E1D` (Buttons, accents, badges, callouts)
- **Deep Navy & Slate**: `#17274F` / `#0F1A36` / `#181D23` (Headers, hero section, footer)
- **Royal Accent Blue**: `#0058E6` / `#3557DC` / `#E6F0FF` (Icons, links, secondary badges)
- **Industrial Slate**: `#2D3137` / `#575A5F` / `#94A3B8` (Body typography)
- **Backgrounds**: `#FFFFFF` / `#F8FAFC` / `#F1F5F9` (Cards, layout, modals)
- **Safety Amber**: `#F0AD4E` / `#D8A600` (Badges and warnings)

---

## 🚀 Key Features

### 1. Interactive Student Record Form
- Form identical to the official VSSTI admission form:
  - **First Name** & **Last Name**
  - **Mobile Number** (e.g. `0330-0078640`)
  - **City** (Rawalpindi, Islamabad, etc.)
  - **Email Address**
  - **Desired Course** (IOSH, OSHA 30/48h, ISO 45001, NVQ, OTHM, etc.)
  - **Training Mode** (On-Campus, Weekend Batch, Online Virtual, Corporate)
  - **Additional Remarks**
- Real-time client & server validation.
- Generates a unique Student ID (e.g., `VSSTI-2026-1004`).
- Shows an interactive confirmation slip with a **Print Enrollment Slip** button.

### 2. Interactive Safety Blog
- Dedicated blog section & full modal reader.
- Dynamic search & category filtering (*ISO Certifications, Industrial Safety, Career Guidance*).
- Real educational articles:
  - *Why ISO 45001 Certification Is Important for Modern Organizations*
  - *How Workplace Safety Training Reduces Industrial Accidents*
  - *OSHA 30 vs OSHA 48: Which Safety Certification Matches Your Career Goals?*
- Interactive comment system: readers can submit comments and join discussions in real-time.

### 3. Password-Protected Admin Portal
- Accessible via the **Admin Portal** button in the top bar, navigation, hero, or footer.
- **Admin Password**: `151214`
- **Admin Features**:
  - **Dashboard Overview**: Live counts for registered students, subscribers, courses, and articles.
  - **Student Records Manager**: Search, filter, change status (`Pending`, `Enrolled`, `Completed`), delete records, and **Export to CSV**.
  - **Blog Manager**: Publish new articles with custom HTML, categories, author, and cover images; edit and delete posts.
  - **Qualifications Manager**: Add or edit courses, syllabus topics, duration, and certifying bodies.
  - **Subscribers List**: View subscriber emails, remove entries, and simulate broadcast announcements.
  - **Website Settings Editor**: Live update phone numbers (`+0330-0078640`), email (`vsstinstitute@gmail.com`), office address, announcement bar ticker, and hero slogan without restarting the server!

### 4. Course Catalog & Syllabus Viewer
- Interactive category tabs (*International Safety, OSHA Certifications, ISO Systems, Industrial Safety, Technical & IT*).
- One-click syllabus modal with module breakdowns.
- Direct "Enroll Now" action that auto-fills the Student Record Form with the chosen course.

### 5. Newsletter Subscription
- Interactive subscription form with instant feedback and duplicate email protection.

---

## 🛠️ Technology Stack
- **Backend**: Node.js & Express.js REST API
- **Database**: Persistent JSON data storage (`data/db.json`)
- **Frontend**: Responsive HTML5, Vanilla JavaScript (ES6+), Modern CSS3 with CSS variables and flex/grid layouts
- **Icons & Typography**: FontAwesome 6, Google Fonts (Inter)

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
# or: node server.js
```
The server will start on `http://localhost:3000`.

### 3. Access Admin Panel
- Click **Admin Portal** or **Admin Access** in the top bar or footer.
- Enter the password: `151214`

---

## 📍 Institute Contact Information
- **Institution**: Vector Safety Solutions and Technical Training Institute (VSSTI)
- **Location**: Office #303, Talha Heights, 6th Road, Rawalpindi, Pakistan
- **Phone**: `+0330-0078640`, `+0330-0078641` (Call 24/7)
- **Email**: `vsstinstitute@gmail.com`
- **Hours**: Mon – Sat: 09:00 am – 06:00 pm | Sunday: CLOSED
- **Motto**: *Together We Grow....*
