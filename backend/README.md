# Compliance & Document Management System - Backend

A comprehensive Node.js + Express backend for a compliance and document management system with MongoDB, JWT authentication, role-based access control, and AI-powered semantic search.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Document Management** - Upload, version control, approval workflow
- **Compliance Tracking** - Automated compliance task generation and tracking
- **Knowledge Base** - AI-powered semantic search using OpenAI embeddings
- **Dashboard Analytics** - Comprehensive statistics and reporting
- **Email Notifications** - Automated reminders and notifications

### Technical Features
- **MVC Architecture** - Clean, modular code structure
- **MongoDB + Mongoose** - Robust database with schema validation
- **File Upload** - Multer-based file handling with validation
- **Security** - Helmet, rate limiting, input validation
- **Error Handling** - Comprehensive error handling and logging
- **API Documentation** - Complete Postman collection included

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API key (for semantic search)
- SMTP credentials (for email notifications)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd compliance-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=8080
   MONGO_CONN=mongodb://localhost:27017/compliance-management
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Then seed the database
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/department/:department` - Get department-specific stats

### Documents
- `POST /api/documents` - Upload new document
- `GET /api/documents` - List documents with filtering
- `GET /api/documents/:id` - Get document by ID
- `PATCH /api/documents/:id/status` - Update document status (Admin only)
- `GET /api/documents/:id/versions` - Get document versions
- `POST /api/documents/:id/versions` - Add new version
- `DELETE /api/documents/:id` - Delete document (Admin only)

### Compliance
- `GET /api/compliance` - List compliance tasks
- `POST /api/compliance` - Create compliance task
- `GET /api/compliance/:id` - Get compliance task by ID
- `PATCH /api/compliance/:id/status` - Update compliance status
- `PUT /api/compliance/:id` - Update compliance task
- `DELETE /api/compliance/:id` - Delete compliance task
- `GET /api/compliance/overdue/list` - Get overdue tasks
- `GET /api/compliance/due-soon/list` - Get due soon tasks
- `GET /api/compliance/stats/overview` - Get compliance statistics

### Knowledge Base
- `POST /api/knowledge-base/index` - Index document for search
- `GET /api/knowledge-base/search/semantic` - Semantic search
- `GET /api/knowledge-base/search/text` - Text-based search
- `GET /api/knowledge-base` - List knowledge base entries
- `GET /api/knowledge-base/:id` - Get entry by ID
- `PUT /api/knowledge-base/:id` - Update entry
- `DELETE /api/knowledge-base/:id` - Delete entry
- `GET /api/knowledge-base/stats/overview` - Get knowledge base statistics

## 🔐 User Roles

### Admin
- Full access to all features
- Can approve/reject documents
- Can view all departments' data
- Can manage users and system settings

### Department User
- Can upload and view documents from their department
- Can manage compliance tasks assigned to them
- Can search knowledge base
- Cannot approve documents or access other departments' data

## 📊 Database Models

### User
- `name`, `email`, `password` (hashed)
- `role` (admin/department_user)
- `department`, `isActive`, `lastLogin`

### Document
- `title`, `description`, `department`
- `status` (Draft, Pending Review, Under Review, Approved, Rejected)
- `versions` array with file URLs and metadata
- `uploadedBy`, `reviewedBy`, `reviewedAt`

### Compliance
- `documentId` (reference to Document)
- `dueDate`, `status` (Pending, On Track, Overdue, Resolved)
- `priority`, `complianceType`, `description`
- `assignedTo`, `reminders`, `resolutionNotes`

### KnowledgeBase
- `documentId` (reference to Document)
- `title`, `content`, `summary`
- `embeddings` (vector for semantic search)
- `category`, `tags`, `keywords`
- `searchCount`, `lastAccessed`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `8080` |
| `MONGO_CONN` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `OPENAI_API_KEY` | OpenAI API key for embeddings | Required |
| `SMTP_HOST` | SMTP server host | Required |
| `SMTP_USER` | SMTP username | Required |
| `SMTP_PASS` | SMTP password | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### File Upload
- Maximum file size: 10MB
- Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF
- Storage: Local filesystem (configurable for cloud storage)

## 🧪 Testing

### Seed Data
The system includes a comprehensive seed script that creates:
- Sample users (admin + department users)
- Sample documents with various statuses
- Compliance tasks with different priorities
- Knowledge base entries with embeddings

```bash
npm run seed
```

### Test Credentials
- **Admin**: `admin@company.com` / `admin123`
- **Department Users**: `[department]@company.com` / `user123`
  - Example: `hr@company.com` / `user123`

## 📱 Postman Collection

A complete Postman collection is included in `/postman/` with:
- All API endpoints
- Sample requests and responses
- Environment variables
- Authentication examples

Import the collection and set up the environment variables for easy testing.

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Granular permissions
- **Input Validation** - Joi schema validation
- **Rate Limiting** - Prevents abuse
- **Helmet** - Security headers
- **Password Hashing** - bcrypt with salt rounds
- **CORS Protection** - Configurable origins

## 📈 Monitoring & Logging

- **Morgan** - HTTP request logging
- **Error Handling** - Comprehensive error tracking
- **Health Check** - `/ping` endpoint for monitoring
- **File Upload Tracking** - Upload success/failure logging

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure production MongoDB
4. Set up proper SMTP credentials
5. Configure file storage (local or cloud)
6. Set up monitoring and logging
7. Configure reverse proxy (nginx)
8. Set up SSL certificates

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the Postman collection
- Check the logs for error details
- Ensure all environment variables are set correctly

## 🔄 API Versioning

The API uses URL-based versioning:
- Current version: `/api/v1/` (default)
- Future versions: `/api/v2/`, etc.

## 📝 Changelog

### v1.0.0
- Initial release
- Complete CRUD operations for all entities
- JWT authentication and authorization
- File upload and version control
- Compliance tracking system
- AI-powered semantic search
- Email notification system
- Comprehensive dashboard analytics
