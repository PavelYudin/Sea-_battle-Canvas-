document.addEventListener("mousemove",(function(e){//движение мыши на вражеском поле
	const c_X=e.clientX;
	const c_Y=e.clientY;
	const {left,right,top,bottom}=this.canvas.getBoundingClientRect();

	if(c_X<=right && c_X>=left && c_Y>=top && c_Y<=bottom)
	{
		if(!this.aim) this.addAim().drawAim();
		this.aim.style.top=c_Y-parseInt(this.aim.height)/2+'px';
		this.aim.style.left=c_X-parseInt(this.aim.width)/2+'px';	
		const c_Id=this.getCell(c_X,c_Y,left,top);					
		this.aim.style.display='';	
		if(c_Id===null)
		{
			this.backlight.style.display='none';	
		}else
		{
			this.backlight.style.display='';
			const c_leftBacklight=this.canvas.getBoundingClientRect().left+this.arrCoordinatesCell[c_Id].x;
			const c_TopBacklight=this.canvas.getBoundingClientRect().top+this.arrCoordinatesCell[c_Id].y;
			this.backlight.style.top=c_TopBacklight+'px';
			this.backlight.style.left=c_leftBacklight+'px';
		}		
	}else if(this.aim)
	{
		this.backlight.style.display='none';
		this.aim.style.display='none';
	}	
}).bind(battlefield2),true);


document.body.addEventListener("wheel",(function(e){
	if(!this.backlight) return;
	this.backlight.style.display='none';
	this.aim.style.display='none';
}).bind(battlefield2));


battlefield2.canvas.parentElement.addEventListener("mouseup",function(e){//удар по вражеским кораблям
	battlefield2.hit(e);
});


battlefield2.canvas.parentElement.addEventListener("mousedown",(function(e){ //событие мыши временное удаления прицела для убийства вражеских кораблей
	if(this.canvas.parentElement.contains(this.aim))
	{
		this.aim.style.display='none';
		this.backlight.style.display='none';
		this.aim.clientX=e.clientX;
		this.aim.clientY=e.clientY;
	}
}).bind(battlefield2));


const c_ClientWidth=document.documentElement.clientWidth;
const c_ClientHeight=document.documentElement.clientHeight;
const c_WidthCanvas=battlefield1.canvas.width;

window.addEventListener('resize',function(e){
	const c_ChangeClientWidth=document.documentElement.clientWidth;
	const c_ChangeClientHeight=document.documentElement.clientHeight;
	const c_PercentClientWidth=c_ChangeClientWidth*100/c_ClientWidth;
	let n_NewSizeField=c_WidthCanvas*Math.round(c_PercentClientWidth)/100;
	if(n_NewSizeField<200) return;
	const c_WidthCell=(n_NewSizeField-Battlefield.countCells*battlefield1.context.lineWidth)/Battlefield.countCells;
	if(!Number.isInteger(c_WidthCell))
	{
		n_NewSizeField=Math.ceil(c_WidthCell)*Battlefield.countCells+Battlefield.countCells*battlefield1.context.lineWidth;
	}

	battlefield1.canvas.width=n_NewSizeField;
	battlefield1.canvas.height=n_NewSizeField;
	battlefield1.createCells();

	battlefield2.canvas.width=n_NewSizeField;
	battlefield2.canvas.height=n_NewSizeField;
	battlefield2.createCells();

	//field
	battlefield1.canvas.parentElement.style.width=n_NewSizeField+'px';
	battlefield1.canvas.parentElement.style.height=n_NewSizeField+'px';
	battlefield1.canvas.nextElementSibling.style.width=n_NewSizeField+'px';
	battlefield1.canvas.nextElementSibling.style.height=parseInt(n_NewSizeField/2)+'px';
	battlefield1.canvas.nextElementSibling.style.left=battlefield1.canvas.parentElement.style.left;
	if(!autoplay.checked)
	{
		if(label.innerText.length)
		{
			battlefield1.fieldWithShip.children[0].width=0;
			battlefield1.canvas.nextElementSibling.style.top=battlefield1.canvas.parentElement.getBoundingClientRect().top+'px';
		}else
		{
			battlefield1.canvas.nextElementSibling.style.top=battlefield1.canvas.parentElement.getBoundingClientRect().top-parseInt(n_NewSizeField/2)+'px';
			battlefield1.manualShipPlacement();
		}
	}else
	{
		battlefield1.fieldWithShip.children[0].width=0;
		battlefield1.canvas.nextElementSibling.style.top=battlefield1.canvas.parentElement.getBoundingClientRect().top+'px';
	}

	battlefield1.canvas.parentElement.nextElementSibling.style.width=n_NewSizeField+'px';
	battlefield1.canvas.parentElement.nextElementSibling.style.height=n_NewSizeField+'px';
	battlefield2.canvas.parentElement.style.width=n_NewSizeField+'px';
	battlefield2.canvas.parentElement.style.height=n_NewSizeField+'px';

	battlefield1.changeSizeField();
	battlefield2.changeSizeField();

	if(this.aim) battlefield2.drawAim();
	
});

