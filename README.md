PRE-REQUISITE TO RUN THE APP
1. Make sure you've prepared you MongoDB database wether on your local machine (MongoDB Compass) or cloud (MongoDB Atlas) so you can fill the required variables on server's .env file.

FOR CLIENT
1. Install all dependencies using "npm i" command on your terminal,
2. Create .env file inside client folder. Add variable VITE_API_URL with value of your running local server url. For example, VITE_API_URL=http://localhost:8888
3. Run the client using "npm run dev" command on your terminal.

FOR SERVER
1. Install all dependencies using "npm i" command on your terminal,
2. Create .env file inside server folder and add several variables in it. For example:
   DB_PORT=28018
   DB_HOST=localhost
   DB_NAME=yourdbname
   SECRET_KEY=yoursecretkey
   CLIENT_DOMAIN=http://localhost:5173
   RUNNING_PORT=8888
4. Run the server using "npm run dev" command on your terminal.
