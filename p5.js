function setup() {
  //console.log(windowWidth, windowHeight)
  cnv = createCanvas(800, 1000);
  background(220);
  noStroke();
  rectMode(CENTER);
  buttonFind = createButton('Find Path');
  buttonFind.position(200,850);
  buttonFind.mousePressed(pathFind);
/*   buttonClear = createButton('Generate Maze');
  buttonClear.position(300,850);
  buttonClear.mousePressed(mazeAlg); */
  buttonClear = createButton('Clear Obstacules');
  buttonClear.position(450,850);
  buttonClear.mousePressed(clearObs);
  buttonClear = createButton('Clear Path');
  buttonClear.position(600,850);
  buttonClear.mousePressed(clearPath);
}

casasOcupadas = {}
casasOcupadas[50+"x"+50]="inicio";
casasOcupadas[750+"x"+770]="fim";

setInicio = false;
setEnd = false;

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

matriz = []
start = []
goal = []

/* function mazeAlg() {
	for (var i = 10; i < height + 20; i += 20) {
		for (var j = 10; j < width + 20; j += 20) {
			if(i==10 || j==10 || i==height-210 || j==width+10){
				casasOcupadas[i+"x"+j] = "ocupada"			
			}			
		}	
	}
	maze2(height-210,width+10,(height-210)/2,(width+10)/2)	
}

function maze2(h,w,x,y){
	random1=Math.floor(Math.random() * height-210)
	random2=Math.floor(Math.random() * width+10)
} */


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
	for(XxY in foundPath){
		//console.log(((foundPath[XxY][0]*20)+10)+"x"+((foundPath[XxY][1]*20)+10))
		casasOcupadas[((foundPath[XxY][0]*20)+10)+"x"+((foundPath[XxY][1]*20)+10)]="caminho"
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
		console.log(matriz.length, matriz[0].length)
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

