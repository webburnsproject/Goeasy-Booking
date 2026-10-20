# 🚗 GoEasy Travels — Client Handover & Platform Delivery Documentation

**Project Name**: GoEasy Travels & Fleet Rentals Platform  
**Delivery Date**: October 2026  
**Status**: Ready for Production / MVP Deployment  
**Delivered By**: Webburns Development Team  

---

## 📋 Executive Summary

**GoEasy Travels** is a fullstack commercial vehicle rental and outstation fleet marketplace built specifically for the Indian travel and tourism sector. The platform eliminates third-party payment gateway convenience fees by empowering direct operator settlements, while enforcing strict **2-stage admin verification** (Aadhaar, PAN, RC, and physical vehicle inspection) to protect customers from fraudulent operators.

The application has been engineered with a modern, glassmorphic user interface optimized for **desktop, tablet, and mobile devices**.

---

## 👥 Portals & User Roles

### 1. 🧳 Customer (User) Portal
- **Fleet Discovery**: Search outstation rentals by pickup location, dropoff destination, travel dates, and vehicle seating capacity (4, 7, 12, 17+ seater).
- **8-Point Vehicle Inspector**: Inspect verified high-resolution photographs of Front, Rear, Left side, Right side, Passenger interior, Cockpit dashboard, Odometer reading, and Number plate before confirming reservations.
- **Direct Settlement (Zero Gateway Fees)**: Transparent pricing without hidden platform commissions.
- **Reservation Tracker**: Live status pipeline (`Request Created` ➔ `Owner Review` ➔ `Driver Allocated` ➔ `Trip Completed`) with connected indicator arrows.
- **Direct Communication**: 1-click **WhatsApp Chat**, direct **Phone Call**, and automated booking email receipt.
- **Profile & Account Management**: Manage personal contact details and upload customized avatar photos at `/profile`.

### 2. 🏢 Vehicle Owner / Fleet Partner Portal
- **Owner Registration & Approval Gate**: Commercial owners submit agency details and proposed fleet size. Accounts remain locked until Super Admin review.
- **KYC Verification Hub (`/owner-kyc`)**: Upload Aadhaar Card and PAN Card for identity and compliance verification.
- **Fleet Management (`/owner-dashboard`)**:
  - Add vehicles with RC document, insurance policy, and 8-point physical condition report.
  - One-click vehicle booking visibility toggle (`Active & Searchable` vs `Hidden / Inactive`).
- **Booking Dispatch & Allocation**:
  - Receive booking notifications with customer phone and email.
  - Confirm reservations and assign specific driver names and contact numbers.
  - 1-click WhatsApp customer contact with pre-filled reservation greetings.
  - Internal payment settlement tracker (mark bookings as Paid/Settled).
- **Agency Branding & Profile (`/profile`)**:
  - Manage Agency Name, Operating Base City, GSTIN registration, and Agency Bio.
  - Upload custom agency logo with live preview and header branding.

### 3. 🛡️ Super Admin Management Console (`/admin-dashboard`)
- **Stage 1: Owner Account Approval**: Review pending partner registrations; approve or reject login access.
- **Stage 2: KYC Verification**: Inspect submitted Aadhaar & PAN documents before granting vehicle listing authorization.
- **Vehicle Inspection Clearance**: Verify 8-point exterior/interior photos, RC document, and motor insurance before vehicles appear in customer searches.
- **Master Fleet & Customer Directory**: Search, activate, suspend, or remove users and fleet partners.
- **Global Booking Oversight**: View all reservation activity across all operators with real-time status metrics.
- **1-Click Test Data Seeder**: Built-in database reset and population tool for instant staging demonstrations.

---

## 🔑 Pre-Configured Demo Credentials

All test accounts are pre-seeded and ready for immediate demonstration:

| Role | Account Name | Login Email | Password | Status / Access |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Platform Admin | `admin@goeasy.com` | `Admin@12345` | Full administrative console |
| **Fleet Owner (Verified)** | Venkateshwara Tours | `venkat.tours@goeasy.com` | `Owner@12345` | Active fleet, KYC verified |
| **Fleet Owner (Delhi)** | Sharma Outstation | `sharma.travels@goeasy.com` | `Owner@12345` | Active fleet, Innovas & Ertigas |
| **Fleet Owner (Pending KYC)** | Vikram Rentals | `vikram.rentals@goeasy.com` | `Owner@12345` | Aadhaar/PAN submitted for review |
| **Fleet Owner (Unapproved)** | Sunil Goa Cabs | `sunil.goa@goeasy.com` | `Owner@12345` | Login blocked (*Pending Approval*) |
| **Customer 1** | Rohan Mehta | `user@goeasy.com` | `User@12345` | Customer dashboard & reservations |
| **Customer 2** | Priya Sharma | `priya.sharma@gmail.com` | `User@12345` | Customer dashboard & bookings |

---

## 🌐 Application URL Directory

| Route Path | View / Portal Description | Access Role |
| :--- | :--- | :--- |
| `/` | Live Fleet Search & Discovery | Public / Customer |
| `/popular-routes` | Outstation Highways & Tourist Corridors | Public / Customer |
| `/user-auth` | Customer Login & Registration | Public / Customer |
| `/user-dashboard` | Customer Booking Tracker & Driver Details | Logged-in Customer (`user`) |
| `/owner-auth` | Commercial Fleet Partner Login & Register | Commercial Partner (`owner`) |
| `/owner-dashboard` | Fleet Operations, Bookings, & Dispatch | Commercial Partner (`owner`) |
| `/owner-kyc` | Aadhaar & PAN Compliance Verification | Commercial Partner (`owner`) |
| `/profile` | Profile, Agency Branding, & Logo Management | Customer & Fleet Owner |
| `/admin-login` | Dedicated Super Admin Portal | Administrator (`admin`) |
| `/admin-dashboard` | Master Console (KYC, Fleet Clearances) | Administrator (`admin`) |

---

## ⚙️ Deployment & Server Setup

### Prerequisites
- **NodeJS** (v18.x or v20.x recommended)
- **MongoDB Atlas** or local MongoDB instance
- **Redis Cloud** (or local Redis, fallback cache included)
- **Cloudinary Account** (for cloud image storage, fallback disk storage included)

### 1. Backend Server Deployment
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp ../.env.example .env
# Edit .env with your production credentials

# Run database seeder (optional for demo data)
node src/utils/seedRunner.js

# Start backend server
node src/server.js
# Production with PM2: pm2 start src/server.js --name "goeasy-backend"
```

### 2. Frontend Application Deployment
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# Preview build locally
npm run preview
# Serve dist/ via Nginx, Vercel, or AWS S3 + CloudFront
```

---

## 🔒 Security & Performance Features
- **JWT Authentication**: Secure stateless tokens with 30-day persistence.
- **Password Protection**: Passwords salted and hashed with `bcryptjs` (cost factor 10).
- **Rate Limiting**: Protection against brute-force login and API abuse (`express-rate-limit`).
- **Security Headers**: Standard HTTP security headers via `helmet`.
- **CORS Restricted**: API requests restricted to authorized frontend domains.
- **Fast Caching**: Redis caching on search queries with automatic fallback to high-speed memory cache.

---

## 📞 Support & Maintenance
For technical inquiries, feature extensions, or infrastructure deployment assistance, please contact the Webburns engineering team.
