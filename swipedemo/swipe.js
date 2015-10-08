/**
*author ducaiwei
*swipe x
*
*/
(function(window,$){
	var Swipe = function(opts){
		this.dom = opts.dom;//dom节点
		this.canAuto = opts.canAuto;//是否支持自动滑动
		this.prevIndex = opts.index ? opts.index : 0;//滑动画面索引
		this.callBack = opts.callBack;//回调函数
		this.w = this.dom.offsetWidth;
		this.children = this.getChild(this.dom);
		this.maxIndex = this.children.length-1;
		this.sliderIndex =  opts.sliderIndex ? opts.sliderIndex : 0;
		this.offsetDist = this.sliderIndex*this.w;//初始化滑动距离
		this.startX = 0;
		this.endX = 0;
		this.loop = opts.loop;
		this.nextIndex = 0;
		this.interval = null;//定时器
		this.direction = 'h';
		this.endTime = 0;
		this.init();
	}
	Swipe.prototype = {
		init:function(){
			var self = this;
			self.swipe();
			if(self.canAuto){
				self.autoPlay();
			}
		},
		getChild:function(dom){
			var self = this;
			var children = [];
			if(dom){
				var cs = dom.childNodes;
				var i = 0,l = cs.length;
				for(;i < l;i++){
					if(cs[i].tagName){
						cs[i].style.width = self.w+"px";
						children.push(cs[i]);
					}
				}
			}
			self.dom.style.width = self.w * children.length + "px";
			return children;
		},
		swipe:function(){
			var self = this;
			var hashTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
			var startEvt = hashTouch?'touchstart':'mousedown';
	        var moveEvt = hashTouch?'touchmove':'mousemove';
	        var endEvt = hashTouch?'touchend':'mouseup';
			var _start = function(evt){
				self.startX = hashTouch?evt.targetTouches[0].pageX:evt.pageX;
				self.startY = hashTouch?evt.targetTouches[0].pageY:evt.pageY;
				self.endTime = new Date().getTime();
				clearInterval(self.interval);
			};
			var _move=function(evt){
				var x = hashTouch?evt.targetTouches[0].pageX:evt.pageX,y = hashTouch?evt.targetTouches[0].pageY:evt.pageY,distY = y - self.startY,
				absDistY = Math.abs(distY),distX = x - self.startX,absDistX = Math.abs(distX),timestamp = new Date().getTime();
				var touchAngel = Math.atan2(absDistY,absDistX)*180/Math.PI;
				if(touchAngel > 45){
					self.direction = 'v';
				}else{
					self.direction = 'h';
				}
				if(self.direction == 'h'){
					evt.preventDefault();
					distX = self.offsetDist + distX;
					self.scroll(distX,false);
				}
			};
			var _end = function(evt){
				self.endX = hashTouch?evt.changedTouches[0].pageX:evt.pageX;
				var y = hashTouch?evt.changedTouches[0].pageY:evt.pageY;
				var distX = self.endX - self.startX,absDistX = Math.abs(distX);
				if(self.direction == 'h' && absDistX > 50){
					self.slider(distX);
				}else{
					self.slider(0);
				}

			};
			self.dom.addEventListener(startEvt,_start,false);
			self.dom.addEventListener(moveEvt,_move,false);
			self.dom.addEventListener(endEvt,_end,false);
		},
		scroll:function(dist,flag){
			var self = this;
			self.dom.style.webkitTransition = "all ease-out "+(flag?.3:0)+"s 0s";
			self.dom.style.transform = "translate3D("+dist+"px,0,0)";
			self.dom.style.webkitTransform = "translate3D("+dist+"px,0,0)";
			self.dom.style.mozTransform = "translate3D("+dist+"px,0,0)";
			self.dom.style.msTransform = "translate3D("+dist+"px,0,0)";
			if(flag && self.callBack){
				self.callBack(dist,self.sliderIndex);
			}
		},
		slider:function(distX){
			var distX = distX;
			var self = this;
			if(distX < 0){
				if(self.sliderIndex >= self.maxIndex){
					distX = self.offsetDist;
					self.sliderIndex = self.maxIndex-1;
				}else{
					distX = self.offsetDist - self.w;
				}
				self.sliderIndex++;
			}else if(distX > 0){
				self.sliderIndex = self.sliderIndex-1;
				if(self.sliderIndex <= 0){
					self.sliderIndex =  0;
					distX = 0;
				}else{
					distX = self.offsetDist + self.w;
				}
			}else{
				distX = self.offsetDist;
			}
			self.offsetDist = distX;
			self.scroll(distX,true);
			if(self.canAuto){
				self.autoPlay();
			}
		},
		autoPlay:function(){
			var self = this;
			self.interval = setInterval(function(){
				self.sliderIndex++;
				if(self.sliderIndex >= self.maxIndex){
					self.sliderIndex = 0;
					self.offsetDist = 0;
				}
				var distX = 0-self.sliderIndex*self.children[0].offsetWidth;
				self.offsetDist = distX;
				self.scroll(distX,true,distX);
			},3000);
		}
	}
	window.Swipe = Swipe;
})(window);
