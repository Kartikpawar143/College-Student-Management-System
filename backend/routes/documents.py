from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from database import documents_collection
from models.document_model import DocumentModel
import os
import shutil
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_ROOT = "public"

@router.post("/upload")
async def upload_document(
    title: str = Form(...),
    description: str = Form(""),
    fileType: str = Form(...), # 'note', 'pyq', 'aadhar', 'bonafide', etc.
    uploaderId: str = Form(...),
    uploaderName: str = Form(...),
    branch: str = Form(""),
    semester: int = Form(None),
    subject: str = Form(""),
    file: UploadFile = File(...)
):
    # Determine directory
    folder = "documents"
    if fileType == "note": folder = "notes"
    elif fileType == "pyq": folder = "pyqs"
    
    target_dir = os.path.join(UPLOAD_ROOT, folder)
    os.makedirs(target_dir, exist_ok=True)
    
    file_name = f"{datetime.now().timestamp()}_{file.filename}"
    file_path = os.path.join(target_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    doc_data = {
        "title": title,
        "description": description,
        "fileType": fileType,
        "filePath": f"/{folder}/{file_name}",
        "uploadedBy": uploaderId,
        "uploaderName": uploaderName,
        "branch": branch,
        "semester": semester,
        "subject": subject,
        "uploadedAt": datetime.now()
    }
    
    result = documents_collection.insert_one(doc_data)
    return {"id": str(result.inserted_id), "message": "File uploaded successfully"}

@router.get("/")
async def get_documents(fileType: str = None, branch: str = None, semester: int = None):
    query = {}
    if fileType: query["fileType"] = fileType
    if branch: query["branch"] = branch
    if semester: query["semester"] = semester
    
    docs = list(documents_collection.find(query).sort("uploadedAt", -1))
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs

@router.delete("/{id}")
async def delete_document(id: str):
    doc = documents_collection.find_one({"_id": ObjectId(id)})
    if doc:
        # Delete from disk
        path = os.path.join(UPLOAD_ROOT, doc["filePath"].lstrip("/"))
        if os.path.exists(path):
            os.remove(path)
        documents_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Document deleted"}
