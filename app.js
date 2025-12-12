// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDdVaZmpvM0hqkmuOmXbrLqQpKu0Lq-tQ0",
  authDomain: "fir-project-52b71.firebaseapp.com",
  projectId: "fir-project-52b71",
  storageBucket: "fir-project-52b71.firebasestorage.app",
  messagingSenderId: "144970758936",
  appId: "1:144970758936:web:af7d9bd873e3a7fa703c6d",
  measurementId: "G-WPF27EHNWS"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();

// DOM
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const feedArea = document.getElementById("feed-area");
const usernameSpan = document.getElementById("username");
const postBtn = document.getElementById("post-btn");
const messageInput = document.getElementById("message-input");
const messagesList = document.getElementById("messages-list");

// Signup
signupBtn.onclick = () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Compte créé !"))
    .catch(err => alert(err.message));
};

// Login
loginBtn.onclick = () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("Connecté !"))
    .catch(err => alert(err.message));
};

// Logout
logoutBtn.onclick = () => auth.signOut();

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    feedArea.style.display = "block";
    usernameSpan.textContent = `Hello ${user.email}`;
  } else {
    feedArea.style.display = "none";
    usernameSpan.textContent = "";
  }
});

// Post message
postBtn.onclick = () => {
  const user = auth.currentUser;
  const text = messageInput.value;

  if (!user) { alert("Connecte-toi d'abord !"); return; }
  if (!text.trim()) { alert("Message vide"); return; }

  db.collection("messages").add({
    text: text,
    userId: user.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = "";
};

// Real-time messages
db.collection("messages")
  .orderBy("timestamp", "desc")
  .onSnapshot(snapshot => {
    messagesList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();

      const date = data.timestamp
        ? new Date(data.timestamp.toDate()).toLocaleString()
        : "⏳";

      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${data.userEmail}</strong>
        <br>
        ${data.text}
        <div style="font-size:0.75rem; opacity:0.6; margin-top:4px;">${date}</div>
      `;
      messagesList.appendChild(div);
    });
  });
