function start(complexity,seconds){
	function period(){
		if(Battlefield.sec<10)
		{
			time.innerHTML='00:0'+Battlefield.sec;
		}else
		{
			time.innerHTML='00:'+Battlefield.sec;
		}
	}
	function exit(){
		if(battlefield2.checkingAvailabilityShips())
		{
			label.innerHTML=label.dataset.exit1;
		}else
		{
			for(let i=0;i<battlefield2.arrCells.length;i++){
				const c_CellValue=battlefield2.arrCells[i];
				if(c_CellValue<Battlefield.kill && c_CellValue>Battlefield.miss)
				{
					battlefield2.drawHit(i,Battlefield.shipColor);
				}
				if(Battlefield.complexity=='hard' && c_CellValue==Battlefield.kill) battlefield2.animate_kill2(i);
			}
			label.innerHTML=label.dataset.exit2;
		}
		time.innerHTML='';
		clearInterval(nTimerId);
		return;
	}
	if(!timer) timer=Battlefield.random(seconds,10);
	if(Battlefield.chet==0) exit();
	if(Battlefield.sec<1)
	{
		if(Battlefield.chet=='pc')
		{
			Battlefield.chet='player';
		}
		else if(Battlefield.chet=='player')
		{
			Battlefield.chet='pc';
		}
		Battlefield.sec=10;
	}
	period();
	if(Battlefield.chet=='pc')
	{
		label.innerHTML=label.dataset.title2;
		if(timer==Battlefield.sec)
		{
			battlefield1.hit_me(complexity);
			if(Battlefield.chet==0)
			{
				exit();
				return;
			}
			Battlefield.sec=10;
			period();
			timer=Battlefield.random(seconds,10);
			Battlefield.chet='player';
			label.innerHTML=label.dataset.title1;
			return;
		}
	}
	Battlefield.sec--;
}
