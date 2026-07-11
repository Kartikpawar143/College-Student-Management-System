from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load ENV from the backend directory
load_dotenv('backend/.env')

# Connection string with fallback
mongo_uri = os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017/smart-campus')
db_name = 'smart-campus'

try:
    client = MongoClient(mongo_uri)
    db = client[db_name]
    
    # Update ALL students: set password field to match their rollNo
    students = db.students.find({})
    count = 0
    for student in students:
        roll_no = student['rollNo'].strip()
        db.students.update_one(
            {'_id': student['_id']},
            {'$set': {'password': roll_no, 'rollNo': roll_no}}
        )
        count += 1
    
    print(f'Successfully synchronized {count} student accounts. All passwords are now set to match their Roll Numbers.')
    
except Exception as e:
    print(f'Error during migration: {e}')
finally:
    if 'client' in locals():
        client.close()
