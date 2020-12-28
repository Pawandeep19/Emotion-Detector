var Mode="hard";  //just change hard to easy to start game with easy as default mode
var color=[];
var squares=document.querySelectorAll(".square");
var colordisplay=document.querySelector("#colorDisplay");
var messagedisplay=document.querySelector("#messagedisplay");
var h1=document.querySelector("h1");
var resetbut=document.querySelector("#resetButton");
var easybtn=document.querySelector("#easy");
var hardbtn=document.querySelector("#hard");
if(Mode==="easy")
	easyLevel();
	else
		hardLevel();

for(var i=0;i<squares.length;i++){
	//square click event
	squares[i].addEventListener("click",function(){
	//grabbing the square color
	var colorclicked=this.style.backgroundColor;
	//comparing the color
	if(colorclicked===colorpicked){
		messagedisplay.textContent="Correct";
		colorChange(colorclicked); //changing colors of all squares to correct ans color
		h1.style.backgroundColor=colorpicked; //changing color of h1 with correct ans
		resetbut.textContent="Play Again";

	}
	else{
		messagedisplay.textContent="Try Again";
		this.style.backgroundColor="#232323";  //removing the wrong square by changing the bg color with the body bg color
	}

	});

}
easybtn.addEventListener("click",easyLevel);
function easyLevel(){
	Mode="easy";
	hardbtn.classList.remove("selected");
	easybtn.classList.add("selected");
	for(var i=3;i<6;i++){
		squares[i].style.display="none";
	}
	reset(3);
}

hardbtn.addEventListener("click",hardLevel);
function hardLevel(){
	Mode="hard";
	easybtn.classList.remove("selected");
	hardbtn.classList.add("selected");
	for(var i=3;i<6;i++){
		squares[i].style.display="block";
	}
	reset(6);
}

resetbut.addEventListener("click",function(){
	if(Mode==="easy")
		reset(3);
	else
		reset(6);
	});


function reset(number){
    //generate random square colors and filling color array
	color=SquareColorArray(number);
	//new color pick
	colorpicked=pickrandomcolor();
	//h1 rgb part change
	colordisplay.textContent=colorpicked;
	//filling colors in squares
	for(var i=0;i<color.length;i++){
		squares[i].style.backgroundColor=color[i];
	}
	//do the below line if you want game to always start with steelblue h1 
	// h1.style.backgroundColor="steelblue";
	resetbut.textContent="New Colors";
	messagedisplay.textContent="";

}




function colorChange(color){  //changing the color of all squares with the correct ans
for(var i=0;i<squares.length;i++){
	squares[i].style.backgroundColor=color;
   }  
}

function pickrandomcolor(){     //picking random square out of the 6 or 3 for desired color
	var randomno=Math.floor(Math.random()*color.length)
	return color[randomno];
}
function SquareColorArray(num){ //filling the color array
	var arr=[];
	for(var i=0;i<num;i++){
		arr[i]=SquareColorGenerator();
	}
	return arr;
}
function SquareColorGenerator(){ //generating random colors for color array
	var r=Math.floor(Math.random()*256);
	var g=Math.floor(Math.random()*256);
	var b=Math.floor(Math.random()*256);
	return "rgb("+r+", "+g+", "+b+")";

}