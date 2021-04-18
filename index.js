const signIn = document.querySelector(".googleSignIn");
if (signIn) {
  signIn.addEventListener("click", googleSignIn);

  function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((results) => {
        window.location.assign("./todo.html");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
const userName = document.querySelector("#userName");
const signOut = document.querySelector(".signOut");
const todolist = document.querySelector(".todoList");
const addTodo = document.querySelector(".addTodo");
const todo = document.querySelector("#todo");
let userUid;
if (window.location.pathname === "/todo.html") {
  updateUserData();
}

function renderUserData(doc) {
  let color;
  if (doc.data().complete === false) {
    color = "green";
  } else {
    color = "red";
  }

  let divList = `
  <div class="list ${color}" data-id='${doc.id}'>
    <p class="todoText">${doc.data().text}</p>
    <div class="doneDelete">
      <i class="done fas fa-check"></i>
      <i class="delete fas fa-trash-alt"></i>
    </div>
  </div>
  `;

  todolist.insertAdjacentHTML("beforeend", divList);

  const btnDone = document.querySelector(`[data-id='${doc.id}'] .done`);

  btnDone.addEventListener("click", () => {
    db.collection(`users/${userUid}/todos`).doc(`${doc.id}`).update({
      complete: true,
    });
  });

  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .delete`);
  btnDelete.addEventListener("click", () => {
    db.collection(`users/${userUid}/todos`)
      .doc(`${doc.id}`)
      .delete()
      .then(() => {
        console.log("Document succesfully deleted!");
      })
      .catch((err) => {
        console.log("Error removing document", err);
      });
  });
}

function updateUserData() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //console.log(user);
      userName.innerText = `Welcome ${firebase.auth().currentUser.displayName}`;
      userUid = firebase.auth().currentUser.uid;
    } else {
    }
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    db.collection(`users/${userUid}/todos`)
      .orderBy("creadtedAt", "desc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            renderUserData(change.doc);
          }
          if (change.type === "removed") {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);

            todolist.removeChild(tr);
          }
          if (change.type === "modified") {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);

            todolist.removeChild(tr);
            console.log("entered modified");
            renderUserData(change.doc);
          }
        });
      });
  } else {
  }
});

if (addTodo) {
  addTodo.addEventListener("click", addToFirebase);

  function addToFirebase() {
    if (todo.value === "") {
      alert("please enter something");
    } else {
      const ref = db.collection(`users/${userUid}/todos`);
      ref.add({
        text: todo.value,
        complete: false,
        creadtedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
}

if (signOut) {
  signOut.addEventListener("click", signOutFunction);
  function signOutFunction() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.assign("./index.html");
      })
      .catch((error) => {
        // An error happened.
      });
  }
}
