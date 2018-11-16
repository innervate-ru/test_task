import moment from 'moment';
import crypto from 'crypto';
import {oncePerServices, missingService} from '../../common/services/index';
// import something from '../postgres/index';

function apolloToRelayResolverAdapter(oldResolver) {
  return function (obj, args, context) {
    return oldResolver(args, context.request);
  }
}

export default oncePerServices(function (services) {

    const {
        postgres = missingService('postgres')
    } = services;


  function testQuery(builderContext) {
    return async function(obj, args, context) {

      return [
          {str: "A", int: 1, obj: {a: "A1", b: "B1"}},
          {str: "B", int: 2, obj: {a: "A2", b: "B2"}},
          {str: "C", int: 3, obj: {a: "A3", b: "B3"}},
      ];
    }
  }

  function getUsers(builderContext) {
    return async function(obj, args, context) {
      try {
        const { rows } = await postgres.exec({statement: 'SELECT * FROM users'});
        return rows
      } catch (e) {
        console.log(e);
      }
    }
  }

  function getUser(builderContext) {
    return async function(obj, args, context) {
      try {
        const { manager, blocked, name, login } = args;

        const paramsArr = [];
        if(manager) paramsArr.push(`manager`);
        if(blocked) paramsArr.push(`blocked`);
        if(name) paramsArr.push(`name='${name}'`);
        if(login) paramsArr.push(`login='${login}'`);

        const paramsStr = paramsArr.join(' AND ');

        const { rows } = await postgres.exec({statement: `SELECT * FROM users WHERE ${paramsStr}`});
        return rows

      } catch (e){
        console.log(e);
      }
    }
  }

  function addUser(builderContext) {
    return async function(obj, args, context) {
      try {
        const { login, password } = args;

        if(!login || !password) {
          return { isAuthenticated: false }
        }

        const { rows } = await postgres.exec({statement: `SELECT password_hash FROM users WHERE login='${login}'`});
        const dbHash = rows[0].password_hash;

        // Т.к. я не знаю как хэш сгенерирован в таблице users, то аутентификация
        // работает по хэшу пароля

        if(password === dbHash) {
          return { isAuthenticated: true }
        } else {
          return { isAuthenticated: false }
        }

        // Пример реализации с полем isAuthenticated и наличием хэш функции
        // const hash = crypto.createHash('md5').update(password).digest("hex");
        // if(dbHash !== hash){
        //   return { isAuthenticated: false }
        // }
        //
        // const response = await postgres.exec({statement: `UPDATE users SET isAuthenticated=TRUE WHERE login=${login}'`});
        // if(!response.hasError){
        //   return { isAuthenticated: true }
        // }
        //

      } catch (e){
        console.log(e);
        return { isAuthenticated: false }
      }
    }
  }

  return {
    testQuery,
    getUsers,
    getUser,
    addUser
  }
});
