# Q&A Forum with User Accounts & Profiles

A full-stack web application that enables developers to post questions, share knowledge, and earn points through community engagement. Built using the MERN stack with comprehensive testing and security features.

## 🚀 Features

- **User Authentication**
  - JWT-based authentication system
  - Google OAuth integration
  - Secure HTTP-only cookies
  - Password encryption

- **Question & Answer System**
  - Post questions with titles and detailed descriptions
  - Comment on posts
  - Upvote helpful answers
  - Search functionality for existing questions

- **Profile Management**
  - Customizable user profiles
  - Profile picture management
  - Email and password updates
  - View personal post history

- **Points System**
  - Earn points for correct answers
  - Track user contributions
  - Gamified knowledge sharing

## 🛠️ Tech Stack

- **Frontend:**
  - React.js
  - Tailwind CSS
  - Material UI
  - JWT for authentication

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Google OAuth API

- **Testing & Development:**
  - Mocha.js & Chai for API testing
  - Figma for UI/UX design
  - Git for version control

## 📦 Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies for both frontend and backend
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd client
npm install
```

3. Set up environment variables
```bash
# Create .env file in server directory
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Run the development servers
```bash
# Backend server
cd server
npm run dev

# Frontend client
cd client
npm start
```

## 🔐 API Documentation

### Authentication Routes

#### POST /login
- Login with username and password
- Returns JWT token and user object

#### POST /register
- Register new user with username, email, and password
- Returns JWT token and user object

#### POST /logout
- Logout user and clear cookies

#### GET /oauth/google
- Google OAuth authentication
- Creates new user account if first-time login

### Profile Routes

#### GET /profile
- Fetch user's posts, saved posts, and statistics

#### PATCH /profile/password
- Update user password

#### PATCH /profile/email
- Update user email

#### PATCH /profile/picture
- Update profile picture

#### DELETE /profile
- Delete user account

### Post Routes

#### GET /post
- Fetch all posts with pagination

#### GET /post/:id
- Fetch specific post by ID

#### GET /post/search
- Search posts by text

#### POST /post
- Create new post

#### PATCH /post/:id/comment
- Add comment to post

#### PATCH /post/:id/upvote
- Upvote post or comment

## 🔍 Testing

The application includes comprehensive API testing using Mocha.js and Chai:

```bash
# Run tests
cd server
npm test
```

## 🔒 Security Features

- JWT authentication
- HTTP-only cookies
- Database encryption
- Input validation
- OAuth integration

## 💡 Future Improvements

- Real-time notifications
- Advanced search filters
- Community moderation tools
- Content categorization
- Mobile application


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👥 Author

Edward Akapo - https://edwardakapo.com/

---
Built with ❤️ using the MERN stack 
