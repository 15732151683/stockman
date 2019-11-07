  function getCookie(name) {
           str  = document.cookie;
           start = str.indexOf(name+"=");
           //找不到 name，表示不存在这个name的cookie
           if (start==-1){return "";}
           start+=name.length+1;//name=
           console.log(start)
           //值的结束位置
           end  =str.indexOf(";",start);
           //使用substring获得值
           end = end == -1?str.length:end;//末尾没有分号
           val = str.substring(start, end);
           return val;
           
           }
  
 function setCookie(name,value,path,expires) {
                
            var current_date = new Date();
            //将日期设置为过期的日期
                current_date.setDate(current_date.getDate() + expires);
            //将日期转成GMT字符串
            expires_str = current_date.toGMTString();
            //设置cookie的过期日期
            document.cookie = name+"="+value+"; path="+path+"; expires="+expires_str;
           }