const express = require('express')
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3kvya.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const tasksDatabase = client.db('simple_task_manager').collection('tasks');

        app.get('/tasks', async (req, res) => {
            const query = { state: undefined };
            const cursor = tasksDatabase.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/tasks', async (req, res) => {
            const data = req.body;
            const result = await tasksDatabase.insertOne(data);
            res.send(result);
        });

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const data = req.body;
            console.log(data)
            const options = { upsert: true };
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    state: data.state
                },
            };
            const result = await tasksDatabase.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.put('/editedTasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const data = req.body;
            console.log(data)
            const options = { upsert: true };
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    task: data.task
                },
            };
            const result = await tasksDatabase.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.get('/completedTasks', async (req, res) => {
            const query = { state: "completed" };
            const cursor = tasksDatabase.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Simple Task Manager')
})

app.listen(port, () => {
    console.log(`Task manager app listening on port ${port}`)
})