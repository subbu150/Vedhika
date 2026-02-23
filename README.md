

# వేదిక — No-Code Event Website & Event Lifecycle SaaS Platform

Vedhika is a full-stack SaaS platform that enables colleges and organizations to create complete event websites and manage the entire event lifecycle without coding.

Organizers can dynamically design event pages, support multiple event modes (online/offline), manage registrations, submissions, showcases, and generate downloadable certificates — all from a single platform.

---

# 🚀 Live Demo

[https://vedhika-1.onrender.com](https://vedhika-1.onrender.com/)

---

# ✨ Core Capabilities

* No-code event website builder
* Multi-mode event lifecycle (Booking → Submission → Showcase)
* Dynamic event page generation
* Certificate generation & downloads
* SaaS multi-event architecture

---

# 📌 Features

## 🧩 No-Code Event Website Builder

Organizers can create full event websites dynamically without coding.

Customizable sections & fields:

* Event banner
* Event logo
* Hero section content
* Description
* Rules & guidelines
* Dates & venue
* Registration fields
* Page sections & layout

Each event automatically becomes its own structured webpage.

---

## 🎭 Event Modes Support

Vedhika supports multiple event types and participation models.

### 🏫 Offline Events

* Venue & schedule management
* Participant registration
* On-site event handling

### 💻 Online Events

* Booking / registration
* File submission
* Project/demo uploads
* Remote participation

### 🖼️ Showcase Mode

* Public submission display
* Gallery / project showcase
* Judges or audience viewing

---

## 📥 Registration & Submissions

* Dynamic registration forms
* Custom participant fields
* File uploads (projects, documents, media)
* Submission deadlines
* Participant tracking

---

## 🏅 Certificate Generation

* Automatic certificate creation
* Participant name injection
* Event name & date
* Downloadable certificates
* Organizer-issued certificates

---

## 📅 Event Lifecycle Management

Events progress through configurable phases:

* Draft
* Published
* Registration
* Submission
* Showcase
* Closed / Completed

---

## 👤 Authentication & Users

* Secure signup & login
* Password reset via email
* JWT authentication
* User dashboards

---

## 🧑‍💼 Organizer Dashboard

* Create event websites
* Manage registrations
* View submissions
* Issue certificates
* Control event modes & phases

---

## 🌐 Public Event Pages

* SEO-friendly event pages
* Public viewing without login
* Responsive design
* Dynamic content rendering

---

## ☁️ Cloud Architecture

* MongoDB Atlas database
* Cloudinary media storage
* Render deployment
* Scalable SaaS backend

---

# 🏗️ Tech Stack

**Frontend**

* React (Vite)
* Dynamic form rendering
* Axios

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

**Cloud & Deployment**

* Render
* MongoDB Atlas
* Cloudinary

**Email**

* Nodemailer

---

# 📂 Project Structure

```
vedhika/
│
├── event-frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
EMAIL_USER=your_email
EMAIL_PASS=your_password
CLIENT_URL=https://vedhika-frontend.onrender.com
```

---

# ▶️ Run Locally

## Clone repo

```
git clone https://github.com/subbu150/vedhika.git
cd vedhika
```

## Backend

```
cd backend
npm install
npm run dev
```

## Frontend

```
cd event-frontend
npm install
npm run dev
```

# 🔐 API Overview

**Auth**

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/forgot-password`
* POST `/api/auth/reset-password`

**Events**

* GET `/api/events`
* POST `/api/events`
* PUT `/api/events/:id`
* DELETE `/api/events/:id`

**Registration & Submission**

* POST `/api/events/:id/register`
* POST `/api/events/:id/submit`
* GET `/api/events/:id/participants`

**Certificates**
* GET `/api/certificates/:eventId/:userId`
  
# 🎯 Unique Value Proposition
Vedhika is not just an event manager.
It is a **no-code event website + lifecycle + participation + certification SaaS** designed for educational institutions and event organizers.
Organizers can launch complete event portals without development effort.

# 🛣️ Future Enhancements
* Payments for paid events
* QR attendance
* Judge scoring panel
* Multi-tenant organizations
* Analytics dashboard
* Email notifications

# 👨‍💻 Author
**Subash Balupunuri**
Vedhika Platform Developer



