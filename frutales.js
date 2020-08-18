let frutalesArray = [];

let minPrice = undefined;
let maxPrice = undefined;

function showItemsList(array){

    let item = "";
    for(let i = 0; i < array.length; i++){
        let pos = array[i];

        if ((minPrice == undefined || (minPrice != undefined && minPrice <= parseInt(pos.price))) && 
            (maxPrice == undefined || (maxPrice != undefined && maxPrice >= parseInt(pos.price)))) {

            item += `
            <div class="item">
                <h2 class="">`+ pos.title +`</h2>
                <span class="float-right-top" title="` + pos.currency + `"> Precio: $` + pos.price + `</span>
                <p>` + pos.description + `</p>
            </div>`
        }

        document.getElementById("listado").innerHTML = item;
    }
}

document.addEventListener("DOMContentLoaded", function(e){

    getJSONData(LIST_URL_FRUTALES).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            frutalesArray = resultObj.data;
            //Muestro las categorías ordenadas
            showItemsList(frutalesArray);
        }
    });

    document.getElementById("filter").addEventListener("click", function() {
        minPrice = document.getElementById("min-value").value;
        maxPrice = document.getElementById("max-value").value;

        if (minPrice != undefined && minPrice != "" && parseInt(minPrice) >= 0) {
            minPrice = parseInt(minPrice);
        }
        else {
            minPrice = undefined;
        }
        if (maxPrice != undefined && maxPrice != "" && parseInt(maxPrice) >= 0) {
            maxPrice = parseInt(maxPrice);
        }
        else {
            maxPrice = undefined;
        }

        //Muestro los productos filtrados
        showItemsList(frutalesArray);

    });

    document.getElementById("erase").addEventListener("click", function() {
        document.getElementById("min-value").value = undefined;
        document.getElementById("max-value").value = undefined;

        minPrice = undefined;
        maxPrice = undefined;

        //Muestro todos los productos
        showItemsList(frutalesArray);
    });

});