import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase";

export default function Upload({ onUpload }) {

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    const storageRef = ref(storage, `audio/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);

    onUpload(storageRef.fullPath);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ border: "2px dashed #aaa", padding: "40px" }}
    >
      Drag & Drop Audio File
    </div>
  );
}