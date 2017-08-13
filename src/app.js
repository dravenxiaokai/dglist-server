const express = require('express');
const mongoose = require('mongoose');
const Product = require('./product');

const path = require('path')

mongoose.connect('mongodb://127.0.0.1:27017/dglist');

const app = express();

app.use('/',express.static(path.join(__dirname,'..','client')))

app.get('/', (request, response) => {
    response.send('Hello, Express!');
});

app.get('/api/products', (request, response, next) => {
    Product.find({}, { __v: 0 }, (error, products) => {
        if (error) next(error)
        response.json(products);
    });
});

// put 通常是改变数据库一条记录的方法
app.put('/api/products/:id/likes', (request, response) => {
  Product
    .findByIdAndUpdate(request.params.id, { $inc: { likes: 1 } })
    .exec((error) => {
      if (error) next(error);
      response.json({ success: true });
    });
});

app.use((error, request, response, next) => {
    response.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, 'localhost', () => {
    console.log('Server is listening on port 3000');
});
