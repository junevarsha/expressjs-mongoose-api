Terminal tab1:
mongod

Terminal tab2:
cd Desktop/expressJS/
npm install
node crud.js

Terminal tab3
MONGO_URL=mongodb://localhost:27017/dashboard meteor

Kill all existing ports:
lsof -i tcp:3000
lsof -i tcp:27017
kill -9 PID
ps aux | grep node
kill -9 PID
