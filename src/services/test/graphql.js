import {oncePerServices, missingService} from '../../common/services/index'

const PREFIX = '';

export default oncePerServices(function (services) {

  const graphqlBuilderSchema = require('../../common/graphql/LevelBuilder.schema');

  const resolvers = require('./resolvers').default(services);

  return async function builder(args) {

    graphqlBuilderSchema.build_options(args);
    const { parentLevelBuilder, typeDefs, builderContext } = args;


    typeDefs.push(`
      type ${PREFIX}TestQueryObject {
        a: String,
        b: String
      }

      type ${PREFIX}TestQueryElement {
        str: String,
        int: Int,
        obj: ${PREFIX}TestQueryObject
      }

      type ${PREFIX}Data {
        birthday: String
      }

      type ${PREFIX}User {
        user_id: Int
        login: String
        name: String
        email: String
        manager: Boolean
        blocked: Boolean
        data: ${PREFIX}Data
      }

      type ${PREFIX}authStatus {
        isAuthenticated: Boolean
      }

    `);

    parentLevelBuilder.addQuery({
      name: `testQuery`,
      type: `[${PREFIX}TestQueryElement]`,
      args: `
        str: String,
        int: Int
      `,
      resolver: resolvers.testQuery(builderContext),
    });

    parentLevelBuilder.addQuery({
      name: `Users`,
      type: `[${PREFIX}User]`,
      resolver: resolvers.getUsers(builderContext),
    });

    parentLevelBuilder.addQuery({
      name: `User`,
      type: `[${PREFIX}User]`,
      args: `
        manager: Boolean
        blocked: Boolean
        name: String
        login: String
      `,
      resolver: resolvers.getUser(builderContext),
    });

    parentLevelBuilder.addMutation({
      name: `Auth`,
      type: `${PREFIX}authStatus`,
      args: `
        login: String
        password: String
      `,
      resolver: resolvers.addUser(builderContext),
    });

  }
});
