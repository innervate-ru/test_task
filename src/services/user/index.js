import configApi from 'config';
import merge from 'lodash/merge';
import { missingService, oncePerServices, serviceName } from '../../common/services';

export const name = serviceName(__filename);

// const schema = require('./index.schema');
const serviceConfig = configApi.get('externalTestService');

export default oncePerServices(function (services) {
  const {
    postgres = missingService('postgres')
  } = services;

  class UserService {

    _timerId = null;

    constructor(options) {
      // schema.ctor_options(this, options);
      this._options = options;
    }

    async _serviceStart() {
      if (this._enabled && this._importEnabled) {
        this._timerId = setInterval(() => {
          return console.info(`user service is alive`);
        }, this._processInterval);
      }

    }

    async _serviceStop() {
      clearInterval(this._timerId);
    }

    async getAllUsers({context}) {
      const list = await postgres.exec({
        context,
        statement: `SELECT t.*, CTID FROM public.users t LIMIT 501`
      });
      return list.rows.map(item => ({...item, birthday: item.data && item.data.birthday}))
    }
  }

  const mergedConfig = merge(serviceConfig, { dependsOn: [postgres] });
  return new (require('../../common/services').Service(services)(UserService))(name, mergedConfig);
});
