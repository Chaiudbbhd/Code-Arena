# 💖 Welcome to the Code Arena – UI/UX Showcase

![Code Arena UI Screenshot](https://i.ibb.co/HD9H4vsk/Screenshot-2025-08-06-at-3-52-40-PM.png)


## 🧠 Project Overview

Welcome to **Code Arena**, a sleek, modern front-end experience built using the latest web technologies. This project is not just a static UI — it's a **visionary platform** designed for **competitive environments** like coding challenges, quizzes, and online tests conducted between friends or institutions.

🎯 **Purpose**:
> This app is built **exclusively for conducting competitive challenges** — ensuring fairness, preventing cheating, and creating a smooth user experience.

---

## 🔐 Intelligent Security-First Design

**Code Arena** stands out with **advanced security controls** baked into the frontend (and to be enhanced further in the backend), specifically designed for competition integrity:

- ❌ **No Copy-Paste**: All keyboard events like `Ctrl+C`, `Ctrl+V`, or `Right-Click > Copy` are disabled to prevent content leakage.
- 🛑 **Tab Switch Detection**: If a user tries to switch tabs, minimize the window, or open DevTools, the platform automatically tracks the event.
- ⚠️ **Auto-Disqualification**: Upon detecting any suspicious or unauthorized activity (like switching tabs multiple times or resizing the screen), the user is **instantly disqualified** from the session.
- 👁️ **Tamper-Resistant UI**: Ensures users remain focused in a full-screen secure environment (kiosk-style experience).

🔒 These features are part of the UI/UX layer and will be enforced even more robustly in the upcoming **backend rollout**.

---

## 🌐 Live Preview

🚀 **Live URL**: [code-arena-three.vercel.app](https://code-arena-three.vercel.app)

🛠️ **Status**:  
> 💡 This is currently a **UI/UX prototype**. The **full-fledged backend integration**, user authentication, real-time monitoring, and analytics are under development and coming soon!

---

## ⚙️ Tech Stack

This project is powered by:

- ⚡ **Vite** — Lightning-fast development environment
- 🧬 **TypeScript** — For static typing and clean architecture
- ⚛️ **React** — Front-end library for modular UI
- 🎨 **Tailwind CSS** — Modern, utility-first styling
- 🧩 **shadcn/ui** — Accessible and beautifully styled components

---

## 🛠️ Getting Started (Local Development)

> Make sure you have [Node.js](https://nodejs.org/en) and [npm](https://www.npmjs.com/) installed.  
> It's recommended to install Node via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

### 👨‍💻 Clone and Run the Project

```bash
# 1️⃣ Clone the repository
git clone <YOUR_GIT_URL>

# 2️⃣ Navigate into the project directory
cd <YOUR_PROJECT_NAME>

# 3️⃣ Install the required dependencies
npm install

# 4️⃣ Start the development server
npm run dev
