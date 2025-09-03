# 📝 Note-Taking Application

A full-stack **MERN + TypeScript** note-taking app with authentication, built using:

- **Backend:** Node.js, Express, TypeScript, MongoDB, JWT, nodemailer(SMTP) for Email OTP
- **Frontend:** React + Vite + TypeScript  
- **Deployment:** Render (server + client in same repo)

---

## 🚀 Features
- User authentication (JWT + cookies)
- Create, read, update, and delete notes
- Protected routes
- Responsive React frontend
- Production-ready build (server serves client)

---

## 📂 Project Structure
```
├── api/ # Backend (Express + TS)
│ ├── routes/ # API routes
│ ├── models/ # Mongoose models
│ ├── controllers/ # Route controllers
│ └── index.ts # Entry point
├── client/ # Frontend (React + Vite + TS)
│ ├── src/
│ ├── index.html
│ └── vite.config.ts
├── dist/ # Compiled server build (created by tsc)
├── package.json
├── tsconfig.json
└── README.md
```


**## ⚙️ Setup & Installation**

### **1️⃣ Clone repo**
```
git clone https://github.com/likhith1072/Note-Taking-Application.git
cd Note-Taking-Application
```
2️⃣** Install dependencies**

# install backend deps
```
npm install
```

# install frontend deps
```
npm install --prefix client
```

**3️⃣ Environment variables**

Create a .env file in the root:
```
MONGO=mongodb+srv://<your-cluster>/<dbname>
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
SMTP_USER=<your smtp user >
SMTP_PASS=<your smtp password>
SENDER_EMIAL=<your email>
```

Create a .env file in the client:
```
VITE_FIREBASE_API_KEY=<your firebase apikey>
```

**🛠️ Development**

Run server + client separately:

# Run backend (with ts-node + nodemon)
```
npm run dev
```

# Run frontend
```
cd client
npm run dev
```

**📦 Build & Production**

**To build both server and client:
```
npm run build
```
This will:

Compile TypeScript (api/ → dist/)

Build React client (client/dist/)

Place everything ready for deployment

Run production server:
npm start

**🔗 API Endpoints**

Auth

POST /api/auth/signup → signup

POST /api/auth/signin → signin

POST /api/auth/send-otp → for sending otp

POST /api/auth/google → Google Auth

POST /api/auth/signout → signout



Notes

GET /api/note/getnotes → Get all notes for logged in user

GET /api/note/getnote/:noteId → Get a perticular single note 

POST /api/note/create → Create note

PUT /api/note/updatenote/:noteId → Update note

DELETE /api/note/deletenote/:noteId → Delete note

**🌐 Deployment (Render)**

This project is configured to deploy server + client in one service.

Push repo to GitHub

Connect repo to Render

Add Environment Variables (from .env) in Render dashboard

Build command:
```
npm run build
```

Start command:
```
npm start
```

** App will be live at:**

👉 https://note-taking-application-0l99.onrender.com




