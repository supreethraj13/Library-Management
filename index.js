const express = require('express');
const {users} = require('./data/users');

const userrouter = require('./Routes/users');
const bookrouter = require('./Routes/books');


const app = express();
const port = 3000;
app.use(express.json());
app.use('/users', userrouter);
app.use('/books', bookrouter);

app.get('/', (req, res) => {
  res.status(200).send('Home Page');
});

//route to get all users


// app.use((req, res) => {
//   res.status(404).send('Page Not Found');
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});