/**
 * ===================================================================
 * VAIDEHI // DIGITAL SPACE — FIREBASE CONFIGURATION & SERVICE LAYER
 * ===================================================================
 * 
 * Replace the placeholder credentials below with your web app credentials
 * from Firebase Console (https://console.firebase.google.com/).
 * 
 * NOTE: If credentials remain as placeholders, the application
 * automatically operates in Local Simulation Mode (persisting to localStorage)
 * so that all features (contact form & admin dashboard) work smoothly right away!
 */

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const isConfigured = 
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

const LOCAL_STORAGE_KEY = "vaidehi_digital_messages";

let app = null;
let auth = null;
let db = null;

if (typeof firebase !== "undefined" && isConfigured) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log("🚀 [Firebase] Live Cloud Firestore & Authentication initialized.");
  } catch (err) {
    console.warn("⚠️ [Firebase] Initialization failed, using local simulation storage:", err);
  }
} else {
  console.info("ℹ️ [Firebase] Running in Local Simulation Mode. Add your API keys in firebase/firebase-config.js to sync with live Cloud Firestore.");
}

function getLocalMessages() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initial = [
        {
          id: "msg_demo_01",
          name: "Dr. Ananya Sharma",
          email: "asharma@innovate-tech.org",
          subject: "Invitation: Hackathon Judge & Student Speaker",
          message: "Hi Vaidehi! We came across your portfolio and your impressive 9.43 CGPA. We'd love to invite you to present your Agritech and AI study projects at our upcoming regional student tech symposium.",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: "unread"
        },
        {
          id: "msg_demo_02",
          name: "Rohan Patel",
          email: "rohan.p@cloudscale.io",
          subject: "Collaboration on Data Visualization Projects",
          message: "Hey Vaidehi, awesome portfolio! I saw your Power BI and Tableau visualization dashboards. Would love to discuss an open-source collaboration on student analytics.",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          status: "read"
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function sendContactMessage(payload) {
  const messageData = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    createdAt: new Date().toISOString(),
    status: "unread"
  };

  if (db && isConfigured) {
    try {
      const docRef = await db.collection("contactMessages").add(messageData);
      return { success: true, id: docRef.id, mode: "cloud" };
    } catch (err) {
      console.error("Firestore save error, falling back to local:", err);
      return saveLocally(messageData);
    }
  } else {
    return saveLocally(messageData);
  }
}

function saveLocally(messageData) {
  const list = getLocalMessages();
  const id = "local_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
  const entry = { id, ...messageData };
  list.unshift(entry);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  return { success: true, id, mode: "local" };
}

async function fetchAllMessages() {
  if (db && isConfigured) {
    try {
      const snapshot = await db.collection("contactMessages").orderBy("createdAt", "desc").get();
      const messages = [];
      snapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, messages, mode: "cloud" };
    } catch (err) {
      console.warn("Could not load from Firestore, using local:", err);
      return { success: true, messages: getLocalMessages(), mode: "local" };
    }
  } else {
    return { success: true, messages: getLocalMessages(), mode: "local" };
  }
}

async function updateMessageStatus(id, newStatus) {
  if (db && isConfigured && !id.startsWith("local_") && !id.startsWith("msg_demo_")) {
    try {
      await db.collection("contactMessages").doc(id).update({ status: newStatus });
      return { success: true, mode: "cloud" };
    } catch (err) {
      console.error("Firestore status update failed:", err);
    }
  }

  const list = getLocalMessages();
  const item = list.find(m => m.id === id);
  if (item) {
    item.status = newStatus;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return { success: true, mode: "local" };
  }
  return { success: false, error: "Message not found" };
}

async function deleteMessage(id) {
  if (db && isConfigured && !id.startsWith("local_") && !id.startsWith("msg_demo_")) {
    try {
      await db.collection("contactMessages").doc(id).delete();
      return { success: true, mode: "cloud" };
    } catch (err) {
      console.error("Firestore delete failed:", err);
    }
  }

  let list = getLocalMessages();
  list = list.filter(m => m.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  return { success: true, mode: "local" };
}

async function adminSignIn(email, password) {
  if (auth && isConfigured) {
    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: cred.user, mode: "cloud" };
    } catch (err) {
      return { success: false, error: err.message, code: err.code };
    }
  } else {
    // Local testing default admin account:
    // admin@vaidehi.space / vaidehi2026
    if (email.trim().toLowerCase() === "admin@vaidehi.space" && password === "vaidehi2026") {
      const demoUser = { email: "admin@vaidehi.space", uid: "demo-admin-vh", displayName: "Vaidehi Harde" };
      sessionStorage.setItem("vh_demo_admin_auth", JSON.stringify(demoUser));
      return { success: true, user: demoUser, mode: "local" };
    } else {
      return { 
        success: false, 
        error: "Firebase not yet linked. For local testing, use:\nEmail: admin@vaidehi.space\nPassword: vaidehi2026\nOr add your Firebase credentials in firebase/firebase-config.js." 
      };
    }
  }
}

async function adminSignOut() {
  sessionStorage.removeItem("vh_demo_admin_auth");
  if (auth && isConfigured) {
    await auth.signOut();
  }
  return { success: true };
}

function getCurrentAdminUser(callback) {
  if (auth && isConfigured) {
    auth.onAuthStateChanged(user => {
      callback(user);
    });
  } else {
    const raw = sessionStorage.getItem("vh_demo_admin_auth");
    if (raw) {
      try {
        callback(JSON.parse(raw));
      } catch (e) {
        callback(null);
      }
    } else {
      callback(null);
    }
  }
}

window.VH_FIREBASE = {
  isConfigured,
  sendContactMessage,
  fetchAllMessages,
  updateMessageStatus,
  deleteMessage,
  adminSignIn,
  adminSignOut,
  getCurrentAdminUser
};
