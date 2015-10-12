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
			if(self.maxIndex < 1){//滚动元素为1
				return;
			}
			if(self.loop){
				if(self.maxIndex < 2){
					self.children.concat([self.children[0].cloneNode(true),self.children[1].cloneNode(true)]);
					self.maxIndex = self.children.length - 1;
				}
				for(var i = 0 ,l = self.maxIndex;i < l;i++){
					self.children[i].style.position = 'absolute';
					self.children[i].style.top = '0';
					self.children[i].style.left = '0';
					self.addAnimation(self.children[i],(i*self.w),false);
				}
				self.addAnimation(self.children[self.maxIndex],(0-self.w),false);
			}
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
				self.interval = null;
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
					if(self.loop){
						self.loopScroll(distX);
					}else{
						distX = self.offsetDist + distX;
						self.addAnimation(self.dom,distX,false);
					}
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
		slider:function(distX){
			var distX = distX;
			var self = this;
			if(Math.abs(distX) > 50){
				if(distX < 0){
					if(self.sliderIndex < 0){
						self.sliderIndex = 0;
					}
					if(self.loop){
						if(self.sliderIndex > self.maxIndex){
							self.sliderIndex = 0;
						}
						if(self.sliderIndex < 0){
							self.sliderIndex = self.maxIndex;
						}
						var prevIndex = self.sliderIndex, activeIndex = self.sliderIndex + 1;
						if(activeIndex > self.maxIndex){
							activeIndex = 0;
						}
						var nextIndex = activeIndex + 1;
						if(nextIndex > self.maxIndex){
							nextIndex = 0;
						}
						console.log(prevIndex,activeIndex,nextIndex);
						self.addAnimation(self.children[prevIndex],0-self.w,true);
						self.addAnimation(self.children[activeIndex],0,true);
						self.addAnimation(self.children[nextIndex],self.w,false);
					}else{
						if(self.sliderIndex >= self.maxIndex){
							distX = self.offsetDist;
							self.sliderIndex = self.maxIndex;
						}else{
							distX = self.offsetDist - self.w;
						}
					}
					self.sliderIndex++;
				}else{
					if(self.sliderIndex > self.maxIndex){
						self.sliderIndex = self.maxIndex;
					}
					if(self.loop){
						if(self.sliderIndex < 0){
							self.sliderIndex = self.maxIndex;
						}
						var prevIndex = self.sliderIndex,activeIndex = prevIndex - 1;
						if(activeIndex < 0){
							activeIndex = self.maxIndex;
						}
						var nextIndex = activeIndex - 1;
						if(nextIndex < 0){
							nextIndex = self.maxIndex;
						}

						self.addAnimation(self.children[prevIndex],self.w,true);
						self.addAnimation(self.children[activeIndex],0,true);
						self.addAnimation(self.children[nextIndex],0-self.w,false);
					}else{
						if(self.sliderIndex <= 0){
							self.sliderIndex =  0;
							distX = 0;
						}else{
							distX = self.offsetDist + self.w;
						}
					}
					self.sliderIndex--;
				}
			}else{
				if(self.loop){
					self.addAnimation(self.children[self.prevIndex],0,false);
					if(distX < 0){
						self.addAnimation(self.children[self.activeIndex],self.w,false);
					}else{
						self.addAnimation(self.children[self.activeIndex],-self.w,false);
					}
				}else{
					distX = self.offsetDist;
				}
			}
			if(!self.loop){
				self.offsetDist = distX;
				self.addAnimation(self.dom,distX,true);
			}
			if(self.callBack){
				self.callBack(self.sliderIndex);
			}
			if(self.canAuto && !self.interval){
				self.autoPlay();
			}
		},
		loopScroll:function(distX){
			var self = this;
			if(self.sliderIndex > self.maxIndex) self.sliderIndex = 0;
			if(self.sliderIndex < 0) self.sliderIndex = self.maxIndex;
			if(distX < 0){
				self.prevIndex = self.sliderIndex, self.activeIndex = self.sliderIndex + 1;
			}else{
				self.prevIndex = self.sliderIndex, self.activeIndex = self.sliderIndex - 1;
			}
			if(self.activeIndex > self.maxIndex) self.activeIndex = 0;
			if(self.activeIndex < 0) self.activeIndex = self.maxIndex;
			self.addAnimation(self.children[self.prevIndex],distX,false);
			if(distX > 0){
				self.addAnimation(self.children[self.activeIndex],-self.w+distX,false);
			}else{
				self.addAnimation(self.children[self.activeIndex],self.w+distX,false);
			}
		},
		addAnimation:function(dom,distX,flag){
			dom.style.transition = "all ease-out "+(flag?.3:0)+"s 0s";
			dom.style.mozTransition = "all ease-out "+(flag?.3:0)+"s 0s";
			dom.style.msTransition = "all ease-out "+(flag?.3:0)+"s 0s";
			dom.style.oTransition = "all ease-out "+(flag?.3:0)+"s 0s";
			dom.style.webkitTransition = "all ease-out "+(flag?.3:0)+"s 0s";
			dom.style.transform = 'translate3D('+distX+'px,0,0)';
			dom.style.webkitTransform = 'translate3D('+distX+'px,0,0)';
			dom.style.mozTransform = 'translate3D('+distX+'px,0,0)';
			dom.style.msTransform = 'translate3D('+distX+'px,0,0)';
			dom.style.oTransform = 'translate3D('+distX+'px,0,0)';
		},
		autoPlay:function(){
			var self = this;
			self.interval = setInterval(function(){
				self.slider(-self.w);
			},3000);
		}
	}
	window.Swipe = Swipe;
})(window);
