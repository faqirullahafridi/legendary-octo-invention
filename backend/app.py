from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import sqlite3
from datetime import datetime
import cv2
import numpy as np
from PIL import Image
from rembg import remove
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
import io

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
DATABASE = 'photo_maker.db'

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Initialize database
def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS logs
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  timestamp TEXT,
                  action TEXT,
                  filename TEXT,
                  ip_address TEXT)''')
    conn.commit()
    conn.close()

# Passport sizes in pixels (assuming 300 DPI)
PASSPORT_SIZES = {
    'us': {'name': 'US (2x2 inches)', 'width': 600, 'height': 600},
    'eu': {'name': 'EU/UK/Pakistan (35x45 mm)', 'width': 413, 'height': 531},
    'india': {'name': 'India (51x51 mm)', 'width': 602, 'height': 602}
}

def log_activity(action, filename, ip_address):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("INSERT INTO logs (timestamp, action, filename, ip_address) VALUES (?, ?, ?, ?)",
              (datetime.now().isoformat(), action, filename, ip_address))
    conn.commit()
    conn.close()

def detect_face(image_path):
    # Load the image
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Load the face cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    if len(faces) > 0:
        # Return the first detected face
        return faces[0]  # (x, y, w, h)
    else:
        # If no face detected, return None
        return None

def crop_and_resize(image_path, face_coords, size_key):
    # Load the image
    image = Image.open(image_path)
    
    if face_coords:
        x, y, w, h = face_coords
        # Add some padding around the face
        padding = int(w * 0.3)
        x = max(0, x - padding)
        y = max(0, y - padding)
        w = min(image.width - x, w + 2 * padding)
        h = min(image.height - y, h + 2 * padding)
        
        # Crop the image
        cropped = image.crop((x, y, x + w, y + h))
    else:
        # If no face detected, use the entire image
        cropped = image
    
    # Resize to the specified passport size
    size = PASSPORT_SIZES[size_key]
    resized = cropped.resize((size['width'], size['height']), Image.Resampling.LANCZOS)
    
    return resized

def remove_background(image, bg_type='white'):
    # Convert PIL image to bytes
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    # Remove background
    result = remove(img_byte_arr)
    
    # Convert back to PIL image
    result_image = Image.open(io.BytesIO(result)).convert("RGBA")
    
    if bg_type == 'white':
        # Create white background
        background = Image.new('RGB', result_image.size, (255, 255, 255))
        composite = Image.alpha_composite(background.convert('RGBA'), result_image)
        return composite.convert('RGB')
    elif bg_type == 'blue':
        # Create blue background
        background = Image.new('RGB', result_image.size, (0, 120, 215))
        composite = Image.alpha_composite(background.convert('RGBA'), result_image)
        return composite.convert('RGB')
    elif bg_type == 'transparent':
        return result_image
    else:  # light gray
        # Create light gray background
        background = Image.new('RGB', result_image.size, (240, 240, 240))
        composite = Image.alpha_composite(background.convert('RGBA'), result_image)
        return composite.convert('RGB')

def add_watermark(image):
    # Add a simple watermark (in a real app, this would be more sophisticated)
    # For now, we'll just return the image as-is
    # In a real implementation, you would add a visible watermark
    return image

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file:
        # Generate unique filename
        filename = str(uuid.uuid4()) + (os.path.splitext(file.filename)[1] if file.filename else '.jpg')
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Log activity
        ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
        log_activity('upload', filename, ip_address)
        
        return jsonify({'filename': filename, 'filepath': filepath})

@app.route('/api/process', methods=['POST'])
def process_image():
    data = request.get_json()
    filename = data.get('filename')
    size_key = data.get('size', 'us')
    bg_type = data.get('background', 'white')
    add_watermark_flag = data.get('watermark', True)
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    # Check if file exists
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    # Detect face
    face_coords = detect_face(filepath)
    
    # Crop and resize
    processed_image = crop_and_resize(filepath, face_coords, size_key)
    
    # Remove background
    processed_image = remove_background(processed_image, bg_type)
    
    # Add watermark if requested
    if add_watermark_flag:
        processed_image = add_watermark(processed_image)
    
    # Save processed image
    processed_filename = 'processed_' + filename
    processed_filepath = os.path.join(PROCESSED_FOLDER, processed_filename)
    processed_image.save(processed_filepath, 'PNG')
    
    # Log activity
    ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    log_activity('process', processed_filename, ip_address)
    
    return jsonify({
        'processed_filename': processed_filename,
        'processed_filepath': processed_filepath,
        'size': PASSPORT_SIZES[size_key]
    })

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    filepath = os.path.join(PROCESSED_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    # Log activity
    ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    log_activity('download', filename, ip_address)
    
    return send_file(filepath, as_attachment=True)

def create_pdf(images, output_path, copies_per_page=4):
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    
    # Calculate positions for multiple images per page
    if copies_per_page == 4:
        positions = [(50, height-200), (width/2+25, height-200), 
                     (50, height/2-50), (width/2+25, height/2-50)]
        img_width, img_height = 200, 200
    elif copies_per_page == 6:
        positions = [(50, height-180), (width/2+25, height-180),
                     (50, height/2-20), (width/2+25, height/2-20),
                     (50, 100), (width/2+25, 100)]
        img_width, img_height = 180, 180
    else:  # 8 copies
        positions = [(30, height-150), (width/3+20, height-150), (2*width/3+10, height-150),
                     (30, height/2+20), (width/3+20, height/2+20), (2*width/3+10, height/2+20),
                     (30, 150), (width/3+20, 150)]
        img_width, img_height = 150, 150
    
    # Add images to PDF
    for i, img in enumerate(images):
        if i > 0 and i % copies_per_page == 0:
            c.showPage()  # New page
        
        page_index = i % copies_per_page
        x, y = positions[page_index]
        
        # Save image to memory
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        # Draw image on PDF
        c.drawImage(ImageReader(img_buffer), x, y, width=img_width, height=img_height)
    
    c.save()

@app.route('/api/download-pdf', methods=['POST'])
def download_pdf():
    data = request.get_json()
    filenames = data.get('filenames', [])
    copies_per_page = data.get('copies', 4)
    
    if not filenames:
        return jsonify({'error': 'No filenames provided'}), 400
    
    # Load images
    images = []
    for filename in filenames:
        filepath = os.path.join(PROCESSED_FOLDER, filename)
        if os.path.exists(filepath):
            img = Image.open(filepath)
            images.append(img)
    
    if not images:
        return jsonify({'error': 'No valid images found'}), 404
    
    # Generate unique PDF filename
    pdf_filename = 'passport_photos_' + str(uuid.uuid4()) + '.pdf'
    pdf_filepath = os.path.join(PROCESSED_FOLDER, pdf_filename)
    
    # Create PDF
    create_pdf(images, pdf_filepath, copies_per_page)
    
    # Log activity
    ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    log_activity('download-pdf', pdf_filename, ip_address)
    
    return jsonify({'pdf_filename': pdf_filename})

@app.route('/api/sizes', methods=['GET'])
def get_sizes():
    return jsonify(PASSPORT_SIZES)

@app.route('/api/logs', methods=['GET'])
def get_logs():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 50")
    logs = c.fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    log_list = []
    for log in logs:
        log_list.append({
            'id': log[0],
            'timestamp': log[1],
            'action': log[2],
            'filename': log[3],
            'ip_address': log[4]
        })
    
    return jsonify(log_list)

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)