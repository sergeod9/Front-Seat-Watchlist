
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const dropDownMenuArr = document.querySelectorAll('.dropdown');
let breakPointArr;
let breakPointSmall;
let toggleHamburger = true;
let dropdownMenuState = false;

breakPointArr = {
    "small":768,
    "medium": 1024,
    "large": 1280,
    "xlarge": 1366 
}
breakPointSmall = breakPointArr.small;


if(window.innerWidth > breakPointSmall){
    dropdownMenuState = true;
    console.log(breakPointSmall);
}else{
    dropdownMenuState = false;
}

// Response to screen size change
window.addEventListener('resize', () => {
    if(window.innerWidth > breakPointSmall){
        menu.style.display = 'inline-block';
        dropdownMenuState = true;

    }else{
        menu.style.display = 'none';
        toggleHamburger = true;
        dropdownMenuState = false;

    }
});

// Toggle Hamburger show/hide menu for small window width
hamburger.addEventListener('click', e =>{
    if(toggleHamburger){
        menu.style.display = 'inline-block';
        toggleHamburger = false;
    } else {
        menu.style.display = 'none';
        toggleHamburger =  true;
    }
})





