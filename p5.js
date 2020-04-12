const WIDTH = 800
const HEIGHT = 800
const CELLSIZE = 20
const RANGE = CELLSIZE/2;
const BLUEGREEN = [13, 152, 186]
const BLUEPURPLE = [54.1, 16.9, 88.6]
const YELLOWORANGE = [255, 174, 66]
const REDORANGE = [255, 83, 73]
let setInicio = false;
let setEnd = false;
let matriz = []
let start = []
let goal = []
let dividorsX=[]
let dividorsY=[]
let casasOcupadas = {}
casasOcupadas[(CELLSIZE+RANGE)+"x"+(CELLSIZE+RANGE)]="inicio";
casasOcupadas[(WIDTH-CELLSIZE-RANGE)+"x"+(HEIGHT-CELLSIZE-RANGE)]="fim";

function setup() {
	cnv = createCanvas(WIDTH, HEIGHT);
	background(220);
	noStroke();
	rectMode(CENTER);

	buttonMaze = createButton('Generate Maze');
	buttonMaze.position(175,835);
	buttonMaze.mousePressed(mazeAlg);

	buttonFind = createButton('Find Path');
	buttonFind.position(290,835);
	buttonFind.mousePressed(pathFind);

	buttonClearObs = createButton('Clear Obstacules');
	buttonClearObs.position(370,835);
	buttonClearObs.mousePressed(clearObs);

	buttonClearPath = createButton('Clear Path');
	buttonClearPath.position(495,835);
	buttonClearPath.mousePressed(clearPath);
}

// Clear All Obstacules
function clearObs() {
	for (i in casasOcupadas){
		if(casasOcupadas[i]=="ocupada"){
			delete casasOcupadas[i];
		}
	}
}

// Clear Path
function clearPath() {
	for (i in casasOcupadas){
		if(casasOcupadas[i]=="caminho"){
			delete casasOcupadas[i];
		}
	}
}


function mazeAlg() {
	clearObs()
	clearPath()
	for (var i = RANGE; i < height + RANGE; i += CELLSIZE) {
		for (var j = RANGE; j < width + RANGE; j += CELLSIZE) {
			if(i==RANGE || j==RANGE || i==height-RANGE || j==width-RANGE){
				casasOcupadas[i+"x"+j] = "ocupada"			
			}			
		}	
	}
	dividorsX=[]
	dividorsY=[]
	maze2(RANGE,RANGE,width-RANGE,height-RANGE)	
}

