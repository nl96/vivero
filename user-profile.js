
document.addEventListener("DOMContentLoaded", function (e) {

    // Usuarios no logueados son redireccionar al inicio de sesión
    if (!(localStorage.getItem("Vivero-User-Logged"))) {
        sessionStorage.setItem("redirLogin", JSON.stringify({
            from: "user-profile.html",
            msg: "Debes iniciar sesión para acceder a su perfil."
        }));
        window.location = "login.html";

    } else {

        if (localStorage.getItem("data-User-Profile")){
            let dataUser = JSON.parse(localStorage.getItem("data-User-Profile"));

            if(dataUser.img != ""){
                document.getElementById("imgUser").src = dataUser.img;
            }
            document.getElementById("inputAvatar").value = dataUser.img;
            document.getElementById("inputName").value = dataUser.name;
            document.getElementById("inputLastName").value = dataUser.lastName;
            document.getElementById("inputAge").value = dataUser.age;
            document.getElementById("inputEmail").value = dataUser.email;
            document.getElementById("inputPhone").value = dataUser.phone;
        }

        document.getElementById("userProfile").addEventListener("submit", function(event){
            let newDataUser = {
                img: document.getElementById("inputAvatar").value,
                name: document.getElementById("inputName").value,
                lastName: document.getElementById("inputLastName").value,
                age: document.getElementById("inputAge").value,
                email: document.getElementById("inputEmail").value,
                phone: document.getElementById("inputPhone").value
            }
            localStorage.setItem("data-User-Profile", JSON.stringify(newDataUser))
            window.location = "user-profile.html";

            // Previene que el formulario se envíe (comportamiento por defecto del navegador)
            if (event.preventDefault) event.preventDefault();
            return false;
        });
    }
});