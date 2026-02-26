const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getKeywords } = require("./keywords");

initializeApp();

exports.analyzeRecording = onCall((request) => {
  const { fileContent, fileName } = request.data;

  // For now, we'll just log the file name and return a dummy analysis.
  console.log(`Received file: ${fileName}`);

  // In a real scenario, you would process the fileContent.
  // Here, we'll use the placeholder keyword extraction.
  const dummyText = "This is a dummy transcript based on the audio file.";
  const keywords = getKeywords(dummyText);

  return {
    status: "success",
    message: "File processed successfully.",
    analysis: {
      transcript: dummyText,
      keywords: keywords,
    },
  };
});
