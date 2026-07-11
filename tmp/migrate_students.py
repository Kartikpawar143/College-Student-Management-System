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
    
    # Update all students who don't have a password field
    result = db.students.update_many(
        {'password': {'$exists': False}}, 
        {'$set': {'password': 'student123'}}
    )
    
    print(f'Successfully updated {result.modified_count} students with the default password: student123')
    
except Exception as e:
    print(f'Error during migration: {e}')
finally:
    if 'client' in locals():
        client.close()
