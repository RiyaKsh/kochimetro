# Kochi Metro Backend API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## User Roles
- **admin**: Full access to all departments and features
- **department_user**: Limited access to their department only

---

## 1. Authentication Routes (`/api/auth`)

### POST `/api/auth/register`
Register a new admin user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "Operations"
}
```

**Response:**
```json
{
  "message": "Admin registered successfully",
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "department": "Operations"
    },
    "token": "jwt_token",
    "redirectTo": "/dashboard"
  }
}
```

### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "department": "Operations",
      "lastLogin": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token",
    "redirectTo": "/dashboard"
  }
}
```

### GET `/api/auth/profile`
Get current user profile. **Requires Authentication**

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "department": "Operations",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT `/api/auth/profile`
Update user profile. **Requires Authentication**

**Request Body:**
```json
{
  "name": "John Smith",
  "department": "Maintenance"
}
```

### PUT `/api/auth/change-password`
Change user password. **Requires Authentication**

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### POST `/api/auth/logout`
Logout user. **Requires Authentication**

---

## 2. Dashboard Routes (`/api/dashboard`)

### GET `/api/dashboard`
Get dashboard statistics. **Requires Authentication**

**Query Parameters:**
- `department` (optional): Filter by department (admin only)

**Response:**
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "success": true,
  "data": {
    "overview": {
      "documentsUploadedToday": 5,
      "totalDocuments": 150,
      "pendingCompliance": 12,
      "overdueCompliance": 3,
      "activeDepartments": 4,
      "knowledgeBaseItems": 45,
      "complianceCompletionRate": 85,
      "documentApprovalRate": 92
    },
    "trends": {
      "weeklyUploads": [
        {"date": "2024-01-15", "count": 3},
        {"date": "2024-01-16", "count": 5}
      ],
      "complianceTrends": {
        "Pending": [{"date": "2024-01-15", "count": 2}],
        "Resolved": [{"date": "2024-01-15", "count": 5}]
      }
    },
    "recent": {
      "recentDocuments": [...],
      "upcomingCompliance": [...]
    },
    "departmentStats": [...] // Admin only
  }
}
```

### GET `/api/dashboard/department/:department`
Get department-specific statistics. **Requires Authentication & Department Access**

**Response:**
```json
{
  "message": "Department statistics retrieved successfully",
  "success": true,
  "data": {
    "department": "Operations",
    "totalDocuments": 50,
    "documentsByStatus": [
      {"_id": "Approved", "count": 45},
      {"_id": "Pending Review", "count": 5}
    ],
    "complianceByStatus": [...],
    "monthlyTrends": [...],
    "topUsers": [...]
  }
}
```

---

## 3. Document Routes (`/api/documents`)

### POST `/api/documents`
Upload a new document. **Requires Authentication**

**Request:** Multipart form data
- `file`: Document file (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF)
- `title`: Document title
- `description`: Document description
- `category`: Document category
- `language`: Document language
- `priority`: Document priority
- `access`: Access level (`self`, `department`, `cross-department`)
- `allowedDepartments`: Array of department names (for cross-department access)

**Response:**
```json
{
  "message": "Document uploaded successfully",
  "success": true,
  "data": {
    "_id": "document_id",
    "title": "Safety Manual",
    "description": "Safety procedures manual",
    "department": "Operations",
    "access": "department",
    "status": "Pending Review",
    "versions": [...],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET `/api/documents`
Get documents with filtering and pagination. **Requires Authentication**

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sortBy`: Sort field (default: 'createdAt')
- `sortOrder`: Sort order (`asc` or `desc`, default: 'desc')
- `search`: Search term
- `status`: Filter by status

**Response:**
```json
{
  "message": "Documents retrieved successfully",
  "success": true,
  "data": {
    "documents": [
      {
        "_id": "document_id",
        "title": "Safety Manual",
        "description": "Safety procedures manual",
        "department": "Operations",
        "status": "Approved",
        "fileUrl": "/uploads/documents/file-123.pdf",
        "uploadedBy": {...},
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 100,
      "hasNext": true,
      "hasPrev": false
    },
    "statusCounts": [
      {"_id": "Approved", "count": 45},
      {"_id": "Pending Review", "count": 5}
    ]
  }
}
```

### GET `/api/documents/:id`
Get single document by ID. **Requires Authentication**

**Response:**
```json
{
  "message": "Document retrieved successfully",
  "success": true,
  "data": {
    "document": {
      "_id": "document_id",
      "title": "Safety Manual",
      "description": "Safety procedures manual",
      "department": "Operations",
      "status": "Approved",
      "versions": [...],
      "uploadedBy": {...},
      "reviewedBy": {...}
    }
  }
}
```

### PUT `/api/documents/:id`
Update document status. **Requires Authentication**

**Request Body:**
```json
{
  "status": "Approved",
  "reviewComments": "Document approved after review"
}
```

### DELETE `/api/documents/:id`
Delete document (soft delete). **Requires Authentication**

### GET `/api/documents/shared`
Get shared documents. **Requires Admin Authentication**

---

## 4. Compliance Routes (`/api/compliance`)

### GET `/api/compliance`
Get compliance tasks with filtering. **Requires Authentication**

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sortBy`: Sort field (default: 'dueDate')
- `sortOrder`: Sort order (`asc` or `desc`, default: 'asc')
- `status`: Filter by status
- `priority`: Filter by priority
- `department`: Filter by department
- `assignedTo`: Filter by assigned user
- `dueSoon`: Filter tasks due in next 7 days (true/false)
- `overdue`: Filter overdue tasks (true/false)

**Response:**
```json
{
  "message": "Compliance tasks retrieved successfully",
  "success": true,
  "data": {
    "complianceTasks": [
      {
        "_id": "task_id",
        "documentId": {...},
        "dueDate": "2024-02-15T00:00:00Z",
        "priority": "High",
        "status": "Pending",
        "complianceType": "Safety Review",
        "description": "Review safety procedures",
        "assignedTo": {...},
        "department": "Operations"
      }
    ],
    "pagination": {...},
    "statusCounts": [...],
    "priorityCounts": [...]
  }
}
```

### GET `/api/compliance/:id`
Get single compliance task by ID. **Requires Authentication**

### POST `/api/compliance`
Create new compliance task. **Requires Authentication**

**Request Body:**
```json
{
  "documentId": "document_id",
  "dueDate": "2024-02-15T00:00:00Z",
  "priority": "High",
  "complianceType": "Safety Review",
  "description": "Review safety procedures document",
  "assignedTo": "user_id",
  "reminders": true
}
```

### PATCH `/api/compliance/:id/status`
Update compliance task status. **Requires Authentication**

**Request Body:**
```json
{
  "status": "Resolved",
  "resolutionNotes": "Task completed successfully"
}
```

### PUT `/api/compliance/:id`
Update compliance task. **Requires Authentication**

### DELETE `/api/compliance/:id`
Delete compliance task. **Requires Authentication**

### GET `/api/compliance/overdue/list`
Get overdue compliance tasks. **Requires Authentication**

### GET `/api/compliance/due-soon/list`
Get compliance tasks due soon (next 7 days). **Requires Authentication**

### GET `/api/compliance/stats/overview`
Get compliance statistics. **Requires Authentication**

**Response:**
```json
{
  "message": "Compliance statistics retrieved successfully",
  "success": true,
  "data": {
    "overview": {
      "totalTasks": 50,
      "pendingTasks": 10,
      "onTrackTasks": 25,
      "overdueTasks": 5,
      "resolvedTasks": 10,
      "completionRate": 80
    },
    "tasksByPriority": [...],
    "tasksByDepartment": [...] // Admin only
  }
}
```

---

## 5. Knowledge Base Routes (`/api/knowledge-base`)

### POST `/api/knowledge-base/index`
Index document in knowledge base. **Requires Authentication**

**Request Body:**
```json
{
  "documentId": "document_id",
  "title": "Safety Procedures",
  "content": "Full document content for indexing...",
  "summary": "Brief summary of the document",
  "category": "Safety",
  "tags": ["safety", "procedures", "manual"],
  "keywords": ["emergency", "evacuation", "first aid"],
  "language": "en"
}
```

### GET `/api/knowledge-base/search/semantic`
Semantic search using AI embeddings. **Requires Authentication**

**Query Parameters:**
- `q`: Search query (required, min 2 characters)
- `department`: Filter by department
- `category`: Filter by category
- `tags`: Filter by tags (array)
- `limit`: Results limit (default: 20)
- `skip`: Skip results (default: 0)

**Response:**
```json
{
  "message": "Semantic search completed successfully",
  "success": true,
  "data": {
    "query": "safety procedures",
    "results": [
      {
        "_id": "kb_entry_id",
        "title": "Safety Procedures Manual",
        "summary": "Comprehensive safety procedures...",
        "category": "Safety",
        "tags": ["safety", "procedures"],
        "documentId": {...},
        "similarityScore": 0.95
      }
    ],
    "totalResults": 5,
    "pagination": {
      "limit": 20,
      "skip": 0,
      "hasMore": false
    }
  }
}
```

### GET `/api/knowledge-base/search/text`
Text-based search (fallback). **Requires Authentication**

**Query Parameters:** Same as semantic search

### GET `/api/knowledge-base`
Get knowledge base entries. **Requires Authentication**

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sortBy`: Sort field (default: 'createdAt')
- `sortOrder`: Sort order (`asc` or `desc`, default: 'desc')
- `category`: Filter by category
- `department`: Filter by department
- `tags`: Filter by tags (array)
- `search`: Search term

### GET `/api/knowledge-base/:id`
Get single knowledge base entry by ID. **Requires Authentication**

### PUT `/api/knowledge-base/:id`
Update knowledge base entry. **Requires Authentication**

### DELETE `/api/knowledge-base/:id`
Delete knowledge base entry. **Requires Authentication**

### GET `/api/knowledge-base/stats/overview`
Get knowledge base statistics. **Requires Authentication**

---

## 6. Employee Management Routes (`/api/employees`)

### POST `/api/employees/invite`
Invite a new employee. **Requires Admin Authentication**

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

**Response:**
```json
{
  "message": "Employee invited successfully",
  "success": true,
  "data": {
    "userId": "user_id",
    "password": "generated_password"
  }
}
```

### GET `/api/employees/department-employees`
Get all employees in admin's department. **Requires Admin Authentication**

**Response:**
```json
{
  "message": "Department employees retrieved successfully",
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "lastLogin": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/api/employees/assign-document/:id`
Assign users to a document. **Requires Admin Authentication**

**Request Body:**
```json
{
  "userIds": ["user_id_1", "user_id_2"]
}
```

---

## 7. Product Routes (`/api/products`)

### GET `/api/products`
Get products (placeholder endpoint). **Requires Authentication**

**Response:**
```json
[
  {
    "name": "mobile",
    "price": 10000
  },
  {
    "name": "tv",
    "price": 20000
  }
]
```

---

## 8. Health Check

### GET `/ping`
Health check endpoint.

**Response:**
```json
{
  "message": "PONG",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "healthy"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "success": false,
  "error": "Detailed error message (development only)"
}
```

### Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

---

## File Upload Limits

- **Maximum file size**: 10MB
- **Allowed file types**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF
- **Upload directory**: `/uploads/`

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Standard rate limit headers included in responses

---

## CORS Configuration

- **Allowed Origins**: `http://localhost:5173` (configurable via `FRONTEND_URL`)
- **Allowed Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization
- **Credentials**: Supported

---

## Environment Variables

Required environment variables:
- `JWT_SECRET`: Secret key for JWT token signing
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)
- `OPENAI_API_KEY`: OpenAI API key for knowledge base embeddings (optional)
- `MAX_FILE_SIZE`: Maximum file upload size in bytes (default: 10485760 = 10MB)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 8080)

---

## Database Models

### User
- `_id`, `name`, `email`, `password`, `role`, `department`, `isActive`, `lastLogin`, `createdAt`, `updatedAt`

### Document
- `_id`, `title`, `description`, `category`, `language`, `priority`, `uploadedBy`, `department`, `access`, `allowedDepartments`, `allowedUsers`, `status`, `versions`, `currentVersion`, `reviewedBy`, `reviewedAt`, `reviewComments`, `isArchived`, `archiveReason`, `createdAt`, `updatedAt`

### Compliance
- `_id`, `documentId`, `dueDate`, `priority`, `complianceType`, `description`, `assignedTo`, `department`, `status`, `resolvedBy`, `resolvedAt`, `resolutionNotes`, `reminders`, `isActive`, `createdAt`, `updatedAt`

### KnowledgeBase
- `_id`, `documentId`, `title`, `content`, `summary`, `embeddings`, `category`, `department`, `tags`, `keywords`, `language`, `createdBy`, `updatedBy`, `searchCount`, `isActive`, `createdAt`, `updatedAt`

---

## Frontend Implementation Notes

1. **Authentication**: Store JWT token in localStorage/sessionStorage and include in Authorization header
2. **File Uploads**: Use FormData for document uploads with multipart/form-data
3. **Pagination**: Implement pagination controls using the pagination data from responses
4. **Error Handling**: Check `success` field and display appropriate error messages
5. **Role-based UI**: Show/hide features based on user role (admin vs department_user)
6. **Department Filtering**: Department users can only see their department's data
7. **Real-time Updates**: Consider implementing WebSocket connections for real-time notifications
8. **File Downloads**: Use the `fileUrl` from document responses to download/view files
