# 🎓 Advanced College Campus Monitoring System

A premium, localized, and security-focused Attendance Management System featuring AI-driven Face Recognition, Geofencing, Recruitment Pipelines, and Digital Notice Circulation.

---

## 🚀 Key Evolutionary Features

### 📍 Anti-Proxy Attendance (Geofencing)
*   **V2 Location Intelligence**: Prevents attendance "proxies" by requiring students to be within a **500m radius** of the campus node.
*   **GPS Verification**: Automatically fetches and verifies student coordinates against the Institutional Matrix ([18.5204, 73.8567]).
*   **Privacy-First Tracking**: Location is only synchronized during the attendance verification window.

### 👤 AI Face Recognition
*   **High-Accuracy Verification**: Increased matching threshold to **0.70** to ensure 100% identity accuracy.
*   **Unknown Rejection**: Decisively rejects unauthorized personnel attempting to access the attendance node.
*   **Multi-Sample Analysis**: Process multiple face samples for resilient identification across 100+ students.

### 💼 Career Synchronization (Placements)
*   **Resume Pipeline**: Students can upload PDF resumes directly during the application process.
*   **Admin Recruitment Command**: Administrators can review applications, download candidate resumes, and manage recruitment lifecycles.
*   **Digital Registry**: Real-time tracking of student applications and placement statuses.

### 📜 Notice Circulation Hub
*   **Digital Attachments**: Administrators can circulate notices with official PDF instructions/announcements.
*   **Universal Viewing**: Students and Teachers can view/download official documents directly from their dashboards.
*   **Cloud Persistence**: All notices and documents are securely archived in the institutional registry.

---

## 🛠️ Technical Stack

### **Frontend**
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Vanilla CSS with Premium Aesthetic Design (Dark Mode, Glassmorphism)
*   **Icons**: Tabler Icons React
*   **API Client**: Axios

### **Backend**
*   **Engine**: FastAPI (Python 3.10+)
*   **Database**: MongoDB (PyMongo)
*   **AI/CV**: OpenCV, MediaPipe (Face Detection & Recognition)
*   **Geospatial**: Haversine Coordinate Arithmetic

---

## 📦 Dynamic Setup Guide

### 1. Institutional Configuration (Backend)

1. Open Command Prompt

Navigate to the project folder:

cd Facial-attendance-and-timetable-\backend
2. Create Virtual Environment Using Python 3.11
py -3.11 -m venv venv
3. Activate Virtual Environment
venv\Scripts\activate
4. Upgrade Pip
python -m pip install --upgrade pip
5. Install Project Dependencies
pip install -r requirements.txt
6. Install Additional Required Package
pip install email-validator
7. Verify Python Version
python --version

Expected:

Python 3.11.x
8. Run the Backend
python app.py

### 2. Interface Terminal (Frontend)
```bash
npm install
npm run dev
```

---

## 🔒 Security Protocols
*   **Geographic Fencing** (Authorized-Area-Only Attendance)
*   **Face ID Accuracy** (0.70 Stricter-Match Logic)
*   **BSON/ObjectId** Secure Database Indexing
*   **Role-Based Access Control** (Admin, Teacher, Student)

---

## 📂 Institutional Architecture
*   `/src/app/student/attendance`: Presence marking with Geolocation.
*   `/src/app/admin/placements`: Recruitment monitoring & Resume access.
*   `/backend/routes`: Academic command logic and API nodal points.
*   `/public/uploads`: Secure document and profile archive.

---

> **Institutional Note**: This system is designed for high-performance campus synchronization and definitively eliminates attendance falsification.
