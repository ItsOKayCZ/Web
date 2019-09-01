window.onload = main;
var facingDirection;

function main(){

  var frontCamera = {
    video: {
      facingMode: "user"
    },
    audio: false
  };

  var backCamera = {
    video: {
      facingMode: "enviroment"
    },
    audio: false
  }

  const cameraView = document.getElementById("cameraView");
  const cameraCapture = document.getElementById("cameraCapture");
  const cameraButton = document.getElementById("cameraButton");
  const flipCamera = document.getElementById("flipCamera");

  facingDirection = "back";
  navigator.mediaDevices.getUserMedia(backCamera).then(function(stream){
    cameraView.srcObject = stream;
  }).catch(function(error){

    navigator.mediaDevices.getUserMedia(frontCamera).then(function(stream){
      cameraView.srcObject = stream;
      facingDirection = "front";
    }).catch(function(error){
      alert("Cannot use camera");
    });

  });

  cameraButton.onclick = function(){

    cameraCapture.width = cameraView.videoWidth;
    cameraCapture.height = cameraView.videoHeight;
    cameraCapture.getContext("2d").drawImage(cameraView, 0, 0);

    var image = cameraCapture.toDataURL("image/png", 1).split(",")[1];

    if(!confirm("Are you sure you want to send the photo?")){
      return;
    }

    var http = new XMLHttpRequest();
    var url = location.origin + "/sendEmail";

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function(){
      if(http.readyState === 4 && http.status === 200) {
        alert(this.responseText);
      }
    }

    http.send("image=" + image);

  }

  flipCamera.onclick = function(){

    if(facingDirection == "front"){
      navigator.mediaDevices.getUserMedia(backCamera).then(function(stream){
        cameraView.srcObject = stream;
        facingDirection = "back";
      }).catch(function(error){
        alert("Sorry, you cannot do that");
      });
    } else if(facingDirection == "back"){
      navigator.mediaDevices.getUserMedia(frontCamera).then(function(stream){
        cameraView.srcObject = stream;
        facingDirection = "front";
      }).catch(function(error){
        alert("Sorry, you cannot do that");
      });
    }
  }

  cameraButton.onmousedown = function(){
    cameraButton.classList.add("clicked");
  }
  cameraButton.onmouseup = function(){
    cameraButton.classList.remove("clicked");
  }
}