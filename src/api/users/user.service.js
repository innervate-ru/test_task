// const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');
const jwt = require('jsonwebtoken');

// users hardcoded for simplicity, store in a db for production applications
const users = [
  {user_id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User'}
];

// const mongoClient = new MongoClient(config.db.url, {useNewUrlParser: true});
// mongoClient.connect(function (err, client) {
//
//   const db = client.db(config.db.name);
//   // console.log('connect :: clent: ', client, err, db);
//   const collection = db.collection("users");
//
//   collection.insertMany(users, function (err, results) {
//
//     console.log(results);
//     client.close();
//   });
// });


module.exports = {
  authenticate,
  getAll
};

async function authenticate({username, password}) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const {password, ...userWithoutPassword} = user;
    const token = jwt.sign(
      {...userWithoutPassword},
      config.secret,
      {expiresIn: '24h'}
    );
    return {
      ...userWithoutPassword,
      token
    };
  }
}

async function getAll() {
  return users.map(u => {
    const {password, ...userWithoutPassword} = u;
    return userWithoutPassword;
  });
}