window.addEventListener('load',function(e){
	battlefield1.createFieldManualShipPlacement();
	battlefield1.fieldWithShip.addEventListener('click',function(e){
		const c_ObjSizeField=this.getBoundingClientRect();
		for(let i in battlefield1.objFieldShips){
			const c_Left=c_ObjSizeField.left+battlefield1.objFieldShips[i].x;
			const c_Right=c_Left+battlefield1.widthCell;
			const c_Top=c_ObjSizeField.top+battlefield1.objFieldShips[i].y;
			const c_Bottom=c_Top+battlefield1.widthCell*i;
			if(e.clientX>c_Left && e.clientX<c_Right && e.clientY>c_Top && e.clientY<c_Bottom)
			{
				const c_Canvas=document.createElement('canvas');
				c_Canvas.style.position='fixed';
				c_Canvas.style.left=c_Left+'px';
				c_Canvas.style.transform='rotate(0deg)';
				c_Canvas.style.top=c_Top+'px';
				c_Canvas.width=battlefield1.widthCell;
				c_Canvas.height=battlefield1.widthCell*i+i*battlefield1.context.lineWidth;
				const c_Ctx=c_Canvas.getContext("2d");
				c_Ctx.fillStyle=Battlefield.shipColor;
				c_Ctx.fillRect(0,0,c_Canvas.width,c_Canvas.height);
				this.parentElement.append(c_Canvas);
				battlefield1.activeShip=c_Canvas;
				break;
			}
		}
		if(!battlefield1.activeShip) return;
		battlefield1.activeShip.addEventListener('contextmenu',function(e){
			if(!battlefield1.activeShip) return;
			if(battlefield1.activeShip.style.transform=='rotate(0deg)'){
				battlefield1.activeShip.style.transform='rotate(90deg)';
				const c_nCountBlock=battlefield1.getCountBlock();
				battlefield1.activeShip.style.left=e.clientX+battlefield1.widthCell*(c_nCountBlock/2)-battlefield1.widthCell+battlefield1.context.lineWidth*c_nCountBlock/2-battlefield1.context.lineWidth/2+'px';
				battlefield1.activeShip.style.top=e.clientY-battlefield1.widthCell*c_nCountBlock/2-battlefield1.context.lineWidth*c_nCountBlock/2+battlefield1.context.lineWidth/2 +'px';
			}else{
				battlefield1.activeShip.style.transform='rotate(0deg)';
				battlefield1.activeShip.style.left=e.clientX-battlefield1.widthCell/2+'px';
				battlefield1.activeShip.style.top=e.clientY-battlefield1.widthCell/2+'px';
			}
			e.preventDefault();
		});
		battlefield1.activeShip.addEventListener('mousedown',function(e){
			if(e.which==1){
				battlefield1.activeShip.remove();
			}
		});
	});

});

