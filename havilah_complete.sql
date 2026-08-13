-- ============================================================
--  HAVILAH PRO - COMPLETE DATABASE SETUP
--  Import this via phpMyAdmin → Import → Choose File
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- CreateTable
CREATE TABLE IF NOT EXISTS dmins (
    id INTEGER NOT NULL AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ole VARCHAR(50) NOT NULL DEFAULT 'admin',
    last_login DATETIME(3) NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX dmins_email_key(email),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
    service_id INTEGER NOT NULL AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    eatured BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX services_slug_key(slug),
    PRIMARY KEY (service_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_requests (
    equest_id INTEGER NOT NULL AUTO_INCREMENT,
    service_id INTEGER NOT NULL,
    
ame VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(150) NULL,
    udget VARCHAR(50) NULL,
    message TEXT NOT NULL,
    ttachment VARCHAR(255) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at DATETIME(3) NULL,
    submitted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (equest_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS internship_roles (
    ole_id INTEGER NOT NULL AUTO_INCREMENT,
    ole_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    openings INTEGER NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at DATETIME(3) NULL,
    PRIMARY KEY (ole_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS internship_applications (
    pplication_id INTEGER NOT NULL AUTO_INCREMENT,
    ole_id INTEGER NOT NULL,
    ull_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    college VARCHAR(150) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    year_of_study VARCHAR(20) NOT NULL,
    portfolio_url VARCHAR(255) NULL,
    esume VARCHAR(255) NOT NULL,
    cover_letter TEXT NULL,
    linkedin VARCHAR(255) NULL,
    github VARCHAR(255) NULL,
    pplication_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at DATETIME(3) NULL,
    pplied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (pplication_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS 	estimonials (
    	estimonial_id INTEGER NOT NULL AUTO_INCREMENT,
    client_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NULL,
    phone VARCHAR(20) NULL,
    company VARCHAR(150) NULL,
    designation VARCHAR(100) NULL,
    profile_photo VARCHAR(255) NULL,
    eview TEXT NOT NULL,
    ating INTEGER NOT NULL,
    eatured BOOLEAN NOT NULL DEFAULT false,
    pproved BOOLEAN NOT NULL DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (	estimonial_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contacts (
    contact_id INTEGER NOT NULL AUTO_INCREMENT,
    
ame VARCHAR(100) NOT NULL,
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

CREATE TABLE IF NOT EXISTS ctivity_logs (
    id INTEGER NOT NULL AUTO_INCREMENT,
    dmin_id INTEGER NULL,
    ction VARCHAR(255) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id INTEGER NULL,
    ip_address VARCHAR(45) NULL,
    rowser VARCHAR(255) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) NOT NULL,
    alue TEXT NOT NULL,
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (key)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys
ALTER TABLE service_requests ADD CONSTRAINT service_requests_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE internship_applications ADD CONSTRAINT internship_applications_role_id_fkey FOREIGN KEY (ole_id) REFERENCES internship_roles(ole_id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================
--  DEFAULT ADMIN USER
--  Email:    robinson30122000@gmail.com
--  Password: Havilah_Pro@2026
-- ============================================================
INSERT INTO dmins (email, password_hash, ole, updated_at) VALUES
('robinson30122000@gmail.com', '/IbkO5OvSqMFNC7.o5uvfC9BV3FkPZxKbbOBWFo1i1g6AWC', 'admin', NOW());

SET FOREIGN_KEY_CHECKS = 1;
