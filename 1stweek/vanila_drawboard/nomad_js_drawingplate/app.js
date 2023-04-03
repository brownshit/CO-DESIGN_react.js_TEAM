//we'll make project by canvas api
//기본 html만들기 위해서 ! ctrl + space를 이용할 수 있다!

//live server다운로드 받아서 우측하단에서 실행시키면 된다!!
//js이름은 무조건 index.js로 지어야 한다.
//canvas api 는 js로 그래픽을 그려주게 할 수 있다.
//webgl api로는 2d나 3d그래픽을 그려줄 수 있다.
const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById('mode-btn');
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");

//likearray라서 Array.from을 통해 배열로 생성해주었다.colorOptions를
const colorOptions = Array.from(    //유사배열은 이와같은 메소드로 처리해줘야 한다.
    //얘자체로는 HTMLCollection이기 때문이다!
    document.getElementsByClassName("color-option")
    );//해당 과정을 통해 js배열로서 사용할 수 있게 되었다.

const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");//html에서 가져온다

//brush 캔버스에 그림 그릴때 사용할 변수.
//canvas 는 그릴수 있는 붓을 주는 강력한 기능을 가지고 있다.
const ctx = canvas.getContext("2d");//we have two choice, 2d, webgl

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

//선들을 수정할 border를 설정해준 것, 그림은 canvas안에서만
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;//초기값을 5로 주겠다.
ctx.lineCap = "round";
let isPaining = false;
//canvas의 좌표시스템 좌측 상단끝이 0,0 // x,y축으로 구성되어 있다.
let isFilling = false;

//유저가 마우스를 움직이 때마다 moveTo를 호출하고
//클릭하기 시작하면 선을 그려야 한다.
function onMove(event){
    //ctx.moveTo(event.offsetX, event.offsetY);
    if(isPaining){
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return; //to kill the function! to listen new event listen, status initilizing
    }
    ctx.beginPath();//선의 굵기가 달라지는 것을 방지하기 위함이랄까??
    ctx.moveTo(event.offsetX, event.offsetY);
}
//마우스를 누르는건 mousedown이라고 한다.
function startPainting(event){
    isPaining = true;
}
function cancelPainting(event){
    isPaining = false;
}
function onLindWidthChange(event){
    //console.log(event)
    //console.log(event.target.value);
    ctx.lineWidth = event.target.value;
}
function onColorChange(event){
    console.log(event.target.value);
    //event.target.value는 우리가 colorhtml요소에서 고른 색의 정보를 담고있다.
    //fillcolor는 채우는 색상을 의미한다.
    //strokecolor는 그리는 선의 색상을 의미한다.
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}
function onColorClick(event){
    const colorValue = event.target.dataset.color;
    //console.dir(event.target.dataset.color);    //객체에 접근해서 처리해줬다!!
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    
    //해당 코드는 사용자게에 선택한 색을 알려주기 위해 추가한 것이다.
    color.value = colorValue;
}
function onModeClick(){
    //this function will be change mode of pen
    //fill, and draw
    if(isFilling){
        isFilling = false;
        modeBtn.innerText = "Fill";
    }else{
        isFilling = true; 
        modeBtn.innerText = "Draw";
    }
}
function onCanvasClick(){
    if(isFilling){
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}
function onDestroyClick(){
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}
function onEraserClick(){
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
}

function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    //console.log(url);
    //브라우저는 항상 유저의 실제 파일 시스템과 격리가 되어있다.
    //js app은 유저의 파일을 읽을 수 없다.
    //브라우저의 메모리 안에 들어간다.
    
    //url로 이미지를 만들어주기
    const image = new Image()
    image.src = url;
    //이미지가 onload되면 function이 실행된다.
    image.onload = function(){
        ctx.drawImage(image, 0, 0,CANVAS_WIDTH, CANVAS_HEIGHT);
        //다른이미지를 추가하고싶을 수도 있으니깐~
        fileInput.value = null;
    }
}
function onDoubleClick(event){
    //event.offsetX // event.offsetY 는 마우스가 더블클릭한 좌표를 가리키게 된다,
    const text = textInput.value;
    if(text !== ""){
        ctx.save();//ctx의 이전상태 모든것을 저장해준다. 색상 스타일등...        
        ctx.lineWidth = 1;
        ctx.font = "68px serif";
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore();  //저장했던 이전상태를 다시 되돌려준다!
    }
}
function onSaveClick(event){
    const url = canvas.toDataURL();
    //아래의 createElement는 a태그를 가진 html요소를 index.html에 만들어준다.
    //a태그를 이용해 가짜 링크를 만들어주기.
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}
canvas.addEventListener("dblclick",onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
//마우스가 캔버스 밖을 벗어나게 되면... 1st option
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click",onCanvasClick);
//굵기를 조절하는 것을 인지하는 eventlistener
lineWidth.addEventListener("change", onLindWidthChange);
color.addEventListener("change", onColorChange);

//내장함수내의 color는 colorOption의 값을 담고 있을 것이다.
colorOptions.forEach((color)=>color.addEventListener
    ("click", onColorClick));
//onColorClick가 작동할때, 어떤 버튼이 눌렸는지를 아는게 굉장히 중요하다!

//colorOptions의 각 div에 addEventListener를 통해 이벤트 리스너를 달아줄 것이다,

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click",onEraserClick);
//click은 mousedown , mouseup을 다 한것과 같다.

fileInput.addEventListener("change",onFileChange);
saveBtn.addEventListener("click", onSaveClick);