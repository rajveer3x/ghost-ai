import { put } from '@vercel/blob';
import fetch from 'node-fetch';

async function test() {
  console.log("Testing Groq...");
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "Say hello" }
      ],
      max_tokens: 10
    })
  });
  
  if (!groqRes.ok) {
    const text = await groqRes.text();
    console.error("Groq Error:", groqRes.status, text);
    return;
  }
  
  const groqData = await groqRes.json();
  const text = groqData.choices[0].message.content;
  console.log("Groq Success:", text);
  
  console.log("Testing Blob...");
  try {
    const blob = await put(`test-dir/test-${Date.now()}.md`, text, {
      access: 'private',
      contentType: 'text/markdown',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    console.log("Blob Success:", blob.url);
  } catch (e) {
    console.error("Blob Error:", e.message);
  }
}

test();
