import express from "express";
import { expressMiddleware } from "@apollo/server/express4"
import { createGraphqlServer } from "./graphql";

const init = async () => {
    const PORT = Number(process.env.PORT) || 8000;
    const app = express();

    app.use(express.json());


    app.get("/", (req, res) => {
        res.send(`
        <body><pre>Up and Running at <a href="/graphql">/graphql</a></pre></body>
        `);
    })

    app.use("/graphql", expressMiddleware(await createGraphqlServer()));

    app.listen(PORT, () => {
        console.log("Listening on http://localhost:" + PORT);
    })
}

init();