window.onload = main;

function main(){

  var frontCamera = {
    video: {
      facingMode: "user",
    },
    audio: false
  };

  var backCamera = {
    video: {
      facingMode: {
        exact: "enviroment"
      },
      audio: false
    }
  }

  const cameraView = document.getElementById("cameraView");
  const cameraCapture = document.getElementById("cameraCapture");
  const cameraButton = document.getElementById("cameraButton");
  const flipCamera = document.getElementById("flipCamera");

  navigator.mediaDevices.getUserMedia(frontCamera).then(function(stream){
    cameraView.srcObject = stream;
  }).catch(function(error){
    var DOM = document.createElement("p");
    DOM.innerHTML = error;

    document.getElementsByTagName("body")[0].appendChild(DOM);
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
        console.log("Status: " + this.responseText);
      }
    }

    http.send("image=" + image);

  }

  flipCamera.onclick = function(){
    navigator.mediaDevices.getUserMedia(backCamera).then(function(stream){
      cameraView.srcObject = stream;
    }).catch(function(error){
      alert("Sorry, you cannot do that");
    });
  }

  cameraButton.onmousedown = function(){
    cameraButton.classList.add("clicked");
  }
  cameraButton.onmouseup = function(){
    cameraButton.classList.remove("clicked");
  }
}