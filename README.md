# swipe
移动端轮播组件，简单易用，dom不需要做特殊处理
#使用方法
new Swipe({
	"dom":document.getElementById("swipe-wrapper"),
	index:0,
	callBack:fn,
	canAuto:false,
	loop:true
});
#参数说明
dom:轮播的dom节点
index:从第几个子节点开始轮播,默认是0
callBack:每一次切换后的回调函数
canAuto:是否需要自动轮播
loop:是否来回循环轮播
