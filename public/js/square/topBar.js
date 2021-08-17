let head_selec = document.querySelector(".menu-icon");//获取menu-icon元素
let head_nav = document.querySelector(".nav");//获取导航栏元素
head_selec.addEventListener("click", () => {
    if (!head_selec.classList.contains("menu-icon-active")) {//设置点击之后的menu-icon样式
        head_selec.classList.add("menu-icon-active");
    } else {
        head_selec.classList.remove("menu-icon-active");
    }
    if (!head_nav.classList.contains("nav-active")) {//设置点击之后的nav样式
        head_nav.classList.add("nav-active");
    } else {
        head_nav.classList.remove("nav-active");
    }
});