# API Documentation

This document provides detailed information about the API endpoints available in the URL Shortener application.

## Base URL

```
http://localhost:8000/api
```

## Endpoints

### 1. Create Short URL

Creates a new short URL from a long URL.

- **URL**: `/urls`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "long_url": "https://example.com/very/long/url/that/needs/shortening",
    "custom_code": "example" // Optional
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "short_code": "example",
      "long_url": "https://example.com/very/long/url/that/needs/shortening",
      "short_url": "http://localhost:3000/example",
      "created_at": "2023-04-22T12:00:00Z"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**:
    ```json
    {
      "detail": "Invalid URL format"
    }
    ```
  - **Code**: 409 Conflict
  - **Content**:
    ```json
    {
      "detail": "Custom code already exists"
    }
    ```

### 2. Redirect to Long URL

Redirects to the original long URL when a short URL is accessed.

- **URL**: `/{short_code}`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 307 Temporary Redirect
  - **Redirects to**: The original long URL
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "detail": "Short URL not found"
    }
    ```

### 3. Get URL Statistics

Retrieves statistics for a specific short URL.

- **URL**: `/urls/{short_code}/stats`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "short_code": "example",
      "long_url": "https://example.com/very/long/url/that/needs/shortening",
      "short_url": "http://localhost:3000/example",
      "created_at": "2023-04-22T12:00:00Z",
      "clicks": 42,
      "last_clicked": "2023-04-23T15:30:00Z"
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "detail": "Short URL not found"
    }
    ```

### 4. Get All URLs

Retrieves all shortened URLs.

- **URL**: `/urls`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "short_code": "example1",
        "long_url": "https://example.com/url1",
        "short_url": "http://localhost:3000/example1",
        "created_at": "2023-04-22T12:00:00Z",
        "clicks": 10
      },
      {
        "short_code": "example2",
        "long_url": "https://example.com/url2",
        "short_url": "http://localhost:3000/example2",
        "created_at": "2023-04-22T13:00:00Z",
        "clicks": 5
      }
    ]
    ```

### 5. Delete URL

Deletes a specific short URL.

- **URL**: `/urls/{short_code}`
- **Method**: `DELETE`
- **Success Response**:
  - **Code**: 204 No Content
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "detail": "Short URL not found"
    }
    ```

## Database Schema

The application uses PostgreSQL with the following schema:

### URLs Table

```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER DEFAULT 0,
    last_clicked TIMESTAMP WITH TIME ZONE
);
```

## Error Codes

- **400 Bad Request**: The request was invalid or cannot be served.
- **404 Not Found**: The requested resource could not be found.
- **409 Conflict**: The request conflicts with the current state of the server.
- **500 Internal Server Error**: An unexpected error occurred on the server.

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Authentication

Currently, the API does not require authentication. Future versions may include authentication for certain endpoints.
