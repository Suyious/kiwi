import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4"
import { prismaClient } from "./lib/db";

const init = async () => {
    const PORT = Number(process.env.PORT) || 8000;
    const app = express();

    app.use(express.json());

    const graphqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello there",
                say: (_, { name }) => "hello " + name,
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password}:
                    { firstName: string, lastName: string, email: string, password: string}) => {
                        await prismaClient.user.create({
                            data: {
                                firstName,
                                lastName,
                                email,
                                password,
                                salt: "random_salt"
                            }
                        });
                        return true;
                } 
            }
        }
    });
    await graphqlServer.start();

    app.get("/", (req, res) => {
        res.send(`
        <body><pre>Up and Running at <a href="/graphql">/graphql</a></pre></body>
        `);
    })

    app.use("/graphql", expressMiddleware(graphqlServer));

    app.listen(PORT, () => {
        console.log("Listening on http://localhost:" + PORT);
    })
}

init();