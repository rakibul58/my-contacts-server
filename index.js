const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { query } = require('express');

const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bebjeyw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    });
}


async function run() {

    try {
        // collections
        const contactsCollection = client.db("myContacts").collection("contacts");
        
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;

            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '7d' });
            return res.send({ accessToken: token });

        });




    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', async (req, res) => {
    res.send('My Contact server is running')
});

app.listen(port, () => {
    console.log(`My Contact Server is running on ${[port]}`);
});