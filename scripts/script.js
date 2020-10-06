const apiKey = "QTKPx19XqTa8x4Oc7I17ZjFkMoJoW1MM";
let seeMoreClicks = 1;

async function searchGIF(search){

    let limit = 12;
    let offset = seeMoreClicks*limit - 12;

    let resp = await fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}&limit=${limit}&offset=${offset}`)
    let data = await resp.json();

    let gifArr = data.data;

    let searchResultsCtn = document.getElementById("search-results-ctn");
    let searchTitle = document.getElementById("search-title");

    console.log(data.data)

    if (data.data.length > 0){

        if (seeMoreClicks === 1)
        {
            searchResultsCtn.textContent = ""
        }
    
        searchTitle.textContent = search;
        searchTitle.style.textTransform = "capitalize";

        seeMore.classList.remove("hidden")
    
        for (let i = 0; i < limit; i++)
        {
            addGIFToDOM(gifArr[i], searchResultsCtn);
        }

    }else{
        searchResultsCtn.textContent = ""

        seeMore.classList.add("hidden")
        let img = document.createElement("img")
        let message = document.createElement("p")
        
        img.src = "assets/icon-busqueda-sin-resultado.svg"

        message.textContent = "Intentá con otra búsqueda"
        message.classList.add("message")

        searchTitle.textContent = "Sad times :("
        searchResultsCtn.appendChild(img);
        searchResultsCtn.appendChild(message)
        //Show no results message
    }
}

async function trendingGIF(){

    //Hago el fetch hacia la API de giphy y espero la respuesta de la promesa.
    let resp = await fetch(`https://api.giphy.com/v1/gifs/trending?&api_key=${apiKey}&limit=3`);
    let info = await resp.json();
    let carrousel = document.getElementById("carrousel");

    for (let i = 0; i < info.data.length; i++){
        // addGIFToTrending(info.data[i]);
        addGIFToDOM(info.data[i], carrousel)
    }
}

async function trendingWords(){

    let resp = await fetch(`https://api.giphy.com/v1/trending/searches?&api_key=${apiKey}`);
    let info = await resp.json();

    addToTrending(info.data);
}

async function autocomplete(){

    let resp = await fetch(`https://api.giphy.com/v1/gifs/search/tags?q=${this.value}&api_key=${apiKey}`);

    let data = await resp.json();
    let suggestions = data.data;

    let sugCtn = document.getElementById("suggestion-ctn");
    sugCtn.classList.remove("hidden");

    if (this.value === ""){
        sugCtn.classList.add("hidden");
        glass.src = "assets/icon-search.svg";
    }
    sugCtn.textContent = "";

    for(let i = 0; i < data.data.length; i++){
        autocompleteInDOM(suggestions[i].name, sugCtn)
    }
}

async function getFavGIFs(){

    let gifArr = favGifs;

    if (gifArr !== null){
        favCtn.textContent = ""
        gifArr = gifArr.join(',');
    
        let resp = await fetch(`https://api.giphy.com/v1/gifs?ids=${gifArr}&api_key=${apiKey}`);
        let data = await resp.json();
        console.log(data.data);

        for (let i = 0; i < data.data.length; i++){
            addGIFToDOM(data.data[i], favCtn);
        }

    }else{

        console.log('algo')
        //Mostrar página sin resultados

    }


}

let favGifs = JSON.parse(localStorage.getItem("favGIFs"));

if (favGifs === null){
    favGifs = [];
}

let searchCtn = document.getElementById("search-ctn");
let cross = document.getElementById("cross");
let glass = document.getElementById("search-icon");
let searchBar = document.getElementById("search-bar");
let search = document.getElementById("search-input");
let seeMore = document.getElementById("see-more");
let favorites = document.getElementById("favorites");
let favCtn = document.getElementById("fav-ctn")
let favoritesBtn = document.getElementById("favorites-btn");
let createGif = document.getElementById("create");
let createBtn = document.getElementById("create-gif-btn");
let myGifos = document.getElementById("my-gifos");
let myGifosBtn = document.getElementById("my-gifos-btn");
let dark = document.getElementById("dark-mode");
let darkBtn = document.getElementById("dark-mode-btn");
let results = document.getElementById("search-results");
let intro = document.getElementById("intro");
let home = document.getElementById("home");
let trendingTitle = document.getElementById("trend-title-container");
let trending = document.getElementById("trending");
let menu = document.getElementById("menu");
let hiddenSections = document.querySelectorAll("section.could-hide");

