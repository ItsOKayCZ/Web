// https://raw.githubusercontent.com/ItsOKayCZ/Python/master/{Path}/{Directory}/README.md
function showContent(el){

    var path = el.attributes[0].value;
    var directory = el.innerText;

    var http = new XMLHttpRequest();
    var url = "https://raw.githubusercontent.com/ItsOKayCZ/Python/master/" + path + "/" + directory + "/README.md";

    http.open("GET", url);
    http.send();

    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            showResult(this.responseText);
        }
    }

}

function showResult(content){

    var el = document.getElementsByClassName("content_viewer")[0];

    content = parseMarkdown(content);

    el.innerHTML = content;

}

function parseMarkdown(content){

    // Unorder list
    content = content.replace(/^([^\*\s].+)\n(\*\s.+)/gm, "$1\n<ul>\n$2"); // First line; Something before
    content = content.replace(/^(\*\s.+)/g, "<ul>\n$1"); // First line; Nothing before
    content = content.replace(/^(\s*\*\s.+)\n([\n\#\d])/gm, "$1\n</ul>\n$2"); // Last line

    content = content.replace(/^\s+\*\s(.+)/gm, "<ul><li>$1</li></ul>\n"); // Indent

    content = content.replace(/\*\s(.+)/gm, "<li>$1</li>"); // Make a <li> DOM

    // Order list
    content = content.replace(/^([^\d].+)\n(\d\.\s.+)/gm, "$1\n<ol>\n$2");
    content = content.replace(/(\d\.\s.+)\n[^\d\.](.+)/gm, "$1\n</ol>\n$2");
    content = content.replace(/^\s*\d\.\s(.+)/gm, "<li>$1</li>");

    // Links
    content = content.replace(/\[(.+)\]\((.+)\)/g, '<a href=https://$2>$1</a>');

    // Bold
    content = content.replace(/(\_){2}(.+)(\_){2}/g, "<b>$2</b>");

    // Italic
    content = content.replace(/(\_){1}(.+)(\_){1}/g, "<i>$2</i>");

    // Headers
    content = content.replace(/[\#]{6}\s*(.+)/g, "<h6>$1</h6>"); // h6
    content = content.replace(/[\#]{5}\s*(.+)/g, "<h5>$1</h5>"); // h5
    content = content.replace(/[\#]{4}\s*(.+)/g, "<h4>$1</h4>"); // h4
    content = content.replace(/[\#]{3}\s*(.+)/g, "<h3>$1</h3>"); // h3
    content = content.replace(/[\#]{2}\s*(.+)/g, "<h2>$1</h2>"); // h2
    content = content.replace(/[\#]{1}\s*(.+)/g, "<h1>$1</h1>"); // h1

    // Newline
    content = content.replace(/([\s]{2})/g, "<br>");

    return content;
}
