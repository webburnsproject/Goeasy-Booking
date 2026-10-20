<div align="center">

# 🚗 GoEasy Travels & Fleet Rentals

**Fullstack Vehicle Rental & Commercial Outstation Fleet Marketplace**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Cloud-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern fullstack web platform connecting travelers with verified commercial fleet operators across India. Features **2-stage Aadhaar/PAN KYC verification**, **8-point physical vehicle inspection**, **direct operator settlement without convenience fees**, real-time dispatch with driver allocation, and automated WhatsApp/call customer communication.

[Client Handover Guide](CLIENT_HANDOVER.md) • [Report Bug](https://github.com/webburnsproject/Goeasy-Booking/issues) • [Request Feature](https://github.com/webburnsproject/Goeasy-Booking/issues)

</div>

---

## 📸 Key Features

### 🧳 Customer Experience
* **Interactive Outstation Search**: Filter by pickup city, dropoff destination, travel dates, and vehicle seating capacity (4, 7, 12, 17+ seater).
* **8-Point Vehicle Inspector**: High-resolution exterior (Front, Rear, Left, Right) and interior (Dashboard, Seats, Odometer, Number plate) verification before booking.
* **Direct Settlement**: Direct UPI, bank transfer, or cash settlement with verified fleet operators with no middleman gateway fees.
* **Live Stepper Tracker**: Step-by-step progress tracking with animated state-connected arrows.
* **Instant Operator Contact**: 1-click WhatsApp chat link with pre-filled reservation details and direct phone call links.

### 🏢 Fleet Operator Portal
* **Gated Registration**: New owner accounts require Super Admin approval prior to accessing the portal.
* **KYC Compliance Hub**: Direct Aadhaar and PAN document upload for regulatory compliance.
* **Fleet Management**: Upload RC documents, insurance policies, condition photos, and toggle listing visibility (`Active` / `Hidden`).
* **Driver Dispatch**: Confirm reservations and assign specific driver names and phone numbers.
* **Agency Branding**: Manage agency name, operating cities, GSTIN, description, and upload custom agency logos.

### 🛡️ Super Admin Management Console
* **Stage 1 Verification**: Review initial commercial fleet partner signups and grant portal access.
* **Stage 2 Verification**: Inspect uploaded Aadhaar and PAN documents before authorizing fleet listings.
* **Vehicle Inspection Clearance**: Audit vehicle photos and commercial documents before making vehicles searchable.
* **Customer & Operator Directory**: Suspend, activate, or manage user accounts and global reservations.
* **1-Click Test Data Seeder**: Built-in test data seeding to reset and test the platform with realistic Indian fleets.

---

## 🏗️ Architecture & Technology Stack

```
Goeasy-Booking/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB, Redis, Cloudinary configuration
│   │   ├── controllers/     # Auth, Owner, Vehicle, Booking, Admin controllers
│   │   ├── middleware/      # JWT auth, role authorization, upload, error handler
│   │   ├── models/          # Mongoose schemas (User, Vehicle, Booking)
│   │   ├── routes/          # RESTful Express route handlers
│   │   ├── utils/           # Database seeder and email service
│   │   └── server.js        # Express application entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, VehicleCard, Modals
│   │   ├── context/         # AuthContext with sync localStorage hydration
│   │   ├── pages/           # Landing, Auth, Dashboards, KYC, Profile
│   │   ├── services/        # Fetch API service layer
│   │   ├── App.jsx          # Path-based routing and navigation
│   │   └── index.css        # Vanilla CSS Design System & Responsive Tokens
│   ├── index.html
│   └── vite.config.js
├── CLIENT_HANDOVER.md       # Client delivery and operational documentation
├── .env.example             # Environment variables template
└── README.md
```

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | Component-driven SPA with path-based routing |
| **Styling** | Vanilla CSS (Tokens) | Glassmorphism, CSS clamp typography, responsive breakpoints |
| **Icons** | Lucide React | Modern feather icon family |
| **Backend API** | Node.js, Express | Modular RESTful API architecture |
| **Database** | MongoDB Atlas, Mongoose | Relational document modeling with schema validation |
| **Caching** | Redis Cloud (ioredis) | Query caching with automatic memory cache fallback |
| **File Storage** | Cloudinary | Cloud document and vehicle image storage with disk fallback |
| **Email Alerts** | Nodemailer (SMTP) | Automated transactional notifications |
| **Authentication** | JWT, bcryptjs | Stateless token auth with salted password hashing |

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/webburnsproject/Goeasy-Booking.git
cd Goeasy-Booking
```

### 2. Configure Environment Variables
Copy `.env.example` into both root and backend directories:
```bash
cp .env.example backend/.env
```
Fill in your credentials (or use the pre-configured defaults for local testing):
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URI=your_redis_connection_string (optional)
CLOUDINARY_URL=your_cloudinary_url (optional)
```

### 3. Start Backend Server
```bash
cd backend
npm install
node src/server.js
# Backend runs on http://localhost:5000
```

### 4. Start Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Seed Test Data (Optional)
To populate realistic test data (vehicles, owners, bookings, admins):
```bash
cd backend
node src/utils/seedRunner.js
# Or click "Reset & Seed MVP Test Data" inside Super Admin Dashboard!
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@goeasy.com` | `Admin@12345` | Master console & KYC approvals |
| **Fleet Partner (Delhi)** | `sharma.travels@goeasy.com` | `Owner@12345` | Active fleet, Innovas & Ertigas |
| **Fleet Partner (Bengaluru)** | `venkat.tours@goeasy.com` | `Owner@12345` | Active fleet, Force Urbania & Tempo |
| **Customer** | `user@goeasy.com` | `User@12345` | Active reservations & tracker |

---

## 🌐 API Reference

### Authentication & Profiles (`/api/auth`)
* `POST /register-user` — Register customer account
* `POST /login-user` — Authenticate customer
* `POST /register-owner` — Register commercial owner account
* `POST /login-owner` — Authenticate commercial owner
* `POST /login-admin` — Super admin authentication
* `GET /me` — Verify session and fetch current profile
* `PUT /profile` — Update account profile details & upload custom logo/avatar

### Fleet Partner Operations (`/api/owner`)
* `GET /profile` — Fetch partner profile & metrics
* `POST /kyc` — Submit Aadhaar & PAN documents
* `GET /vehicles` — Fetch operator's fleet listings
* `POST /vehicles` — Register vehicle with RC, insurance, and 8-point condition photos
* `PATCH /vehicles/:id/allocation` — Toggle active booking visibility
* `GET /bookings` — Fetch customer reservation requests
* `PATCH /bookings/:id/status` — Confirm, assign driver, update payment status

### Vehicles & Public Discovery (`/api/vehicles`)
* `GET /search` — Search verified vehicles by route, date, and seating capacity
* `GET /:id` — Detailed vehicle specifications, 8-point inspection, and owner details

### Bookings (`/api/bookings`)
* `POST /` — Create trip reservation
* `GET /my-bookings` — Customer reservation history & tracker
* `PATCH /:id/cancel` — Cancel pending booking

### Super Admin Console (`/api/admin`)
* `GET /dashboard-stats` — Global revenue volume, active fleets, and metrics
* `GET /pending-owners` — Pending initial owner registrations
* `PATCH /owners/:id/approval` — Stage 1 approval (grant login access)
* `GET /pending-kyc` — Stage 2 KYC verification queue
* `PATCH /owners/:id/kyc-approval` — Stage 2 KYC authorization
* `GET /pending-vehicles` — Vehicles awaiting physical inspection approval
* `PATCH /vehicles/:id/approval` — Approve vehicle for search visibility
* `POST /seed-data` — Reset and seed database with sample fleet records

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