searchBar.addEventListener("focusin", searchSwitch);
searchBar.addEventListener("focusout", deSwitch);
search.addEventListener("keyup", autocomplete);
cross.addEventListener("mousedown", () => search.value = "");
glass.addEventListener("mousedown", runSearch);
// favorites.addEventListener("click", displayFavorites);

createBtn.addEventListener("click", () =>{
    
    hiddenSections.forEach(section => section.classList.add("hidden"));
    createGif.classList.remove("hidden");
    trending.classList.add("hidden-trending");
});

search.addEventListener("keyup", (e) =>{
    if (e.keyCode === 13){
        runSearch();
    }
})

home.addEventListener("click", () => {

    hiddenSections.forEach(section => section.classList.add("hidden"));
    
    trending.classList.remove("hidden-trending")
    intro.classList.remove("hidden");
    trendingTitle.classList.remove("hidden");
    search.value = "";
    menu.checked = false;
});

favoritesBtn.addEventListener("click", () => {

    hiddenSections.forEach(section => section.classList.add("hidden"));

    trending.classList.remove("hidden-trending")
    favorites.classList.remove("hidden");
    menu.checked = false;
    getFavGIFs();
});

seeMore.addEventListener("click", () => {
    seeMoreClicks = seeMoreClicks + 1;
    searchGIF(search.value);
});

let gifCardTemplate = document.getElementById("gif-card-template").content.firstElementChild;

trendingGIF();
trendingWords();

//Esta función agrega los GIFs al DOM
function addGIFToTrending(element){

    //Busco mi elemento carrousel
    let carrousel = document.getElementById("carrousel")

    //Creo mi contenedor de GIFs
    let gifCtn = document.createElement("div");
    gifCtn.classList.add("trend-gif-card");

    //Creo el img donde va a estar el GIF
    let gif = document.createElement("img");
    gif.src = element.images.fixed_height.url;
    gif.classList.add("gif");

    //Insertamos el img al contenedor de GIF y el contenedor al carrousel
    gifCtn.appendChild(gif);
    carrousel.appendChild(gifCtn);
}

function addGIFToDOM(gif, container){

    let gifClone = gifCardTemplate.cloneNode(true);
    let gifCtn = gifClone.children[1];

    gifCtn.classList.add("gif-ctn");

    let trueGif = gifCtn.children[0];

    trueGif.src = gif.images.fixed_height.url; 
    trueGif.classList.add("gif");

    let gifTitle = gifClone.children[0].children[1];
    let gifAuthor = gifClone.children[0].children[0];

    let gifInfo = gif.title.split("GIF by");

    if (gifInfo.length === 1){
        gifAuthor.textContent = "Anonymous";
        gifTitle.textContent = gifInfo[0];
    }else{
        gifAuthor.textContent = gifInfo[1];
        gifTitle.textContent = gifInfo[0];
    }

    trueGif.id = gif.id;

    let favBtn = gifClone.children[2].children[0];
    let downloadBtn = gifClone.children[2].children[1];
    let expandBtn = gifClone.children[2].children[2];

    favBtn.style.cursor = "pointer";
    downloadBtn.style.cursor = "pointer";
    expandBtn.style.cursor = "pointer";

    let onFavs = favGifs.find(giphy => giphy === gif.id)

    if (onFavs !== undefined){
        favBtn.src = "assets/icon-fav-active.svg"
        favBtn.classList.add("fav-btn-active")
    }

    favBtn.addEventListener("click", addToFavs);

    container.appendChild(gifClone);
}

