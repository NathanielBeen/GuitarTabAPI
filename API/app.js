const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db');
const createdb = require('./createdb');

db.connectToDb((err) =>{
    if (err){
        console.log('unable to connect to db');
        process.exit(1);
    }
    else{
        createdb.createDatabase();
    }
});

/*const db = require('./db');
const songRoutes = require('./routes/songRoute');
const userRoutes = require('./routes/userRoute');
const tagRoutes = require('./routes/tagRoute');
const ratingRoutes = require('./routes/ratingRoute');
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested_With, Content_Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use("/songs", songRoutes);
app.use("/users", userRoutes);
app.use("/tags", tagRoutes);
app.use("/ratings", ratingRoutes);

db.connectToDb((err) =>{
    if (err){
        console.log('unable to connect to db');
        process.exit(1);
    }
    else app.listen(process.env.PORT || 3000);
});

module.exports = app;*/