// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const authenticate = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token,  process.env.SECRET_KEY); 
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
//         if (!user) {
//           throw new Error();
//         }
    
//         req.user = user;
//         req.token = token;
//         next();
//       } catch (error) {
//         res.status(401).send({ error: 'Please authenticate.' });
//       }
// };

// module.exports = authenticate;
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Assuming you have a separate file for configuration

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId; // Attach user ID to request object
    next(); 
  });
};

module.exports = {
  verifyToken
};
