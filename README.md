# Valdosta Medicine - Employee Management System

A comprehensive employee management and task assignment system built for Valdosta Medicine clinic.

## Features

### Core Features (Implemented)

1. **Task Assignment to Specific Users** ✅
   - Create tasks and assign them to individual employees
   - Assignees can update task status
   - View all tasks or only tasks assigned to you

2. **Employee Information Storage** ✅
   - Store employee ID, name, email, address, and salary
   - Additional fields: date of hire, date of birth, department, and role
   - Search and filter employees
   - Admin-only employee management (create, update, deactivate)

3. **User Levels (Admin & Normal Users)** ✅
   - Implemented through group-based permissions
   - Admin group with elevated privileges
   - Role-based access control throughout the application

4. **User Groups** ✅
   - Create and manage custom groups
   - Add/remove members from groups
   - Default admin group with full control
   - Groups can have custom descriptions

5. **Task Assignment to Groups** ✅
   - Assign tasks to entire groups
   - Any group member can view and work on group tasks
   - Filter tasks by assignee type (employee or group)

6. **Admin-Configurable Task Statuses** ✅
   - Create custom task statuses
   - Default statuses: Open, In-Progress, Complete
   - Configurable status colors and order
   - Prevent deletion of default statuses

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the database with initial data:
   ```bash
   npm run seed
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Default Credentials

After seeding the database, you can login with these credentials:

**Admin Account:**
- Email: `admin@valdostamedicine.com`
- Password: `admin123`

**Staff Account:**
- Email: `sarah.johnson@valdostamedicine.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new employee
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee (admin only)
- `PUT /api/employees/:id` - Update employee (admin only)
- `DELETE /api/employees/:id` - Deactivate employee (admin only)

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create new group (admin only)
- `PUT /api/groups/:id` - Update group (admin only)
- `DELETE /api/groups/:id` - Delete group (admin only)
- `POST /api/groups/:id/members` - Add member to group (admin only)
- `DELETE /api/groups/:id/members/:employeeId` - Remove member from group (admin only)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/my-tasks` - Get tasks assigned to current user
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Task Statuses
- `GET /api/task-statuses` - Get all task statuses
- `GET /api/task-statuses/:id` - Get status by ID
- `POST /api/task-statuses` - Create new status (admin only)
- `PUT /api/task-statuses/:id` - Update status (admin only)
- `DELETE /api/task-statuses/:id` - Delete status (admin only)

## Database Schema

### Employee
- id, employeeId, name, email, password
- address, salary, dateOfHire, dateOfBirth
- department, role, isActive

### Group
- id, name, description, isAdmin

### Task
- id, title, description, priority
- dueDate, completedAt
- assigneeType (employee or group)
- assigneeId, statusId, createdById

### TaskStatus
- id, name, description, color, order, isDefault

### EmployeeGroup (Join Table)
- EmployeeId, GroupId

## User Interface

The application includes the following pages:

1. **Login Page** - Authentication
2. **Dashboard** - Overview with statistics and recent tasks
3. **Employees** - Employee management (view, create, edit, deactivate)
4. **Tasks** - Task management (create, assign, update status)
5. **Groups** - Group management and member assignment (admin only)
6. **Task Statuses** - Status configuration (admin only)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Admin-only routes protection
- Token validation on all protected endpoints

## Priority Implementation

Features were implemented in order of importance as specified:

1. ✅ Task assignment to specific users
2. ✅ Storing employee info
3. ✅ User levels (admin, normal)
4. ✅ User groups
5. ✅ Task assignment to user groups
6. ✅ Admin-configurable task statuses

## Future Enhancements

Potential improvements for future versions:

- Email notifications for task assignments
- File attachments for tasks
- Task comments and activity history
- Advanced reporting and analytics
- Calendar view for tasks with due dates
- Mobile responsive design improvements
- Export data to CSV/Excel
- Task templates
- Recurring tasks
- Time tracking

## License

MIT

## Support

For issues or questions, please contact the development team.