function maze2(x,y,w,h){
	let dividorY = -1
	let dividorX = -1
	counter=0
	// Randomizes X and Y Dividing Line
	while((dividorY<0 || dividorX<0 || dividorsX.includes(dividorY) || dividorsY.includes(dividorX)) && counter < 1000){
		dividorX = (Math.floor(Math.random() * ((w-CELLSIZE)/CELLSIZE - (x+CELLSIZE*2)/CELLSIZE)) + (x+CELLSIZE*2)/CELLSIZE) * CELLSIZE
		dividorY = (Math.floor(Math.random() * ((h-CELLSIZE)/CELLSIZE - (y+CELLSIZE*2)/CELLSIZE)) + (y+CELLSIZE*2)/CELLSIZE) * CELLSIZE
		counter++
	}
	console.log(`New dividorX: ${dividorX}`)
	console.log(`New dividorY: ${dividorY}`)
	dividorsX.push(dividorX)
	dividorsY.push(dividorY)
	
	let passagemX1=-1
	let passagemX2=-1
	counter = 0
	// Randomizes Passages in the X Dividing Line
	while((passagemX1<0 || passagemX2<0 || dividorsX.includes(passagemX1) || dividorsX.includes(passagemX2)) && counter < 1000){
		passagemX1=(Math.floor(Math.random() * ((dividorY-CELLSIZE)/CELLSIZE - (y+CELLSIZE*2)/CELLSIZE)) + (y+CELLSIZE*2)/CELLSIZE) * CELLSIZE
		passagemX2=(Math.floor(Math.random() * ((h-CELLSIZE)/CELLSIZE - (dividorY+CELLSIZE*2)/CELLSIZE)) + (dividorY+CELLSIZE*2)/CELLSIZE) * CELLSIZE	
		counter++
		}	
	console.log(`New passagemX1: ${passagemX1} going on dividorsX`)
	console.log(`New passagemX2: ${passagemX2} going on dividorsX`)		
	dividorsX.push(passagemX1)
	dividorsX.push(passagemX2)	
	
	let passagemY1=-1
	let passagemY2=-1
	counter = 0
	// Randomizes Passages in the Y Dividing Line
	while((passagemY1<0 || passagemY2<0 || dividorsY.includes(passagemY1) || dividorsY.includes(passagemY2)) && counter < 1000){
		passagemY1=(Math.floor(Math.random() * ((dividorX-CELLSIZE)/CELLSIZE - (x+CELLSIZE*2)/CELLSIZE)) + (x+CELLSIZE*2)/CELLSIZE) * CELLSIZE
		passagemY2=(Math.floor(Math.random() * ((w-CELLSIZE)/CELLSIZE - (dividorX+CELLSIZE*2)/CELLSIZE)) + (dividorX+CELLSIZE*2)/CELLSIZE) * CELLSIZE
		counter++
	}
	console.log(`New passagemY1: ${passagemY1} going on dividorsY`)
	console.log(`New passagemY2: ${passagemY2} going on dividorsY`)	
	dividorsY.push(passagemY1)
	dividorsY.push(passagemY2)
	
	for (var i = x; i < h + RANGE; i += CELLSIZE) {
		casasOcupadas[i+"x"+dividorX] = "ocupada"						
	}
	delete casasOcupadas[passagemX1+"x"+dividorX]
	delete casasOcupadas[passagemX2+"x"+dividorX]
	
 	for (var j = y; j < w + RANGE; j += CELLSIZE) {
		casasOcupadas[dividorY+"x"+j] = "ocupada"						
	}
	delete casasOcupadas[dividorY+"x"+passagemY1]
	delete casasOcupadas[dividorY+"x"+passagemY2] 
		

	// Segundo Quadrante
	if(dividorX-x>CELLSIZE*4 && dividorY-y>CELLSIZE*4){
		maze2(x,y,dividorX,dividorY)
	} 
	// Quarto Quadrante
	if(h-dividorY>CELLSIZE*4 && w-dividorX>CELLSIZE*4){
		maze2(dividorY,dividorX,h,w)
	}
 	// Terceiro Quadrante
/*	if(dividorX-x>80 && h-dividorY>80){
		maze2(dividorY,y,h,dividorX)
	}

	//Primeiro Quadrante
	if(w-dividorX>80 && dividorY-y>80){
		maze2(dividorX,y,w,dividorY)
	}	 */ 
}


function pathFind() {
	clearPath()
	for (var i = RANGE; i < height + RANGE; i += CELLSIZE) {
		matriz[(i-RANGE)/CELLSIZE] = []
		for (var j = RANGE; j < width + RANGE; j += CELLSIZE) {
			matriz[(i-RANGE)/CELLSIZE][(j-RANGE)/CELLSIZE] = "vazio"
		}
	}
	
	// Generate Path Finding Grid
	for (XxY in casasOcupadas){
		coord = XxY.split("x");
		if(casasOcupadas[XxY]=="inicio"){
			matriz[(coord[0]-RANGE)/CELLSIZE][(coord[1]-RANGE)/CELLSIZE] = "inicio"
			start[0] = (coord[0]-RANGE)/CELLSIZE
			start[1] = (coord[1]-RANGE)/CELLSIZE
		}
		else if(casasOcupadas[XxY]=="fim"){
			matriz[(coord[0]-RANGE)/CELLSIZE][(coord[1]-RANGE)/CELLSIZE] = "fim"
			goal[0] = (coord[0]-RANGE)/CELLSIZE
			goal[1] = (coord[1]-RANGE)/CELLSIZE
		}
		else if(casasOcupadas[XxY]=="ocupada"){
			matriz[(coord[0]-RANGE)/CELLSIZE][(coord[1]-RANGE)/CELLSIZE] = "ocupada"
		}
	}
	
	foundPath = aStar()

	for(i=0;i<foundPath.length;i++){
		casasOcupadas[((foundPath[i][0]*CELLSIZE)+RANGE)+"x"+((foundPath[i][1]*CELLSIZE)+RANGE)]="caminho"
	}
}

function reconstruct_path(cameFrom, current){
    total_path = []
    while(cameFrom[current]!=start){
		current = cameFrom[current]
        total_path.unshift(current)	
	}
    return total_path	  
}
	
