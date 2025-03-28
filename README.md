# To-Do List 应用需求

## 核心功能

### 1. 用户注册与登录
- 用户可以通过用户名、邮箱和密码进行注册。
- 用户可以通过邮箱和密码登录。
- 密码采用哈希存储和验证，确保安全性。

### 2. 任务管理
- 用户可以创建、编辑和删除任务。
- 任务包含以下字段：
  - 标题（`title`）
  - 描述（`description`）
  - 状态（`status`，如 `pending`、`inProgress`、`completed`）
  - 优先级（`priority`，1到5，1为最高优先级）
  - 截止时间（`dueDate`）
- 用户可以更新任务的状态（如从 `pending` 更改为 `inProgress` 或 `completed`）。

### 3. 任务状态更新
- 用户可以更新任务状态。
- 任务状态包括三种：
  - `pending`（待办）
  - `inProgress`（进行中）
  - `completed`（已完成）
- 任务更新时，`updatedAt` 自动更新为当前时间。

### 4. 用户数据持久化
- 用户数据（任务、用户名、邮箱等）存储在数据库中。
- 删除用户时，自动删除该用户的所有任务。