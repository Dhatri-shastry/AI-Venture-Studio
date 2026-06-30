import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDatabase } from "./database/mongodb";

const PORT = process.env.PORT || 5000;

async function startServer() {

    await connectDatabase();

    app.listen(PORT, () => {

        console.log(`Server running on ${PORT}`);

    });

}

startServer();