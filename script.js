// selecting the elements
const video = document.getElementById("video")
var contentarea=document.querySelector(".content")
var mp=document.querySelector(".mainpage")
var messDis=document.querySelector(".messDis");
var imgcolor=document.querySelector(".imgbox");
var li=document.getElementsByTagName("li");


//promise all is used to load the models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)  //start the video once the models are loaded



//var to track media so that we can stop the video once we are done
var MediaStream;




//function to start video(basically links our js to webcam)
function startVideo() {
  //receive all the streams we get from webcam
  navigator.getMedia=navigator.getUserMedia(
    { video: {} },

    function(stream){
    video.srcObject = stream,
    MediaStream = stream.getTracks()[0]
    },

    //throw error if some problem with webcam
    err => console.error(err)
  )
  
}
//video function ends




//now the part what to do with that video
video.addEventListener('play', () => {

  //create a canvas from media
  const canvas = faceapi.createCanvasFromMedia(video)
  //append that canvas into the body
  document.body.append(canvas)
  //create display size for canvas which would be same as video width and height
  const displaySize = { width: video.width, height: video.height }
  //apply this display size to canvas
  faceapi.matchDimensions(canvas, displaySize)


  //set interval and use asynchronous function and store it to a var which will be used later to stop the exectution of the function
  //we use async function because it returns a promise and we can await till the promises are loaded
  var interval=setInterval(async () => {
    //detect all the faces in the video(their landmark points and expressions) and store them in a const
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    //resize those detections according to display size
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //get the context of your 2d canvas and clear the rect if some still images remains in canvas
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    //display the recorded detections on the canvas with resized display size
    //uncomment the next 3 lines if you want to display the detections
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


    //console.log(detections[0].expressions)----->to get the expressions;
    //console and set the values according to your preference

    //for nuetral
    if(detections[0].expressions.neutral>0.5){
      //if nuetral expressions display emotion as boring
      messDis.innerHTML="BORING <i class='far fa-meh-blank'></i>";
      //tick the boring in the list
      li[0].innerHTML="BORING <i class='fas fa-check'></i>";
      //change the img background color
      imgcolor.style.background="linear-gradient(to right, #434343, #000000)";
    }

    //for angry
    else if(detections[0].expressions.angry>0.2){
      messDis.innerHTML="ANGRY <i class='far fa-angry'></i>";
      li[1].innerHTML="ANGRY <i class='fas fa-check'></i>";
      imgcolor.style.background="linear-gradient(to right, #0a0a0b 0%, #6a0b0b 100%)";
    }

    //for surprised
    else if(detections[0].expressions.surprised>0.9){
      messDis.innerHTML="Surprised <i class='far fa-surprise'></i>";
      li[2].innerHTML="SURPRISED <i class='fas fa-check'></i>";
      imgcolor.style.background=" linear-gradient(to right, #222022 0%, #0f0d68 100%)";
    }

    //for sad
    else if(detections[0].expressions.sad>0.1){
      messDis.innerHTML="Sad <i class='far fa-frown'></i>";
      li[3].innerHTML="SAD <i class='fas fa-check'></i>";
      imgcolor.style.background=" linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,9,26,1) 100%, rgba(0,212,255,1) 100%)";
    }

    //if happy
    if(detections[0].expressions.happy>0.7){
        console.log("user happy");
        //remove the invisible class from patatap clone
        contentarea.classList.remove("invisible");
        //display the patatap clone 
        contentarea.classList.add("visible");
        //remove the visible class from emotion detector
        mp.classList.remove("visible");
        //make the emotion detector invisible
        mp.classList.add("invisible");
        //stop the media stream that is the webcam
        MediaStream.stop();
        //stop the set interval and async function by clearing ,using the var we took(var interval)
        window.clearInterval(interval);
        interval = null;
    }
  }, 100)//we set 100 ms that camera detects expression every 100ms 
})
//event listener ends