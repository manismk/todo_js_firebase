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

if (window.location.pathname === "/todo.html") {
  updateUserData();
}
function updateUserData() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user);
      userName.innerText = `Welcome ${firebase.auth().currentUser.displayName}`;
    } else {
    }
  });
}

if (addTodo) {
  addTodo.addEventListener("click", addToFirebase);
  function addToFirebase() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const ref = db.collection(
          `users/${firebase.auth().currentUser.uid}/todos`
        );
        ref.add({
          text: todo.value,
          complete: false,
          creadtedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
      }
    });
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

/*

  let tr = `
  <div class="list green">
  <p class="todoText">abchvsdzfxy cvsbihgdxhgrdhjjdg</p>
  <div class="doneDelete">
    <button class="done">Done</button>
    <button class="delete">Delete</button>
  </div>
  </div>
  `;
  
    todolist.insertAdjacentHTML("beforeend", tr);
*/
