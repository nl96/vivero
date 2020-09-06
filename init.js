const LIST_URL_FRUTALES = "https://nl96.github.io/vivero/frutales.json";
const LIST_URL_COMENTARIOS = "https://nl96.github.io/vivero/comments.json";
const USUARIOS_URL = "https://danielk2020.github.io/biblioteca/usuarios.json";

var getJSONData = function(url){
    var result = {};
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}


document.addEventListener("DOMContentLoaded", function (e) {
  if (document.getElementById("login")){
    let userLogged = localStorage.getItem("User-Logged");
    let infoUser = document.getElementById("login");
    let user = document.getElementById("user");

    if (userLogged) {
      infoUser.style.display = "inline-block";
      userLogged = JSON.parse(userLogged);
      user.innerText = user.innerText + "Usuario logeado: " + userLogged.email;
    }

    document.getElementById("logout").addEventListener("click", function(){
      localStorage.removeItem("User-Logged");
      window.location = "login.html";
    });
  }
});