let frutalesArray = [];
let cartObjArray = {};

function getRadioValue(radioGroup) {
    let radioName = document.getElementsByName(radioGroup);
    for (let i = 0; i < radioName.length; i++) {
        if (radioName[i].checked) {
            return parseInt(radioName[i].value);
        }
    }
}
// Actualizo lista de departamentos
function dpto(zona){
    let dpto = document.getElementById("dpto");
    dpto.innerHTML = "";

    let listDpto = {
        mon: "Montevideo",
        met: ["Canelones", "San José"],
        int: ["Artigas", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado", "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "Soriano", "Tacuarembó", "Treinta y Tres"]
    }
    
    switch (zona) {
        case 100:
            let option = document.createElement("option");
            option.innerHTML = listDpto.mon;
            dpto.appendChild(option);
            break;
        case 200:
            for(let key in listDpto.met) {
                let option = document.createElement("option");
                option.innerHTML = listDpto.met[key];
                dpto.appendChild(option);
            }
            break;
        case 250:
            for(let key in listDpto.int) {
                let option = document.createElement("option");
                option.innerHTML = listDpto.int[key];
                dpto.appendChild(option);
            }
            break;
    
        default:
            break;
    }
}
// Actualizo coste total
function refreshTotal() {
    let list = cartObjArray.articleId;
    let outputTotal = document.getElementById("outputSubtotal");
    let subtotal = document.getElementById("subtotal");
    let sumSubtotal = 0;
    for (const i in list) {
        let price = frutalesArray[list[i]].price;
        let cant = parseInt(document.getElementById("cant" + list[i]).value);
        if (!(cant > 0)) {
            cant = 1;
            console.log(cant);
        }
        sumSubtotal += price * cant;
    }
    outputTotal.innerHTML = `<output name="total" for="cant${list.join(' cant')}" title="UYU">$${sumSubtotal}</output>`;
    subtotal.innerHTML = outputTotal.innerHTML;

    let total = document.getElementById("total");
    total.innerHTML = `<output name="total" for="mon met int cant${list.join(' cant')}" title="UYU">$${sumSubtotal + getRadioValue("zona")}</output>`;

    dpto(getRadioValue("zona"));
}

// Muestro articulos del carrito y costos
function showCart(cart) {
    let list = cart.articleId;
    let listCart = document.getElementById("listCart");
    listCart.innerHTML = "";

    if (list.length > 0) {
        let item = "";
        for (const i in list) {
            let article = frutalesArray[list[i]];
            item = `
            <tr>
              <td>${article.title}</td>
              <td>${article.currency} ${article.price}</td>
              <td><input type="number" name="cant${list[i]}" id="cant${list[i]}" max="100" min="1" step="1" value="1" size="3" oninput="a=parseInt(cant${list[i]}.value); if(!(a>0)){a=1}; result${list[i]}.value=${article.price}*a"></td>
              <td>$<output name="result${list[i]}" for="cant${list[i]}" title="UYU">${article.price}</output></td>
              <td>
                <button type="button" class="btn-menu">&nbsp;&vellip;&nbsp;
                  <div hidden class="btn-menu-dropdown">
                    <input type="button" value="Ver artículo" onclick="acceder(${list[i]})"/>
                    <input type="button" value="Quitar" onclick="remove(${i})"/>
                  </div>
                </button>
              </td>
            </tr>`;
            listCart.innerHTML += item;
        };

        let zona = document.getElementsByName("envio")[0];
        zona.innerHTML = '$' + getRadioValue("zona");

        refreshTotal();
    } else {
        document.getElementById("cart").innerHTML = "";

        let notif = document.getElementById("notif");
        notif.innerHTML = "No hay artículos en el carrito";
        notif.setAttribute("open", true);
    }
}

// Acceder
function remove(pos) {
    cartObjArray.articleId.splice(pos, 1);
    showCart(cartObjArray);
}

// Acceder
function acceder(code) {
    localStorage.setItem("articulo", JSON.stringify({ articleCode: code }));
    window.location = "articulo-info.html";
}

document.addEventListener("DOMContentLoaded", function(e){

    // Usuarios no logueados son redireccionar al inicio de sesión
    if (!(localStorage.getItem("Vivero-User-Logged"))) {
        sessionStorage.setItem("redirLogin", JSON.stringify({
            from: "cart.html",
            msg: "Debes iniciar sesión para comprar."
        }));
        window.location = "login.html";

    } else {

        getJSONData(LIST_URL_FRUTALES).then(function(resultObj){
            if (resultObj.status === "ok")
            {
                frutalesArray = resultObj.data;

                getJSONData(CART_URL).then(function(resultObj){
                    if (resultObj.status === "ok")
                    {
                        cartObjArray = resultObj.data;
                        
                        if (sessionStorage.getItem("new-buy")){
                            let articleCode = JSON.parse(sessionStorage.getItem("new-buy")).articleCode;
                            let existInCart = false;

                            cartObjArray.articleId.forEach(id => {
                                if (id == articleCode){
                                    existInCart = true
                                }
                            });
                            
                            if (!existInCart){
                                cartObjArray.articleId.push(articleCode);
                            }

                            sessionStorage.removeItem("new-buy");
                        }
                        // Mustro articulos del carrito
                        showCart(cartObjArray);
                    }
                });
            }
        });

        document.getElementById("cart").addEventListener("submit", function (e) {

            // Header modal
            let modalHeader = document.getElementById("modal-header").getElementsByTagName("h2")[0];
            modalHeader.innerHTML = "Resumen de compra"

            
            // Body modal
            let confirmData = {
                user: document.getElementById("nombre").value + " " + document.getElementById("apellido").value,
                dpt: document.getElementById("dpto").value,
                dir: document.getElementById("dir").value,
                cost: document.getElementById("total").innerText
            }

            let modalBody = document.getElementById("modal-body");
            modalBody.innerHTML = "";

            let p = document.createElement("p");
            modalBody.appendChild(p);

            p.innerHTML = `${confirmData.user}, su compra a sido realizada con excito.<br>
            Los productos serán enviados a la localidad de ${confirmData.dir} en el depantamento de ${confirmData.dpt}.<br>
            Costo total de ${confirmData.cost}.`;

            // Exit modal
            let modalClose = ["modalCloseOutside", "modalCloseTimes", "modalCloseBtn"];
            for(let key in modalClose) {
                document.getElementById(modalClose[key]).href = "index.html";
                document.getElementById(modalClose[key]).title = "Inicio";
            }

            // Footer modal
            document.getElementById("modal-footer").getElementsByTagName("input")[0].remove();
            document.getElementById(modalClose[2]).innerHTML = "Inicio";

            
            // Previene que el formulario se envíe (comportamiento por defecto del navegador)
            if (e.preventDefault) e.preventDefault();
            return false;

        });

    }

});