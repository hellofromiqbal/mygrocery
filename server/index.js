const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');

const mongooseConnection = require('./databases/mongoose');

const authRouter = require('./app/auth/router');
const productRouter = require('./app/product/router');
const categoryRouter = require('./app/category/router');
const cartItemRouter = require('./app/cartItem/router');
const addressRouter = require('./app/address/router');
const invoiceRouter = require('./app/invoice/router');

const app = express();

app.use(cors({
  credentials: true,
  origin: config.clientDomain
}));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', cartItemRouter);
app.use('/api', addressRouter);
app.use('/api', invoiceRouter);

mongooseConnection(app);

app.get('/', (req, res) => {
  return res.send('Hello world...');
});