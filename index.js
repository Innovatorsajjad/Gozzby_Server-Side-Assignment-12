const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xps4k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('DB Connected');
        const productCollection = client.db('lowell-parts').collection('products');
        const orderCollection = client.db('lowell-parts').collection('orders');
        const userCollection = client.db('lowell-parts').collection('users');
        const reviewCollection = client.db('lowell-parts').collection('reviews');
      
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = await productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(filter);
            res.send(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})