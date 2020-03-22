function display(algName){
    var el = document.getElementById("display");

    var url = location.href;
    url = url.split("/"); url.pop(); 
    url = url.join("/");
    el.src = `${url}/Algs/${algName}/index.html`;
}