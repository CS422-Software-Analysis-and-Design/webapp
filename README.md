# E-Commerce Web Application with AI Assistant

This is a comprehensive e-commerce web application with an integrated AI chatbot assistant. The application allows users to browse products, create accounts, manage wishlists, compare products, and get AI-powered assistance through a chatbot.

## Project Structure

The project is divided into three main components:

### Frontend (fe)
- React.js based user interface
- Tailwind CSS for styling
- Features include:
  - Product browsing and searching
  - User authentication
  - Wishlist management
  - Product comparison
  - AI Chatbot integration
  - Responsive design

### Backend (be)
- Flask-based REST API
- Features include:
  - User account management
  - Product search and filtering
  - Integration with OpenAI for chatbot functionality
  - Web scraping capabilities
  - Swagger UI for API documentation

### Database (db)
- PostgreSQL database
- Stores product information, user accounts, and wishlists

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Python](https://www.python.org/) 3.9+ (for local backend development)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_CONTAINER_NAME=db_container
DB_HOST=database
DB_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=ecommerce

# Backend Configuration
BACKEND_CONTAINER_NAME=backend_container
BACKEND_HOST=0.0.0.0
BACKEND_PORT=5002

# API Keys
OPENAI_API_KEY=your_openai_api_key
```

## Running the Application

### Backend and Database (Docker)

1. Start the backend and database services using Docker Compose:

```powershell
docker-compose up --build database backend
```

2. The backend API will be accessible at http://localhost:5002
3. Swagger UI documentation will be available at http://localhost:5002/swagger/

### Frontend (Local)

1. Navigate to the frontend directory:

```powershell
cd fe
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm start
```

4. The frontend will be accessible at http://localhost:3000

## Testing

The project includes various test files in the `be/test` directory for testing different components of the backend:

- Account management
- Product search and description
- OpenAI integration
- Wishlist functionality

## Development

- Backend API code is located in `be/app`
- Frontend React components are in `fe/src/components`
- Database initialization scripts are in `db/init`

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Axios, React Router
- **Backend**: Flask, Python, OpenAI API
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Other**: Swagger for API documentation
 
