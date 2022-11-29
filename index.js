const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//mongodb
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pauaaue.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("car-wash").collection("services");
    const orderCollection = client.db("car-wash").collection("orders");

    //create api for getting  data from mongodb
    //getting all data
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);

      res.send(service);
    });
    //get specific data from mongodb

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    //orders api for all data
    app.get("/orders", async (req, res) => {
      console.log(req.query.email); //email searching
      // for email searching and order product
      //query system for data load
      let query = {};

      //check email and have then the change the query
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      //order collection e find korbo qurey diye
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray(); //get order
      res.send(orders);
    });

    //create api for orders cause different db for this
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    //for update or approved or pending
    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status; //body te request pathabo
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status, //set status
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    //for delete
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("car-wash server is running");
});

app.listen(port, () => {
  console.log(`car-wash-server on the ${port}`);
});
