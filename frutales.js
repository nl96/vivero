let frutalesArray = [];

// Filtro
let minPrice = undefined;
let maxPrice = undefined;

// Ordeno
const ORDER_ASC_BY_TITLE = "A->Z";
const ORDER_DESC_BY_TITLE = "Z->A";
const ORDER_ASC_BY_PRICE = "0->9";
const ORDER_DESC_BY_PRICE = "9->0";
const ORDER_ASC_BY_CODE = "CodAsc";
const ORDER_DESC_BY_CODE = "CodDesc";

function sortItemsList(criterio, array){
    let result = [];
    if (criterio === ORDER_ASC_BY_TITLE){
        result = array.sort(function(a, b) {
            if ( a.title < b.title ){ return -1; }
            if ( a.title > b.title ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_DESC_BY_TITLE){
        result = array.sort(function(a, b) {
            if ( a.title > b.title ){ return -1; }
            if ( a.title < b.title ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_ASC_BY_PRICE){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.price);
            let bCount = parseInt(b.price);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.price);
            let bCount = parseInt(b.price);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_ASC_BY_CODE){
        result = array.sort(function(a, b) {
            let aNum = parseInt(a.code);
            let bNum = parseInt(b.code);

            if ( aNum < bNum ){ return -1; }
            if ( aNum > bNum ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_DESC_BY_CODE){
        result = array.sort(function(a, b) {
            let aNum = parseInt(a.code);
            let bNum = parseInt(b.code);

            if ( aNum > bNum ){ return -1; }
            if ( aNum < bNum ){ return 1; }
            return 0;
        });
    }
    // Devuelvo lista ordenada
    return result;
}

// Busco
let termSearch = undefined;

function search(text1, text2) {
	text = text1 + " " + text2;
    return (text.toLowerCase()).search(termSearch.toLowerCase());
}

function markWordsSearch(mark){
    if (termSearch != undefined) {
        let xPos = (mark.toLowerCase()).search(termSearch.toLowerCase());
        let word = "";
        if (xPos != -1) {
            for (let i = xPos; i < (xPos + termSearch.length); i++ ) {
                word += mark.charAt(i);
            }
        }
        return mark.replace(word, "<mark>"+word+"</mark>");
    } else {
        return mark
    }
}

function showItemsList(array){

    let item = "";
    for(let i = 0; i < array.length; i++){
        let pos = array[i];
        
        if (termSearch == undefined || search(pos.title, pos.description) >= 0) {

            if ((minPrice == undefined || (minPrice != undefined && minPrice <= parseInt(pos.price))) && 
                (maxPrice == undefined || (maxPrice != undefined && maxPrice >= parseInt(pos.price)))) {

                item += `
                <div class="item">
                    <h2 class="">`+ markWordsSearch(pos.title) +`</h2>
                    <input type="button" class="float-right-top" value="Acceder" onclick="acceder(` + pos.code + `)"/>
                    <span class="float-right-top" title="` + pos.currency + `"> Precio: $` + pos.price + `</span>
                    <span class="float-right-top" hidden> Código: ` + pos.code + `</span>
                    <p>` + markWordsSearch(pos.description) + `</p>
                </div>`
            }
        }
        document.getElementById("listado").innerHTML = item;
    }
}

// Acceder
function acceder(code){
    localStorage.setItem("articulo", JSON.stringify({articleCode: code}));
    window.location = "articulo-info.html";
}

document.addEventListener("DOMContentLoaded", function(e){

    getJSONData(LIST_URL_FRUTALES).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            frutalesArray = resultObj.data;
            // Inicio con lista ordenada
            frutalesArray = sortItemsList(ORDER_ASC_BY_TITLE, frutalesArray);
            //Muestro las categorías ordenadas
            showItemsList(frutalesArray);
        }
    });

    // Filtrado
    document.getElementById("filter").addEventListener("click", function() {

        // Agrego valores a las variables minPrice y maxPrice
        minPrice = document.getElementById("min-value").value;
        maxPrice = document.getElementById("max-value").value;

        // Convierto la cadena en entero si los hay en los campos numéricos
        if (minPrice != undefined && minPrice != "" && parseInt(minPrice) >= 0) {
            minPrice = parseInt(minPrice);
        } else {
            minPrice = undefined;
        }
        
        if (maxPrice != undefined && maxPrice != "" && parseInt(maxPrice) >= 0) {
            maxPrice = parseInt(maxPrice);
        } else {
            maxPrice = undefined;
        }

        //Muestro los productos filtrados por precio
        showItemsList(frutalesArray);

    });
    // Deshacer filtrado
    document.getElementById("erase").addEventListener("click", function() {

        // Vacio los campos numéricos y elimino valores a las variables minPrice y maxPrice
        document.getElementById("min-value").value = "";
        document.getElementById("max-value").value = "";
        minPrice = undefined;
        maxPrice = undefined;

        //Muestro todos los productos
        showItemsList(frutalesArray);
    });

    // Ordenado
    document.getElementById("sortTitleAsc").addEventListener("click", function(){
        frutalesArray = sortItemsList(ORDER_ASC_BY_TITLE, frutalesArray);
        //Muestro los productos ordenados por título de forma ascendente
        showItemsList(frutalesArray);
    });
    document.getElementById("sortTitleDesc").addEventListener("click", function(){
        frutalesArray = sortItemsList(ORDER_DESC_BY_TITLE, frutalesArray);
        //Muestro los productos ordenados por título de forma descendente
        showItemsList(frutalesArray);
    });

    document.getElementById("sortPriceAsc").addEventListener("click", function(){
        frutalesArray = sortItemsList(ORDER_ASC_BY_PRICE, frutalesArray);
        //Muestro los productos ordenados por precio de forma ascendente
        showItemsList(frutalesArray);
    });
    document.getElementById("sortPriceDesc").addEventListener("click", function(){
        frutalesArray = sortItemsList(ORDER_DESC_BY_PRICE, frutalesArray);
        //Muestro los productos ordenados por precio de forma descendente
        showItemsList(frutalesArray);
    });

    document.getElementById("sortCodeAsc").addEventListener("click", function(){
        frutalesArray = sortItemsList(ORDER_ASC_BY_CODE, frutalesArray);
        //Muestro los productos ordenados por código de forma ascendente
        showItemsList(frutalesArray);
    });
    document.getElementById("sortCodeDesc").addEventListener("click", function(){
        frutalesArray = sortItemsList(ORDER_DESC_BY_CODE, frutalesArray);
        //Muestro los productos ordenados por código de forma descendente
        showItemsList(frutalesArray);
    });

    document.getElementById("search").addEventListener("keyup", function(){
        termSearch = document.getElementById("search").value;
        document.getElementById("inputErase").removeAttribute("hidden");
        if (termSearch == ""){
            document.getElementById("inputErase").setAttribute("hidden", true);
        }
        //Muestro los productos por busqueda
        showItemsList(frutalesArray);
    });
    document.getElementById("inputErase").addEventListener("click", function(){
        document.getElementById("search").value = "";
        document.getElementById("inputErase").setAttribute("hidden", true);
        termSearch = undefined;
        //Muestro los productos por busqueda
        showItemsList(frutalesArray);
    });

});
