const video = document.getElementById("video")
var contentarea=document.querySelector(".content")
var hd=document.querySelector(".head")
var h2=document.querySelector("h2");






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
      h2.textContent="Boring";
    }
    else if(detections[0].expressions.angry>0.2){
      h2.textContent="Angry";
    }
    else if(detections[0].expressions.surprised>0.8){
      h2.textContent="Surprised";
    }
    else if(detections[0].expressions.sad>0.1){
      h2.textContent="Sad";
    }
    if(detections[0].expressions.happy>0.7){
        h2.textContent="Happy";
        console.log("pawan");
        contentarea.classList.remove("invisible");
        contentarea.classList.add("visible");
        hd.classList.add("invisiblepage");
        hd.classList.remove("visiblepage");
        MediaStream.stop();
        window.clearInterval(interval);
        interval = null;
    }
  }, 100)
})