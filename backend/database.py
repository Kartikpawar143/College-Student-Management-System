from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/smart-campus")
DB_NAME = "smart-campus"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

students_collection = db["students"]
teachers_collection = db["teachers"]
attendance_collection = db["attendance"]
timetable_collection = db["timetable"]
notices_collection = db["notices"]
leave_collection = db["leave_applications"]
gatepass_collection = db["gate_pass"]
courses_collection = db["courses"]
placements_collection = db["placements"]
notes_collection = db["notes"]
pyqs_collection = db["pyqs"]
documents_collection = db["documents"]
exam_forms_collection = db["exam_forms"]
scholarship_collection = db["scholarship_forms"]
admin_collection = db["admins"]
placement_applications_collection = db["placement_applications"]
config_collection = db["config"]

# Create indexes for better performance
students_collection.create_index("rollNo", unique=True)
students_collection.create_index("email", unique=True)
students_collection.create_index("name")

attendance_collection.create_index([("studentId", 1), ("date", 1)])
attendance_collection.create_index("date")

teachers_collection.create_index("email", unique=True)
teachers_collection.create_index("id")

leave_collection.create_index("status")
gatepass_collection.create_index("status")

timetable_collection.create_index([("branch", 1), ("semester", 1)])
timetable_collection.create_index("teacher_id")

notices_collection.create_index("createdAt")

