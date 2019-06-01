function main(category){
  var url = document.location.origin + "/github?category=" + category;
  var api = new XMLHttpRequest();

  console.log(url);
  api.open("GET", url);

  api.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  }

}
