const firebaseConfig = {
  apiKey: "AIzaSyBCWtgwNEitPgx1b05X3aTqwTkhOQmDXXk",
  authDomain: "projalevano.firebaseapp.com",
  projectId: "projalevano",
  storageBucket: "projalevano.firebasestorage.app",
  messagingSenderId: "459761540470",
  appId: "1:459761540470:web:dd8a4bccee1a4931712e57",
  measurementId: "G-V728D4GDYS"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await auth.createUserWithEmailAndPassword(email, password);
  window.location = "dashboard.html";
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await auth.signInWithEmailAndPassword(email, password);
  window.location = "dashboard.html";
};

window.logout = async function () {
  await auth.signOut();
  window.location = "index.html";
};

// Solo cuando estamos en dashboard
if (window.location.pathname.includes("dashboard.html")) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location = "index.html";
      return;
    }

    const productList = document.getElementById("product-list");
    const colRef = db.collection("productos");
    const snapshot = await colRef.get();

    productList.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${data.name} - $${data.price} - Stock: ${data.stock}`;
      const del = document.createElement("button");
      del.textContent = "Eliminar";
      del.onclick = async () => {
        await colRef.doc(docSnap.id).delete();
        location.reload();
      };
      li.appendChild(del);
      productList.appendChild(li);
    });
  });

  window.addProduct = async function () {
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    await db.collection("productos").add({ name, price, stock });
    location.reload();
  };
}
