## Stumps & Stories

#### Description: The following project is an attempt to make a Newsletter for cricket using the following Tech Stacks
- Tech Stacks: 
    - Next.js (for both frontend & backend)
    - Neon serverless (for Database)
    - Vercel CRON Jobs
    - Node mailer
    - Google In App Passswords (for Emails)
- SQL Queries (For Database)
<img width="523" height="142" alt="image" src="https://github.com/user-attachments/assets/9a97aa62-86f2-4af6-be0f-86b5318820f3" />
<img width="542" height="178" alt="image" src="https://github.com/user-attachments/assets/738151e7-b667-4f4f-8a36-3460ddbc9e4c" />
<img width="606" height="174" alt="image" src="https://github.com/user-attachments/assets/0235ab68-1d50-42b6-90e8-57867bec539e" />
CREATE TABLE unsubscribe_tokens (
  id SERIAL PRIMARY KEY,
  subscriber_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);


    
