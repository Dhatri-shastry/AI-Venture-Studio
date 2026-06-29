import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
    res.json({
        message: "Agent Route Working"
    });
});

export default router;