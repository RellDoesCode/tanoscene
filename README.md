TANOSCENE – SOCIAL MEDIA WEB APP  
COSC 484 – GROUP 3  

PROJECT OVERVIEW  
TanoScene is a social media web app where users can sign up, log in, make posts, and follow other users. We built this as our final group project for COSC 484 to practice building a complete full stack application.

The code is split into two parts:  
- backend: Node.js / Express API with MongoDB  
- tanoscene-frontend: React app built with Vite  

MAIN FEATURES  
- User signup and login with JWT based authentication  
- Home page that shows your posts and posts from users you follow  
- Create text posts with an optional media file  
- User profiles with bio and recent posts  
- Follow and unfollow other users  
- Settings page to update username and bio  

TECH STACK  

Backend  
- Node.js and Express  
- MongoDB with Mongoose  
- JSON Web Tokens (JWT) for authentication  
- GridFS for media storage

Frontend  
- React with Vite  
- React Router  
- Context based auth provider  
- Axios for API requests  

PROJECT STRUCTURE (TOP LEVEL)  
- backend/              Node / Express API  
- tanoscene-frontend/   React frontend  
- README.md             This file  

PREREQUISITES  
- Node.js (LTS) and npm  
- MongoDB (local instance or remote Atlas cluster)  

ENVIRONMENT VARIABLES  

Backend (.env in backend/)  
- MONGO_URI=your_mongodb_connection_string  
- JWT_SECRET=some_secret_string  
- CLIENT_URL=http://localhost:5173  
- PORT=5000   (optional, defaults to 5000)  

Frontend (.env in tanoscene-frontend/)  
- VITE_API_URL=http://localhost:5000  

If VITE_API_URL is not set, the frontend uses relative URLs and the Vite dev proxy to talk to the backend on port 5000.  

-----------------------------------------  
BACKEND SETUP (LOCAL)  
-----------------------------------------  

1. Open a terminal and go into the backend folder  

   cd backend  

2. Install backend dependencies  

   npm install  

3. Create a .env file in backend/ using the variables listed above  

4. Start MongoDB  
   - For local MongoDB, make sure the Mongo service is running  
   - For Atlas, verify that MONGO_URI points to a valid cluster  

5. Start the backend server  

   npm run dev  

   or  

   node server.js  

The API should now be available at:  

   http://localhost:5000  

MAC PERMISSION NOTE  
On some macOS setups there are permission issues inside node_modules. If scripts fail with a permission error, run these commands from the backend directory:  

   chmod -R 755 .  
   chmod -R +x node_modules/.bin  

Then try npm run dev again.  

-----------------------------------------  
FRONTEND SETUP (LOCAL)  
-----------------------------------------  

1. Open a new terminal and go into the frontend folder  

   cd tanoscene-frontend  

2. Install frontend dependencies  

   npm install  

3. (Recommended) create tanoscene-frontend/.env with  

   VITE_API_URL=http://localhost:5000  

4. Start the frontend dev server  

   npm run dev  

Vite will print a local URL, usually:  

   http://localhost:5173  

Open that URL in your browser.  

-----------------------------------------  
HOW TO USE THE SITE  
-----------------------------------------  

1. Sign up  
   - Click “Sign Up”  
   - Enter a username, email, and password  
   - Submit the form to create an account  

2. Log in  
   - Go to the login page  
   - Enter your username and password  
   - On success you are logged in and redirected into the app  

3. Home feed  
   - The home page shows recent posts  
   - You should see your own posts and posts from users you follow  

4. Create a post  
   - Use the post form at the top of the home page  
   - Type your text content  
   - Optionally choose a media file (image, gif, short video)  
   - Submit the form and the new post should appear in the feed  

5. Follow other users  
   - Visit another user’s profile page  
   - Use the follow button to follow or unfollow  
   - Posts from users you follow will show up in your home feed  

6. Profile page  
   - Your profile shows your username, bio, and posts  
   - You can visit /profile for your own profile  
   - You can visit /profile/:username to view another user’s profile  

7. Settings  
   - Use the settings page to edit your username and bio  
   - Save changes to update your account information  

-----------------------------------------  
KNOWN ISSUES / LIMITATIONS
-----------------------------------------  

- Media uploads  
  Media uploads are wired to GridFS on the backend, but we did not fully debug every edge case. In some environments uploads may be limited or may need additional configuration.

- Time constraints
  Some features from the original proposal (such as direct messaging and deeper profile customization) were cut for time and are planned as future work.

-----------------------------------------  
RUNNING EVERYTHING
-----------------------------------------  

1. Start MongoDB  
2. Start the backend (inside backend/)  

   npm run dev  

3. Start the frontend (inside tanoscene-frontend/)  

   npm run dev  

4. Open the frontend URL (for example http://localhost:5173)  
5. Sign up, log in, and use the app as described above  

-----------------------------------------  
CREDITS  
-----------------------------------------  

COSC 484 – Group 3  

-  Backend and database: Rell Beasley
-  Frontend and UI: Fallon Katz, Lara Moussa, Nick Arellano
-  Documentation and slides: Everyone


