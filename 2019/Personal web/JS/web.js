// https://raw.githack.com/ItsOKayCZ/Web/master/{path}/{directory}/index.html
function showContent(el){

    var path = el.attributes[0].value;
    var directory = el.innerText;
    var difIndex = el.attributes[1].value;
    var url;
    if(difIndex != "static"){
        url = "https://raw.githack.com/ItsOKayCZ/Web/master/" + path + "/" + directory + "/index.html"
    } else {
        url = "https://raw.githack.com/ItsOKayCZ/Web/master/" + path + "/" + directory + "/" + difIndex + "/index.html"
    }

    document.getElementsByClassName("content_iframe")[0].src = url;

}