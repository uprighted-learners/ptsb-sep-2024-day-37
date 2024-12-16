const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.send('I am alive!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});