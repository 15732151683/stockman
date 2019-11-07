function formatStars(starsNum){
  var first = starsNum.substr(0,1);
  var last = starsNum.substr(1,1);
  var temp = [];
  for(var i=0; i < first; i++){
    temp.push(true);
  }
  if(last == "5"){
    temp.push(true);
  }
  while(temp.length < 5){
    temp.push(false);
  }
  return temp;
}

function formatCasts(casts){
  var temp = [];
  for(var i in casts){
    temp.push(casts[i].name)
  }
  return temp.join("/");
}

function formatCastsInfo(casts){
  var temp = [];
  for(var i in casts){
    var obj = {
      name:casts[i].name,
      avatar: casts[i].avatars ? casts[i].avatars.large:""
    }
    temp.push(obj);
  }

  return temp;
}

module.exports = {
  formatStars,
  formatCasts,
  formatCastsInfo
}