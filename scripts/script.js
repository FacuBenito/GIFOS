const apiKey = "QTKPx19XqTa8x4Oc7I17ZjFkMoJoW1MM";
let seeMoreClicks = 1;

async function searchGIF(search){

    let limit = 12;
    let offset = seeMoreClicks*limit - 12;

    let resp = await fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}&limit=${limit}&offset=${offset}`)
    let data = await resp.json();

    let gifArr = data.data;

    let searchResultsCtn = document.getElementById("search-results-ctn");

    if (seeMoreClicks === 1){
        searchResultsCtn.textContent = ""
    }

    let searchTitle = document.getElementById("search-title");
    searchTitle.textContent = search;

    for (let i = 0; i < limit; i++){
        addGIFToDOM(gifArr[i], searchResultsCtn);
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

searchBar.addEventListener("focusin", searchSwitch);
searchBar.addEventListener("focusout", deSwitch);
search.addEventListener("keyup", autocomplete);
cross.addEventListener("mousedown", () => search.value = "");
glass.addEventListener("mousedown", runSearch);

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
    trueGif.classList.add("gif")

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
    console.log(words);

    for (let i = 0; i < words.length; i++){
        let word = document.createElement("span");

        if (i < 4){
            word.textContent = words[i] + ", "
        }else{
            word.textContent = words[i]
        }

        trending.appendChild(word);
        
        word.addEventListener("mousedown", () =>{
            search.value = word.textContent;
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
        runSearch()});

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
    
    let results = document.getElementById("search-results");

    results.classList.remove("hidden");
    results.classList.add("search-results");

    seeMoreClicks = 1;

    searchGIF(search.value);

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
