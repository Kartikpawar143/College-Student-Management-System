import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import cv2
import numpy as np
import mediapipe as mp
import base64
import shutil
import threading
from typing import List, Optional
from datetime import datetime
from starlette.concurrency import run_in_threadpool
from pymongo import MongoClient
import glob
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv(override=True)
app = FastAPI()

# Mount public directory for uploads
app.mount("/public", StaticFiles(directory="public"), name="public")

from database import students_collection, teachers_collection, attendance_collection, admin_collection, leave_collection, gatepass_collection, config_collection, MONGO_URI

# Import new routers
from routes import auth, notices, timetable, leave, gatepass, placements, documents, exam_forms, scholarship, teachers

# ==== CONFIG ====
STUDENT_IMAGES_DIR = "backend/Student_Images"
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
SIMILARITY_THRESHOLD = 0.70 # Increased from 0.45 for much higher accuracy and to reject 'Unknown' persons

mp_face_detection = None
face_detection_model = None
face_detection_hq = None

def get_face_detector(hq=False):
    global mp_face_detection, face_detection_model, face_detection_hq
    if mp_face_detection is None:
        import mediapipe as mp
        mp_face_detection = mp.solutions.face_detection
    
    if hq:
        if face_detection_hq is None:
            face_detection_hq = mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)
        return face_detection_hq
    else:
        if face_detection_model is None:
            face_detection_model = mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.4)
        return face_detection_model

# ==== GLOBAL STATE ====
known_faces = [] # List of {"name": name, "hist": histogram}

print(f"[INFO] Connected to MongoDB at {MONGO_URI}")

# ==== CORS ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(notices.router)
app.include_router(timetable.router)
app.include_router(leave.router)
app.include_router(gatepass.router)
app.include_router(placements.router)
app.include_router(documents.router)
app.include_router(exam_forms.router)
app.include_router(scholarship.router)
app.include_router(teachers.router)

# ==== HELPER FUNCTIONS ====

def get_face_embedding(image, silent=False):
    """
    Detects face and returns a Histogram 'embedding' for comparison.
    """
    if image is None:
        if not silent: print("[ERROR] No image provided to get_face_embedding")
        return None
        
    height, width, _ = image.shape
    # if not silent: print(f"[DEBUG] Processing image: {width}x{height}")

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    detector = get_face_detector(hq=True) # Use HQ for embedding generation
    results = detector.process(rgb_image)

    if not results or not results.detections:
        if not silent: print(f"[WARNING] No face detected by MediaPipe in {width}x{height} image")
        return None

    if not silent: print(f"[INFO] Detected {len(results.detections)} face(s)")

    detection = results.detections[0]
    bboxC = detection.location_data.relative_bounding_box
    x, y, w, h = int(bboxC.xmin * width), int(bboxC.ymin * height), int(bboxC.width * width), int(bboxC.height * height)
    
    x_start = max(0, x)
    y_start = max(0, y)
    x_end = min(width, x + w)
    y_end = min(height, y + h)

    face_crop = image[y_start:y_end, x_start:x_end]
    if face_crop.size == 0: return None

    face_crop = cv2.resize(face_crop, (128, 128))
    hsv_crop = cv2.cvtColor(face_crop, cv2.COLOR_BGR2HSV)
    # Using 32x32 H-S histogram for better performance/accuracy balance
    hist = cv2.calcHist([hsv_crop], [0, 1], None, [32, 32], [0, 180, 0, 256])
    cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)
    
    return hist

