import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
    res.json({
        message: "Research Route Working"
    });
});

export default router;