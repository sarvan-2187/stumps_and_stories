## Stumps & Stories

#### Description: The following project is an attempt to make a Newsletter for cricket using the following Tech Stacks
#### Tech Stacks: 
    - Next.js (for both frontend & backend)
    - Neon serverless (for Database)
    - Vercel CRON Jobs
    - Node mailer
    - Google In App Passswords (for Emails)
    - Groq Meta Llama AI (for Summarizing RSS Feeds)
    - ESPNCricInfo, CricTracker (for RSS Feeds)
    - Marked (for Rendering the Markdown Content)
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

### Architecture Diagram
![architecture](https://github.com/user-attachments/assets/c04de775-483b-4080-bf82-d7e9f1c5936d)

    