def load_known_faces():
    global known_faces
    new_known_faces = []
    
    # Prioritize Database loading (much faster than disk I/O)
    db_students = list(students_collection.find(
        {"$or": [{"faceEmbedding": {"$exists": True}}, {"faceEmbeddings": {"$exists": True}}]},
        {"name": 1, "faceEmbeddings": 1, "faceEmbedding": 1}
    ))
    
    for s in db_students:
        try:
            if "faceEmbeddings" in s and isinstance(s["faceEmbeddings"], list):
                for emb in s["faceEmbeddings"]:
                    hist = np.array(emb, dtype=np.float32).reshape(32, 32)
                    new_known_faces.append({"id": str(s["_id"]), "name": s["name"], "hist": hist, "embeddings": [emb]})
            elif "faceEmbedding" in s:
                hist = np.array(s["faceEmbedding"], dtype=np.float32).reshape(32, 32)
                new_known_faces.append({"id": str(s["_id"]), "name": s["name"], "hist": hist, "embeddings": [s["faceEmbedding"]]})
        except Exception as e:
            continue
            
    # Optional Disk Loading (only as fallback or for un-synced images)
    if os.path.exists(STUDENT_IMAGES_DIR) and len(new_known_faces) < 5:
        all_files = glob.glob(os.path.join(STUDENT_IMAGES_DIR, "**", "*.*"), recursive=True)
        valid_extensions = {".jpg", ".jpeg", ".png"}
        img_files = [f for f in all_files if os.path.splitext(f)[1].lower() in valid_extensions]
        
        for file_path in img_files[:20]: # Limit disk scan to avoid heavy load
            name = os.path.basename(os.path.dirname(file_path))
            if any(k["name"] == name for k in new_known_faces): continue
            
            img = cv2.imread(file_path)
            if img is not None:
                hist = get_face_embedding(img, silent=True)
                if hist is not None:
                    new_known_faces.append({"id": None, "name": name, "hist": hist})

    known_faces = new_known_faces
    print(f"[INFO] Face Cache Ready: {len(known_faces)} entries")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    print("[INFO] Cleaning up legacy database indexes...")
    try:
        # Log indexes for debugging
        idxs = students_collection.index_information()
        print(f"[INFO] Current Student Indexes: {list(idxs.keys())}")
        
        # Drop the problematic index if it exists
        if "enrollmentNumber_1" in idxs:
            students_collection.drop_index("enrollmentNumber_1")
            print("[INFO] Dropped legacy enrollmentNumber index.")
    except Exception as e:
        print(f"[DEBUG] Index cleanup note: {e}")

    print("[INFO] Starting face cache loader in background...")
    threading.Thread(target=load_known_faces, daemon=True).start()

@app.get("/student/me/{student_id}")
async def get_student_profile(student_id: str):
    try:
        student = students_collection.find_one({"_id": ObjectId(student_id)})
        if not student:
             raise HTTPException(status_code=404, detail="Student not found")
        
        # Get Attendance Stats (Robust match for both string and ObjectId)
        query = {"$or": [{"studentId": student_id}, {"studentId": ObjectId(student_id)}]}
        attendance_records = list(attendance_collection.find(query).sort("date", -1))
        
        print(f"[DEBUG] Fetching Profile for {student_id}: Found {len(attendance_records)} records")
        
        # Calculate dynamic working days (unique attendance dates in system)
        unique_dates = attendance_collection.distinct("date")
        total_days = max(1, len(unique_dates)) 
        present_days = len(attendance_records)
        percentage = (present_days / total_days * 100)
        
        return {
            "profile": {
                "name": student["name"],
                "rollNo": student["rollNo"],
                "department": student.get("department", "General"),
                "email": student["email"],
                "phone": student.get("phone", ""),
                "profileImage": student.get("profileImage", "")
            },
            "stats": {
                "totalWorkingDays": total_days,
                "presentDays": present_days,
                "absentDays": total_days - present_days,
                "percentage": round(percentage, 1)
            },
            "history": [
                {"date": r["date"], "time": r["time"], "status": "Present"} for r in attendance_records
            ]
        }
    except Exception as e:
         print(e)
         raise HTTPException(status_code=500, detail="Failed to fetch profile")

