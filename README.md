# URL Shortener

A modern, fast, and user-friendly URL shortening service built with SolidJS, FastAPI, and MongoDB.

## Features

- **URL Shortening**: Convert long URLs into short, manageable links
- **Custom Short Codes**: Optionally specify your own short code for URLs
- **Analytics**: Track clicks and usage statistics for your shortened URLs
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Modern dark theme for reduced eye strain
- **Privacy Policy & Terms**: Clear documentation of service usage
- **Docker Support**: Easy deployment with Docker and docker-compose

## Tech Stack

### Frontend

- **SolidJS**: Reactive UI library for building user interfaces
- **SUID**: Material UI components for SolidJS
- **TypeScript**: Type-safe JavaScript

### Backend

- **FastAPI**: Modern, fast web framework for building APIs
- **MongoDB**: NoSQL database for storing URLs and analytics
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running the FastAPI application

## Installation & Setup

### Option 1: Using Docker (Recommended)

1. Prerequisites:

   - Docker
   - Docker Compose

2. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

3. Start the application:

   ```bash
   docker-compose up -d
   ```

4. Access the application at `http://localhost:3000`

To stop the application:

```bash
docker-compose down
```

To remove all data (including the database):

```bash
docker-compose down -v
```

### Option 2: Manual Installation

1. Prerequisites:

   - Node.js (v14+)
   - Python (v3.8+)
   - MongoDB

2. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Install backend dependencies:

   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017
   DATABASE_NAME=url_shortener
   BASE_URL=http://localhost:3000
   ```

6. Start the backend server:

   ```bash
   cd backend
   uvicorn main:app --reload
   ```

7. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

8. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a long URL in the input field
2. Optionally specify a custom short code
3. Click "Shorten URL" to generate a shortened link
4. Copy and share your shortened URL
5. View analytics by clicking on the "Stats" link

## Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
python -m build
```

## API Documentation

For detailed information about the API endpoints, please refer to the [API Documentation](API.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [SolidJS](https://www.solidjs.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [MongoDB](https://www.mongodb.com/)
- [SUID](https://suid.io/)
