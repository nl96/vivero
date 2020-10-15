const LIST_URL_FRUTALES = "https://nl96.github.io/vivero/frutales.json";
const LIST_URL_COMENTARIOS = "https://nl96.github.io/vivero/comments.json";
const LIST_URL_IMAGES = "https://nl96.github.io/vivero/article-img/code-img.json";
const USUARIOS_URL = "https://danielk2020.github.io/biblioteca/usuarios.json";
const CART_URL = "cart.json";

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

  if (document.getElementById("login")) {
    let userLogged = localStorage.getItem("Vivero-User-Logged");
    let infoUser = document.getElementById("login");

    if (userLogged) {
      infoUser.innerHTML = `<button class="btn-menu">Cuenta
      <div hidden class="btn-menu-dropdown">
        <span id="user">Usuario logeado: ` + JSON.parse(userLogged).email + `</span>
        <a href="user-profile.html">Mi Perfil</a>
        <a href="cart.html">Mi Carrito</a>
        <input id="logout" type="button" value="Cerrar sesión"/>
      </div>
    </button>`;

      document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("Vivero-User-Logged");
        window.location = "login.html";
      });
    }
  }
});