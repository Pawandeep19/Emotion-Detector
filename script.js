const video = document.getElementById("video")
var contentarea=document.querySelector(".content")
var mp=document.querySelector(".mainpage")
var messDis=document.querySelector(".messDis");
var imgcolor=document.querySelector(".imgbox");
var li=document.getElementsByTagName("li");







Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)
var MediaStream;
function startVideo() {
  navigator.getMedia=navigator.getUserMedia(
    { video: {} },
    function(stream){
    video.srcObject = stream,
    MediaStream = stream.getTracks()[0]
    },
    err => console.error(err)
  )
  
}

if(contentarea.visible){
  console.log("yes");
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  var interval=setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    //console.log(detections[0].expressions);
    if(detections[0].expressions.neutral>0.5){
      messDis.innerHTML="BORING <i class='far fa-meh-blank'></i>";
      li[0].innerHTML="BORING <i class='fas fa-check'></i>";
      imgcolor.style.background="linear-gradient(to right, #434343, #000000)";
    }
    else if(detections[0].expressions.angry>0.2){
      messDis.innerHTML="ANGRY <i class='far fa-angry'></i>";
      li[1].innerHTML="ANGRY <i class='fas fa-check'></i>";
      imgcolor.style.background="linear-gradient(to right, #0a0a0b 0%, #6a0b0b 100%)";
    }
    else if(detections[0].expressions.surprised>0.9){
      messDis.innerHTML="Surprised <i class='far fa-surprise'></i>";
      li[2].innerHTML="SURPRISED <i class='fas fa-check'></i>";
      imgcolor.style.background=" linear-gradient(to right, #222022 0%, #0f0d68 100%)";
    }
    else if(detections[0].expressions.sad>0.1){
      messDis.innerHTML="Sad <i class='far fa-frown'></i>";
      li[3].innerHTML="SAD <i class='fas fa-check'></i>";
      imgcolor.style.background=" linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,9,26,1) 100%, rgba(0,212,255,1) 100%)";
    }
    if(detections[0].expressions.happy>0.7){
        console.log("user happy");
        contentarea.classList.remove("invisible");
        contentarea.classList.add("visible");
        mp.classList.add("invisible");
        mp.classList.remove("visible");
        MediaStream.stop();
        window.clearInterval(interval);
        interval = null;
    }
  }, 100)
})