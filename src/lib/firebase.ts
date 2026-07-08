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
const firebaseConfig = {
  apiKey: "AIzaSyCBLFD-b_4FG0JlMeIy2iIgKMLr3w7LHYY",
  authDomain: "spring-xcel-water.firebaseapp.com",
  projectId: "spring-xcel-water",
  storageBucket: "spring-xcel-water.firebasestorage.app",
  messagingSenderId: "413128829523",
  appId: "1:413128829523:web:99443b9de7a10d424c74a6",
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
