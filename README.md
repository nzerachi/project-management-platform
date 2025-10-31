# TeamFlow - Team Collaboration Platform

A modern team collaboration and project management platform built with Next.js and MySQL.

## Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Team Management**: Create teams and manage team members with role-based access
- **Project Management**: Organize projects within teams
- **Task Management**: Create tasks, assign them to team members, track progress
- **Task Collaboration**: Add comments to tasks for real-time team discussions
- **Real-time Updates**: See changes reflected across the platform

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+ or MariaDB 10.5+
- A modern web browser

## Setup

### 1. Database Setup

First, create a MySQL database and user:

\`\`\`sql
CREATE DATABASE teamflow;
CREATE USER 'teamflow_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON teamflow.* TO 'teamflow_user'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

### 2. Environment Variables

Copy `.env.example` to `.env.local` and configure:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the following variables in `.env.local`:

\`\`\`
DB_HOST=localhost
DB_USER=teamflow_user
DB_PASSWORD=your_secure_password
DB_NAME=teamflow
JWT_SECRET=your-very-secure-secret-key-here
\`\`\`

### 3. Database Schema

Run the SQL migration scripts to create the database tables:

\`\`\`bash
npm run db:setup
\`\`\`

This will execute the SQL script at `scripts/01-create-schema.sql`

### 4. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 5. Run the Application

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Project Structure

\`\`\`
.
├── app/
│   ├── api/              # API routes for backend
│   ├── auth/             # Authentication pages (login, signup)
│   ├── dashboard/        # Main dashboard and project pages
│   └── page.tsx          # Landing page
├── components/           # Reusable React components
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   └── db-validation.ts # Database validation
├── scripts/             # Database migration scripts
└── public/              # Static assets
\`\`\`

## API Routes

### Authentication

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Sign in to account

### Teams

- `GET /api/teams` - Get all teams for authenticated user
- `POST /api/teams` - Create a new team

### Projects

- `GET /api/projects?teamId={teamId}` - Get projects for a team
- `POST /api/projects` - Create a new project

### Tasks

- `GET /api/tasks?projectId={projectId}` - Get tasks for a project
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get task details
- `PATCH /api/tasks/{id}` - Update task

### Comments

- `GET /api/comments?taskId={taskId}` - Get comments for a task
- `POST /api/comments` - Add a comment to a task

## Authentication

The platform uses JWT tokens stored in localStorage for authentication. Each request includes the token in the Authorization header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Security Features

- Password hashing with PBKDF2
- JWT token-based authentication
- SQL parameterized queries to prevent injection
- Role-based access control (admin, member, viewer)

## Development

### Running Tests

\`\`\`bash
npm run test
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

The application can be deployed to Vercel, AWS, or any Node.js-compatible hosting:

1. Set up environment variables in your hosting platform
2. Run `npm install` and `npm run build`
3. Start the application with `npm start`

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check environment variables are set correctly
- Ensure the database user has proper permissions

### Authentication Issues

- Clear browser localStorage: `localStorage.clear()`
- Check JWT_SECRET is set in environment variables
- Verify tokens aren't expired (7-day expiration)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
\`\`\`

```json file="" isHidden
# project-management-platform
