
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, where, deleteDoc } from "firebase/firestore";
import { Transaction, Reminder, Birthday } from "../types";

// ATENÇÃO: Substitua pelos dados do seu Console do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-id",
  appId: "seu-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return null;
  }
};

export const logout = () => signOut(auth);

// Funções de Banco de Dados
// Fix: Added categoryBudgets to the data parameter type definition to support financial goals persistence
export const saveUserData = async (userId: string, data: {
  transactions: Transaction[],
  reminders: Reminder[],
  birthdays: Birthday[],
  categoryBudgets?: Record<string, number>
}) => {
  try {
    const userDoc = doc(db, "users", userId);
    await setDoc(userDoc, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Erro ao salvar no Firestore:", error);
  }
};

export const loadUserData = async (userId: string) => {
  try {
    const userDoc = doc(db, "users", userId);
    const snap = await getDoc(userDoc);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error("Erro ao carregar do Firestore:", error);
    return null;
  }
};
