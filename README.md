touchEvent for iOS events

###Methods:
* `onSwipeLeft  : function()`
* `onSwipeRight : function()`
* `onSwipeUp    : function()`
* `onSwipeDown  : function()`
* `onGestureEnd : function()`
* `onPinchOpen  : function(scale)`
* `onPinchClose : function(scale)`
* `onRotated    : function(rotation)`
* `onGesture    : function(e)`

###Usage:
```html
<script type="text/javascript" src="../src/touchEvent.js"></script>
```

```js
var event = new touchEvent("body");
event.onGesture(function(e){
	//do something;
});
```