var frutalesArray = [];

function showItemsList(array){

    let item = "";
    for(let i = 0; i < array.length; i++){
        let pos = array[i];

        item += `
        <div class="item">
            <h2 class="">`+ pos.title +`</h2>
            <span class="float-right-top" title="` + pos.currency + `"> Precio: $` + pos.price + `</span>
            <p>` + pos.description + `</p>
        </div>`

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
});