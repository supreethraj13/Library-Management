const express = require('express');
const {users} = require('./data/users');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Home Page');
});

//route to get all users
app.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

//route to get a user by id
app.get('/users/:id', (req, res) => {
  const {id} = req.params;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//route to create a new user
app.post('/users', (req, res) => {
  const {id,name,surname, email,issuedBook,issuedDate,returnDate,subscription,subscriptionDate } = req.body;
  if (!id || !name || !surname || !email || !issuedBook || !issuedDate || !returnDate || !subscription || !subscriptionDate) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  const user = users.find(u => u.id === id);
  if (user) {
    return res.status(409).json({ 
      success: false,
      message: 'User with this ID already exists',
    });
  }

  users.push({id,name,surname, email,issuedBook,issuedDate,returnDate,subscription,subscriptionDate });
  res.status(201).json({
    success: true,
    message: 'User created successfully',
  });
});

//route to update a user by id
app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const {data} = req.body;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  Object.assign(user, data);
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
  });
});

//route to delete a user by id
app.delete('/users/:id', (req, res) => {
  const {id} = req.params;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  const updatedUsers = users.filter(u => u.id !== id);
  res.status(200).json({
    success: true,
    data: updatedUsers,
    message: 'User deleted successfully',
  });
});


// app.use((req, res) => {
//   res.status(404).send('Page Not Found');
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});