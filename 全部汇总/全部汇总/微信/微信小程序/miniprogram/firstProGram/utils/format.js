function formatStars(starsNum){
  var first=starsNum.substr(0,1);
  var last=starsNum.substr(1,1);
  var temp=[];
  for(var i=0;i<first;i++){
    temp.push(true);
  }
  if(last=="5"){
    temp.push(true)
  }
  while(temp.lenght<5){
    temp.push(false)
  }
  return temp;
}
module.exports={
  formatStars
}