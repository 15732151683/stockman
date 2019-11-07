/*封装一个预加载函数*/
/*参数:
 imgArr 图片资源路径的数组
 loaded 函数 用于将加载的进度比回传给外部
 success 函数  用于处理加载完毕时执行的功能
 * */
function loadImgs(imgArr, loaded, success){
	//存储预加载好的图片对象的数组
	var imgObjs = [];
	var count = 0;
	for (var i = 0; i < imgArr.length; i++) {
		//取到图片
		var img = new Image();
		imgObjs.push(img);
		//当图片加载成功的时候
		img.onload = function(){
			count++;
			var percent = parseInt(count/imgArr.length*100);
			//回调函数  借助回调函数将函数内部的数据传递给外部
			/*if(typeof loaded === 'function'){
				loaded(percent);
			}*/
			typeof loaded === 'function' && loaded(percent);
			if (count == imgArr.length) {
				typeof success === 'function' && success();
			}
		}
		img.src = imgArr[i];
	}
	console.log(imgObjs);
	return imgObjs;
}
