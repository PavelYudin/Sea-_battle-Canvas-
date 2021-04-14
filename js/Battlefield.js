class Battlefield{

	constructor(elemId){
		this.canvas = document.getElementById(elemId);
		this.context=this.canvas.getContext("2d");
		this.arrCells=[];
		this.arrCoordinatesCell=[];
		for(let i=0;i<Battlefield.countCells*Battlefield.countCells;i++){
			const c_Obj={x:null,y:null/*,nCellValue:null*/}
			this.arrCells.push(null);
			this.arrCoordinatesCell.push(c_Obj);
		}
	}

	static backgroundColor="#9abff3";
	static damagedShipColor="red";
	static shipColor="yellow";
	static kill=5;
	static miss=0;
	static perimeter=6;
	static countCells=10;
	static arrLandmark=[-1,1,-10,10];

	static random(nMin,nMax){
				return Math.round(nMin - 0.5 + Math.random() * (nMax - nMin + 1));
			}

	getCountBlock(){
		if(this==battlefield1) return parseInt(this.activeShip.height/this.widthCell);
	}

	getCell(nX,nY,fLeft,fTop){
		for(let i=0;i<this.arrCoordinatesCell.length;i++){
			if(this.arrCoordinatesCell[i].x+fLeft<=nX && nX<=fLeft+this.widthCell+this.arrCoordinatesCell[i].x && this.arrCoordinatesCell[i].y+fTop<=nY && nY<=fTop+this.widthCell+this.arrCoordinatesCell[i].y)
			{
				return i;
			}
		}
		return null;
	}

	checkingAvailabilityShips(){
		for(let i=0;i<this.arrCells.length;i++){
			if(this.arrCells[i]<Battlefield.kill && this.arrCells[i]>Battlefield.miss) return false;
		}
		return true;
	}

	drawMiss(nIndexCell){
		this.context.fillStyle = "black";
		this.context.beginPath();
        this.context.arc(this.arrCoordinatesCell[nIndexCell].x+this.widthCell/2,this.arrCoordinatesCell[nIndexCell].y+this.widthCell/2, this.widthCell/4, 0, Math.PI*2, false);
        this.context.closePath();
        this.context.fill();
	}

	drawHit(nIndexCell,sColor){
		this.context.fillStyle=sColor;
		this.context.fillRect(this.arrCoordinatesCell[nIndexCell].x,this.arrCoordinatesCell[nIndexCell].y,this.widthCell,this.widthCell);
	}

	animate_kill2(nIndex){
		const img = new Image();
        img.src = "img/kill.jpg";
        img.onload = (function() {
            this.context.drawImage(img, this.arrCoordinatesCell[arguments[0]].x, this.arrCoordinatesCell[arguments[0]].y,this.widthCell,this.widthCell);
        }).bind(this,nIndex);
	}

	createCells(){

		function getSizeCell(nCountCells){
			return (this.canvas.getBoundingClientRect().width-nCountCells*this.context.lineWidth)/nCountCells;
		}

		this.context.lineWidth = 2;
		this.context.strokeStyle = 'blue';
		this.context.fillStyle = Battlefield.backgroundColor;
		this.widthCell=getSizeCell.call(this,Battlefield.countCells);
		let nCoordinatesX=1;
		let nCoordinatesY=1;

		for(let i=0;i<Battlefield.countCells;i++){
			for(let j=0;j<Battlefield.countCells;j++){
				this.context.strokeRect(nCoordinatesX,nCoordinatesY,this.widthCell,this.widthCell);
				this.context.fillRect(nCoordinatesX,nCoordinatesY,this.widthCell,this.widthCell);
				const c_nIndexCell=parseInt(i+''+j);
				this.arrCoordinatesCell[c_nIndexCell].x=nCoordinatesX;
				this.arrCoordinatesCell[c_nIndexCell].y=nCoordinatesY;
				nCoordinatesX+=this.widthCell+2;
			}
			nCoordinatesY=nCoordinatesY+this.widthCell+2;
			nCoordinatesX=1;
		}
		return this;
	}

	check(){

		let del_elem=(sNum)=>{
			for(let i=1;i<arguments.length;i++){
				let index=String(arguments[i]).lastIndexOf(sNum)
				if(index!=-1 && ((String(arguments[i]).length==2 && index==1) || (String(arguments[i]).length==1 && index==0)))
				{
					Array.prototype.splice.call(arguments,i,1);
					i=1;
				}
			}
		}

		let zero=String(arguments[0]).indexOf('0');
		let nine=String(arguments[0]).indexOf('9');
		if(String(arguments[0]).indexOf('0')!=-1  ){//если содержит 0
			del_elem('9');
		}else if(String(arguments[0]).indexOf('9')!=-1){
			del_elem('0');
		}
		for(let j=0;j<arguments.length;j++){
			const nIndex=arguments[j];
			if(nIndex<0 || nIndex>99) continue;
			const nCellValue=this.arrCells[nIndex];
			if(nCellValue!==null && nCellValue<Battlefield.kill && nCellValue>0) return nIndex;
		}	
		return -1;
	}

	createShip(nKol,nView,id,orientation){
		const arrTemporary=[];//временный массив для кораблей
		const self=this;
		const arrPosition=[];
		for(let i=0;i<nKol;i++){
			arrPosition.push(id?orientation:Battlefield.random(0,1))
		}
		
		function horizontal(nIdCell,nKof,nStep){
			if(self.check(nIdCell+nKof,nIdCell+nKof*2,nIdCell+nKof+nStep,nIdCell+nKof-nStep,nIdCell+nKof*2-nStep,nIdCell+nKof*2+nStep)==-1 && nIdCell+nKof>=0 && nIdCell+nKof<100)
			{
				if((String(nIdCell).length>1 && (String(nIdCell+nKof)[0]==String(nIdCell)[0]) && Math.abs(nKof)==1 || Math.abs(nKof)==10) || (String(nIdCell).length==1 && (Math.abs(nKof)==10 || Math.abs(nKof)==1) && nIdCell+nKof<10 && nIdCell+nKof>=0))
				{
					if(nKof<0){arrTemporary.unshift(nIdCell+nKof);return true;}
					if(nKof>0){arrTemporary.push(nIdCell+nKof);return true;}
				}
			}
			animation();
			return false;
		}

		let animation=()=>{
			if(id!=undefined){
				label.innerHTML='Корабли не должны друг друга касаться!';
				setTimeout(()=>{label.innerHTML=''},2000);
				return false;
			}
		}	
		for(let k=0;k<nKol;k++){
			arrTemporary.length=0;// очищаем временный массив для кораблей
			let nRand=id!=undefined?id:Battlefield.random(0,99);
			while(this.check(nRand,nRand+1,nRand-1,nRand-10,nRand+10,nRand+1-10,nRand+1+10,nRand-1-10,nRand-1+10)!=-1){
				if(id!=undefined){				
					animation();
					return false;}
				nRand=Battlefield.random(0,99);
			}
			arrTemporary.push(nRand);
			if(nView>1){				
				for(let i=1;i<nView;i++){
					if(arrPosition[k]){ // если по горизонтали ставим
						if(!horizontal(arrTemporary[arrTemporary.length-1],1,10)){//c + просчет
							if(id!=undefined){return false;}
							if(id==undefined && !horizontal(arrTemporary[0],-1,10)){//c - просчет
								--k;break;
							}		
						}
					}else{//по вертикали
						if(!horizontal(arrTemporary[arrTemporary.length-1],10,1)){//c + просчет
							if(id!=undefined){return false;}
							if(id==undefined && !horizontal(arrTemporary[0],-10,1)){//c - просчет
								--k;break;
							}	
						} 
					}
				}
			}
			if(arrTemporary.length==nView){
				for(let i=0;i<arrTemporary.length;i++){
					const nIndex=arrTemporary[i];
					this.arrCells[nIndex]=nView;
					if(this==battlefield1) this.drawHit(nIndex,Battlefield.shipColor);
				}
			}
		}	
		return true;
	}

	hit(e){// метод для убийства вражеских кораблей
		function perimeter(arrKillShip){// по периметру убитого корбля координаты заношу в массив,что бы не стрелять около корабля
			const arrKof=[[-1,-11,9],[1,11,-9],[-10,10]];
			for(let i=0;i<arrKillShip.length;i++){
				let nIndex=arrKillShip[i];
				for(let k=0;k<arrKof.length;k++){
					if(k==0 && nIndex%10==0) continue;
					const sLimitIndexCell=(nIndex/10+'').split('.')[1];
					if(k==1 && sLimitIndexCell=='9') continue;
					const arrRoute=arrKof[k];
					for(let j=0;j<arrRoute.length;j++){	
						if(nIndex+arrRoute[j]<=99 && nIndex+arrRoute[j]>=0 && arrKillShip.indexOf(nIndex+arrRoute[j])==-1){
							this.arrCells[nIndex+arrRoute[j]]=Battlefield.perimeter;
						}
					}
				}
			}	
		}

		function animate_kill(arrShip){//анимация пропадания корабля
			let nStep=1;//уменьшение размера подбитого квадрата
			let nTimerId1 = setTimeout((function tick() {	
				for(let j=0;j<arrShip.length;j++){
					const nCoordinatesCellX=this.arrCoordinatesCell[arrShip[j]].x;
					const nCoordinatesCellY=this.arrCoordinatesCell[arrShip[j]].y;					
					this.context.fillStyle=Battlefield.backgroundColor;
					this.context.fillRect(nCoordinatesCellX,nCoordinatesCellY,this.widthCell,this.widthCell);
					this.context.fillStyle=Battlefield.damagedShipColor;
					const nWidthCell=Math.floor(this.widthCell-(nStep*2))<=1?0:Math.floor(this.widthCell-(nStep*2));
					this.context.fillRect(nCoordinatesCellX+nStep,nCoordinatesCellY+nStep,nWidthCell,nWidthCell);				
				}
				nStep=nStep+1;
				if(nStep>Math.ceil(this.widthCell/2)) {
					clearTimeout(nTimerId1);
					return;
				}
				nTimerId1 = setTimeout(tick.bind(this), 100);
			}).bind(this), 1000);
		}

		if(Battlefield.chet=='pc'  && this==battlefield2 || !Battlefield.chet){return;}// если в данный момент ход компьютера или конец игры я не могу ударить
		let nIdCell=null;
		if(typeof e=='object'){//если я стреляю
			const nCoordinatesMouseX=e.clientX;
			const nCoordinatesMouseY=e.clientY;
			const {left,top}=this.canvas.getBoundingClientRect();
			nIdCell=this.getCell(nCoordinatesMouseX,nCoordinatesMouseY,left,top);
			if(nIdCell===null) return;
		}else{
			nIdCell=e;//если комп стреляет	
		}		
		const nIndex=this.check(nIdCell);//попал ли по кораблю
		if(nIndex!=-1){ //если попал по кораблю
			if(this==battlefield1) battlefield1.push=1;//попал по кораблю	
			this.drawHit(nIdCell,Battlefield.damagedShipColor);
			this.arrCells[nIndex]=this.arrCells[nIndex]-this.arrCells[nIndex]*2;

			function shipKillCheck(arrCells,nIdCell){
				let nCountBlock=Math.abs(arrCells[nIdCell]);
				nCountBlock--;
				const arrCoordinates=[];//массив для коориднат
				arrCoordinates.push(nIdCell);
				function positionCalculation(nStep){
					if(nStep==-1 && nIdCell%10==0) return false;
					const sLimitIndexCell=(nIdCell/10+'').split('.')[1];
					if(nStep==1 && sLimitIndexCell=='9') return false;
					if(nIdCell+nStep<=99 && nIdCell+nStep>=0 && arrCells[nIdCell]==arrCells[nIdCell+nStep]){
						nCountBlock--;
						arrCoordinates.push(nIdCell+nStep);
						return true;
					}
					return false;
				}
				const nCountBlock2=nCountBlock;
				for(let j=0;j<Battlefield.arrLandmark.length;j++){
					for(let i=1;i<=nCountBlock2;i++){
						if(!positionCalculation(Battlefield.arrLandmark[j]*i)) break; 
					}
				}
				return !nCountBlock?arrCoordinates:[];
			}

			const arrKillShip=shipKillCheck(this.arrCells,nIndex);
			
			if(arrKillShip.length){//если корабль убит		
				if(this==battlefield1) perimeter.call(this,arrKillShip);
				if(this==battlefield1 || Battlefield.complexity=='medium' || Battlefield.complexity=='easy')
				{
					for(let i=0;i<arrKillShip.length;i++)
					{
						const nIndexCell=arrKillShip[i];
						this.animate_kill2(nIndexCell);	
					}
				}else
				{
					animate_kill.call(this,arrKillShip);
				}
				for(let i=0;i<arrKillShip.length;i++){
					const nIndexCell=arrKillShip[i];
					this.arrCells[nIndexCell]=Battlefield.kill;
				}
			}
			if(this.checkingAvailabilityShips()){ //если все корабли убиты
				Battlefield.chet=0;
				return;
			}	
		}else{//если промахнулся по кораблю
			if(this==battlefield1) battlefield1.push=0;
			if(this.arrCells[nIdCell]===null)
			{
				this.arrCells[nIdCell]=Battlefield.miss;
				this.drawMiss(nIdCell);
			}
		}
		
		//возвращаем прицел на прежние место после того как выстрелил
		if(this==battlefield2)
		{
			this.canvas.parentElement.dispatchEvent(new MouseEvent('mousemove',{
									clientX:this.aim.clientX,
									clientY:this.aim.clientY})
									);
		}
		Battlefield.chet='pc';
		Battlefield.sec=10;
	}

	changeSizeField(){
		for(let i=0;i<this.arrCells.length;i++){
			if(this.arrCells[i]==Battlefield.miss) this.drawMiss(i);
			if(this.arrCells[i]<0) this.drawHit(i,Battlefield.damagedShipColor);
			if(this.arrCells[i]>Battlefield.miss && this.arrCells[i]<Battlefield.kill){
				if(this==battlefield1){
					this.drawHit(i,Battlefield.shipColor);
				}else if(!Battlefield.chet){
					this.drawHit(i,Battlefield.shipColor);
				}
			}
			if(this.arrCells[i]==Battlefield.kill){
				if(Battlefield.complexity=='hard' && this==battlefield2 && Battlefield.chet) continue;
				this.animate_kill2(i);
			}		
		}
	}

	createFieldManualShipPlacement(){
		this.timer=null;
		this.fieldWithShip=document.createElement('div');
		this.fieldWithShip.classList.add('fieldHandMade');
		this.fieldWithShip.style.width=this.canvas.width;
		this.fieldWithShip.style.height=parseInt(this.canvas.width)/2+'px';
		this.fieldWithShip.style.top=this.canvas.getBoundingClientRect().top+'px';
		this.fieldWithShip.style.left=this.canvas.getBoundingClientRect().left+'px';
		const c_Canvas=document.createElement('canvas');
		this.ctxFieldShip=c_Canvas.getContext("2d");
		this.fieldWithShip.append(c_Canvas);
		const fieldParent=document.getElementsByClassName('field')[0];
		fieldParent.append(this.fieldWithShip);
		this.objFieldShips={};
	}

	manualShipPlacement=function(){
		this.fieldWithShip.children[0].width=this.canvas.width;
		this.fieldWithShip.children[0].height=parseInt(this.fieldWithShip.style.height);
		//рисуем
		const c_nWidthBlock=parseInt(this.canvas.width/4);
		const c_nTop=20;
		if(Object.keys(this.objFieldShips).length){
			for(let i in this.objFieldShips){
				const c_nLeft=20+c_nWidthBlock*(i-1);
				this.ctxFieldShip.fillStyle=Battlefield.shipColor;
				this.objFieldShips[i].x=c_nLeft;
				this.ctxFieldShip.fillRect(c_nLeft,c_nTop,this.widthCell,this.widthCell*i);
			}
		}else{
			const c_nKolView=4;
			for(let i=1;i<=c_nKolView;i++){
				const kol=c_nKolView-i+1;
				const c_nLeft=20+c_nWidthBlock*(i-1);
				this.ctxFieldShip.fillStyle=Battlefield.shipColor;
				const obj={'x':c_nLeft,'y':c_nTop,count:kol};
				this.objFieldShips[i]=obj;
				this.ctxFieldShip.fillRect(c_nLeft,c_nTop,this.widthCell,this.widthCell*i);
			}
		}
	}

	animationFieldWithShip=function(nStep,nHeight){
		this.timer=setInterval((function(){
			if(this.fieldWithShip.style.top==Math.ceil(this.fieldWithShip.parentElement.getBoundingClientRect().top)-nHeight+'px'){
				clearInterval(this.timer);
				this.timer=null;
			}else{
				this.fieldWithShip.style.top=parseInt(this.fieldWithShip.style.top)+nStep+'px';
			}	
		}).bind(this),5);
	}

	hit_me(sComplexity){//метод для убийства своих кораблей
		if(this!=battlefield1) return;
		function easy(){
			let nIndexCell=null;
			if(arguments[0]==undefined){
				do{
					nIndexCell=Battlefield.random(0,99);//arguments[0] координатат для попаданию по кораблю
				}while(this.arrCells[nIndexCell]==Battlefield.miss || this.arrCells[nIndexCell]==Battlefield.kill || this.arrCells[nIndexCell]<0 || this.arrCells[nIndexCell]==Battlefield.perimeter)// что бы повторно не бил по тем же координатам
			}else{
				nIndexCell=arguments[0];
			}
			this.hit(nIndexCell);
		}
		switch (sComplexity){	
			case 'easy':
				easy.call(this);
				break;
			case 'medium':
				medium.call(this);
				break;
			case 'hard':
				hard.call(this);
				break;
		}	
		function hard(){
			for(let i=0;i<this.arrCells.length;i++){
				if(this.arrCells[i]<Battlefield.miss){
					medium.call(this);
					return;
				}
			}

			let nDraw=Battlefield.random(0,1);
			if(nDraw){//если 1 то четко по кораблю попадаем
				let nNextIndexCell=null;
				do{
					const nRandIndex=Battlefield.random(0,99);
					for(let i=nRandIndex;i<this.arrCells.length;i++){
						if(this.arrCells[i]>Battlefield.miss && this.arrCells[i]<Battlefield.kill){
							nNextIndexCell=i;
						}
					}
				}while(nNextIndexCell===null)
					easy.call(this,nNextIndexCell);				
			}else{
				easy.call(this);		
			}
		}	

		function medium(){//среднюю сложность прописываю	
			const damagedShipIndex=[];
			for(let i=0;i<this.arrCells.length;i++){
				if(this.arrCells[i]<0){
					damagedShipIndex.push(i);
				}
			}
			for(let i=0;i<damagedShipIndex.length;i++){
				const nIndexCell=damagedShipIndex[i];
				const nCellValue=this.arrCells[nIndexCell];
				for(let i=0;i<Battlefield.arrLandmark.length;i++){
					const nStep=Battlefield.arrLandmark[i];
					if(nStep==-1 && nIndexCell%10==0) continue;
					const sLimitIndexCell=(nIndexCell/10+'').split('.')[1];
					if(nStep==1 && sLimitIndexCell=='9') continue;
					const nNextIndex=nIndexCell+nStep;
					if(nNextIndex<0 || nNextIndex>99) continue;
					const nNextCellValue=this.arrCells[nNextIndex];
					if(Math.abs(this.arrCells[nIndexCell])==this.arrCells[nNextIndex]){
						easy.call(this,nNextIndex);
						return;
					}
				}
			}
			easy.call(this);//если подбитых кораблей нет бьем наобум
		}
	}

	addAim=function(){
		if(this!=battlefield2) return;
		const c_FieldOpponent=document.getElementsByClassName('field')[2];
		const c_Canvas=document.createElement('canvas');
		const c_Canvas2=document.createElement('canvas');
		
		c_Canvas.id='aim';
		c_Canvas.style.display="none";
		c_FieldOpponent.append(c_Canvas);
		this.aim=c_Canvas;
		//подсветка backlight
		c_Canvas2.id='backlight';
		c_Canvas2.style.display="none";
		this.backlight=c_Canvas2;	
		c_FieldOpponent.prepend(c_Canvas2);
		return this;
	}

	drawAim=function(){
		if(this!=battlefield2) return;
		function drawCircle(nR){
			c_Context.beginPath();
		    c_Context.arc((this.context.lineWidth+this.widthCell)/2,(this.widthCell+this.context.lineWidth)/2,nR, 0, Math.PI*2, false);
			c_Context.closePath();
			c_Context.stroke();	
		}
		
		this.aim.width=this.widthCell;
		this.aim.height=this.widthCell;

	    const c_Context = this.aim.getContext('2d');
	    c_Context.lineWidth=2;
	   	drawCircle.call(this,this.widthCell/2-c_Context.lineWidth);
	   	drawCircle.call(this,this.widthCell/6);
	   	//horizontal
		c_Context.beginPath();
		c_Context.moveTo(this.widthCell-(this,this.widthCell/2-c_Context.lineWidth)*2,this.widthCell/2+this.context.lineWidth/2);
		c_Context.lineTo(this.widthCell-1,this.widthCell/2+this.context.lineWidth/2);
		c_Context.stroke();
		//vertical
		c_Context.beginPath();
		c_Context.moveTo(this.widthCell/2+this.context.lineWidth/2,this.widthCell-(this,this.widthCell/2-c_Context.lineWidth)*2);
		c_Context.lineTo(this.widthCell/2+this.context.lineWidth/2,this.widthCell+this.context.lineWidth/2);
		c_Context.stroke();
		//подсветка
		this.backlight.width=this.widthCell;
		this.backlight.height=this.widthCell;
	    const c_Context2 = this.backlight.getContext('2d');
	    c_Context2.globalAlpha =0.5;
		c_Context2.fillStyle='#10e8e8';
		c_Context2.fillRect(0,0,this.widthCell,this.widthCell);
	}
}
