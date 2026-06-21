import { Request, Response } from "express";
import { adminAuth } from "../firebase/firebaseAdmin";

export const signup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const user = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};