let timer;//time to trigger the opponent's move
const button=document.getElementById('play');
const autoplay=document.getElementById('autoplay');
const label=document.getElementsByClassName('div_label')[0];

const battlefield1=new Battlefield('canvas1').createCells();
battlefield1.push;//определяет последний удар попал или нет при средней сложности 

const battlefield2=new Battlefield('canvas2').createCells();



