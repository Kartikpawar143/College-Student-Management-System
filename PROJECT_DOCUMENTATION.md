# 🛡️ PROJECT DOCUMENTATION: GHRUA
### *Smart AI-Face Attendance & Campus Management System*

---

## 1. PROJECT OVERVIEW
**GHRUA** is a high-security, automated campus ecosystem designed to streamline attendance and student activity monitoring. The system replaces traditional attendance methods with **Biometric Face Verification** and **GPS-based Geofencing**, ensuring that students are physically present on campus and verified by identity before their presence is logged.

---

## 2. TECHNOLOGY STACK (CORE ENGINE)

### ⚛️ Frontend (Client Side)
- **Framework**: Next.js 15 (React)
- **Styling**: Tailwind CSS (PostCSS)
- **Icons**: @tabler/icons-react
- **HTTP Client**: Axios (for REST API communication)
- **State Management**: React Hooks (useState, useEffect, useAuth context)

### 🐍 Backend (Server Side)
- **Framework**: FastAPI (Python 3.x)
- **Server**: Uvicorn (ASGI)
- **Language**: Python
- **Concurrency**: Asynchronous tasks for fast image processing

### 🗄️ Database (Data Layer)
- **Type**: NoSQL
- **Provider**: MongoDB
- **Driver**: Pymongo
- **Collections**: `students`, `attendance`, `gatepass`, `config`, `notices`, `placements`

### 👁️ AI & ML (Intelligence Layer)
- **Computer Vision**: OpenCV (cv2)
- **Face Detection**: MediaPipe / HAAR Cascades
- **Processing**: Numpy (Matrix operations)
- **Storage**: GridFS / Local disk for profile imagery

---

## 3. KEY ALGORITHMS & MATHEMATICAL MODELS

### 🎯 Face Feature Matching (Identity Node)
The system extracts facial landmarks (embeddings) and compares them using:
1.  **Face Embedding**: Converting facial features into a 128-dimensional vector.
2.  **Distance Metric**: **Euclidean Distance** or **Cosine Similarity** to check how close the live face is to the registered profile.
    - *Threshold*: Matches > 70% similarity are marked "SUCCESS".

### 📍 Haversine Geofencing (Spatial Node)
To verify if a student is within the 500-meter campus boundary:
- **Formula**:
  $$a = \sin^2\left(\frac{\Delta lat}{2}\right) + \cos(lat_1) \cos(lat_2) \sin^2\left(\frac{\Delta lon}{2}\right)$$
  $$c = 2 \cdot \text{atan2}(\sqrt{a}, \sqrt{1-a})$$
  $$d = R \cdot c$$
- **Variables**: $R$ (Earth radius - 6371km), $\Delta$ (Difference in coordinates between Student GPS and Campus Node).

---

## 4. PROJECT ARCHITECTURE & FLOW

### 🔄 The Operational Flow
1.  **Registration**: Student submits profile image $\rightarrow$ Backend stores image and builds Face Cache.
2.  **Verification Phase**:
    *   **Step 1**: Frontend fetches coordinates $\rightarrow$ Backend verifies **Geofence**.
    *   **Step 2**: If spatially verified, Frontend captures Live Screenshot.
    *   **Step 3**: Backend runs **Face Matching** algorithm.
    *   **Step 4**: If identity matches, record is pushed to `attendance_collection`.
3.  **Governance Phase (Gatepass)**:
    *   Student submits Leave Request $\rightarrow$ Notification sent to Teacher $\rightarrow$ Status updated in real-time on Student Dashboard.

---

## 5. FOLDER STRUCTURE BREAKDOWN

- `📂 /src/app`: The Next.js Router hierarchy.
  - `📂 /student`: Dashboard, Mark Attendance, Leave Application.
  - `📂 /teacher`: Student Registry, Approval Center, Campus Calibration.
- `📂 /backend`: The FastAPI Controller layer.
  - `📄 app.py`: The Main Gateway (Auth, Face Logic, Setup).
  - `📄 database.py`: MongoDB connection and Schema definitions.
  - `📂 /routes`: Module-specific controllers (Placements, Exams, Notices).
- `📂 /public/uploads`: Secure storage for registered student face profiles.

---

## 🛠️ INSTALLATION & QUICK START
1.  **Backend**: `pip install -r requirements.txt` followed by `python app.py` (Port 8001).
2.  **Frontend**: `npm install` followed by `npm run dev` (Port 3000).
3.  **Environment**: Ensure `.env` contains your `MONGO_URI`.

---
*Note: This document can be printed as a PDF for formal submission.*
