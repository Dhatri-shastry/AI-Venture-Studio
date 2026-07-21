import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
    sendMessage,
    sendMessageStream,
    listChats,
    getChat,
    renameChat,
    deleteChat,
} from "../controllers/chat.controller";

const router = Router();

router.post("/", authenticate, sendMessage);
router.post("/stream", authenticate, sendMessageStream);
router.get("/", authenticate, listChats);
router.get("/:chatId", authenticate, getChat);
router.patch("/:chatId", authenticate, renameChat);
router.delete("/:chatId", authenticate, deleteChat);

export default router;
