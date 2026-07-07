import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import "../../firebase/firebaseAdmin";
import User from "../models/User";

/**
 * Both login and register follow the same pattern used with Firebase Auth:
 * the client signs in/up with Firebase directly, gets an ID token, and
 * sends it here. We verify it and sync a local User profile in Mongo
 * (which is what the rest of the app - projects, chats - foreign-keys to).
 */
async function syncUserFromToken(idToken: string) {
    const decoded = await getAuth().verifyIdToken(idToken);

    const user = await User.findOneAndUpdate(
        { uid: decoded.uid },
        {
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name,
            photo: decoded.picture,
        },
        { upsert: true, new: true }
    );

    return user;
}

export const register = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ success: false, message: "idToken is required" });
        }

        const user = await syncUserFromToken(idToken);

        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ success: false, message: "idToken is required" });
        }

        const user = await syncUserFromToken(idToken);

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};
