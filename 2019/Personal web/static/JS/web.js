function main(category){

  var http = new XMLHttpRequest();
  var url = "http://localhost:8080/github?category=" + category;

  http.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  }

  http.open("GET", url);
  http.send();

}
