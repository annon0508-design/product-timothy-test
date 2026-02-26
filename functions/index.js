const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { transcribeAudio } = require("./whisper");

admin.initializeApp();

exports.processAudio = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name;

    // Ensure we are only processing files in the 'audio/' directory
    if (!filePath.startsWith("audio/")) {
        console.log(`File ${filePath} is not in the audio directory, skipping.`);
        return null;
    }

    try {
        const transcriptData = await transcribeAudio(filePath);

        // The document ID will be the file name without the 'audio/' prefix
        const docId = filePath.split('/').pop();

        await admin.firestore().collection("files").doc(docId).set({
            filePath,
            transcript: transcriptData.text,
            segments: transcriptData.segments,
            createdAt: new Date(),
        });

        console.log(`Successfully transcribed ${filePath} and saved to Firestore.`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
});