const express = require('express');
const connect = require('./config/database');
const app = express();
const PORT = 8080;
app.use(express.json());

connect();

app.get('/api/health', (req, res) => {
    res.send('I am alive!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});