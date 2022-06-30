const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Simple Task Manager')
})

app.listen(port, () => {
    console.log(`Task manager app listening on port ${port}`)
})