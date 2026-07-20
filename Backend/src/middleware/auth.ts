import { getAuth } from "firebase-admin/auth";
import "../../firebase/firebaseAdmin";

export const authenticate = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decodedToken =
      await getAuth().verifyIdToken(token);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
