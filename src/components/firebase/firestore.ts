import { UserProfile } from "../../models/user-profile";
import { db } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userDocument = await getDoc(doc(db, "users", uid));

  if (!userDocument.exists()) {
    return null;
  }

  const data = userDocument.data();

  return {
    username: data.username,
    role: data.role,
    createdAt: data.createdAt
      ? (data.createdAt as Timestamp).toDate()
      : new Date(),
    lastConnection: data.lastConnection
      ? (data.lastConnection as Timestamp).toDate()
      : new Date(),
  };
};

export const createUserProfile = async (uid: string, username: string) => {
  await setDoc(doc(db, "users", uid), {
    username: username,
    role: "user",
    createdAt: serverTimestamp(),
    lastConnection: serverTimestamp(),
  });
  await setDoc(doc(db, "usernames", username), { uid });
};

export const updateLastConnection = (uid: string) =>
  updateDoc(doc(db, "users", uid), { lastConnection: serverTimestamp() });

export const isUsernameTaken = async (username: string) => {
  const docUsername = await getDoc(doc(db, "usernames", username));
  return docUsername.exists();
};
