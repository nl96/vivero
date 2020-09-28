let usersArray = [];

function validateUser(array, userIn, passwordIn) {
    for (let i = 0; i < array.length; i++) {
        let usuario = array[i];
        if (usuario.email == userIn && usuario.password == passwordIn) {
            return true;
        }
    }
    return false;
}

document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById("submit").addEventListener("click", function(e){
        let inputEmail = document.getElementById("inputEmail");
        let inputPassword = document.getElementById("inputPassword");
        let camposCompletos = true;
    
        if (inputEmail.value === ""){
            inputEmail.classList.add("invalid");
            camposCompletos = false;
        }
        if (inputPassword.value === ""){
            inputPassword.classList.add("invalid");
            camposCompletos = false;
        }
    
        if (camposCompletos){
            
            getJSONData(USUARIOS_URL).then(function (resultObj){
                if (resultObj.status === "ok"){
                    usersArray = resultObj.data;
        
                    if (validateUser(usersArray, inputEmail.value, inputPassword.value)) {

                        localStorage.setItem("Vivero-User-Logged", JSON.stringify({email: inputEmail.value}));
                        
                        window.location = "index.html";
                    } else {
                        alert("Usuario o contraseña incorrectos");
                    }
                }
            });

        }
        else{
            alert("Debes ingresar correctamente los datos");
        }

    });
});