SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS internship_applications;
DROP TABLE IF EXISTS service_requests;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS internship_roles;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
  id INTEGER NOT NULL AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  last_login DATETIME(3) NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX admins_email_key (email),
  PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE services (
  service_id INTEGER NOT NULL AUTO_INCREMENT,
  service_name VARCHAR(100) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX services_slug_key (slug),
  PRIMARY KEY (service_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE service_requests (
  request_id INTEGER NOT NULL AUTO_INCREMENT,
  service_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(150) NULL,
  budget VARCHAR(50) NULL,
  message TEXT NOT NULL,
  attachment VARCHAR(255) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at DATETIME(3) NULL,
  submitted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (request_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE internship_roles (
  role_id INTEGER NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  openings INTEGER NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at DATETIME(3) NULL,
  PRIMARY KEY (role_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE internship_applications (
  application_id INTEGER NOT NULL AUTO_INCREMENT,
  role_id INTEGER NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  college VARCHAR(150) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  year_of_study VARCHAR(20) NOT NULL,
  portfolio_url VARCHAR(255) NULL,
  resume VARCHAR(255) NOT NULL,
  cover_letter TEXT NULL,
  linkedin VARCHAR(255) NULL,
  github VARCHAR(255) NULL,
  application_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at DATETIME(3) NULL,
  applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (application_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE testimonials (
  testimonial_id INTEGER NOT NULL AUTO_INCREMENT,
  client_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NULL,
  phone VARCHAR(20) NULL,
  company VARCHAR(150) NULL,
  designation VARCHAR(100) NULL,
  profile_photo VARCHAR(255) NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  approved BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (testimonial_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE contacts (
  contact_id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NULL,
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  enquiry_type VARCHAR(50) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (contact_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE activity_logs (
  id INTEGER NOT NULL AUTO_INCREMENT,
  admin_id INTEGER NULL,
  action VARCHAR(255) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id INTEGER NULL,
  ip_address VARCHAR(45) NULL,
  browser VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE settings (
  key_name VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (key_name)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE service_requests ADD CONSTRAINT fk_sr_service FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE internship_applications ADD CONSTRAINT fk_ia_role FOREIGN KEY (role_id) REFERENCES internship_roles(role_id) ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO admins (email, password_hash, role, updated_at) VALUES ('robinson30122000@gmail.com', '\/IbkO5OvSqMFNC7.o5uvfC9BV3FkPZxKbbOBWFo1i1g6AWC', 'admin', NOW());

SET FOREIGN_KEY_CHECKS = 1;