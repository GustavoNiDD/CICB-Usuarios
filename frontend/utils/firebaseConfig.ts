// Caminho: /home/gustavoadm/projetos/ColegioIntegracao/frontend/utils/firebaseConfig.ts

import { initializeApp, getApps, getApp } from "firebase/app"; // Importe getApps e getApp
import { getAuth } from "firebase/auth";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxwoRf1f0j74QH0sXf9tffLriVbDFd1-4",
  authDomain: "cicb-35c00.firebaseapp.com",
  projectId: "cicb-35c00",
  storageBucket: "cicb-35c00.firebasestorage.app",
  messagingSenderId: "1000928975311",
  appId: "1:1000928975311:web:7fe5f68d71448a034c1aba"
};

// Inicializa o Firebase App apenas se ainda não houver um.
// Isso previne erros de re-inicialização em ambientes com hot-reloading.
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa e exporta o serviço de autenticação
export const auth = getAuth(app);
