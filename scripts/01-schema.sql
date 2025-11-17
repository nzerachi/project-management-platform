-- MySQL Database Schema for Team Collaboration Platform

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role ENUM('admin', 'user') DEFAULT 'user',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- TEAMS TABLE
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner_id (owner_id)
);

-- TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'admin', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_team_member (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  team_id INT NOT NULL,
  status ENUM('active', 'archived', 'completed') DEFAULT 'active',
  owner_id INT NOT NULL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_team_id (team_id),
  INDEX idx_status (status),
  INDEX idx_owner_id (owner_id)
);

-- TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'in_review', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  assigned_to INT,
  created_by INT NOT NULL,
  start_date DATE,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);

-- COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id)
);

-- ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  comment_id INT,
  user_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_comment_id (comment_id)
);

-- ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  task_id INT,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT,
  old_value JSON,
  new_value JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- SAMPLE DATA
INSERT INTO users (email, password_hash, full_name, avatar_url, role) VALUES
('admin@example.com', 'hashed_password_1', 'Admin User', '/placeholder.svg?height=40&width=40', 'admin'),
('alice@example.com', 'hashed_password_2', 'Alice Johnson', '/placeholder.svg?height=40&width=40', 'user'),
('bob@example.com', 'hashed_password_3', 'Bob Smith', '/placeholder.svg?height=40&width=40', 'user'),
('carol@example.com', 'hashed_password_4', 'Carol Davis', '/placeholder.svg?height=40&width=40', 'user');

INSERT INTO teams (name, description, owner_id) VALUES
('Engineering Team', 'Core product development team', 1),
('Design Team', 'UX/UI design and prototyping', 1),
('Marketing Team', 'Marketing and growth initiatives', 2);

INSERT INTO team_members (team_id, user_id, role) VALUES
(1, 1, 'owner'), (1, 2, 'admin'), (1, 3, 'member'),
(2, 1, 'owner'), (2, 4, 'member'),
(3, 2, 'owner'), (3, 3, 'member');

INSERT INTO projects (name, description, team_id, owner_id, status, start_date, end_date) VALUES
('Mobile App MVP', 'Build MVP for mobile platform', 1, 2, 'active', '2025-01-15', '2025-03-31'),
('Website Redesign', 'Complete redesign of company website', 2, 4, 'active', '2025-01-20', '2025-02-28'),
('Q1 Marketing Campaign', 'Q1 marketing initiatives and campaigns', 3, 2, 'active', '2025-01-01', '2025-03-31');

INSERT INTO tasks (project_id, title, description, status, priority, assigned_to, created_by, due_date) VALUES
(1, 'Setup authentication', 'Implement user authentication system', 'in_progress', 'high', 3, 2, '2025-01-25'),
(1, 'Create dashboard', 'Build main dashboard component', 'todo', 'high', 2, 2, '2025-01-28'),
(1, 'API integration', 'Integrate backend API', 'todo', 'medium', 3, 2, '2025-02-01'),
(2, 'Homepage design', 'Design homepage layout', 'in_progress', 'urgent', 4, 4, '2025-02-10'),
(2, 'Brand guidelines', 'Create brand style guide', 'done', 'high', 4, 4, '2025-01-20'),
(3, 'Social media campaign', 'Plan and execute social media campaign', 'todo', 'medium', 3, 2, '2025-02-05'),
(3, 'Email marketing', 'Create email marketing campaign', 'in_review', 'medium', 2, 2, '2025-02-15');
