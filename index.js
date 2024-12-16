const express = require('express');
const connect = require('./config/database');
const bcrypt = require('bcrypt');


const app = express();
const PORT = 8080;
app.use(express.json());

connect();

const saltRounds = 10;

app.get('/api/health', (req, res) => {
    res.send('I am alive!');
});

const User = require('./models/user.model');

// POST - /api/register - create a new user
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        // ensure there is a username and password in the request body
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // implement bcrypt to hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, password: hashedPassword });
        newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});