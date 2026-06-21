import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ServiceAccount } from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
}

export const adminAuth = getAuth();