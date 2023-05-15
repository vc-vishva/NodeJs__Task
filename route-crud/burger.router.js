const burgerRouter = require("express").Router();
const dbPath = './db.json';
const fs = require('fs/promises');


const data = require(`./${process.env.data}`);

burgerRouter.use(express.json());


//get
burgerRouter.get('/', (req, res) => {
  const userdata = data.burger
  res.json(userdata);
});
//
burgerRouter.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  const  userData= data.burger.find((item) => item.id === id);
  if (userData) {
    res.status(200).json(userData);
  } else {
    res.status(404).send('User data not found');
  }
  
});
//creat
let nextburgerId = data.counter.burger || 1;

burgerRouter.post('/', async(req, res) => {
  const { name, price } = req.body;
  const newburger = { id: nextburgerId++, name, price };
  if (!data.burger) {
    data.burger = [newburger];
  } else {
    data.burger.push(newburger);
  }
  data.counter.burger = nextburgerId;
 await fs.writeFile(dbPath, JSON.stringify(data));

  res.status(201).json(newburger);
});
//
//update
burgerRouter.put('/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;

  const burgerToUpdate = data.burger.find((item) => item.id === id);

  if (burgerToUpdate) {
    burgerToUpdate.name = name || burgerToUpdate.name;
    burgerToUpdate.price = price || burgerToUpdate.price;

   await fs.writeFile(dbPath, JSON.stringify(data));
    res.status(200).json({ message: 'burger data updated successfully' });
  } else {
    res.status(404).json({ message: 'burger data not found' });
  }
});
//delete
burgerRouter.delete('/:id', async(req, res) => {
  
  const id = parseInt(req.params.id);
  const index = data.burger.findIndex(p => p.id === id);
  if (index >= 0) {
    data.burger.splice(index, 1);
    // data.counter.pizza -= 1;
   await fs.writeFile(dbPath, JSON.stringify(data));
    res.status(200).json({ message: 'burger data deleted successfully' });
  } else {
    res.status(404).json({ message: 'burger data  not found' });
  }
});

module.exports = burgerRouter;
