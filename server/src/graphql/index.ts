import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db";
import { User } from "./user";

export const createGraphqlServer = async () => {
    const graphqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
            type Mutation {
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    });
    await graphqlServer.start();

    return graphqlServer;
}