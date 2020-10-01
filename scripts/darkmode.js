let darkModeBtn = document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("click", (e) => {themeToggler(e)});

function themeToggler(e){
    e.preventDefault();
    
    let currentTheme = document.documentElement.getAttribute("data-theme");
    menu.checked = false;

    if (currentTheme == "light"){
        document.documentElement.setAttribute("data-theme", "dark");
        darkModeBtn.textContent = "Modo Diurno";
        home.setAttribute("src", "assets/logo-mobile-modo-noct.svg");
        
    }else{
        document.documentElement.setAttribute("data-theme", "light");
        darkModeBtn.textContent = "Modo Nocturno";
        home.setAttribute("src", "assets/logo-mobile.svg");
    }
}