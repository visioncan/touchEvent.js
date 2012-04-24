/*
	
touchEvent for iOS events.

* @Copyright (c) 2012 visioncan.com
* @author vcan
* @version 1.0

*/

var touchEvent = function(el, option){
	var hasTouch = this.hasTouch = 'ontouchstart' in window;
	var EVENT = this.EVENT = { 
			RESIZE         : 'onorientationchange' in window ? 'orientationchange' : 'resize',

			TOUCH_START    : hasTouch ? 'touchstart' : 'mousedown',
			TOUCH_MOVE     : hasTouch ? 'touchmove'  : 'mousemove',
			GESTURE_START  : 'gesturestart',
			GESTURE_END    : 'gestureend',
			GESTURE_CHANGE : 'gesturechange'
	};

	//default options
	this.options = {
		min_dist: 20,
		is_deliver_on_end: false
	};

	this.methods = {
		onSwipeLeft  : function(){},
		onSwipeRight : function(){},
		onSwipeUp    : function(){},
		onSwipeDown  : function(){},
		onGestureEnd : function(){},
		onPinchOpen  : function(scale){},
		onPinchClose : function(scale){},
		onRotated    : function(rotation){},
		onGesture    : function(e){}
	};

	this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	this.wrapper.addEventListener(EVENT.TOUCH_START,    this, false);
	this.wrapper.addEventListener(EVENT.GESTURE_START,  this, false);
	this.wrapper.addEventListener(EVENT.GESTURE_END,    this, false);
	this.wrapper.addEventListener(EVENT.GESTURE_CHANGE, this, false);
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

	handleEvent : function(e){
		switch (e.type){
			case this.EVENT.TOUCH_START : 
				this._onTouchStart(e);
				break;
			case this.EVENT.TOUCH_MOVE :
				this._onTouchMove(e);
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
		}
	},

	// evnet
	_onTouchStart : function(e){
		var point = this.hasTouch ? e.touches[0] : e;
		this.startX = point.pageX;
		this.startY = point.pageY;
		this.isMoving = true;
		this.wrapper.addEventListener(this.EVENT.TOUCH_MOVE, this, false);
	},

	_onTouchMove : function(e){           
		e.preventDefault();
		if (this.isGesture) {
			this._onTouchEnd();
			return;
		};
		var point = this.hasTouch ? e.touches[0] : e;
		if (this.isMoving) {
			var x = point.pageX;
			var y = point.pageY;
			var dx = this.startX - x;
			var dy = this.startY - y;
			if (Math.abs(dx) >= this.options.min_dist) {
				this._onTouchEnd();
				if (dx > 0) {
					this.onSwipeLeft();
				}else {
					this.onSwipeRight();
				}
			}
			if (Math.abs(dy) >= this.options.min_dist) {
				this._onTouchEnd();
				if (dy > 0) {
					this.onSwipeUp();
				}else {
					this.onSwipeDown();
				}
			}
		}
	},

	_onTouchEnd : function() {
		this.wrapper.removeEventListener(this.EVENT.TOUCH_MOVE, this, false);
		this.startX = null;
		this.startY = null;
		this.isMoving = false;
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
		this.isGesture = false;
		e.preventDefault();
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
	} 
}






