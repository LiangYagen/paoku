
/*人物创建*/
function preson(cobj,canvas,runimg,jumpimg){
    this.clientW=canvas.width;
    this.clientH=canvas.height;
    this.cobj=cobj;
    this.canvas=canvas;
    this.runimg=runimg;
    this.jumpimg=jumpimg;
    this.state="runimg";
    this.status=0;
    this.width=100;
    this.height=100;
    this.speed=5
    this.x=0;
    this.y=this.clientH-this.height;
    this.inity=this.y;
    this.sudu="slow";
}
preson.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.state][this.status],0,0,183,125,0,0,104,79);
        this.cobj.restore();
    }
}
/*障碍物设置*/
function hides(cobj,canvas,hidesimg){
    this.clientW=canvas.width;
    this.clientH=canvas.height;
    this.width=50;
    this.height=50;
    this.x=this.clientW+50;
    this.y=this.clientH-this.height-10 ;
    this.cobj=cobj;
    this.hidesimg=hidesimg;
    this.status=0;
    this.speed=0.5;
}
hides.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hidesimg[this.status],0,0,170,171,0,0,45,45);
        this.cobj.restore();
    }
}
/*游戏主体*/
function game(cobj,canvas,runimg,jumpimg,hidesimg,fen,life){
    this.clientW=canvas.width;
    this.clientH=canvas.height;
    this.fen=fen;
    this.life=life;
    this.lifenum=3;
    this.cobj=cobj;
    this.canvas=canvas;
    this.jumpimg=jumpimg;
    this.hidesimg=hidesimg;
    this.pobj=new preson(cobj,canvas,runimg,jumpimg);
    this.time=40;
    this.step=0;
    this.historyArr=[];
    this.score=0;
    this.backspeed=3;
    this.tunum=0
    this.initscore=0;
}
game.prototype={
    play:function(){
        this.key();
        var num=0;
        var that=this;
        var num1=0;
        var step=6000;
        var back=0;
        setInterval(function(){
            that.step+=that.time;
            that.cobj.clearRect(0,0,that.clientW,that.clientH);
            if(that.score>5){
                that.pobj.sudu="nomarl"
            }else if(that.score>8){
                that.pobj.sudu="fraw"
            }
              if(that.pobj.sudu=="slow"){
                  if(that.step%30==0){
                      num++;
                      that.pobj.x+=that.pobj.speed;
                  }
                  for(var i=0;i<that.historyArr.length;i++){
                      that.historyArr[i].speed=5
                  }
                  that.backspeed=5
              }else if(that.pobj.sudu=="nomarl"){
                  if(that.step%60==0){
                      num++;
                      that.pobj.x+=that.pobj.speed;

                  }
                  for(var i=0;i<that.historyArr.length;i++){
                      that.historyArr[i].speed=8
                  }
                  that.backspeed=8;
              }else if(that.pobj.sudu=="fraw"){
                  if(that.step%80==0){
                      num++;
                      that.pobj.x+=that.pobj.speed;
                  }
                  for(var i=0;i<that.historyArr.length;i++){
                      that.historyArr[i].speed=10
                  }
                  that.backspeed=10;
              }
            if(that.pobj.state=="runimg"){
                that.pobj.status=num%that.tunum
            }else if(that.pobj.state=="jumpimg"){
                that.pobj.status=0;
            }
            that.pobj.draw();
            if(that.pobj.x>that.clientW/3){
                that.pobj.x=that.clientW/3
            }
            back+=that.backspeed
            that.canvas.style.backgroundPositionX=-back+"px";




            /*障碍物*/
            if(num1%step==0){
                num1=0;
                step=parseInt(5+25*Math.random())*300;
                var hidesObj=new hides(that.cobj,that.canvas,that.hidesimg);
                hidesObj.status=Math.floor(that.hidesimg.length*Math.random());
                if(that.historyArr.length==0){
                    hidesObj.flag=true;
                }
                that.historyArr.push(hidesObj);
                if(that.historyArr.length>10){
                    that.historyArr.shift();
                }
            }
            for(var i=0;i<that.historyArr.length;i++){
                that.historyArr[i].x-=that.historyArr[i].speed;
                that.historyArr[i].draw();
                if(that.historyArr[i].flag){

                    if(that.historyArr[i].x+that.historyArr[i].width<that.pobj.x){
                        if(that.historyArr[i+1]){
                            that.historyArr[i].flag=false;
                            that.historyArr[i+1].flag=true;
                        }
                        if(!that.historyArr[i].score){
                                that.score++;
                                that.fen.innerHTML=that.score;
                            that.historyArr[i].score=true;
                        }
                    }
                    if(hitPix(that.canvas,that.cobj,that.pobj,that.historyArr[i])){
                        if(!that.historyArr[i].life){
                            that.lifenum--;
                            that.life.innerHTML=that.lifenum;
                            that.historyArr[i].life=true;
                            if(that.lifenum==0){
                                alert("GAME OVER")
                                location.reload();
                            }
                        }
                    }
                }
            }
            num1+=that.time
        },that.time)
    },
    key:function(){
        var that=this;
        var flag=true;
        document.onkeydown=function(e){
            var code= e.keyCode;
            if(code=="32"){
                var inita=0;
                var speeda=5;
                var g1=0.1;
                var g2=0.3;
                var gao=150;
                if(!flag){
                    return;
                }
                flag=false;
                var t=setInterval(function(){
                    inita+=speeda;
                    that.pobj.state="jumpimg";
                    if(inita>180){
                        flag=true;
                        that.pobj.state="runimg";
                        clearInterval(t)
                    }
                    if(inita<90){
                        speeda-=g1;
                        if(speeda<2){
                            speeda=2;
                        }
                    }else{
                        if(speeda<5){
                            speeda=5;
                        }
                        speeda+=g2;
                    }
                        var oy=Math.sin(inita*Math.PI/180)*gao;
                        var y=that.pobj.inity-oy;
                        that.pobj.y=y;
                    if(that.pobj.y>that.pobj.inity){
                        that.pobj.y=that.pobj.inity;
                    }
                },that.time)
            }
        }
    }
}