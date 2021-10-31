const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middle order 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m7jsy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('bookCenter');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

// Get api 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        })
// Get single api 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

// post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
     
            const result = await servicesCollection.insertOne(service)
            // console.log(result);
            res.json(result)
        })
        // Delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })
        // Add Order 
        app.post("/addOrder", (req, res) => {
            console.log(req.body);
            ordersCollection.insertOne(req.body)
                .then(result => {
                res.send(result);
                })
            
            // Get Orders 
            app.get("/myOrders/:email", async (req, res) => {
                console.log(req.params.email);
                const result = await ordersCollection.find({ email: req.params.email }).toArray();
                res.send(result);
            })
            // Delete Order 
            app.delete("/myOrders/:id", async (req, res) => {
                const id = req.params.id;
                const query = {_id: ObjectId(id)}
                const result = await ordersCollection.deleteOne(query);
                console.log(result);
            })
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})