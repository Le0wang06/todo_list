1. 用户表
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 用户ID
    username VARCHAR(50) UNIQUE NOT NULL,       -- 用户名
    email VARCHAR(100) UNIQUE NOT NULL,         -- 邮箱
    passwordHash TEXT NOT NULL,                -- 密码哈希
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

2. 任务表
```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 任务ID
    userId INT NOT NULL,                       -- 关联的用户ID
    title VARCHAR(255) NOT NULL,                -- 任务标题
    description TEXT,                           -- 任务描述
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending', -- 任务状态
    priority INT DEFAULT 1,                     -- 任务优先级（1-5）
    dueDate TIMESTAMP,                         -- 任务截止时间
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新时间
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- 外键关联用户
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```