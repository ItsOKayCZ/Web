function showDropdown(el){
    el.classList.toggle("clicked");
    el.nextElementSibling.classList.toggle("hidden");
}

function displayLink(el){
    if(el.innerHTML == "Github"){
        window.open(el.dataset.link, "_blank");
        return;
    }

    var frame = document.getElementById("preview");
    frame.src = el.dataset.link;

}