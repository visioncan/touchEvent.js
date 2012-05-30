/*
	
touchEvent for iOS events.

* @Copyright (c) 2012 visioncan.com
* @author vcan
* @version 1.0

*/

(function (window) { 
	var touchEvent = function(el, option){
		var hasTouch = this.hasTouch = 'ontouchstart' in window;
		var EVENT = this.EVENT = { 
				RESIZE         : 'onorientationchange' in window ? 'orientationchange' : 'resize',

				TOUCH_START    : hasTouch ? 'touchstart' : 'mousedown',
				TOUCH_MOVE     : hasTouch ? 'touchmove'  : 'mousemove',
				TOUCH_END      : hasTouch ? 'touchend'   : 'mouseup',
				GESTURE_START  : 'gesturestart',
				GESTURE_END    : 'gestureend',
				GESTURE_CHANGE : 'gesturechange'
		};

		//default options
		this.options = {
			min_dist: 20,
			is_deliver_on_end: false
		};
		for (var i in option) { 
			this.options[i] = option[i];
		};

		this.methods = {
			onSwipeLeft  : function(){},
			onSwipeRight : function(){},
			onSwipeUp    : function(){},
			onSwipeDown  : function(){},
			onTouchStart : function(point){},
			onTouchMove  : function(point){ return null},
			onTouchEnd   : function(){},
			onPinchOpen  : function(scale){},
			onPinchClose : function(scale){},
			onRotated    : function(rotation){},
			onGesture    : function(e){},
			onGestureEnd : function(){},
			onScreenChange : function(attr){}
		};

		this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
		this.wrapper.addEventListener(EVENT.TOUCH_START,    this, false);
		this.wrapper.addEventListener(EVENT.TOUCH_END,      this, false);
		this.wrapper.addEventListener(EVENT.GESTURE_START,  this, false);
		this.wrapper.addEventListener(EVENT.GESTURE_END,    this, false);
		this.wrapper.addEventListener(EVENT.GESTURE_CHANGE, this, false);
		window.addEventListener(EVENT.RESIZE, this, false);
	};

	touchEvent.prototype = {
		isGesture : false,
		isMoving : false,
		onPinchOpen : function(e){
			if(typeof e == 'function'){
				this.methods.onPinchOpen = e;
			}else{
				this.methods.onPinchOpen(e);
			}
		},
		onPinchClose : function(e){
			if(typeof e == 'function'){
				this.methods.onPinchClose = e;
			}else{
				this.methods.onPinchClose(e);
			}
		},
		onRotated : function(e){
			if(typeof e == 'function'){
				this.methods.onRotated = e;
			}else{
				this.methods.onRotated(e);
			}
		},
		onGesture : function(e){
			if( typeof e == 'function'){
				this.methods.onGesture = e;
			}else{
				this.methods.onGesture(e);
			}
		},
		onTouchStart : function(fn){
			if( typeof fn == 'function'){
				this.methods.onTouchStart = fn;
			}else{
				this.methods.onTouchStart(fn);
			}
		},
		onTouchMove : function(fn){
			if( typeof fn == 'function'){
				return this.methods.onTouchMove = fn;
			}else{
				return this.methods.onTouchMove(fn);
			}
		},
		onTouchEnd : function(fn){
			if( typeof fn == 'function'){
				this.methods.onTouchEnd = fn;
			}else{
				this.methods.onTouchEnd();
			}
		},
		onGestureEnd : function(fn){
			if( typeof fn == 'function'){
				this.methods.onGestureEnd = fn;
			}else{
				this.methods.onGestureEnd();
			}
		},
		onSwipeLeft : function(fn){
			if( typeof fn == 'function'){
				this.methods.onSwipeLeft = fn;
			}else{
				this.methods.onSwipeLeft();
			}
		},
		onSwipeRight : function(fn){
			if( typeof fn == 'function'){
				this.methods.onSwipeRight = fn;
			}else{
				this.methods.onSwipeRight();
			}
		},
		onSwipeUp : function(fn){
			if( typeof fn == 'function'){
				this.methods.onSwipeUp = fn;
			}else{
				this.methods.onSwipeUp();
			}
		},
		onSwipeDown : function(fn){
			if( typeof fn == 'function'){
				this.methods.onSwipeDown = fn;
			}else{
				this.methods.onSwipeDown();
			}
		},
		onScreenChange : function(e){
			if( typeof e == 'function'){
				this.methods.onScreenChange = e;
			}else{
				this.methods.onScreenChange(e);
			}
		},

		remove : function(){
			this.wrapper.removeEventListener(this.EVENT.TOUCH_START,    this, false);
			this.wrapper.removeEventListener(this.EVENT.TOUCH_END,      this, false);
			this.wrapper.removeEventListener(this.EVENT.GESTURE_START,  this, false);
			this.wrapper.removeEventListener(this.EVENT.GESTURE_END,    this, false);
			this.wrapper.removeEventListener(this.EVENT.GESTURE_CHANGE, this, false);
			window.removeEventListener(this.EVENT.RESIZE, this, false);
			for(var fn in this.methods){
				this.methods[fn] = function(){};
			}
		},

		handleEvent : function(e){
			switch (e.type){
				case this.EVENT.TOUCH_START : 
					this._onTouchStart(e);
					break;
				case this.EVENT.TOUCH_MOVE :
					this._onTouchMove(e);
					break;
				case this.EVENT.TOUCH_END :
					this._onTouchEnd(e);
					break;
				case this.EVENT.GESTURE_START :
					this._onGestureStart(e);
					break;
				case this.EVENT.GESTURE_END :
					this._onGestureEnd(e);
					break;
				case this.EVENT.GESTURE_CHANGE :
					this._onGestureChange(e);
					break;
				case this.EVENT.RESIZE :
					this._onRezise(e);
					break;
			}
		},

		// evnet
		_onTouchStart : function(e){
			var point = this.hasTouch ? e.touches[0] : e;
			this.startX = point.pageX;
			this.startY = point.pageY;
			this.wrapper.addEventListener(this.EVENT.TOUCH_MOVE, this, false);
			this.onTouchStart(point);
		},

		_onTouchMove : function(e){           
			e.preventDefault();
			if (this.isGesture) {
				this._onTouchEnd(null);
				return;
			};
			this.isMoving = true;
			var point = this.hasTouch ? e.touches[0] : e;

			if( this.onTouchMove(point) !== null){
				this.onTouchMove(point);
				return;
			}
			var x = point.pageX;
			var y = point.pageY;
			var dx = this.startX - x;
			var dy = this.startY - y;
			if (Math.abs(dx) >= this.options.min_dist) {
				this._onTouchEnd(null);
				if (dx > 0) {
					this.onSwipeLeft();
				}else {
					this.onSwipeRight();
				}
			}
			if (Math.abs(dy) >= this.options.min_dist) {
				this._onTouchEnd(null);
				if (dy > 0) {
					this.onSwipeUp();
				}else {
					this.onSwipeDown();
				}
			}
		},

		_onTouchEnd : function(e) {
			this.wrapper.removeEventListener(this.EVENT.TOUCH_MOVE, this, false);
			this.startX = null;
			this.startY = null;
			//if (this.isMoving ) {
				this.isMoving = false;
				this.onTouchEnd();
			//}
		},

		_onGestureStart : function(e) {
			this.isGesture = true;
		},

		_onGestureChange : function(e) {
			e.preventDefault();
			if (this.options.is_deliver_on_end){
				return;
			};
			if (e.rotation < 10 || e.rotation > -10) {
				this.onRotated(e.rotation);
				this.onGesture(e);
			}
			if (e.scale > 1) {
				this.onPinchOpen(e.scale);
			}

			if (e.scale < 1) {
				this.onPinchClose(e.scale);
			}
		},

		_onGestureEnd : function(e) {
			e.preventDefault();
			this.isGesture = false;
			this.onGestureEnd();
			if (!this.options.is_deliver_on_end){
				return;
			};
			if (e.rotation < 10 || e.rotation > -10) {
				this.onRotated(e.rotation);
				this.onGesture(e);
			}

			if (e.scale > 1) {
				this.onPinchOpen(e.scale);
			}

			if (e.scale < 1) {
				this.onPinchClose(e.scale);
			}
		},

		_onRezise : function(e) {
			var attr = {
				orientation : 0,
				width  : 0,
				height : 0
			};
			if (this.EVENT.RESIZE == 'orientationchange') {
				attr.orientation = window.orientation;
			};
			attr.width  = this.wrapper.clientWidth;
			attr.height = this.wrapper.clientHeight;
			this.onScreenChange(attr);
		}
	};
	window.touchEvent = touchEvent;
})(window);
