function main(category){

  var url = document.location.origin + "/github?category=" + category;
  var api = new XMLHttpRequest();

  api.open("GET", url);
  api.send();

  api.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      showProjects(JSON.parse(this.responseText));
    }
  }

}


function showProjects(projects){

  var el = document.getElementsByClassName("content_Projects")[0];

  for(var i = 0; i < projects.length; i++){

    var node = document.createElement("p");
    node.innerHTML = projects[i];

    el.appendChild(node);

  }

}
