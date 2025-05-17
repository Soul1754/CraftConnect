# CraftConnect

CraftConnect is a full-stack platform connecting customers with skilled professionals for a variety of services. The project features a Node.js/Express backend and a React frontend, supporting booking, payment, OTP verification, and review flows.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Community](#community)
  - [Bookings](#bookings)
  - [Payments](#payments)
  - [Reviews](#reviews)
  - [Analytics](#analytics)

## Project Overview

CraftConnect is a platform designed to connect customers with skilled professionals for various services. The application allows customers to post service requests, receive quotations from professionals, book services, make secure payments, and leave reviews. Professionals can browse nearby service requests, submit quotations, manage bookings, and receive payments.

## Project Structure

```
CraftConnect/
├── Backend/
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Models/
│   ├── Routes/
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- OTP verification system

### Frontend
- React.js
- React Router
- Tailwind CSS
- Vite

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication

**Base URL**: `/api/auth`

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/register-professional` | POST | Register a new professional account | No |
| `/register-customer` | POST | Register a new customer account | No |
| `/send-otp` | POST | Send OTP for account verification | No |
| `/resend-otp` | POST | Resend OTP if expired | No |
| `/verify-otp` | POST | Verify OTP code | No |
| `/login` | POST | User login (both professional and customer) | No |
| `/complete-profile` | POST | Complete user profile after registration | Yes |
| `/bank-details` | GET | Get professional's bank details | Yes |
| `/bank-details` | PUT | Save or update professional's bank details | Yes |

### Community

**Base URL**: `/api/community`

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/posts` | POST | Create a new service request post | Yes |
| `/user-posts` | GET | Get all posts created by the authenticated customer | Yes |
| `/accept-quotation` | POST | Accept a quotation from a professional | Yes |
| `/complete-post` | POST | Mark a post as completed | Yes |
| `/nearby-posts` | GET | Get service request posts near the professional's location | Yes |
| `/submit-quotation` | POST | Submit a quotation for a service request | Yes |
| `/quotation/:replyId` | GET | Get details of a specific quotation | Yes |

### Bookings

**Base URL**: `/api/bookings`

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/create` | POST | Create a new booking from an accepted quotation | Yes |
| `/user/:userType` | GET | Get all bookings for a user (as customer or professional) | Yes |
| `/:bookingId` | GET | Get details of a specific booking | Yes |
| `/:bookingId/status` | PUT | Update the status of a booking | Yes |
| `/send-completion-otp` | POST | Send OTP for work completion verification | Yes |
| `/mark-done` | POST | Mark a booking as completed with OTP verification | Yes |
| `/submit-review` | POST | Submit a review for a completed booking | Yes |

### Payments

**Base URL**: `/api/payments`

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/create-order` | POST | Create a payment order | Yes |
| `/verify` | POST | Verify a completed payment | Yes |
| `/history` | GET | Get payment history for a customer | Yes |
| `/create-contact` | POST | Create a contact for professional payout | Yes |
| `/create-fund-account` | POST | Create a fund account for professional | Yes |
| `/initiate-payout` | POST | Initiate payout to a professional | Yes |

### Reviews

**Base URL**: `/api/reviews`

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/professional` | GET | Get all reviews for the authenticated professional | Yes |
| `/customer` | GET | Get all reviews submitted by the authenticated customer | Yes |

### Analytics

**Base URL**: `/api/analytics`

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/professional/summary` | GET | Get summary analytics for a professional | Yes |
| `/professional/bookings` | GET | Get booking trends for a professional | Yes |
| `/professional/revenue` | GET | Get revenue analysis for a professional | Yes |
