function main(category){

  var url = document.location.origin + "/github?category=" + category;
  var api = new XMLHttpRequest();

  api.open("GET", url);
  api.send();

  api.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      displayProjects(JSON.parse(this.responseText));
    }
  }

}


function displayProjects(projects){

  var el = document.getElementsByClassName("content_Projects")[0];

  el.removeChild(el.childNodes[3]);

  for(var i = 0; i < projects.length; i++){
    var node = document.createElement("p");
    var attributes = projects[i].split("/");

    node.path = attributes[0];
    node.name = attributes[1];
    if(attributes[2] != undefined){
      node.diffLocation = attributes[2];
    }

    // Adding the onclick event listener
    node.addEventListener("click", function(){
      // Passing the DOM element
      onClickProject(this);
    });

    node.innerHTML = node.name;

    el.appendChild(node);

  }

}
