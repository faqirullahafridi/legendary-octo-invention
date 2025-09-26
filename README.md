# Passport Size Photo Maker

Create passport photos online in seconds with our easy-to-use tool.

## Features
- Upload and preview images
- Automatic face detection and cropping
- Background removal and adjustment
- Photo editing tools (zoom, rotate, brightness, contrast)
- Multiple passport size options
- Download in JPG, PNG, and PDF formats
- Generate multiple copies on A4 sheet
- User activity logging
- Monetization hooks (free with watermark, premium without)

## Tech Stack
- Frontend: React + TailwindCSS + Axios
- Backend: Flask (Python) + OpenCV + rembg + reportlab
- Database: SQLite

## Setup Instructions

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the Flask app:
   ```
   python app.py
   ```
   The backend will be available at http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## API Endpoints

### Upload
- **POST** `/api/upload` - Upload an image file
  - FormData with key `file` containing the image
  - Returns: `{filename, filepath}`

### Processing
- **POST** `/api/process` - Process the uploaded image
  - Body: `{filename, size, background, watermark}`
  - Returns: `{processed_filename, processed_filepath, size}`

### Download
- **GET** `/api/download/<filename>` - Download a processed image
- **POST** `/api/download-pdf` - Generate and download PDF
  - Body: `{filenames: [], copies: 4|6|8}`

### Information
- **GET** `/api/sizes` - Get available passport sizes
- **GET** `/api/logs` - Get user activity logs

## Folder Structure
```
photo-maker/
├── backend/
│   ├── app.py          # Flask application
│   ├── requirements.txt # Python dependencies
│   ├── uploads/         # Uploaded images
│   ├── processed/       # Processed images
│   ├── photo_maker.db   # SQLite database
│   └── Dockerfile       # Backend Docker configuration
├── frontend/
│   ├── src/             # React source code
│   ├── public/          # Static assets
│   ├── package.json     # Frontend dependencies
│   └── Dockerfile       # Frontend Docker configuration
├── sample_images/       # Test images
├── docker-compose.yml   # Multi-container setup
├── render.yaml          # Render deployment config
└── README.md
```

## Deployment

### Docker Deployment
```bash
# Build and run both services
docker-compose up --build
```

### Render Deployment
The project includes a `render.yaml` file for one-click deployment to Render:
1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect it to your forked repository
4. Render will automatically detect the `render.yaml` and deploy both services

### Manual Deployment
For other platforms, deploy the frontend and backend separately:
- Backend: Deploy as a Python web application
- Frontend: Build with `npm run build` and deploy the `dist/` folder as static files

## Monetization
The app includes hooks for monetization:
- Free version: Includes watermark on downloaded images
- Premium version: No watermark, HD quality (placeholder for Stripe/PayPal integration)

To implement payment processing:
1. Add payment provider SDKs (Stripe, PayPal)
2. Implement subscription/user management
3. Modify processing logic to remove watermark for premium users

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.