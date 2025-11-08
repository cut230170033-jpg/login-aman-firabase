// module imports from Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, setDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* --- MASUKKAN firebaseConfig DARI FIREBASE CONSOLE DI SINI --- */
const firebaseConfig = {
  apiKey: "AIzaSyB8pDV2EQCi2nAu6c2gEtWuCMj7kVmrU3M",
  authDomain: "login-aman-firabase-63664.firebaseapp.com",
  projectId: "login-aman-firabase-63664",
  storageBucket: "login-aman-firabase-63664.firebasestorage.app",
  messagingSenderId: "158072906071",
  appId: "1:158072906071:web:cce09ea0a1d01f84e59e12"
};


/* ----------------------------------------------------------- */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM
const regEmail = document.getElementById("regEmail");
const regPass = document.getElementById("regPass");
const loginEmail = document.getElementById("loginEmail");
const loginPass = document.getElementById("loginPass");
const btnRegister = document.getElementById("btnRegister");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const userPage = document.getElementById("userPage");
const authForms = document.getElementById("authForms");
const userEmailSpan = document.getElementById("userEmail");
const userIdP = document.getElementById("userId");
const messages = document.getElementById("messages");

// helper
function showMessage(msg, isError=true){
  messages.textContent = msg;
  messages.style.color = isError ? "#d32f2f" : "#2e7d32";
  setTimeout(()=> messages.textContent = "", 4000);
}

// Register
btnRegister.addEventListener("click", async () => {
  const email = regEmail.value.trim();
  const pass = regPass.value;
  if (!email || pass.length < 6) { showMessage("Email kosong atau password <6 karakter"); return; }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", cred.user.uid), { email, createdAt: new Date().toISOString() });
    showMessage("Registrasi berhasil! Silakan login.", false);
    regEmail.value = ""; regPass.value = "";
  } catch (e) {
    showMessage(e.message);
  }
});

// Login
btnLogin.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const pass = loginPass.value;
  if (!email || !pass) { showMessage("Isi email dan password"); return; }
  try {
    const user = await signInWithEmailAndPassword(auth, email, pass);
    showMessage("Login sukses", false);
  } catch (e) {
    showMessage(e.message);
  }
});

// Logout
btnLogout.addEventListener("click", async () => {
  try { await signOut(auth); showMessage("Logout berhasil", false); }
  catch (e) { showMessage(e.message); }
});

// Observe auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    authForms.classList.add("hidden");
    userPage.classList.remove("hidden");
    userEmailSpan.textContent = user.email;
    userIdP.textContent = 'UID: ${user.uid}';
  } else {
    authForms.classList.remove("hidden");
    userPage.classList.add("hidden");
  }
});