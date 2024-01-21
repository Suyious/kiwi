import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4"

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
        `,
        resolvers: {
            Query: {
                hello: () => "hello there",
                say: (_, { name }) => "hello " + name,
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