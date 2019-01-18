import express from "express";

const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');


let restApiRouter = express.Router();

restApiRouter.get('/api/for-kursant-and-zork', function (req, res, next) {
  console.log('get: /api', req.params);
  res.send({
    status: 'ok',
    title: 'Сообщение для Курсанта и Зорка',
    message: 'Жена пришла. Я собираюсь выходить. Это сообщение генерит мой макбучек. Шурочкин.'
  });
});

restApiRouter.post('/api/user', bodyParser.json(), function (req, res, next) {
  console.log('post: /api/user', req);
  res.send({params: req.body});
});
restApiRouter.delete('/api/user', bodyParser.json(), function (req, res, next) {
  console.log('delete: /api/user', req);
  res.send({params: req.body});
});

restApiRouter.post('/api/profile', bodyParser.json(), function (req, res, next) {
  console.log('post: /api/profile', req);
  res.send({params: req.body});
});
restApiRouter.delete('/api/profile', bodyParser.json(), function (req, res, next) {
  console.log('delete: /api/profile', req);
  res.send({params: req.body});
});

restApiRouter.post('/api/shippings', bodyParser.json(), function (req, res, next) {
  console.log('post: /api/shippings', req);
  res.send({params: req.body});
});
restApiRouter.delete('/api/shippings', bodyParser.json(), function (req, res, next) {
  console.log('delete: /api/shippings', req);
  res.send({params: req.body});
});



module.exports = restApiRouter;
