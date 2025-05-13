# CraftConnect

CraftConnect is a full-stack platform connecting customers with skilled professionals for a variety of services. The project features a Node.js/Express backend and a React frontend, supporting booking, payment, OTP verification, and review flows.

## Features

- User authentication (JWT-based)
- Service listing and booking
- OTP verification for secure bookings
- Payment integration with Razorpay
- Professional payout management
- Review and rating system
- Admin and user dashboards

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

## Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

## Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

- Register as a customer or professional
- Browse and book services
- Complete OTP verification for bookings
- Make payments securely via Razorpay
- Professionals can manage payouts
- Submit and view reviews after service completion

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Authenticate a user and return a token.

### Booking

- **POST /api/bookings**: Create a new booking.
- **GET /api/bookings/:id**: Retrieve booking details by ID.
- **PUT /api/bookings/:id**: Update booking details.

### Payments

- **POST /api/payments/createOrder**: Create a payment order for a booking.
- **POST /api/payments/verify**: Verify payment and update booking status.

### Reviews

- **POST /api/reviews**: Submit a review for a completed booking.
- **GET /api/reviews/:id**: Retrieve reviews for a specific booking.

### Users

- **GET /api/users/:id**: Retrieve user profile information.
- **PUT /api/users/:id**: Update user profile information.
