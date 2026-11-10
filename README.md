# Bulk Mail Application

A full-stack **Bulk Mail Application** built using the MERN stack that allows users to register, log in, send emails to multiple recipients, and track email delivery results through an interactive dashboard.

## Project Overview

The Bulk Mail Application simplifies sending emails to multiple recipients in a single process. Users can create an account, securely log in, compose email messages, enter multiple recipient addresses, and monitor sending status through email history.

## Technologies Used

**Frontend**
- React.js
- Vite
- JavaScript
- Axios
- CSS
- Lucide React Icons

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt.js
- Nodemailer

## Features

- User Registration with Email and Password
- Secure Login and Authentication
- Password Hashing using Bcrypt.js
- JWT-Based Protected Routes
- Responsive Bulk Mail Dashboard
- Send Emails to Multiple Recipients
- Recipient Email Validation
- Duplicate Email Address Removal
- SMTP Integration using Nodemailer
- Individual Email Sending Status
- Success and Failure Notifications
- Email Campaign History
- Total Campaigns, Sent Emails and Failed Emails Statistics
- MongoDB Atlas Cloud Database Integration
- Logout Functionality

## Project Structure

```text
Bulk-Mail-App/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Email.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── emailRoutes.js
│   │   └── middleware/
│   │       └── requireAuth.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jeyachithra2001/bulk-mail-project.git
```

Navigate to the project folder:

```bash
cd Bulk-Mail-App
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure the following environment variables:

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true

SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

MAIL_FROM_NAME=Bulk Mail App
```

**MongoDB Atlas Configuration:**

1. Create a MongoDB Atlas account.
2. Create a free database cluster.
3. Create a database user.
4. Configure Network Access.
5. Select Connect → Drivers.
6. Copy your MongoDB connection string.
7. Add the connection string to `MONGODB_URI`.

**Gmail SMTP Configuration:**

1. Enable 2-Step Verification in your Google Account.
2. Generate a Gmail App Password.
3. Add your Gmail address to `SMTP_USER`.
4. Add your generated App Password to `SMTP_PASS`.

Never upload your `.env` file or expose your credentials on GitHub.

### 3. Start the Backend Server

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder if required:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal, normally:

```text
http://localhost:5173
```

## How to Use the Application

1. Open the Bulk Mail Application.
2. Register using your own email address and password.
3. Log in using your registered credentials.
4. Access the Bulk Mail Dashboard.
5. Enter multiple recipient email addresses.
6. Provide the email subject and message.
7. Click the **Send Bulk Email** button.
8. View the success and failure status of email sending.
9. Check previous campaigns in the Email History section.
10. Log out securely when finished.

**Note:** The application supports up to 100 unique recipients per batch. SMTP provider sending limits may also apply.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/emails/send` | Send bulk emails |
| GET | `/api/emails/history` | Retrieve email history |
| GET | `/api/emails/history/:id` | Retrieve a specific email record |

Email sending and history endpoints require JWT authentication.

## Database

MongoDB Atlas is used as the cloud database.

**Collections:**

- `users` – Stores registered user accounts and hashed passwords.
- `emails` – Stores email campaign details, recipient information, and sending status.

## Future Enhancements

- CSV File Upload for Recipient Lists
- HTML Email Templates
- Email Attachments
- Advanced Campaign Analytics
- Improved User and Access Management

## Security

- Passwords are hashed using Bcrypt.js.
- JWT authentication protects private API routes.
- Sensitive credentials are maintained in environment variables.
- Recipient email addresses are validated before sending.

## Author

**Jeya chithra**
**Developed as a Full Stack Web Development Project.**




