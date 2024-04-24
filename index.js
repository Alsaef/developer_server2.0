const express = require('express')
const app = express()
require('dotenv').config()
const port =process.env.PORT || 3000
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
var cors = require('cors')
app.use(cors())
app.use(express.json());
// 
// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.hwuf8vx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("projectsDB");
    const projects = database.collection("projects");
    app.get("/projects",async(req,res)=>{
        try {
            const result=await projects.find().toArray()
            res.status(200).send(result)  
        } catch (error) {
           console.log(error) ;
          await res.status(504).send(error)
        }
    })
    app.get('/projects/:id',async(req,res)=>{
        const id= req.params.id
        const query = { _id: new ObjectId(id)};
        const result= await projects.findOne(query)
        res.send(result)
    })

    app.post('/post',async(req,res)=>{
      const project =req.body;
      const result=await projects.insertOne(project)
      res.status(200).send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})