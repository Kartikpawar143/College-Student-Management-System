from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
mongo_uri = os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017/smart-campus')
db_name = 'smart-campus'

try:
    client = MongoClient(mongo_uri)
    db = client[db_name]
    students = db.students.find({})
    count = 0
    for s in students:
        new_roll = s['rollNo'].strip().upper()
        # Ensure password is also current roll number if it was meant to be same
        # or just uppercase current password if it exists
        old_pass = s.get('password', new_roll)
        new_pass = old_pass.strip().upper()
        
        db.students.update_one(
            {'_id': s['_id']},
            {'$set': {'rollNo': new_roll, 'password': new_pass}}
        )
        count += 1
    print(f'Done! Normalized {count} student records to UPPERCASE for rollNo and password.')
except Exception as e:
    print(f'Error: {e}')
finally:
    if 'client' in locals():
        client.close()
