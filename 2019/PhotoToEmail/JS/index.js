window.onload = main;

function main(){

  var constraints = {
    video: {
      // facingMode: {
      //   exact: "environment"
      // }
      facingMode: "user"
    },
    audio: false
  };


  const cameraView = document.getElementById("cameraView");
  const cameraSensor = document.getElementById("cameraSensor");
  const cameraOutput = document.getElementById("cameraOutput");
  const cameraCapture = document.getElementById("cameraCapture");


  navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
    var track = stream.getTracks()[0];
    cameraView.srcObject = stream;
  }).catch(function(error){
    var DOM = document.createElement("p");
    DOM.innerHTML = error;

    document.getElementsByTagName("body")[0].appendChild(DOM);
  });


  cameraCapture.onclick = function(){

    cameraSensor.width = cameraView.clientWidth;
    cameraSensor.height = cameraView.clientHeight;

    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    
    cameraOutput.src = cameraSensor.toDataURL("image/webp", 1);
    cameraOutput.classList.add("taken");

  }

}