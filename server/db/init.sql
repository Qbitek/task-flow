-- Usuń tabele jeśli istnieją
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- Tabela użytkowników
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela zadań
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('to_do', 'in_progress', 'done') DEFAULT 'to_do',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Przykładowe dane
INSERT INTO users (name, email) VALUES
('Jan Kowalski', 'jan@example.com'),
('Anna Nowak', 'anna@example.com');

INSERT INTO tasks (title, description, status, user_id) VALUES
('Kupić mleko', 'Przez drożdżówkę', 'to_do', 1),
('Napisać raport', 'Raport kwartalny', 'in_progress', 2);