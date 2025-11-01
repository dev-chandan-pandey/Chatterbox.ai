
---

## 💬 **2️⃣ Chatterbox.ai – README.md**


# 💬 Chatterbox.ai

**Chatterbox.ai** is a full-stack, ChatGPT-like chat application built with the **MERN stack** and integrated with **OpenAI API**. It allows users to chat with an AI assistant, save chat history, and experience a modern, responsive chat interface.

## 🚀 Live Demo
🔗 [Chatterbox.ai Live](https://chatterbox-ai-tidm.vercel.app/)  
💻 [GitHub Repository](https://github.com/dev-chandan-pandey/Chatterbox.ai)

---

## 🧩 Features
- 🤖 ChatGPT-style AI chat powered by **OpenAI API**.
- 🔐 User authentication and authorization using **JWT** and **HTTP-only cookies**.
- ✅ Data validation with **Express-Validator** middleware.
- 💾 Stores user chats and sessions securely in **MongoDB**.
- 💬 Responsive **React + Vite** frontend with **Material UI** for sleek chat UI.
- 🧠 Real-time AI responses and session persistence.

---

## 🛠️ Tech Stack
**Frontend:** React (Vite), Material UI  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**AI Integration:** OpenAI API  
**Authentication:** JWT, Cookies  
**Deployment:** Vercel  

---

## ⚙️ Installation

1. **Clone the repository**
   ```
   git clone https://github.com/dev-chandan-pandey/Chatterbox.ai.git
   cd Chatterbox.ai
  ```
2. Install dependencies
```
npm install
cd client && npm install
```
3. Add environment variables
Create a .env file in the root:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
```
4. Run the app

``
`npm run dev
```