//Me traigo las palabras del trending, como son 20 me quedo con las primeras 5 y las guardo en el p que corresponde
function addToTrending(words){
    
    let trending = document.getElementById("trending-words");

    words.splice(5, 20);

    for (let i = 0; i < words.length; i++){
        let word = document.createElement("span");

        word.textContent += (i!==4) ? (words[i] + ", ") : (words[i] + "  ");
        word.style.cursor = "pointer";

        trending.appendChild(word);
        
        word.addEventListener("mousedown", () =>{
            search.value = word.textContent.slice(0, -2);
            runSearch();
        })
    }
}

//Al hacer click en la búsqueda, hago aparecer la cruz e invierto los lugares con la lupa.
function searchSwitch(){

    cross.style.display = "flex";
    searchCtn.style.flexDirection = "row-reverse";
    glass.style.marginRight = "1rem";
    searchBar.style.paddingLeft = "2.5rem";
}

//Cuando quito el click de la barra de búsqueda, esta vuelve a su estado original
function deSwitch(){

    cross.style.display = "none";
    searchCtn.style.flexDirection = "row";
    searchCtn.style.flexWrap = "nowrap";
    searchBar.style.paddingLeft = "3.5rem";
    glass.style.marginRight = "0";
}

function autocompleteInDOM(complete, sugCtn){

    searchBar.paddingLeft = "0"
    searchCtn.marginLeft = "1.5rem";

    //Creo el contenedor, la imagen y el p para las sugerencias
    let suggestion = document.createElement("div");
    let name = document.createElement("p");
    let img = document.createElement("img");

    //Cambio de color la lupa
    glass.src = "assets/icon-search-active.svg";

    img.src = "assets/icon-search-active.svg";
    img.style.width = "1rem";
    img.style.height = "1rem";
    img.style.marginRight = "1rem";

    //Le pongo el valor del autocompletado a la sugerencia
    name.textContent = complete
    name.style.cursor = "pointer"
    name.className = "sug-name"
    
    suggestion.appendChild(img);
    suggestion.appendChild(name);

    suggestion.style.width = "100%";
    suggestion.className = "suggestion";
    sugCtn.style.borderTop = "1px $autocomplete solid";
    searchBar.style.borderRadius = "30px";
    searchBar.style.flexWrap = "wrap";

    sugCtn.appendChild(suggestion);

    //Agrego evento a la sugerencia para que realice la búsqueda
    name.addEventListener("mousedown", () =>{
        search.value = name.textContent
        runSearch()
    });

    //Agrego el evento para que se retraigan las sugerencias
    searchBar.addEventListener("focusout", deCompleteInDOM);
}

function deCompleteInDOM(){

    let sugCtn = document.getElementById("suggestion-ctn");

    glass.src = "assets/icon-search.svg"
    sugCtn.classList.add("hidden");
    sugCtn.textContent = "";
}

function runSearch(){

    results.classList.remove("hidden");
    results.classList.add("search-results");

    seeMoreClicks = 1;

    if (search.value === ""){
        alert("No se ingresaron parámetros de búsqueda")
    }else{
        searchGIF(search.value);
    }
}

function addGIFToSearch(element){

    let gifCtn = document.createElement("div");
    let gif = document.createElement("img");
    let searchResultsCtn = document.getElementById("search-results-ctn");

    gif.src = element.images.fixed_height.url;

    gifCtn.appendChild(gif);
    searchResultsCtn.appendChild(gifCtn)
}

function addToFavs(){

    let gif = document.getElementById(this.parentNode.parentNode.children[1].children[0].id);

    let found = favGifs.findIndex(giphy => giphy === gif.id)

    if (found === -1){
        favGifs.push(gif.id);
        this.src = "assets/icon-fav-active.svg";
        this.classList.add("fav-btn-active");
    }else{
        this.src = "assets/icon-fav-hover.svg";
        this.classList.remove("fav-btn-active");
        favGifs.splice(found, 1);
    }

    let favsAsString = JSON.stringify(favGifs);
    localStorage.setItem("favGIFs", favsAsString);
}

// function displayFavorites(){

//     favorites.classList.remove("hidden");
//     search.classList.add("hidden");
//     myGifos.classList.add("hidden");
//     intro.classList.add("hidden");
//     createGif.classList.add("hidden");
// }
