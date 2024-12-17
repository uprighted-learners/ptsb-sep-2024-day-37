const express = require('express');
const connect = require('./config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 8080;
app.use(express.json());

connect();

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;

app.get('/api/health', (req, res) => {
    res.send('I am alive!');
});

const User = require('./models/user.model');

// middleware function to check json web token authentication
const authenticateToken = (req, res, next) => {
    try {
        // get the token from the request headers
        const token = req.headers['authorization'];

        // check if token exists
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - no token provided' });
        }

        // verify the token
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden - invalid token' });
            }
            req.user = user;
            next();
        })
    } catch (error) {
        console.log(error);
    }
}

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

        // create a new user
        const newUser = new User({ username, password: hashedPassword });

        // save the user to the database
        newUser.save();

        // return a success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error);
    }
});

// POST - /api/login - login a user
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // find the user in the database
        const user = await User.findOne({ username });

        // if the user doesn't exist, return an error
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        // if the user exists, compare the password
        const isMatch = await bcrypt.compare(password, user.password)

        // if the password is incorrect, return an error
        if (!isMatch) {
            return res.status(401).send('Invalid password');
        }

        // if the password is correct, return a token
        const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.log(error);
    }
})

// GET - /api/protected - protected route
app.get("/api/protected", authenticateToken, (req, res) => {
    try {
        res.json({ message: 'Protected route accessed successfully' });
    } catch (error) {
        console.log(error);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});