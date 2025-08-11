# 🛒 MERN Stack E-Commerce App

This is a fully functional **E-Commerce web application** built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It includes features like product listings, authentication, cart, orders, admin dashboard, and payment integration with Braintree.

---

## 🚀 Live Demo

- 🔗 https://luxury-begonia-e4acf2.netlify.app/

---

## 📸 Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d96a6655-2abc-49f1-9b70-f389ec7df5e6" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/62f119a6-0956-42cf-ba30-38b531795f69" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/457ec450-8636-4545-a3ec-6d3890d49633" />




---

## 🧰 Tech Stack

- **Frontend:** React.js, Bootstrap, Axios, React Router DOM, React Toastify
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Payment Gateway:** Braintree
- **Deployment:** Netifly + Render (Frontend + Backend)
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** React Context API

---

## 📦 Features

### 👤 User
- Register/Login with JWT authentication
- View products with filters by category and price
- Add to cart and checkout with Braintree payment
- View orders

### 🛠️ Admin
- Admin Dashboard
- Create/Update/Delete Categories
- Create/Update/Delete Products
- Manage Orders

---

## 📁 Folder Structure
root/
├── client/ --> React frontend
├── backend/ --> Express backend


---

## 🔧 Environment Variables

Create a `.env` file in the root:

```env
PORT=8080
MONGO_URL=your_mongo_uri
JWT_SECRET=your_jwt_secret
BRAINTREE_MERCHANT_ID=your_id
BRAINTREE_PUBLIC_KEY=your_key
BRAINTREE_PRIVATE_KEY=your_key


📦 How to Run Locally
1. Clone the Repo
bash
Copy
Edit
git clone https://github.com/locifer18/mern-ecommerce-project.git
cd e-commerce-mern
2. Install Backend Dependencies
bash
Copy
Edit
cd api
npm install
3. Install Frontend Dependencies
bash
Copy
Edit
cd ../client
npm install
4. Run the App
bash
Copy
Edit
cd ..
npm run dev

🌐 Deployment
Frontend deployed on netifly

Backend deployed on Render

📞 Contact
Email: anshkanda08@gmailcom

LinkedIn: www.linkedin.com/in/ansh-kanda-75995a244

⭐ Credits
Special thanks to open-source tools and the developer community.

🙌 Support
Leave a ⭐️ if you liked it, and feel free to fork or raise issues
