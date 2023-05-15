const pastaRouter = require("express").Router();
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const  dbPath = './db.json';
// const data = require('./db.json');
const data = require(`./${process.env.data}`);

// const { count } = require("console");
// const { json } = require("express");
pastaRouter.use(express.json());

//
pastaRouter.get('/', (req, res) => {
const userdata = data.pasta 
  res.json(userdata);
  
});
//
pastaRouter.post('/', async(req,res) => {
  let nextPastaId = data.counter.pasta || 1;
  const { name, price} = req.body
  const newpasta = { id: nextPastaId++, name, price };
  if(!data.pasta){
    data.pasta[newpasta];
  }else{
    data.pasta.push(newpasta);
  }
data.counter.pasta = nextPastaId;
await fs.writeFile(dbPath, JSON.stringify(data));
res.status(200).json(newpasta);
})
//
pastaRouter.put('/:id',async(req,res)=>{
  const id = parseInt(req.params.id);
  const { name, price } = req.body;

  const pastaToUpdate = data.pasta.find((item) => item.id === id);

  if (pastaToUpdate) {
    pastaToUpdate.name = name || pastaToUpdate.name;
    pastaToUpdate.price = price || pastaToUpdate.price;

   await fs.writeFile(dbPath, JSON.stringify(data));
    res.status(200).json({ message: 'Pasta updated successfully' });
  } else {
    res.status(404).json({ message: 'Pasta not found' });
  }
});
//
pastaRouter.delete('/:id',async(req,res)=>{
  const id = parseInt(req.params.id);
  const index = data.pizza.findIndex(p => p.id === id);
  if (index >= 0) {
    data.pizza.splice(index, 1);
    // data.counter.pizza -= 1;
   await fs.writeFile(dbPath, JSON.stringify(data));
    res.status(200).json({ message: 'Pasta deleted successfully' });
  } else {
    res.status(404).json({ message: 'Pasta not found' });
  }
})
module.exports = pastaRouter;
