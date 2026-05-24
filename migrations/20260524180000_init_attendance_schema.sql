CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_number VARCHAR(50) UNIQUE NULL,
  employee_number VARCHAR(50) UNIQUE NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL,
  course VARCHAR(100) NULL,
  year_level INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_code VARCHAR(50) NOT NULL UNIQUE,
  subject_name VARCHAR(150) NOT NULL,
  teacher_id INT NOT NULL
);

CREATE TABLE schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NOT NULL,
  room VARCHAR(100) NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NOT NULL,
  student_id INT NOT NULL,
  status VARCHAR(30) DEFAULT 'active',
  UNIQUE KEY unique_enrollment (subject_id, student_id)
);

CREATE TABLE attendance_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  schedule_id INT NOT NULL,
  session_date DATE NOT NULL,
  opened_at DATETIME NULL,
  closed_at DATETIME NULL,
  valid_from DATETIME NOT NULL,
  valid_until DATETIME NOT NULL,
  qr_token VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('scheduled', 'open', 'closed') NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE attendance_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attendance_session_id INT NOT NULL,
  student_id INT NOT NULL,
  time_in DATETIME NOT NULL,
  status ENUM('present', 'late', 'absent') NOT NULL,
  UNIQUE KEY unique_attendance_record (attendance_session_id, student_id)
);
