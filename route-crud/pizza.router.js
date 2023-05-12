const pizzaRouter = require("express").Router();
const bodyParser = require('body-parser');
const dbPath = './db.json';
const fs = require('fs');
// const data = require('./db.json');
const data = require(`./${process.env.data}`);

// const data = require(process.env.data)
pizzaRouter.use(bodyParser.json());
//get all
pizzaRouter.get('/', (req, res) => {
  const userdata = data.pizza 
  res.json(userdata);
  
});
//specific
pizzaRouter.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  const  userData= data.pizza.find((item) => item.id === id);
  if (userData) {
    res.status(200).json(userData);
  } else {
    res.status(404).send('User data not found');
  }
  
});
// Create
let nextPizzaId = data.counter.pizza || 1;

pizzaRouter.post('/', (req, res) => {
  const { name, price } = req.body;
  const newPizza = { id: nextPizzaId++, name, price };
  if (!data.pizza) {
    data.pizza = [newPizza];
  } else {
    data.pizza.push(newPizza);
  }
  data.counter.pizza = nextPizzaId;
  fs.writeFileSync(dbPath, JSON.stringify(data));

  res.status(201).json(newPizza);
});
//update
pizzaRouter.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;

  const pizzaToUpdate = data.pizza.find((item) => item.id === id);

  if (pizzaToUpdate) {
    pizzaToUpdate.name = name || pizzaToUpdate.name;
    pizzaToUpdate.price = price || pizzaToUpdate.price;

    fs.writeFileSync(dbPath, JSON.stringify(data));
    res.status(200).json({ message: 'Pizza updated successfully' });
  } else {
    res.status(404).json({ message: 'Pizza not found' });
  }
});
//delete
pizzaRouter.delete('/:id', (req, res) => {
  
  const id = parseInt(req.params.id);
  const index = data.pizza.findIndex(p => p.id === id);
  if (index >= 0) {
    data.pizza.splice(index, 1);
    // data.counter.pizza -= 1;
    fs.writeFileSync(dbPath, JSON.stringify(data));
    res.status(200).json({ message: 'Pizza deleted successfully' });
  } else {
    res.status(404).json({ message: 'Pizza not found' });
  }
});

module.exports = pizzaRouter;
