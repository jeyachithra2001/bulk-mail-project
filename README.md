# Bulk Mail Application

A full-stack bulk email app built with React + Vite, Node.js + Express, MongoDB + Mongoose, and Nodemailer.

## Features
- Admin login (credentials stored in backend environment variables)
- Send one email to multiple recipients
- Recipient validation and send success/failure feedback
- Email history stored in MongoDB
- JWT-protected API routes

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas account
- Gmail account with 2-Step Verification and a Gmail App Password (or another SMTP provider)

## 1. Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/bulk_mail_app
JWT_SECRET=replace_this_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_16_character_app_password
MAIL_FROM_NAME=Bulk Mail App
```

For Gmail, create an App Password in your Google Account after enabling 2-Step Verification. Use the app password in `SMTP_PASS`, not your normal Gmail password. Do not commit `.env` to GitHub.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## 3. Login

Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `backend/.env`.

## 4. How to send

- Enter recipient addresses separated by commas, semicolons, spaces, or new lines.
- Enter a subject and email message.
- Click **Send bulk email**.
- The app sends one email per recipient and records each result in MongoDB.

## Important notes
- Test with your own email address first.
- Gmail and other providers enforce sending limits and anti-spam rules. Do not use this app for unsolicited email.
- This starter project sends plain-text email. You can extend it to support HTML templates, CSV uploads, attachments, rate limiting, and user management.
- The admin login is intentionally a simple single-admin implementation. For production, add HTTPS, rate limiting, password hashing/rotation, audit logging, and stronger session management.
