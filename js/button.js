button.addEventListener('click',function(e){
	if(!battlefield1.checkingAvailabilityShips()) battlefield1.animationFieldWithShip(1,0);//анимация для скрытия кораблей для расстановки

	function choice(){
		const player=players.getElementsByTagName('input');
		for(let i=0;i<player.length;i++){
			if(player[i].checked){
				Battlefield.chet=player[i].id;//кто ходит
				label.innerHTML=player[i].dataset.player;
			}
		}
	}

	function _complexity(){
		const optionsСomplexity=complexity.getElementsByTagName('input');
		for(let i=0;i<optionsСomplexity.length;i++){
			if(optionsСomplexity[i].checked){
				return {
					level:optionsСomplexity[i].id,
					sec:optionsСomplexity[i].dataset
				}
			}
		}
	}



	//авторасстановка кораблей своих
	if(autoplay.checked)
	{
		battlefield1.createShip(4,1);
		battlefield1.createShip(1,4);
		battlefield1.createShip(2,3);
		battlefield1.createShip(3,2);
	}

	function checkPresenceShips(arrCells){
		return arrCells.some(function(value){return value!==null;})
	}

	if(!checkPresenceShips(battlefield1.arrCells)){
		label.innerHTML='Необходимо расставить корабли!';
		setTimeout(()=>{label.innerHTML=''},2000);
		return;
	}

	battlefield2.createShip(4,1);
	battlefield2.createShip(1,4);
	battlefield2.createShip(2,3);
	battlefield2.createShip(3,2);

	let{level,sec}=_complexity();//какой уровень
	Battlefield.complexity=level;
	let nSeconds=sec.seconds;
	choice();//кто ходит
	Battlefield.sec=10;
	window.nTimerId=setInterval(start,1000,Battlefield.complexity,nSeconds);
	this.classList.add('disabled');
	
	battlefield1.canvas.parentElement.nextElementSibling.addEventListener('click',function(e){
		e.stopPropagation();
	},true)
});


