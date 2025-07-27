# ShopEase E-Commerce Platform

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### User Features
- User authentication (register, login, forgot password)
- Product browsing with filtering and searching
- Product details with image gallery and variants
- Product ratings and reviews
- Product FAQs
- Shopping cart functionality
- Wishlist management
- Checkout process with shipping address selection
- Payment integration with Braintree
- Order history and tracking
- User profile management
- Multiple shipping addresses
- Product comparison
- Recently viewed products
- Newsletter subscription
- Social sharing

### Admin Features
- Dashboard with sales analytics
- Product management (add, edit, delete)
- Category management
- Order management
- User management
- Product variant management
- Review moderation

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Bootstrap for styling
- React Icons
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Braintree for payment processing
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/e-commerce-mern.git
cd e-commerce-mern
```

2. Install server dependencies
```
npm install
```

3. Install client dependencies
```
cd client
npm install
```

4. Create .env file in the root directory with the following variables
```
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key
```

5. Create .env file in the client directory
```
REACT_APP_API=http://localhost:8080
```

### Running the Application

1. Start the server (from the root directory)
```
npm run server
```

2. Start the client (from the client directory)
```
npm start
```

3. Access the application at http://localhost:3000

## Project Structure

```
e-commerce-mern/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # React source files
│       ├── components/     # Reusable components
│       ├── context/        # Context API files
│       ├── pages/          # Page components
│       └── styles/         # CSS files
├── config/                 # Configuration files
├── controllers/            # Route controllers
├── helpers/                # Helper functions
├── middlewares/            # Express middlewares
├── models/                 # MongoDB models
├── routes/                 # API routes
└── server.js              # Express server
```

## License
This project is licensed under the MIT License.