autoplay.addEventListener('click',function(e){
	if(battlefield1.timer!==null){e.preventDefault();return;}
	if(!autoplay.checked)
	{
		battlefield1.manualShipPlacement();
		battlefield1.animationFieldWithShip(-1,parseInt(battlefield1.fieldWithShip.style.height));//анимация для появления кораблей для расстановки
	}else{
		function clear_ship(){
			for(let i=0;i<battlefield1.arrCells.length;i++){
				const c_nCellValue=battlefield1.arrCells[i];
				if(c_nCellValue<Battlefield.kill && c_nCellValue>Battlefield.miss)
				{
					battlefield1.arrCells[i]=null;
					battlefield1.drawHit(i,Battlefield.backgroundColor);
				}
			}
		}
		clear_ship();
		battlefield1.objFieldShips={};
		battlefield1.animationFieldWithShip(1,0);//анимация для скрытия кораблей для расстановки
	}
});

document.addEventListener('mousemove',function(e){
	if(!battlefield1.activeShip) return;
	if(battlefield1.activeShip.style.transform=='rotate(0deg)')
	{
		battlefield1.activeShip.style.left=e.clientX-battlefield1.widthCell/2+'px';
		battlefield1.activeShip.style.top=e.clientY-battlefield1.widthCell/2+'px';
	}else
	{
		const c_nCountBlock=battlefield1.getCountBlock();
		battlefield1.activeShip.style.left=e.clientX+battlefield1.widthCell*(c_nCountBlock/2)-battlefield1.widthCell+battlefield1.context.lineWidth*c_nCountBlock/2-battlefield1.context.lineWidth/2+'px';
		battlefield1.activeShip.style.top=e.clientY-battlefield1.widthCell*c_nCountBlock/2-battlefield1.context.lineWidth*c_nCountBlock/2+battlefield1.context.lineWidth/2 +'px';
	}
});

battlefield1.canvas.addEventListener('mouseup',function(e){
	if(battlefield1.activeShip){
		const c_ObjSizeField=this.getBoundingClientRect();
		for(let i=0;i<battlefield1.arrCoordinatesCell.length;i++){
			const c_Left=c_ObjSizeField.left+battlefield1.arrCoordinatesCell[i].x;
			const c_Right=c_Left+battlefield1.widthCell;
			const c_Top=c_ObjSizeField.top+battlefield1.arrCoordinatesCell[i].y;
			const c_Bottom=c_Top+battlefield1.widthCell;
			if(e.clientX>c_Left && e.clientX<c_Right && e.clientY>c_Top && e.clientY<c_Bottom){
				const c_nCountBlock=battlefield1.getCountBlock();
				function checkCountShip(){		
					battlefield1.objFieldShips[c_nCountBlock].count--;
					if(!battlefield1.objFieldShips[c_nCountBlock].count)
					{
						const c_X=battlefield1.objFieldShips[c_nCountBlock].x;
						const c_Y=battlefield1.objFieldShips[c_nCountBlock].y;
						battlefield1.ctxFieldShip.fillStyle=Battlefield.backgroundColor;
						battlefield1.ctxFieldShip.fillRect(c_X,c_Y,battlefield1.widthCell,battlefield1.widthCell*c_nCountBlock);
						delete battlefield1.objFieldShips[c_nCountBlock];
						battlefield1.activeShip=null;
					}
				}
				if(battlefield1.activeShip.style.transform=='rotate(0deg)')
				{
					if((c_nCountBlock-1)*10+i<100)
					{
						const successfulStaging=battlefield1.createShip(1,c_nCountBlock,i,0);
						if(successfulStaging) checkCountShip();
					}
				}else
				{
					if(parseInt((i+c_nCountBlock-1)/10)==parseInt(i/10))
					{
						const successfulStaging=battlefield1.createShip(1,c_nCountBlock,i,1);
						if(successfulStaging) checkCountShip();
					}
				}
			}
		}
	}
});
