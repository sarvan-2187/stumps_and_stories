## Stumps & Stories

#### Description: The following project is an attempt to make a Newsletter for cricket using the following Tech Stacks
- Tech Stacks: 
    - Next.js (for both frontend & backend)
    - Neon serverless (for Database)
    - Vercel CRON Jobs
    - Node mailer
    - Google In App Passswords (for Emails)
- SQL Queries (For Database)
```sql
-- Creating the Table
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
```sql
-- Creating the Table
CREATE TABLE newsletters(
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP
);
```
```sql
-- Creating the Table
CREATE TABLE unsubscribe_tokens (
  id SERIAL PRIMARY KEY,
  subscriber_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);
```

    
