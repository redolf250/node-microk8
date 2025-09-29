const express = require('express');
const app = express();
const PORT = 9100;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory list acting as the database
let inventory = [
  { id: 1, name: 'Laptop', quantity: 10, price: 1000 },
  { id: 2, name: 'Mouse', quantity: 50, price: 20 },
  { id: 4, name: 'Pendrive', quantity: 70, price: 50 },
  { id: 5, name: 'Keyboard', quantity: 50, price: 20 },
];

// Get all inventory items
app.get('/inventory', (req, res) => {
  res.json(inventory);
});

  
// Get a single inventory item by ID
app.get('/inventory/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = inventory.find(i => i.id === itemId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.json(item);
});

// Add a new inventory item
app.post('/inventory', (req, res) => {
  const { name, quantity, price } = req.body;

  if (!name || quantity == null || price == null) {
    return res.status(400).json({ message: 'Name, quantity, and price are required' });
  }

  const newItem = {
    id: inventory.length > 0 ? inventory[inventory.length - 1].id + 1 : 1,
    name,
    quantity,
    price,
  };

  inventory.push(newItem);
  res.status(201).json(newItem);
});

// Update an inventory item by ID
app.put('/inventory/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const { name, quantity, price } = req.body;

  const itemIndex = inventory.findIndex(i => i.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Update the item details
  inventory[itemIndex] = { ...inventory[itemIndex], name, quantity, price };

  res.json(inventory[itemIndex]);
});

// Delete an inventory item by ID
app.delete('/inventory/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = inventory.findIndex(i => i.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});