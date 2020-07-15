// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9R432wmS3XgE7g8uFfm6Mz0ITOHtql5M",
  authDomain: "serverless-2-5105d.firebaseapp.com",
  databaseURL: "https://serverless-2-5105d.firebaseio.com",
  projectId: "serverless-2-5105d",
  storageBucket: "serverless-2-5105d.appspot.com",
  messagingSenderId: "895138823895",
  appId: "1:895138823895:web:a5437993af6720964cfa92",
  measurementId: "G-LQQF88SE9F",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// db
const db = firebase.firestore();
// db.settings({ timestampsInSnapshots: true });

const pandasList = document.getElementById("pandas-list");

function renderList(pandas, insertionPoint = pandasList) {
  const frag = document.createDocumentFragment();
  for (const panda of pandas) {
    console.log("panda", panda);
    const li = document.createElement("li");
    li.classList.add("panda");
    li.innerHTML = `<div class="avatar"><img width="200" src="${panda.avatar}" alt="${panda.name}"></div><div class="name">${panda.name}</div><div class="controls"><button class="delete" data-id=${panda.id}>&times;</button></div>`;
    frag.append(li);
  }
  insertionPoint.innerHTML = "";
  insertionPoint.append(frag);
}

db.collection("pandas")
  // .where('name', '>', 'l') // caps are considered greater than lower case
  .orderBy("name") // if both then you may get an error about indexes and you should follow the link in the console and click 'create index'
  .get()
  .then((snapshot) => {
    console.log(snapshot.docs);
    const pandas = snapshot.docs.map((doc) =>
      Object.assign({ id: doc.id }, doc.data())
    );
    renderList(pandas);
  });

const pandaForm = document.getElementById("panda-form");
pandaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(pandaForm);
  const data = Object.fromEntries(formData);
  console.log("new panda data", data);
  db.collection("pandas").add(data);
});

pandasList.addEventListener("click", (e) => {
  console.log("clicked", e.target);
  const { id } = e.target.dataset;
  if (e.target && e.target.matches(".delete")) {
    console.log("deleting", id);
    db.collection("pandas").doc(id).delete();
  }
});

// Real-time listener
db.collection("pandas")
  .orderBy("name")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    for (const change of changes) {
      if (change.type === "added") {
        console.log('added', change)
      } else if (change.type === "removed") {
        console.log("removed", change);
      }
    }
  });
