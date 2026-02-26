import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export function uploadFile(file, onProgress, onError, onSuccess) {
    if (!file) {
        if (onError) onError("파일이 없습니다.");
        return;
    }

    const storageRef = ref(storage, 'uploads/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            if (onProgress) onProgress(progress);
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error("Upload failed:", error);
            if (onError) {
                switch (error.code) {
                    case 'storage/unauthorized':
                        onError("Permission denied.");
                        break;
                    case 'storage/canceled':
                        onError("Upload canceled.");
                        break;
                    case 'storage/unknown':
                        onError("An unknown error occurred.");
                        break;
                    default:
                        onError("Upload failed.");
                }
            }
        },
        () => {
            // Handle successful uploads on complete
            console.log("Upload successful");
            if (onSuccess) onSuccess();
        }
    );
}
