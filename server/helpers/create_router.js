const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function (collection) {

  const router = express.Router();

  router.get('/', (req, res) => { //get all
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.get('/:id', (req, res) => { //get one result from database
    const id = req.params.id;
    collection
      .findOne({ _id: ObjectID(id) })
      .then((doc) => res.json(doc))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.put('/:id',(req,res)=>{ // UPDATE  result to database
    const id=req.params.id;
    const updatedData=req.body;
    collection.findOneAndUpdate(
      {_id:ObjectID(id)},
      {$set:updatedData},
      {returnOriginal:false}
    )
    .then((result)=>{
      res.json(result.value)
    })
    .catch((err)=>{
      console.error(err);
      res.status(500);
      res.json({status:500,error:err});
    })
  })

  router.post('/',(req,res)=>{  //CREATE new item
    const newData=req.body;
    collection
    .insertOne(newData)
    .then((result)=> res.json(result.ops[0]))
    .catch((err)=>{
      console.error(err);
      res.status(500);
      res.json({status:500,error:err})
    })
  })

  router.delete('/:id',(req,res)=>{ //delete a result
    const id=req.params.id;
    collection
    .deleteOne({_id: ObjectID(id)})
    .then(result =>{
      res.json(result)
    })
    .catch((err)=>{
      console.error(err);
      res.status(500);
      res.json({status:500,error:err})
    })
  })

  return router;
};

module.exports = createRouter;
