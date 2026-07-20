import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import researchRoutes from "./routes/research.routes";
import projectRoutes from "./routes/project.routes";
import agentRoutes from "./routes/agent.routes";
import userRoutes from "./routes/user.routes";
import mediaRoutes from "./routes/media.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors());

app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/research", researchRoutes);

app.use("/api/project", projectRoutes);

app.use("/api/agent", agentRoutes);

app.use("/api/user", userRoutes);

app.use("/api/media", mediaRoutes);

app.use(errorHandler);


export default app;
