import PyPDF2
import docx
import io
import json
from typing import Dict, Optional

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file bytes"""
    try:
        pdf_file = io.BytesIO(file_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to parse PDF: {str(e)}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX file bytes"""
    try:
        docx_file = io.BytesIO(file_bytes)
        doc = docx.Document(docx_file)
        
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to parse DOCX: {str(e)}")

def parse_resume_file(file_bytes: bytes, filename: str) -> str:
    """Parse resume file and extract text based on file type"""
    file_extension = filename.lower().split('.')[-1]
    
    if file_extension == 'pdf':
        return extract_text_from_pdf(file_bytes)
    elif file_extension in ['docx', 'doc']:
        return extract_text_from_docx(file_bytes)
    else:
        raise Exception(f"Unsupported file type: {file_extension}")

def validate_file_size(file_size: int, max_size_mb: int = 5) -> bool:
    """Validate file size is within limit"""
    max_size_bytes = max_size_mb * 1024 * 1024
    return file_size <= max_size_bytes

def validate_file_type(filename: str) -> bool:
    """Validate file type is PDF or DOCX"""
    allowed_extensions = ['pdf', 'docx', 'doc']
    file_extension = filename.lower().split('.')[-1]
    return file_extension in allowed_extensions

def parse_ai_score_response(response_text: str) -> Optional[Dict]:
    """Parse AI scoring response into structured data"""
    try:
        # Try to extract JSON from response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            return json.loads(json_str)
        
        return None
    except Exception:
        return None
