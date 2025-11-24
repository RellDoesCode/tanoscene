require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoute');
app.use('/api/users', userRoutes);

const postRoutes = require('./routes/postRoute');
app.use('/api/posts', postRoutes);


const User = require('./models/user');
const Post = require('./models/posts');

app.get('/', (req, res) => {
    res.send('API is running');
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        }
    ,);})
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });