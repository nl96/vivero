let frutalesArray = [];
let comentariosArray = [];
let imagenesObjArray = {};

// Muestro producto seleccionado
function showArticle(code) {

    for (let i = 0; i < frutalesArray.length; i++) {
        const article = frutalesArray[i];
        if (article.code == code.articleCode) {
            document.getElementById("title").innerHTML = article.title;
            document.getElementById("description").innerHTML = article.description;
            document.getElementById("price").innerHTML = article.price;
            document.getElementById("currency").innerHTML = article.currency;
        }
    }
    
}
// Muestro imágenes del producto seleccionado
function showImages(code) {

    let num = code.articleCode;
    let imagesArray = imagenesObjArray[num];
    let images = document.getElementById("images");
    let mainImg = ``;
    let navGallery = ``;

    function setToFirstElement(i, setFirst, setDefault) {
        if (i == 0 && setFirst != undefined) {
            return setFirst;
        } else {
            return setDefault;
        }
    }
    for (const img in imagesArray) {
        mainImg += `<input type="radio" name="view" id="view${parseInt(img) + 1}" hidden  ${setToFirstElement(img, 'checked', '')}>
                    <img src="article-img/${num}/${imagesArray[img]}" alt="">`;
        if (imagesArray.length > 1){
            navGallery += `<div>
                            <label for="view${parseInt(img) + 1}"><img src="article-img/${num}/${imagesArray[img]}" alt=""></label>
                        </div>`;
        }
        images.innerHTML = `
                <div id="mainImg">
                    <img class="prop" src="article-img/area.png" alt="" width="640" height="360">
                    <div>${mainImg}</div>
                </div>
                <div id="navGallery">
                    <div class="center">${navGallery}</div>
                </div>`;
    }
}

// Comprar
function comprar(){
    sessionStorage.setItem("new-buy", localStorage.getItem("articulo"));
    window.location = "cart.html";
}

// Muentro comentarios del producto seleccionado
function showComments(code){
    let listComments = document.getElementById("list-comments");
    let newComment = "";
    function stars(num){
        let addStar = "";
        for (let i = 0;  i < 5; i++) {
            if(i < num){
                addStar += '<span class="box"><span class="star star-active"></span></span>';
            } else {
                addStar += '<span class="box"><span class="star"></span></span>';
            }
        }
        return addStar;
    }
    for (const foreignKey in comentariosArray) {
        let comment = comentariosArray[foreignKey]
        if (comment.articleId == code.articleCode) {
            newComment += ` 
            <div class="comment item">
                <span> ${comment.user} </span>
                <br/>
                <span class="time"> ${comment.date} </span>
                <div class="score">
                    ${stars(comment.stars)}
                </div>
                <p> ${comment.comment} </p>
            </div>
            `;
            listComments.innerHTML = newComment;
        }
    }
}

// Añado comentario
function addNewComment() {
    function getStarValue(starRadioGroup) {
        let stars = document.getElementsByName(starRadioGroup);
        for (let i = 0; i < stars.length; i++)
        {
            if (stars[i].checked)
            {
                return stars[i].value;
            }
        }
    }
    function addZero(t){
        if(t < 10){
            return ("0"+t);
        }
        return t;
    }
    let userLogged = JSON.parse(localStorage.getItem("Vivero-User-Logged"));
    let newComment = document.getElementById("new-comment");
    let comment = newComment.value;
    
    let rate = document.getElementById("rate");
    rate.classList.remove("sendCommentInvalid");
    newComment.classList.remove("sendCommentInvalid");
    
    if(userLogged && comment != "" && getStarValue("stars") != undefined){
        let time = new Date();
        let newComment = {
            articleId: (JSON.parse(localStorage.getItem("articulo")).articleCode),
            user: userLogged.email,
            date: time.getDate()+"/"+(time.getMonth() + 1)+"/"+time.getFullYear()+" "+time.getHours()+":"+addZero(time.getMinutes()),
            stars: getStarValue("stars"),
            comment: comment
        }
        comentariosArray.push(newComment);
        showComments(JSON.parse(localStorage.getItem("articulo")));
        
        document.getElementById("new-comment").value = "";
        document.getElementsByName("stars")[getStarValue("stars") - 1].checked = false;
    } else {


        if(newComment.value == ""){
            newComment.classList.add("sendCommentInvalid");
        } 
        if(getStarValue("stars") == undefined){
            rate.classList.add("sendCommentInvalid");
        } 
    }
}


document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(LIST_URL_FRUTALES).then(function (resultObj) {
        if (resultObj.status === "ok") {
            frutalesArray = resultObj.data;
            showArticle(JSON.parse(localStorage.getItem("articulo")));
        }

    });
    getJSONData(LIST_URL_COMENTARIOS).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comentariosArray = resultObj.data;
            showComments(JSON.parse(localStorage.getItem("articulo")));
        }

    });
    getJSONData(LIST_URL_IMAGES).then(function (resultObj) {
        if (resultObj.status === "ok") {
            imagenesObjArray = resultObj.data;
            // Muestro imágenes
            showImages(JSON.parse(localStorage.getItem("articulo")));
        }

    });
    if (document.getElementById("boxComment")){
      let userLogged = localStorage.getItem("Vivero-User-Logged");
  
      if (userLogged) {
        document.getElementById("boxComment").removeAttribute("hidden");
      }
    }
});