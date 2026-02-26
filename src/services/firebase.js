
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

// This function now sends the file content directly to the Cloud Function
export const uploadAndAnalyzeFile = async (file) => {
  if (!file) return;

  // Get the file content as a Base64 string
  const fileContent = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Get Base64 part
      reader.onerror = (error) => reject(error);
  });

  const analyzeRecording = httpsCallable(functions, 'analyzeRecording');

  try {
    const result = await analyzeRecording({ 
        fileContent: fileContent, 
        fileName: file.name 
    });
    return result.data;
  } catch (error) {
    console.error("Error calling Cloud Function:", error);
    throw new functions.https.HttpsError(error.code, error.message);
  }
};
