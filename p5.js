function setup() {
  //console.log(windowWidth, windowHeight)
  cnv = createCanvas(800, 1000);
  background(220);
  noStroke();
  rectMode(CENTER);
  buttonFind = createButton('Find Path');
  buttonFind.position(200,850);
  buttonFind.mousePressed(pathFind);
  buttonClear = createButton('Generate Maze');
  buttonClear.position(300,850);
  buttonClear.mousePressed(mazeAlg);
  buttonClear = createButton('Clear Obstacules');
  buttonClear.position(450,850);
  buttonClear.mousePressed(clearObs);
  buttonClear = createButton('Clear Path');
  buttonClear.position(600,850);
  buttonClear.mousePressed(clearPath);
}

casasOcupadas = {}
casasOcupadas[30+"x"+30]="inicio";
casasOcupadas[770+"x"+790]="fim";

setInicio = false;
setEnd = false;

matriz = []
start = []
goal = []


function clearObs() {
	for (i in casasOcupadas){
		if(casasOcupadas[i]=="ocupada"){
			delete casasOcupadas[i];
		}
	}
}

function clearPath() {
	for (i in casasOcupadas){
		if(casasOcupadas[i]=="caminho"){
			delete casasOcupadas[i];
		}
	}
}


function mazeAlg() {
	for (var i = 10; i < (height-200)+20; i += 20) {
		for (var j = 10; j < width + 20; j += 20) {
			if(i==10 || j==10 || i==height-210 || j==width+10){
				casasOcupadas[i+"x"+j] = "ocupada"			
			}			
		}	
	}
	maze2(10,10,(height-210),(width+10))	
}


dividorsX=[]
dividorsY=[]
function maze2(x,y,h,w){
	dividorX =(Math.floor(Math.random() * ((w-20)/20 - (x+40)/20)) + (x+40)/20) * 20
	dividorY=(Math.floor(Math.random() * ((h-20)/20 - (y+40)/20)) + (y+40)/20) * 20
	dividorsX.push(dividorX)
	dividorsY.push(dividorY)
	passagem11=-1
	passagem12=-1
	
	while(passagem11<0 || passagem12<0 || dividorsY.includes(passagem11) || dividorsY.includes(passagem12)){
		passagem11=(Math.floor(Math.random() * ((dividorY-20)/20 - (x+40)/20)) + (x+40)/20) * 20
		passagem12=(Math.floor(Math.random() * ((w-20)/20 - (dividorY+40)/20)) + (dividorY+40)/20) * 20		
	}
	passagem21=-1
	passagem22=-1
	while(passagem21<0 || passagem22<0 || dividorsX.includes(passagem21) || dividorsX.includes(passagem22)){
		passagem21=(Math.floor(Math.random() * ((dividorX-20)/20 - (y+40)/20)) + (y+40)/20) * 20
		passagem22=(Math.floor(Math.random() * ((h-20)/20 - (dividorX+40)/20)) + (dividorX+40)/20) * 20	
	}

	
	for (var j = 10; j < width + 20; j += 20) {
			casasOcupadas[j+"x"+dividorX] = "ocupada"						
	}
	casasOcupadas[passagem11+"x"+dividorX] = "vazio"
	casasOcupadas[passagem12+"x"+dividorX] = "vazio"
	for (var i = 10; i < (height-200)+20; i += 20) {
			casasOcupadas[dividorY+"x"+i] = "ocupada"						
	}
	casasOcupadas[dividorY+"x"+passagem21] = "vazio"
	casasOcupadas[dividorY+"x"+passagem22] = "vazio"

	console.log(x,y,h,w,dividorX,dividorY)
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
	for (var i = 10; i < (height-200) + 20; i += 20) {
		matriz[(i-10)/20] = []
		for (var j = 10; j < width + 20; j += 20) {
			matriz[(i-10)/20][(j-10)/20] = "vazio"
		}
	}
	for (XxY in casasOcupadas){
		coord = XxY.split("x");
		if(casasOcupadas[XxY]=="inicio"){
			matriz[(coord[0]-10)/20][(coord[1]-10)/20] = "inicio"
			start[0] = (coord[0]-10)/20
			start[1] = (coord[1]-10)/20
		}
		if(casasOcupadas[XxY]=="fim"){
			matriz[(coord[0]-10)/20][(coord[1]-10)/20] = "fim"
			goal[0] = (coord[0]-10)/20
			goal[1] = (coord[1]-10)/20
		}
		if(casasOcupadas[XxY]=="ocupada"){
			matriz[(coord[0]-10)/20][(coord[1]-10)/20] = "ocupada"
		}
	}
	//console.log(matriz)
	foundPath = aStar()
/* 	for(XxY in foundPath){
		//console.log(((foundPath[XxY][0]*20)+10)+"x"+((foundPath[XxY][1]*20)+10))
		
	} */
	//console.log(foundPath.length)
	//console.log(((foundPath[0][0]*20)+10)+"x"+((foundPath[0][1]*20)+10))
	for(i=0;i<foundPath.length;i++){
		//console.log(((foundPath[i][0]*20)+10)+"x"+((foundPath[i][1]*20)+10))
		casasOcupadas[((foundPath[i][0]*20)+10)+"x"+((foundPath[i][1]*20)+10)]="caminho"
	}
}

