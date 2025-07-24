import { Build } from "../../models/build";
import { auth, db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const buildsCollection = collection(db, "builds");

// Create a new build
export async function createBuild(data: Build) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const docRef = await addDoc(buildsCollection, {
    ...data,
    userId: user.uid,
    createdAt: new Date(),
    updatedAt: new Date(),
    submitted: false,
  });
  return docRef.id;
}

// Read all builds
export async function getSeasonBuilds(season: number): Promise<Build[]> {
  const q = query(buildsCollection, where("season", "==", season));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Build[];
}

export async function getCurrentUserBuilds(): Promise<Build[]> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  return getUserBuilds(user.uid);
}

export async function getUserBuilds(userId: string): Promise<Build[]> {
  const q = query(buildsCollection, where("userId", "==", userId));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Build[];
}

// Read a single build by ID
export async function getBuild(id: string): Promise<Build | null> {
  const docRef = doc(db, "builds", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  const data = docSnap.data();

  return {
    id: docSnap.id,
    season: data.season,
    heroId: data.heroId,
    buildId: data.buildId,
    title: data.title,
    description: data.description,
    createdAt: data.createdAt ? (data.createdAt as Date) : new Date(),
    updatedAt: data.updatedAt ? (data.updatedAt as Date) : new Date(),
    userId: data.userId,
    submitted: data.submitted || false,
  };
}

// Update a build by ID
export async function updateBuild(id: string, data: Build) {
  const docRef = doc(db, "builds", id);
  await updateDoc(docRef, {
    buildId: data.buildId,
    title: data.title,
    description: data.description,
    updatedAt: new Date(),
  });
}

// Delete a build by ID
export async function deleteBuild(id: string) {
  const docRef = doc(db, "builds", id);
  await deleteDoc(docRef);
}

// Lock a build by ID
export async function lockBuild(id: string) {
  const docRef = doc(db, "builds", id);
  await updateDoc(docRef, {
    updatedAt: new Date(),
    submitted: true,
  });
}
