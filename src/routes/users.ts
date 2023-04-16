const express = require('express');
const router = express.Router();
import User from '../models/usersModels';


// 共用的headers
const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
};

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      message: "user work:MongoDB Atlas connected!",
      method: "get",
      data: users
    })
    );
    res.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const usersRouter = router;
