// photography-site-pass
const express = require('express')
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
require('dotenv').config()

const port = 5000
console.log(process.env.DB_USER)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bd9js.mongodb.net/Photography?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceDB = client.db("Photography").collection("services");
    const reviewDB = client.db("Photography").collection("reviews");
    const selectDB = client.db("Photography").collection("selected");
    const adminDB = client.db("Photography").collection("adminDB");
    console.log("data")

    // ********************************************************** add data local storage to mongoDb *********************

    // app.post("/reviews", (req, res) => {
    //     const product = req.body
    //     console.log(product)
    //     reviewDB.insertMany(product)
    //         .then(result => {
    //             console.log(result.insertedCount)
    //             res.send(result.insertedCount)
    //         })
    // })

    // ************************************************************ get all service from mongodb *************************

    app.get("/services", (req, res) => {
        serviceDB.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // **************************************************************** get all  reviews from mongodb **************** 

    app.get("/reviews", (req, res) => {
        reviewDB.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // **************************************************************  collect single data from serviceDB **************

    app.get("/service/:key", (req, res) => {
        console.log(req.params.key)
        serviceDB.find({ name: req.params.key })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // ******************************************************************* add Single product ******************** 
    app.post("/addedSingleProduct", (req, res) => {
        const productOne = req.body
        console.log(productOne)
        selectDB.insertOne(productOne)
            //   productsCollection.insertMany(product)
            .then(result => {
                console.log(result)
                // console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    // *********************************************************************** find data For one Person ************
    app.get("/bookings", (req, res) => {
        selectDB.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // ************************************************************************ add single review ********************** 

    app.post("/addReview", (req, res) => {
        const productOne = req.body
        console.log(productOne)
        reviewDB.insertOne(productOne)
            //   productsCollection.insertMany(product)
            .then(result => {
                console.log(result)
                // console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    // ***************************************************************** all order List ***************

    app.get("/allOrder", (req, res) => {
        selectDB.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    //  ****************************************************************** add Single Service ************************* 

    app.post("/addService", (req, res) => {
        const productOne = req.body
        serviceDB.insertOne(productOne)
            //   productsCollection.insertMany(product)
            .then(result => {
                console.log(result)
                // console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    // ------------------------------------------------------------------ Add admin

    app.post("/addAdmin", (req, res) => {
        const admin = req.body
        console.log(admin)
        adminDB.insertOne(admin)
            //   productsCollection.insertMany(product)
            .then(result => {
                console.log(result)
                // console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    // ****************************************************** delete item********************

    app.delete("/delete/:name", (req, res) => {
        console.log(req.params.name)
        serviceDB.deleteOne({ name: req.params.name })
            .then((result) => {
                console.log(result)
                if (result) {

                }
            })
    })


    // --------------------------------------------------------------- admin test***************


    app.get("/admin", (req, res) => {
        adminDB.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents.length > 0)
            })
    })

// *********************************************************************** update Status **************

app.patch("/update/:id", (req, res) => {
    console.log(req.params.id)
    selectDB.updateOne({_id :req.params.id },
        {
            $set:{status : req.body.data  }
        })
        .then((result) => {
            console.log(result)
        })
})





});

app.get('/', (req, res) => {
    res.send('Fresh data!')
})

app.listen(process.env.PORT || port)