function aStar(){
	openSet = []
	openSet.push(start)
	closeSet = []
	cameFrom = {}
	gScore = {}
	gScore[start] = 0
	fScore = {}
	fScore[start] = dist(start[0], goal[0], start[1], goal[1])
	while(openSet.length>0){
		current = openSet.shift()
		if(current[0]==goal[0] && current[1]==goal[1]){
			return reconstruct_path(cameFrom, current)
		}
		closeSet.push(current)
		
		for(i=-1;i<=1;i++){
			for(j=-1;j<=1;j++){
				if(current[0]+i>=0 && current[1]+j>=0 && 
					current[0]+i<matriz.length && current[1]+j<matriz[0].length &&
					matriz[current[0]+i][current[1]+j]!="ocupada"){
					
					tentative_gScore = gScore[current] + 1
					neighbor=[]
					neighbor[0]=current[0]+i
					neighbor[1]=current[1]+j
					if(!gScore[neighbor]){
						gScore[neighbor]=99999;
						
					}				
					if(tentative_gScore < gScore[neighbor]){
						cameFrom[neighbor] = current
						gScore[neighbor] = tentative_gScore
						fScore[neighbor] = gScore[neighbor] + dist(neighbor[0], goal[0], neighbor[1], goal[1])
						if(!closeSet.includes(neighbor)){
							openSet.push(neighbor)
						}										
					}					
				}
			}
		}	
	}
	return []
}

function draw() {
	background(255);
	for (var i = RANGE; i < height + RANGE; i += CELLSIZE) {
		for (var j = RANGE; j < width + RANGE; j += CELLSIZE) {
		  // If mouse over
			if (i > (mouseX - RANGE) && i < (mouseX + RANGE) && j > (mouseY - RANGE) && j < (mouseY + RANGE)) {
				if (setInicio == false & setEnd == false){
					if (mouseIsPressed) {
						if (mouseButton === LEFT && (!casasOcupadas[i+"x"+j] || casasOcupadas[i+"x"+j]=="caminho")) {
							casasOcupadas[i+"x"+j]="ocupada";
						}
						else if (mouseButton === LEFT && casasOcupadas[i+"x"+j]=="inicio") {
							delete casasOcupadas[i+"x"+j];
							setInicio = true;
						}
						else if (mouseButton === LEFT && casasOcupadas[i+"x"+j]=="fim") {
							delete casasOcupadas[i+"x"+j];
							setEnd = true;
						}	
						else if (mouseButton === RIGHT && casasOcupadas[i+"x"+j]=="ocupada") {
							delete casasOcupadas[i+"x"+j];
						}				
					}
					stroke(0);
					if(casasOcupadas[i+"x"+j]=="inicio"){				
						fill(255)
						rect(i, j, CELLSIZE, CELLSIZE);
						textSize(18);
						fill(BLUEGREEN);
						text('S', i-6, j+6);			
					}
					else if(casasOcupadas[i+"x"+j]=="fim"){
						fill(255)
						rect(i, j, CELLSIZE, CELLSIZE);
						textSize(18);
						fill(BLUEPURPLE);
						text('F', i-6, j+6);
					} else{
						fill(123);
						rect(i, j, CELLSIZE, CELLSIZE);					
					}					
				} else if (setInicio == true){
					if (mouseIsPressed) {
						if (mouseButton === LEFT && !casasOcupadas[i+"x"+j]) {
							  casasOcupadas[i+"x"+j]="inicio";
							  setInicio = false;
						}
					}
					fill(BLUEGREEN);
					rect(i,j,CELLSIZE,CELLSIZE);
					textSize(18);
					fill(0);
					text('S', i-6, j+6);			
				} else if (setEnd == true){
					if (mouseIsPressed) {
						if (mouseButton === LEFT && !casasOcupadas[i+"x"+j]) {
							  casasOcupadas[i+"x"+j]="fim";
							  setEnd = false;
						}
					}
					fill(BLUEPURPLE);
					rect(i,j,CELLSIZE,CELLSIZE);
					textSize(18);
					fill(0);
					text('F', i-6, j+6);			
				}
			} // If mouse not over
			else {
				stroke(0);
				if(casasOcupadas[i+"x"+j]=="ocupada"){
					fill(REDORANGE)
					rect(i, j, CELLSIZE, CELLSIZE);
				}
				else if(casasOcupadas[i+"x"+j]=="caminho"){
					fill(YELLOWORANGE)
					rect(i, j, CELLSIZE, CELLSIZE);
				}		
				else if(casasOcupadas[i+"x"+j]=="inicio"){
					fill(BLUEGREEN)
					rect(i, j, CELLSIZE, CELLSIZE);
					textSize(18);
					fill(255);
					text('S', i-6, j+6);			
				}
				else if(casasOcupadas[i+"x"+j]=="fim"){
					fill(BLUEPURPLE)
					rect(i, j, CELLSIZE, CELLSIZE);
					textSize(18);
					fill(255);
					text('F', i-6, j+6);
				} else {
					noFill();
					rect(i, j, CELLSIZE, CELLSIZE);
				}
			}
		}
	}
}