@app.get("/attendance/student/{student_id}")
async def get_student_attendance(student_id: str):
    try:
        query = {"$or": [{"studentId": student_id}, {"studentId": ObjectId(student_id)}]}
        attendance_records = list(attendance_collection.find(query).sort("date", -1).limit(10))
        
        # Clean records for frontend
        for r in attendance_records:
            r["_id"] = str(r["_id"])
            if "studentId" in r: r["studentId"] = str(r["studentId"])
            
        return attendance_records
    except Exception as e:
        print(f"[ERROR] History Fetch: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")

# ==== STUDENT ROUTES ====

@app.get("/students/")
async def get_students():
    students = list(students_collection.find())
    for s in students:
        s["id"] = str(s["_id"]) # Frontend expects 'id'
        s["_id"] = str(s["_id"])
        if "faceEmbedding" in s: del s["faceEmbedding"]
    return students

class StudentAddRequest(BaseModel):
    name: str
    rollNo: str
    department: str
    email: str
    phone: str
    password: str = "student123"
    images: List[str] # List of Base64 strings
    lat: Optional[float] = None
    lng: Optional[float] = None

@app.post("/students/add")
async def add_student(student: StudentAddRequest):
    if students_collection.find_one({"rollNo": student.rollNo}):
        raise HTTPException(status_code=400, detail="Student already exists")
    if students_collection.find_one({"email": student.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    if not student.images:
        raise HTTPException(status_code=400, detail="No images provided")

    # ---- FACE DEDUPLICATION CHECK (Optional/Experimental) ----
    if len(known_faces) > 0:
        for img_b64 in student.images[:2]: # Check first 2 samples for speed
            try:
                temp_b64 = img_b64.split(",")[1] if "," in img_b64 else img_b64
                temp_arr = np.frombuffer(base64.b64decode(temp_b64), np.uint8)
                temp_img = cv2.imdecode(temp_arr, cv2.IMREAD_COLOR)
                temp_emb = get_face_embedding(temp_img, silent=True)
                
                if temp_emb is not None:
                    for person in known_faces:
                        for stored_emb in person.get("embeddings", []):
                            stored_mat = np.array(stored_emb, dtype=np.float32).reshape((32, 32))
                            score = cv2.compareHist(temp_emb, stored_mat, cv2.HISTCMP_CORREL)
                            if score > 0.8: # Very strict match
                                raise HTTPException(status_code=400, detail=f"Face already registered as {person['name']}")
            except HTTPException as e: raise e
            except: continue

    embeddings = []
    saved_profile_image = ""
    
    # Ensure upload dir exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    print(f"[INFO] Processing {len(student.images)} images for {student.name}")

    for idx, img_b64 in enumerate(student.images):
        try:
            # Decode Base64
            if "," in img_b64:
                img_b64 = img_b64.split(",")[1]
            
            image_data = base64.b64decode(img_b64)
            np_arr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if img is None: continue

            # Generate Embedding
            emb = get_face_embedding(img, silent=True)
            if emb is not None:
                embeddings.append(emb.flatten().tolist())
                
                # Save first valid image as profile picture
                if not saved_profile_image:
                    filename = f"{student.rollNo}_profile.jpg"
                    filepath = os.path.join(UPLOAD_DIR, filename)
                    with open(filepath, "wb") as f:
                        f.write(image_data)
                    saved_profile_image = f"/uploads/{filename}"
            
        except Exception as e:
            print(f"[ERROR] Processing image {idx}: {e}")
            continue

    if not embeddings:
         raise HTTPException(status_code=400, detail="Could not detect face in any provided images")

    student.name = student.name.strip()
    student.rollNo = student.rollNo.strip().upper()
    
    student_data = {
        "name": student.name,
        "rollNo": student.rollNo,
        "department": student.department,
        "email": student.email,
        "phone": student.phone,
        "password": student.password if student.password else student.rollNo,
        "profileImage": saved_profile_image,
        "faceEmbeddings": embeddings, # Store ARRAY of embeddings
        "createdAt": datetime.now()
    }
    
    result = students_collection.insert_one(student_data)
    load_known_faces() # Reload cache
    return {"id": str(result.inserted_id), "message": f"Student added with {len(embeddings)} face samples"}

@app.delete("/students/{id}")
async def delete_student(id: str):
    student = students_collection.find_one({"_id": ObjectId(id)})
    if student:
        # Delete Profile Image from disk
        profile_img = student.get("profileImage")
        if profile_img:
            filename = os.path.basename(profile_img)
            filepath = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(filepath):
                try: os.remove(filepath)
                except: pass
    
    students_collection.delete_one({"_id": ObjectId(id)})
    load_known_faces() # Reload cache to remove deleted student
    return {"message": "Deleted"}

class StudentUpdateRequest(BaseModel):
    name: Optional[str] = None
    rollNo: Optional[str] = None
    department: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

@app.put("/students/{id}")
async def update_student(id: str, student: StudentUpdateRequest):
    update_data = {k: v for k, v in student.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Check for duplicate rollNo if changing it
    if "rollNo" in update_data:
        existing = students_collection.find_one({"rollNo": update_data["rollNo"]})
        if existing and str(existing["_id"]) != id:
             raise HTTPException(status_code=400, detail="Roll No already exists")

    # Check if student exists first
    if not students_collection.find_one({"_id": ObjectId(id)}):
         raise HTTPException(status_code=404, detail="Student not found")

    result = students_collection.update_one(
        {"_id": ObjectId(id)}, 
        {"$set": update_data}
    )
    
    # We allow matched_count > 0 even if modified_count is 0 
    # (this happens if update_data matches existing values)
    if result.matched_count == 0:
         raise HTTPException(status_code=404, detail="Student not found")
         
    load_known_faces() # Reload cache to update changes (e.g. name)
    return {"message": "Student updated successfully"}

# ==== MODELS ====

class AttendanceRequest(BaseModel):
    image: str
    lat: Optional[float] = None
    lng: Optional[float] = None

def get_campus_config():
    config = config_collection.find_one({"key": "campus_location"})
    radius = config.get("radius", 500) if config else 500
    return 18.573699074746216, 73.98405091545511, radius

def calculate_distance(lat1, lon1, lat2, lon2):
    from math import radians, cos, sin, asin, sqrt
    # Haversine formula
    R = 6371000 # Radius of Earth in meters
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

@app.get("/config/campus")
async def get_campus_location():
    """Diagnostic route to check the current geofencing center."""
    lat, lng, radius = get_campus_config()
    return {
        "lat": lat,
        "lng": lng,
        "radius": radius,
        "source": "fixed campus coordinates"
    }

# ==== FACE RECOGNITION (LIVE CHECK) ROUTE ====

@app.post("/face/recognize")
async def recognize_face(data: AttendanceRequest):
    """
    Stand-alone recognition endpoint for 'Live Check' page.
    Does NOT mark attendance.
    """
    if not data.image:
        raise HTTPException(status_code=400, detail="No image")

    try:
        encoded = data.image.split(",", 1)[1] if "," in data.image else data.image
        np_arr = np.frombuffer(base64.b64decode(encoded), np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None: raise HTTPException(status_code=400, detail="Invalid Image")

        target_emb = get_face_embedding(img, silent=True)
        if target_emb is None:
             return {"status": "fail", "message": "No face detected"}

        best_score = 0
        best_match = None
        
        for person in known_faces:
            local_best = 0
            for emb_list in person.get("embeddings", []):
                stored_mat = np.array(emb_list, dtype=np.float32).reshape((32, 32))
                score = cv2.compareHist(target_emb, stored_mat, cv2.HISTCMP_CORREL)
                if score > local_best: local_best = score
            
            if float(local_best) > float(best_score):
                best_score = local_best
                best_match = person

        if best_match and best_score > SIMILARITY_THRESHOLD:
            # Fetch full details if needed, but for now just return the name/id
            return {
                "status": "success",
                "student": {
                    "name": best_match["name"],
                    "id": best_match["id"],
                },
                "score": round(best_score, 2)
            }
        
        return {"status": "fail", "message": "Unknown Student", "score": round(best_score, 2)}

    except Exception as e:
        print(f"Recognition Error: {e}")
        return {"status": "error", "message": "Server Error"}


@app.post("/attendance/mark")
async def mark_attendance(data: AttendanceRequest):
    if not data.image:
        raise HTTPException(status_code=400, detail="No image")

    # Geofencing Check
    if data.lat is not None and data.lng is not None:
        campus_lat, campus_lng, allowed_radius = get_campus_config()
        dist = calculate_distance(data.lat, data.lng, campus_lat, campus_lng)
        
        print("-" * 50)
        print(f"[LOCATION DEBUG] Student Lat/Lng: {data.lat}, {data.lng}")
        print(f"[LOCATION DEBUG] Campus Lat/Lng:  {campus_lat}, {campus_lng}")
        print(f"[LOCATION DEBUG] Calculated Distance: {dist:.2f} meters")
        print(f"[LOCATION DEBUG] Allowed Radius:     {allowed_radius} meters")
        print("-" * 50)

        if dist > allowed_radius:
            raise HTTPException(
                status_code=403, 
                detail=f"Attendance Rejected: Area Unauthorized. (Current: {dist:.0f}m from Campus Center)"
            )
    else:
        # Require location for attendance
        raise HTTPException(status_code=400, detail="Location Access Required for Attendance")

    # Offload heavy CV2 and matching logic to a threadpool to prevent blocking the event loop
    return await run_in_threadpool(_process_attendance, data.image)

def _process_attendance(image_b64: str):
    try:
        encoded = image_b64.split(",", 1)[1] if "," in image_b64 else image_b64
        image_data = base64.b64decode(encoded)
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None: raise HTTPException(status_code=400, detail="Invalid Image")

        # Get target embedding
        target_emb = get_face_embedding(img, silent=True)
        if target_emb is None:
             raise HTTPException(status_code=400, detail="Face quality too low")

        best_score = 0
        best_match_id = None
        
        # Optimized Early-Exit Loop
        for person in known_faces:
            person_embeddings = person.get("embeddings", [])
            
            local_best = 0
            for emb_list in person_embeddings:
                stored_mat = np.array(emb_list, dtype=np.float32).reshape((32, 32))
                score = cv2.compareHist(target_emb, stored_mat, cv2.HISTCMP_CORREL)
                if score > local_best: local_best = score
                
            if float(local_best) > float(best_score):
                best_score = local_best
                best_match_id = person.get("id")
            
            # Early exit if we find a very strong match (>90%)
            if best_score > 0.92:
                break

        if not (best_match_id and best_score > SIMILARITY_THRESHOLD):
             raise HTTPException(status_code=401, detail="Face Not Recognized")

        student = students_collection.find_one({"_id": ObjectId(best_match_id)})
        if not student:
            raise HTTPException(status_code=404, detail="Student record not found")

        today = datetime.now().strftime("%Y-%m-%d")
        existing = attendance_collection.find_one({
            "studentId": str(student["_id"]), 
            "date": today
        })
        
        if not existing:
            attendance_collection.insert_one({
                "studentId": str(student["_id"]), 
                "studentName": student["name"],
                "rollNo": student["rollNo"],
                "date": today,
                "time": datetime.now().strftime("%H:%M:%S"),
                "status": "Present"
            })
            return {
                "status": "success", 
                "message": f"Attendance Marked: {student['name']}",
                "student": {"name": student["name"], "rollNo": student["rollNo"]}
            }
        
        return {
            "status": "success", 
            "message": f"Already Marked: {student['name']}",
            "student": {"name": student["name"], "rollNo": student["rollNo"]}
        }

    except Exception as e:
        print(f"Error marking attendance: {e}")
        raise HTTPException(status_code=500, detail="Verification Failed")

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error marking attendance: {e}")
        raise HTTPException(status_code=500, detail="Server Error Processing Image")

@app.get("/attendance/today")
async def get_today():
    today = datetime.now().strftime("%Y-%m-%d")
    records = list(attendance_collection.find({"date": today}))
    print(f"[DEBUG] Today's Attendance Request: Found {len(records)} records for {today}")
    
    # Manual serialization to ensure no ObjectId leaks
    cleaned_records = []
    for r in records:
        r["_id"] = str(r["_id"])
        if "studentId" in r and isinstance(r["studentId"], ObjectId):
             r["studentId"] = str(r["studentId"])
        cleaned_records.append(r)
        
    return cleaned_records

@app.get("/attendance/stats")
async def get_stats():
    today = datetime.now().strftime("%Y-%m-%d")
    total = students_collection.count_documents({})
    present = attendance_collection.count_documents({"date": today})
    print(f"[DEBUG] Stats Request - Today: {today} | Total: {total} | Present: {present}")
    return {
        "totalStudents": total,
        "presentToday": present,
        "absentToday": max(0, total - present),
        "attendancePercentage": round((present / total * 100), 1) if total > 0 else 0
    }

@app.get("/stats/admin")
async def get_admin_stats():
    today = datetime.now().strftime("%Y-%m-%d")
    total_students = students_collection.count_documents({})
    total_teachers = teachers_collection.count_documents({})
    present_today = attendance_collection.count_documents({"date": today})
    pending_leaves = leave_collection.count_documents({"status": "Pending"})
    pending_gatepass = gatepass_collection.count_documents({"status": "Pending"})
    
    attendance_pct = (present_today / total_students * 100) if total_students > 0 else 0
    
    return {
        "totalStudents": total_students,
        "totalTeachers": total_teachers,
        "attendanceToday": round(attendance_pct, 1), # Return as percentage
        "attendanceCount": present_today,
        "pendingLeaves": pending_leaves,
        "pendingGatepass": pending_gatepass,
        "placementStats": 12 
    }

@app.get("/stats/teacher/{teacher_name}")
async def get_teacher_stats(teacher_name: str):
    # This is a bit simplified, usually you'd filter by teacher's classes
    total_students = students_collection.count_documents({}) # Placeholder: all students
    pending_leaves = leave_collection.count_documents({"status": "Pending"})
    
    # Count teacher's documents/notes
    total_files = documents.documents_collection.count_documents({"teacher": teacher_name}) if hasattr(documents, 'documents_collection') else 0
    
    return {
        "totalStudents": total_students,
        "pendingLeaves": pending_leaves,
        "totalFiles": total_files,
        "activeClasses": 4 # Placeholder or dynamic if timetable allows
    }

@app.get("/students/{student_id}/profile")
async def get_student_dashboard_stats(student_id: str):
    try:
        student = students_collection.find_one({"_id": ObjectId(student_id)})
        if not student:
             raise HTTPException(status_code=404, detail="Student not found")
        
        # Calculate Attendance
        query = {"$or": [{"studentId": student_id}, {"studentId": ObjectId(student_id)}]}
        present_days = attendance_collection.count_documents(query)
        
        unique_dates = attendance_collection.distinct("date")
        total_days = max(1, len(unique_dates)) 
        percentage = (present_days / total_days * 100)
        
        return {
            "stats": {
                "attendance": f"{round(percentage, 1)}%",
                "exams": "1 Active",
                "jobs": 2,
                "semester": student.get("semester", 1)
            },
            "profile": {
                "name": student["name"],
                "rollNo": student["rollNo"],
                "department": student.get("department", ""),
            }
        }
    except Exception as e:
         print(f"Error: {e}")
         raise HTTPException(status_code=500, detail="Internal Server Error")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
