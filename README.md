# TaskFlow — College-Level Advanced MERN Todo List

A simple but feature-rich To-Do List project suitable for a 3rd-year B.Tech Computer Science college project.

## Features

- Add, edit, delete tasks
- Complete / pending status
- Priority: Low / Medium / High
- Categories: College / Personal / Work
- Due date and time
- Search
- Filter by status, category and priority
- Sort by newest, due date or priority
- Dashboard statistics
- Completion progress bar
- Overdue task detection
- Upcoming reminders
- Browser notification reminder
- Simple alarm sound at reminder time
- Dark / Light mode
- Responsive design
- MongoDB persistence
- REST API
- Basic validation and error handling

## Important Reminder Note

The reminder checks the time in the browser every second. Therefore, for this simple college project, the TaskFlow page should remain open for the reminder/alarm to fire. Browser notifications require permission.

## Technology

- Frontend: React + JavaScript + CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- API: REST

## Folder Structure

```text
todo-fullstack/
├── backend/
│   ├── models/
│   │   └── Todo.js
│   ├── routes/
│   │   └── todoRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoForm.jsx
│   │   │   └── TodoItem.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Installation

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run:

```bash
npm run dev
```

Backend:
`http://localhost:5000`

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

## MongoDB

You can use MongoDB Atlas or a local MongoDB server.

The application stores these task fields:

- title
- completed
- priority
- category
- dueDate
- reminderAt
- createdAt
- updatedAt

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/todos` | Get all tasks |
| POST | `/api/todos` | Create task |
| PUT | `/api/todos/:id` | Update task |
| DELETE | `/api/todos/:id` | Delete task |
| DELETE | `/api/todos` | Clear completed tasks |

### Example POST body

```json
{
  "title": "Complete DBMS Assignment",
  "priority": "High",
  "category": "College",
  "dueDate": "2026-10-07T18:00:00.000Z",
  "reminderAt": "2026-10-07T17:30:00.000Z"
}
```

## How the Alarm Works

1. User selects a reminder date and time while creating a task.
2. The reminder time is saved in MongoDB.
3. React checks pending tasks every second.
4. When the reminder time arrives:
   - Browser notification is displayed if permission is granted.
   - A short alarm sound is played.
   - If notification is unavailable, a browser alert is shown.
5. The same task is not repeatedly notified during the current page session.

## Project Explanation for Viva

### Frontend
React manages the user interface and task state.

### Backend
Express provides REST APIs for creating, reading, updating and deleting tasks.

### Database
MongoDB stores task information.

### Reminder
The browser compares the current time with the stored `reminderAt` value and triggers the notification/alarm.

## Future Scope

- User login and registration
- Multiple users
- Email reminders
- Mobile application
- Cloud deployment
- Server-side scheduled notifications

## Viva Questions

### 1. Why MongoDB?
MongoDB stores data in a flexible document format and works well with JavaScript applications.

### 2. Why Express.js?
Express makes it easy to create REST APIs using Node.js.

### 3. What is REST API?
It is a way for frontend and backend to communicate using HTTP methods such as GET, POST, PUT and DELETE.

### 4. How does the reminder work?
The frontend checks reminder times periodically and triggers a browser notification and alarm when the time is reached.

### 5. What is React state?
State stores data that can change during application use and causes the UI to update when it changes.

### 6. What is middleware in Express?
Middleware functions run during the request-response cycle. This project uses middleware such as `express.json()` and `cors()`.

### 7. What is Mongoose?
Mongoose is an ODM library that helps Node.js applications work with MongoDB using schemas and models.

### 8. What is the difference between PUT and POST?
POST is generally used to create data, while PUT is used to update existing data.

### 9. What is responsive design?
Responsive design allows the application UI to adapt to mobile, tablet and desktop screen sizes.
