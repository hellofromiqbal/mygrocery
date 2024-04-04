const User = require('../user/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../../config/config');

const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    
    const isEmailExist = await User.findOne({ email });
    if(isEmailExist) {
      return res.status(409).json({
        message: 'Email already exist.'
      });
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userData } = newUser.toObject();

    return res.status(201).json({
      message: 'New user created!',
      data: userData
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  };
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserExist = await User.findOne({ email })
      .populate({
        path: 'cart',
        populate: {
          path: 'product',
          select: '-__v -createdAt -updatedAt'
        }
      })
      // .populate({
      //   path: 'address',
      //   select: '-__v -createdAt -updatedAt'
      // });
    
    const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
    if(!isUserExist || !isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    };
    
    const loginTokenPayload = {
      _id: isUserExist._id,
      fullname: isUserExist.fullname,
      email: isUserExist.email,
      address: isUserExist.address,
      invoices: isUserExist.invoices,
      role: isUserExist.role
    };

    const userSignInToken = jwt.sign(loginTokenPayload, secretKey, { expiresIn: '7d' });
    res.cookie('mygrocery', userSignInToken, { path: '/' });

    return res.status(200).json({
      message: 'Logged in!',
      data: {
        ...loginTokenPayload,
        cart: isUserExist.cart
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  };
};

const logout = async (req, res) => {
  try {
    res.clearCookie('mygrocery');
    return res.status(200).json({
      message: 'Logged out!'
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  };
};

const currUserInfo = async (req, res) => {
  try {
    const { mygrocery } = req.cookies;
    if(!mygrocery) {
      return;
    };

    const decodedToken = await jwt.verify(mygrocery, secretKey);

    const currUser = await User.findById(decodedToken._id)
      .populate({
        path: 'cart',
        populate: {
          path: 'product',
          select: '-__v -createdAt -updatedAt'
        }
      })
      // .populate({
      //   path: 'address',
      //   select: '-__v -createdAt -updatedAt'
      // })
      .select('-password -createdAt -updatedAt -__v');
    
    if(!currUser) {
      return res.status(404).json({
        message: 'User not found.',
      });
    };

    return res.status(200).json({
      message: 'Current User info fetched.',
      data: currUser
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  };
};

module.exports = { register, login, logout, currUserInfo };