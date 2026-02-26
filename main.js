import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getStorage, ref, uploadBytesResumable } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

export const DEFAULT_KEYWORDS = [
  "돈", "입금", "송금", "보내겠다", "줄게",
  "계약", "약속", "합의", "동의",
  "책임", "변상", "환불", "갚겠다",
  "언제", "기한", "날짜",
  "확인", "증거", "녹음"
];

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        uploadFile(files[0]);
    }
});

function uploadFile(file) {
    const storageRef = ref(storage, 'audio/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (error) => {
            console.error("Upload failed:", error);
        },
        () => {
            console.log("Upload successful");
        }
    );
}
