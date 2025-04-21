let storedUser = "admin";
let storedPass = "1234";
let faceData;

window.onload = () => document.getElementById("login").style.display = "block";

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === storedUser && pass === storedPass) {
    document.getElementById("login").style.display = "none";
    document.getElementById("auth").style.display = "block";
    startVideo();
    loadModels();
  } else {
    alert("Invalid login.");
  }
}

function showChangePass() {
  document.getElementById("login").style.display = "none";
  document.getElementById("changePass").style.display = "block";
}

function changeCredentials() {
  storedUser = document.getElementById("newUser").value;
  storedPass = document.getElementById("newPass").value;
  alert("Credentials updated!");
  backToLogin();
}

function backToLogin() {
  document.getElementById("changePass").style.display = "none";
  document.getElementById("login").style.display = "block";
}

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("cam").srcObject = stream;
    document.getElementById("chatVideo").srcObject = stream; // Simulate other peer
  } catch {
    alert("Camera/Mic permission denied");
  }
}

async function loadModels() {
  const url = "https://justadudewhohacks.github.io/face-api.js/models";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(url),
    faceapi.nets.faceLandmark68Net.loadFromUri(url),
    faceapi.nets.faceRecognitionNet.loadFromUri(url)
  ]);
}

async function registerFace() {
  const video = document.getElementById("cam");
  const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                               .withFaceLandmarks().withFaceDescriptor();
  if (result) {
    faceData = new faceapi.LabeledFaceDescriptors("user", [result.descriptor]);
    alert("Face registered");
  } else {
    alert("No face detected");
  }
}

async function authenticateFace() {
  if (!faceData) return alert("No face data registered");

  const video = document.getElementById("cam");
  const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                               .withFaceLandmarks().withFaceDescriptor();
  if (!result) return alert("No face detected");

  const matcher = new faceapi.FaceMatcher([faceData], 0.6);
  const match = matcher.findBestMatch(result.descriptor);

  if (match.label === "user") {
    document.getElementById("auth").style.display = "none";
    document.getElementById("chat").style.display = "block";
  } else {
    alert("Face not recognized");
  }
}

function fullscreen() {
  const video = document.getElementById("chatVideo");
  if (video.requestFullscreen) video.requestFullscreen();
}

function setQuality(value) {
  alert("Quality set to: " + value);
}
