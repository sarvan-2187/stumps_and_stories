## Stumps & Stories

#### Architecture Diagram:
![architecture](https://github.com/user-attachments/assets/c04de775-483b-4080-bf82-d7e9f1c5936d)

#### Description: This project is an attempt to make a Completely Automated Newsletter for Cricket News of Past 72hrs

#### How It Works

1. **RSS Fetching**
   - Fetches cricket news from ESPNcricinfo & CricTracker
   - Filters content strictly from the last 72 hours
   - Deduplicates and classifies news by league

2. **AI Summarization**
   - Uses Groq LLM to summarize verified RSS data only
   - Produces structured and neutral newsletter content

3. **Storage**
   - Stores generated newsletters in Neon PostgreSQL
   - Marks newsletters as unsent until email delivery

4. **Email Delivery**
   - Sends formatted newsletter emails to subscribers
   - Includes one-click unsubscribe links

5. **Automation**
   - Vercel Cron triggers generation and sending
   - Runs every **Wednesday & Saturday at 12:00 PM IST**
---
#### Tech Stacks: 
- Next.js (for both frontend & backend)
- Neon serverless (for Database)
- Vercel CRON Jobs (for Invoking Pipelines and Sending the Emails)
- Node mailer (for Emails)
- Google In App Passswords (for Emails)
- Groq Meta Llama AI (for Summarizing RSS Feeds)
- ESPNCricInfo, CricTracker (for RSS Feeds)
- Marked (for Rendering the Markdown Content)
- Google Fonts & Acceternity UI (for UI Components)
---
#### SQL Queries (For Database):
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



    
