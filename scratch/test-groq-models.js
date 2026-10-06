import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } })
  .then(r => r.json())
  .then(data => console.log(data.data.map(m => m.id).sort()));