function reconstruct_path(cameFrom, current){
    total_path = []
    while(cameFrom[current]!=start){
		//console.log(current)
		//console.log(cameFrom[current])
		current = cameFrom[current]
        total_path.unshift(current)	
	}
	//console.log(total_path)
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
		//console.log(matriz.length, matriz[0].length)
		current = openSet.shift()
		//console.log(current)
		//console.log(goal)
		if(current[0]==goal[0] && current[1]==goal[1]){
			return reconstruct_path(cameFrom, current)
		}
		closeSet.push(current)
		
		
		
		// vizinho esquerda
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
		}		
		//return "falhou"
		
	}

}






function draw() {
  var lightBlue = "black";
  background(255);
  for (var i = 10; i < (height-200) + 20; i += 20) {
    // draw one line of 20 rectangles across the x-axis
    for (var j = 10; j < width + 20; j += 20) {
      var lightBlue = "black";
      var range = 10;
      stroke(0, 0, 255);
      if (i > (mouseX - range) && i < (mouseX + range) && j > (mouseY - range) && j < (mouseY + range)) {
		if (setInicio == false & setEnd == false){
			if (mouseIsPressed) {
				if (mouseButton === LEFT && (!casasOcupadas[i+"x"+j] || casasOcupadas[i+"x"+j]=="caminho")) {
				  casasOcupadas[i+"x"+j]="ocupada";
				  //console.log(i,j);
				}
				if (mouseButton === RIGHT && casasOcupadas[i+"x"+j]=="ocupada") {
				  delete casasOcupadas[i+"x"+j];
				  //console.log(i,j);
				}
				if (mouseButton === LEFT && casasOcupadas[i+"x"+j]=="inicio") {
				  delete casasOcupadas[i+"x"+j];
				  setInicio = true;
				  //console.log(setInicio)
				}
				if (mouseButton === LEFT && casasOcupadas[i+"x"+j]=="fim") {
				  delete casasOcupadas[i+"x"+j];
				  setEnd = true;
				  //console.log(setInicio)
				}				
			}
			if(casasOcupadas[i+"x"+j]=="inicio"){
				noFill();
				stroke(lightBlue);
				fill('black')
				rect(i, j, 20, 20);
				textSize(18);
				fill("green");
				text('S', i-6, j+6);			
			}
			else if(casasOcupadas[i+"x"+j]=="fim"){
				noFill();
				stroke(lightBlue);
				fill('black')
				rect(i, j, 20, 20);
				textSize(18);
				fill("blue");
				text('F', i-6, j+6);
			} else{
				noStroke();
				fill("black");
				rect(i,j,20,20);
				stroke(lightBlue);
				rect(i, j, 20, 20);					
			}					
		} else if (setInicio == true){
			if (mouseIsPressed) {
				if (mouseButton === LEFT && !casasOcupadas[i+"x"+j]) {
					  casasOcupadas[i+"x"+j]="inicio";
					  //console.log(i,j);
					  setInicio = false;
				}
			}
			noStroke();
			fill("green");
			rect(i,j,20,20);
			stroke(lightBlue);
			rect(i, j, 20, 20);
			textSize(18);
			fill("black");
			text('S', i-6, j+6);			
		} else if (setEnd == true){
			if (mouseIsPressed) {
				if (mouseButton === LEFT && !casasOcupadas[i+"x"+j]) {
					  casasOcupadas[i+"x"+j]="fim";
					  //console.log(i,j);
					  setEnd = false;
				}
			}
			noStroke();
			fill("blue");
			rect(i,j,20,20);
			stroke(lightBlue);
			rect(i, j, 20, 20);
			textSize(18);
			fill("white");
			text('F', i-6, j+6);			
		}
      } else {
		if(casasOcupadas[i+"x"+j]=="ocupada"){
			noFill();
			stroke(lightBlue);
			fill('red')
			rect(i, j, 20, 20);
		}
		else if(casasOcupadas[i+"x"+j]=="caminho"){
			noFill();
			stroke(lightBlue);
			fill('yellow')
			rect(i, j, 20, 20);
		}		
		else if(casasOcupadas[i+"x"+j]=="inicio"){
			noFill();
			stroke(lightBlue);
			fill('green')
			rect(i, j, 20, 20);
			textSize(18);
			fill("black");
			text('S', i-6, j+6);			
		}
		else if(casasOcupadas[i+"x"+j]=="fim"){
			noFill();
			stroke(lightBlue);
			fill('blue')
			rect(i, j, 20, 20);
			textSize(18);
			fill("black");
			text('F', i-6, j+6);
		} else {
			noFill();
			stroke(lightBlue);
			rect(i, j, 20, 20);
		}

      }
    }
  }
  //console.log(casasOcupadas);
}

