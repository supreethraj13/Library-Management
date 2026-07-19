const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Home Page');
});

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});