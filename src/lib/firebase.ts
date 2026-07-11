import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Firestore,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

// Same project as the original A-lect Water app — reusing it means every
// historical sale, production run, and staff record is already here.
// Values come from .env.local (see .env.example).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

export function fsCol(name: string): CollectionReference<DocumentData> {
  return collection(getDb(), name);
}

export const fsAddDoc = addDoc;
export const fsGetDocs = getDocs;
export const fsDeleteDoc = deleteDoc;
export const fsUpdateDoc = updateDoc;

export function fsDoc(col: string, id: string) {
  return doc(getDb(), col, id);
}

export const COLLECTIONS = {
  users: "users",
  sales: "sales",
  production: "production",
  rawmats: "rawmats",
  reconciliations: "reconciliations",
  expenses: "expenses",
  attendance: "attendance",
} as const;
