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
	for (var i = RANGE; i < (height)+ RANGE; i += CELLSIZE) {
		for (var j = RANGE; j < width + RANGE; j += CELLSIZE) {
			if(i==RANGE || j==RANGE || i==height-RANGE || j==width-RANGE){
				casasOcupadas[i+"x"+j] = "ocupada"			
			}			
		}	
	}
	maze2(RANGE,RANGE,(height-RANGE),(width-RANGE))	
}

function maze2(x,y,h,w){
	dividorX =(Math.floor(Math.random() * ((w-CELLSIZE)/CELLSIZE - (x+40)/CELLSIZE)) + (x+40)/CELLSIZE) * CELLSIZE
	dividorY=(Math.floor(Math.random() * ((h-CELLSIZE)/CELLSIZE - (y+40)/CELLSIZE)) + (y+40)/CELLSIZE) * CELLSIZE
	dividorsX.push(dividorX)
	dividorsY.push(dividorY)
	passagem11=-1
	passagem12=-1
	
	while(passagem11<0 || passagem12<0 || dividorsY.includes(passagem11) || dividorsY.includes(passagem12)){
		passagem11=(Math.floor(Math.random() * ((dividorY-CELLSIZE)/CELLSIZE - (x+40)/CELLSIZE)) + (x+40)/CELLSIZE) * CELLSIZE
		passagem12=(Math.floor(Math.random() * ((w-CELLSIZE)/CELLSIZE - (dividorY+40)/CELLSIZE)) + (dividorY+40)/CELLSIZE) * CELLSIZE		
	}
	passagem21=-1
	passagem22=-1
	while(passagem21<0 || passagem22<0 || dividorsX.includes(passagem21) || dividorsX.includes(passagem22)){
		passagem21=(Math.floor(Math.random() * ((dividorX-CELLSIZE)/CELLSIZE - (y+40)/CELLSIZE)) + (y+40)/CELLSIZE) * CELLSIZE
		passagem22=(Math.floor(Math.random() * ((h-CELLSIZE)/CELLSIZE - (dividorX+40)/CELLSIZE)) + (dividorX+40)/CELLSIZE) * CELLSIZE	
	}	
	for (var j = RANGE; j < width + RANGE; j += CELLSIZE) {
		casasOcupadas[j+"x"+dividorX] = "ocupada"						
	}
	delete casasOcupadas[passagem11+"x"+dividorX]
	delete casasOcupadas[passagem12+"x"+dividorX]
	for (var i = RANGE; i < (height)+ RANGE; i += CELLSIZE) {
		casasOcupadas[dividorY+"x"+i] = "ocupada"						
	}
	delete casasOcupadas[dividorY+"x"+passagem21]
	delete casasOcupadas[dividorY+"x"+passagem22]

	// Segundo Quadrante
	if(dividorX-x>80 && dividorY-y>80){
		maze2(x,y,dividorX,dividorY)
	} 
 	// Terceiro Quadrante
/* 	if(dividorX-x>80 && h-dividorY>80){
		maze2(x,dividorY,dividorX,h)
	}
 	// Quarto Quadrante
	if(w-dividorX>80 && h-dividorY>80){
		maze2(dividorX,dividorY,h,w)
	}
	//Primeiro Quadrante
	if(w-dividorX>80 && dividorY-y>80){
		maze2(dividorX,y,w,dividorY)
	}	 */ 
}


function pathFind() {
	clearPath()
	for (var i = RANGE; i < (height) + RANGE; i += CELLSIZE) {
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
		
/* 		// vizinho esquerda
		if(current[0]>0 && matriz[current[0]-1][current[1]]!="ocupada"){
			tentative_gScore = gScore[current] + 1
			neighbor=[]
			neighbor[0]=current[0]-1
			neighbor[1]=current[1]
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
		// vizinho cima
		if(current[1]>0 && matriz[current[0]][current[1]-1]!="ocupada"){
			tentative_gScore = gScore[current] + 1
			neighbor=[]
			neighbor[0]=current[0]
			neighbor[1]=current[1]-1
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
		// vizinho baixo
		if(current[1]+1<matriz[0].length && matriz[current[0]][current[1]+1]!="ocupada"){
			tentative_gScore = gScore[current] + 1
			neighbor=[]
			neighbor[0]=current[0]
			neighbor[1]=current[1]+1
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
		// vizinho direita
		if(current[0]+1<matriz.length-1 && matriz[current[0]+1][current[1]]!="ocupada"){
			tentative_gScore = gScore[current] + 1
			neighbor=[]
			neighbor[0]=current[0]+1
			neighbor[1]=current[1]
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
		}	 */		
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