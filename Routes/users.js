const express = require('express');
const {users} = require('../data/users');
const router = express.Router();

//route to get all users

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

// route to get a user's subscription details
router.get('/subscriptions/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const parseDate = (str) => {
    if (!str) return null;
    // supports MM/DD/YYYY or ISO
    const parts = str.split('/');
    if (parts.length === 3) {
      const [m, d, y] = parts.map(Number);
      return new Date(y, m - 1, d);
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const type = (user.subscription || '').toLowerCase();
  const subscriptionDate = parseDate(user.subscriptionDate);

  const monthsToAdd = type === 'basic' ? 1 : type === 'standard' ? 3 : type === 'premium' ? 12 : 0;
  let expiry = null;
  if (subscriptionDate && monthsToAdd > 0) {
    expiry = new Date(subscriptionDate);
    expiry.setMonth(expiry.getMonth() + monthsToAdd);
  }

  const today = new Date();
  const missedSubscription = !subscriptionDate;
  const missedRenewal = expiry ? today > expiry : false;

  let subscriptionFine = 0;
  if (missedSubscription && missedRenewal) subscriptionFine = 200;
  else if (missedSubscription || missedRenewal) subscriptionFine = 100;

  // Book fine: if issued book past returnDate
  let bookFine = { amount: 0, daysOverdue: 0 };
  if (user.issuedBook && user.returnDate) {
    const returnDate = parseDate(user.returnDate);
    if (returnDate && today > returnDate) {
      const days = Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
      const rate = 1; // per-day rate
      bookFine = { amount: days * rate, daysOverdue: days };
    }
  }

  const totalFine = subscriptionFine + (bookFine.amount || 0);

  return res.status(200).json({
    success: true,
    data: {
      subscriptionType: user.subscription || null,
      subscriptionDate: user.subscriptionDate || null,
      expiryDate: expiry ? `${expiry.getMonth() + 1}/${expiry.getDate()}/${expiry.getFullYear()}` : null,
      validity: subscriptionDate ? (missedRenewal ? 'expired' : 'active') : 'none',
      daysRemaining: expiry ? Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)) : null,
      fine: {
        subscriptionFine,
        bookFine,
        totalFine,
        rules: {
          missedRenewalCharge: 100,
          missedSubscriptionCharge: 100,
          missedBothCharge: 200
        }
      }
    }
  });
});

//route to get a user by id
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  const updatedUsers = users.filter(u => u.id !== id);
  // const index = users.findIndex(u => u.id === id);
  // if (index !== -1) {
  //   users.splice(index, 1);
  // }
  res.status(200).json({
    success: true,
    data: updatedUsers,
    message: 'User deleted successfully',
  });
});



module.exports = router;