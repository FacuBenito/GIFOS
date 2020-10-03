let darkModeBtn = document.getElementById("dark-mode-btn");
let peli = document.getElementById("film-icon");
let camara = document.getElementById("camara")

darkModeBtn.addEventListener("click", (e) => {themeToggler(e)});

function themeToggler(e){
    e.preventDefault();
    
    let currentTheme = document.documentElement.getAttribute("data-theme");
    menu.checked = false;

    if (currentTheme == "light"){
        document.documentElement.setAttribute("data-theme", "dark");
        darkModeBtn.textContent = "Modo Diurno";
        home.setAttribute("src", "assets/logo-mobile-modo-noct.svg");
        peli.src = "assets/pelicula-modo-noc.svg";
        camara.src = "assets/camara-modo-noc.svg";
        
    }else{
        document.documentElement.setAttribute("data-theme", "light");
        darkModeBtn.textContent = "Modo Nocturno";
        home.setAttribute("src", "assets/logo-mobile.svg");
        peli.src = "assets/pelicula.svg"
        camara.src = "assets/camara.svg"
    }
}