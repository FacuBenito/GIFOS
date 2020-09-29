let darkModeBtn = document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("click", (e) => {themeToggler(e)});

function themeToggler(e){
    e.preventDefault();
    
    let currentTheme = document.documentElement.getAttribute("data-theme");
    menu.checked = false;

    if (currentTheme == "light"){

        document.documentElement.setAttribute("data-theme", "dark");
        darkModeBtn.textContent = "Modo Diurno"
    }else{
        document.documentElement.setAttribute("data-theme", "light")
        darkModeBtn.textContent = "Modo Nocturno"
    }
}
