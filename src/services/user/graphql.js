import {oncePerServices, missingService} from '../../common/services/index'

const PREFIX = 'User';

export default oncePerServices(function (services) {

  const graphqlBuilderSchema = require('../../common/graphql/LevelBuilder.schema');

  const {
    user = missingService('user')
  } = services;

  return async function builder(args) {

    graphqlBuilderSchema.build_options(args);
    const { parentLevelBuilder, typeDefs, builderContext } = args;

    typeDefs.push(`
    
      type ${PREFIX}QueryElement {
        user_id: Int,
        login: String,
        email: String,
        name: String,
        manager: Boolean,
        blocked: Boolean,
        birthday: String
      }
      
    `);

    parentLevelBuilder.addQuery({
      name: `usersQuery`,
      type: `[${PREFIX}QueryElement]`,
      args: `
        user_id: Int
      `,
      resolver: function (args, request) {
        return user.getAllUsers(args)
      },
    });

  }
});
