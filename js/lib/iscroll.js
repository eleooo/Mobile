var IScroll=function(n,t,i){function u(n,i){this.wrapper=typeof n=="string"?t.querySelector(n):n,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this.options={resizeIndicator:!0,snapThreshold:.334,startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,HWCompositing:!0,useTransition:!0,useTransform:!0};for(var u in i)this.options[u]=i[u];this.translateZ=this.options.HWCompositing&&r.hasPerspective?" translateZ(0)":"",this.options.useTransition=r.hasTransition&&this.options.useTransition,this.options.useTransform=r.hasTransform&&this.options.useTransform,this.options.eventPassthrough=this.options.eventPassthrough===!0?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault,this.options.scrollY=this.options.eventPassthrough=="vertical"?!1:this.options.scrollY,this.options.scrollX=this.options.eventPassthrough=="horizontal"?!1:this.options.scrollX,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,this.options.bounceEasing=typeof this.options.bounceEasing=="string"?r.ease[this.options.bounceEasing]||r.ease.circular:this.options.bounceEasing,this.options.resizePolling=this.options.resizePolling===undefined?60:this.options.resizePolling,this.options.tap===!0&&(this.options.tap="tap"),this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1,this.x=0,this.y=0,this._events={},this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY),this.enable()}function s(n,i,r){var u=t.createElement("div"),f=t.createElement("div");return r===!0&&(u.style.cssText="position:absolute;z-index:9999",f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),f.className="iScrollIndicator",n=="h"?(r===!0&&(u.style.cssText+=";height:7px;left:2px;right:2px;bottom:0",f.style.height="100%"),u.className="iScrollHorizontalScrollbar"):(r===!0&&(u.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px",f.style.width="100%"),u.className="iScrollVerticalScrollbar"),i||(u.style.pointerEvents="none"),u.appendChild(f),u}function o(i,u){this.wrapper=typeof u.el=="string"?t.querySelector(u.el):u.el,this.indicator=this.wrapper.children[0],this.indicatorStyle=this.indicator.style,this.scroller=i,this.options={listenX:!0,listenY:!0,interactive:!1,resize:!0,defaultScrollbars:!1,speedRatioX:0,speedRatioY:0};for(var f in u)this.options[f]=u[f];this.sizeRatioX=1,this.sizeRatioY=1,this.maxPosX=0,this.maxPosY=0,this.options.interactive&&(r.addEvent(this.indicator,"touchstart",this),r.addEvent(this.indicator,"MSPointerDown",this),r.addEvent(this.indicator,"mousedown",this),r.addEvent(n,"touchend",this),r.addEvent(n,"MSPointerUp",this),r.addEvent(n,"mouseup",this))}var h=n.requestAnimationFrame||n.webkitRequestAnimationFrame||n.mozRequestAnimationFrame||n.oRequestAnimationFrame||n.msRequestAnimationFrame||function(t){n.setTimeout(t,1e3/60)},r=function(){function u(n){return s===!1?!1:s===""?n:s+n.charAt(0).toUpperCase()+n.substr(1)}var r={},o=t.createElement("div").style,s=function(){for(var t=["t","webkitT","MozT","msT","OT"],i,n=0,r=t.length;n<r;n++)if(i=t[n]+"ransform",i in o)return t[n].substr(0,t[n].length-1);return!1}(),h;return r.getTime=Date.now||function(){return(new Date).getTime()},r.extend=function(n,t){for(var i in t)n[i]=t[i]},r.addEvent=function(n,t,i,r){n.addEventListener(t,i,!!r)},r.removeEvent=function(n,t,i,r){n.removeEventListener(t,i,!!r)},r.momentum=function(n,t,r,u,f){var s=n-t,o=i.abs(s)/r,e,h,c=.0006;return e=n+o*o/(2*c)*(s<0?-1:1),h=o/c,e<u?(e=f?u-f/2.5*(o/8):u,s=i.abs(e-n),h=s/o):e>0&&(e=f?f/2.5*(o/8):0,s=i.abs(n)+e,h=s/o),{destination:i.round(e),duration:h}},h=u("transform"),r.extend(r,{hasTransform:h!==!1,hasPerspective:u("perspective")in o,hasTouch:"ontouchstart"in n,hasPointer:navigator.msPointerEnabled,hasTransition:u("transition")in o}),r.isAndroidBrowser=/Android/.test(n.navigator.appVersion)&&/Version\/\d/.test(n.navigator.appVersion),r.extend(r.style={},{transform:h,transitionTimingFunction:u("transitionTimingFunction"),transitionDuration:u("transitionDuration"),transformOrigin:u("transformOrigin")}),r.hasClass=function(n,t){var i=new RegExp("(^|\\s)"+t+"(\\s|$)");return i.test(n.className)},r.addClass=function(n,t){if(!r.hasClass(n,t)){var i=n.className.split(" ");i.push(t),n.className=i.join(" ")}},r.removeClass=function(n,t){if(r.hasClass(n,t)){var i=new RegExp("(^|\\s)"+t+"(\\s|$)","g");n.className=n.className.replace(i,"")}},r.offset=function(n){for(var t=-n.offsetLeft,i=-n.offsetTop;n=n.offsetParent;)t-=n.offsetLeft,i-=n.offsetTop;return{left:t,top:i}},r.extend(r.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3}),r.extend(r.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(n){return n*(2-n)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(n){return i.sqrt(1- --n*n)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(n){var t=4;return(n=n-1)*n*((t+1)*n+t)+1}},bounce:{style:"",fn:function(n){return(n/=1)<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}},elastic:{style:"",fn:function(n){return(f=.22,e=.4,n===0)?0:n==1?1:e*i.pow(2,-10*n)*i.sin((n-f/4)*2*i.PI/f)+1}}}),r.tap=function(n,i){var r=t.createEvent("Event");r.initEvent(i,!0,!0),r.pageX=n.pageX,r.pageY=n.pageY,n.target.dispatchEvent(r)},r.click=function(n){var i=n.target,r;i.tagName!="SELECT"&&i.tagName!="INPUT"&&i.tagName!="TEXTAREA"&&(r=t.createEvent("MouseEvents"),r.initMouseEvent("click",!0,!0,n.view,1,i.screenX,i.screenY,i.clientX,i.clientY,n.ctrlKey,n.altKey,n.shiftKey,n.metaKey,0,null),r._constructed=!0,i.dispatchEvent(r))},r}();return u.prototype={version:"5.0.1",_init:function(){this._initEvents(),(this.options.scrollbars||this.options.indicators)&&this._initIndicators(),this.options.mouseWheel&&this._initWheel(),this.options.snap&&this._initSnap(),this.options.keyBindings&&this._initKeys()},destroy:function(){this._initEvents(!0),this._execEvent("destroy")},_transitionEnd:function(n){n.target==this.scroller&&(this._transitionTime(0),this.resetPosition(this.options.bounceTime)||this._execEvent("scrollEnd"))},_start:function(n){if(this.enabled&&(!this.initiated||r.eventType[n.type]===this.initiated)){this.options.preventDefault&&!r.isAndroidBrowser&&n.preventDefault();var u=n.touches?n.touches[0]:n,t;this.initiated=r.eventType[n.type],this.moved=!1,this.distX=0,this.distY=0,this.directionX=0,this.directionY=0,this.directionLocked=0,this._transitionTime(),this.isAnimating=!1,this.startTime=r.getTime(),this.options.useTransition&&this.isInTransition&&(t=this.getComputedPosition(),this._translate(i.round(t.x),i.round(t.y)),this.isInTransition=!1),this.startX=this.x,this.startY=this.y,this.absStartX=this.x,this.absStartY=this.y,this.pointX=u.pageX,this.pointY=u.pageY,this._execEvent("scrollStart")}},_move:function(n){if(this.enabled&&r.eventType[n.type]===this.initiated){this.options.preventDefault&&n.preventDefault();var o=n.touches?n.touches[0]:n,t=o.pageX-this.pointX,u=o.pageY-this.pointY,c=r.getTime(),f,e,s,h;if(this.pointX=o.pageX,this.pointY=o.pageY,this.distX+=t,this.distY+=u,s=i.abs(this.distX),h=i.abs(this.distY),!(c-this.endTime>300)||!(s<10)||!(h<10)){if(this.directionLocked||this.options.freeScroll||(this.directionLocked=s>h+this.options.directionLockThreshold?"h":h>=s+this.options.directionLockThreshold?"v":"n"),this.directionLocked=="h"){if(this.options.eventPassthrough=="vertical")n.preventDefault();else if(this.options.eventPassthrough=="horizontal"){this.initiated=!1;return}u=0}else if(this.directionLocked=="v"){if(this.options.eventPassthrough=="horizontal")n.preventDefault();else if(this.options.eventPassthrough=="vertical"){this.initiated=!1;return}t=0}f=this.x+(this.hasHorizontalScroll?t:0),e=this.y+(this.hasVerticalScroll?u:0),(f>0||f<this.maxScrollX)&&(f=this.options.bounce?this.x+t/3:f>0?0:this.maxScrollX),(e>0||e<this.maxScrollY)&&(e=this.options.bounce?this.y+u/3:e>0?0:this.maxScrollY),this.directionX=t>0?-1:t<0?1:0,this.directionY=u>0?-1:u<0?1:0,this.moved=!0,this._translate(f,e),c-this.startTime>300&&(this.startTime=c,this.startX=this.x,this.startY=this.y)}}},_end:function(n){var e;if(this.enabled&&r.eventType[n.type]===this.initiated){this.options.preventDefault&&n.preventDefault();var v=n.changedTouches?n.changedTouches[0]:n,o,s,f=r.getTime()-this.startTime,t=i.round(this.x),u=i.round(this.y),h=i.abs(t-this.startX),a=i.abs(u-this.startY),c=0,l="";if(this.scrollTo(t,u),this.isInTransition=0,this.initiated=0,this.endTime=r.getTime(),this.resetPosition(this.options.bounceTime)){this._execEvent("scrollEnd");return}if(!this.moved){this.options.tap&&r.tap(n,this.options.tap),this.options.click&&r.click(n);return}if(this._events.flick&&f<200&&h<100&&a<100){this._execEvent("flick");return}if(this.options.momentum&&f<300&&(o=this.hasHorizontalScroll?r.momentum(this.x,this.startX,f,this.maxScrollX,this.options.bounce?this.wrapperWidth:0):{destination:t,duration:0},s=this.hasVerticalScroll?r.momentum(this.y,this.startY,f,this.maxScrollY,this.options.bounce?this.wrapperHeight:0):{destination:u,duration:0},t=o.destination,u=s.destination,c=i.max(o.duration,s.duration),this.isInTransition=1),this.options.snap&&(e=this._nearestSnap(t,u),this.currentPage=e,t=e.x,u=e.y,c=this.options.snapSpeed||i.max(i.max(i.min(h,1e3),i.min(h,1e3)),300),l=this.options.bounceEasing),t!=this.x||u!=this.y){(t>0||t<this.maxScrollX||u>0||u<this.maxScrollY)&&(l=r.ease.quadratic),this.scrollTo(t,u,c,l);return}this._execEvent("scrollEnd")}},_resize:function(){var n=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){n.refresh(),n.resetPosition()},this.options.resizePolling)},resetPosition:function(n){var t,i,r;return this.x<=0&&this.x>=this.maxScrollX&&this.y<=0&&this.y>=this.maxScrollY?!1:(t=this.x,i=this.y,n=n||0,!this.hasHorizontalScroll||this.x>0?t=0:this.x<this.maxScrollX&&(t=this.maxScrollX),!this.hasVerticalScroll||this.y>0?i=0:this.y<this.maxScrollY&&(i=this.maxScrollY),this.options.snap&&(r=this._nearestSnap(t,i),this.currentPage=r,t=r.x,i=r.y),this.scrollTo(t,i,n,this.options.bounceEasing),!0)},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){var n=this.wrapper.offsetHeight;this.wrapperWidth=this.wrapper.clientWidth,this.wrapperHeight=this.wrapper.clientHeight,this.scrollerWidth=this.scroller.offsetWidth,this.scrollerHeight=this.scroller.offsetHeight,this.maxScrollX=this.wrapperWidth-this.scrollerWidth,this.maxScrollY=this.wrapperHeight-this.scrollerHeight,this.maxScrollX>0&&(this.maxScrollX=0),this.maxScrollY>0&&(this.maxScrollY=0),this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.endTime=0,this.wrapperOffset=r.offset(this.wrapper),this._execEvent("refresh")},on:function(n,t){this._events[n]||(this._events[n]=[]),this._events[n].push(t)},_execEvent:function(n){if(this._events[n]){var t=0,i=this._events[n].length;if(i)for(;t<i;t++)this._events[n][t].call(this)}},scrollBy:function(n,t,i,r){n=this.x+n,t=this.y+t,i=i||0,this.scrollTo(n,t,i,r)},scrollTo:function(n,t,i,u){u=u||r.ease.circular,!i||this.options.useTransition&&u.style?(this._transitionTimingFunction(u.style),this._transitionTime(i),this._translate(n,t)):this._animate(n,t,i,u.fn)},scrollToElement:function(n,t,u,f,e){if(n=n.nodeType?n:this.scroller.querySelector(n),n){var o=r.offset(n);o.left-=this.wrapperOffset.left,o.top-=this.wrapperOffset.top,u===!0&&(u=i.round(n.offsetWidth/2-this.wrapper.offsetWidth/2)),f===!0&&(f=i.round(n.offsetHeight/2-this.wrapper.offsetHeight/2)),o.left-=u||0,o.top-=f||0,o.left=o.left>0?0:o.left<this.maxScrollX?this.maxScrollX:o.left,o.top=o.top>0?0:o.top<this.maxScrollY?this.maxScrollY:o.top,t=t===undefined||null||"auto"?i.max(i.abs(o.left)*2,i.abs(o.top)*2):t,this.scrollTo(o.left,o.top,t,e)}},_transitionTime:function(n){n=n||0,this.scrollerStyle[r.style.transitionDuration]=n+"ms",this.indicator1&&this.indicator1.transitionTime(n),this.indicator2&&this.indicator2.transitionTime(n)},_transitionTimingFunction:function(n){this.scrollerStyle[r.style.transitionTimingFunction]=n,this.indicator1&&this.indicator1.transitionTimingFunction(n),this.indicator2&&this.indicator2.transitionTimingFunction(n)},_translate:function(n,t){this.options.useTransform?this.scrollerStyle[r.style.transform]="translate("+n+"px,"+t+"px)"+this.translateZ:(n=i.round(n),t=i.round(t),this.scrollerStyle.left=n+"px",this.scrollerStyle.top=t+"px"),this.x=n,this.y=t,this.indicator1&&this.indicator1.updatePosition(),this.indicator2&&this.indicator2.updatePosition()},_initEvents:function(t){var i=t?r.removeEvent:r.addEvent,u=this.options.bindToWrapper?this.wrapper:n;i(n,"orientationchange",this),i(n,"resize",this),i(this.wrapper,"mousedown",this),i(u,"mousemove",this),i(u,"mousecancel",this),i(u,"mouseup",this),r.hasPointer&&(i(this.wrapper,"MSPointerDown",this),i(u,"MSPointerMove",this),i(u,"MSPointerCancel",this),i(u,"MSPointerUp",this)),r.hasTouch&&(i(this.wrapper,"touchstart",this),i(u,"touchmove",this),i(u,"touchcancel",this),i(u,"touchend",this)),i(this.scroller,"transitionend",this),i(this.scroller,"webkitTransitionEnd",this),i(this.scroller,"oTransitionEnd",this),i(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var t=n.getComputedStyle(this.scroller,null),i,u;return this.options.useTransform?(t=t[r.style.transform].split(")")[0].split(", "),i=+(t[12]||t[4]),u=+(t[13]||t[5])):(i=+t.left.replace(/[^-\d]/g,""),u=+t.top.replace(/[^-\d]/g,"")),{x:i,y:u}},_initIndicators:function(){var i=this.options.interactiveScrollbars,r=typeof this.options.scrollbars!="object",n,t;this.options.scrollbars?(this.options.scrollY&&(n={el:s("v",i,this.options.scrollbars),interactive:i,defaultScrollbars:!0,resize:this.options.resizeIndicator,listenX:!1},this.wrapper.appendChild(n.el)),this.options.scrollX&&(t={el:s("h",i,this.options.scrollbars),interactive:i,defaultScrollbars:!0,resize:this.options.resizeIndicator,listenY:!1},this.wrapper.appendChild(t.el))):(n=this.options.indicators.length?this.options.indicators[0]:this.options.indicators,t=this.options.indicators[1]&&this.options.indicators[1]),n&&(this.indicator1=new o(this,n)),t&&(this.indicator2=new o(this,t));this.on("refresh",function(){this.indicator1&&this.indicator1.refresh(),this.indicator2&&this.indicator2.refresh()});this.on("destroy",function(){this.indicator1&&this.indicator1.destroy(),this.indicator2&&this.indicator2.destroy()})},_initWheel:function(){r.addEvent(this.wrapper,"mousewheel",this),r.addEvent(this.wrapper,"DOMMouseScroll",this);this.on("destroy",function(){r.removeEvent(this.wrapper,"mousewheel",this),r.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(n){var t,i,r,u,f=this;if(clearTimeout(this.wheelTimeout),this.wheelTimeout=setTimeout(function(){f._execEvent("scrollEnd")},400),n.preventDefault(),"wheelDeltaX"in n)t=n.wheelDeltaX/120,i=n.wheelDeltaY/120;else if("wheelDelta"in n)t=i=n.wheelDelta/120;else if("detail"in n)t=i=-n.detail/3;else return;t*=10,i*=10,this.hasVerticalScroll||(t=i),r=this.x+(this.hasHorizontalScroll?t*this.options.invertWheelDirection:0),u=this.y+(this.hasVerticalScroll?i*this.options.invertWheelDirection:0),r>0?r=0:r<this.maxScrollX&&(r=this.maxScrollX),u>0?u=0:u<this.maxScrollY&&(u=this.maxScrollY),this.scrollTo(r,u,0)},_initSnap:function(){this.pages=[],this.currentPage={},typeof this.options.snap=="string"&&(this.options.snap=this.scroller.querySelectorAll(this.options.snap));this.on("refresh",function(){var n=0,f,e=0,h,o,s,u=0,r,c=this.options.snapStepX||this.wrapperWidth,l=this.options.snapStepY||this.wrapperHeight,t;if(this.options.snap===!0)for(o=i.round(c/2),s=i.round(l/2);u>-this.scrollerWidth;){for(this.pages[n]=[],f=0,r=0;r>-this.scrollerHeight;)this.pages[n][f]={x:i.max(u,this.maxScrollX),y:i.max(r,this.maxScrollY),width:c,height:l,cx:u-o,cy:r-s},r-=l,f++;u-=c,n++}else for(t=this.options.snap,f=t.length,h=-1;n<f;n++)(n===0||t[n].offsetLeft<t[n-1].offsetLeft)&&(e=0,h++),this.pages[e]||(this.pages[e]=[]),u=i.max(-t[n].offsetLeft,this.maxScrollX),r=i.max(-t[n].offsetTop,this.maxScrollY),o=u-i.round(t[n].offsetWidth/2),s=r-i.round(t[n].offsetHeight/2),this.pages[e][h]={x:u,y:r,width:t[n].offsetWidth,height:t[n].offsetHeight,cx:o,cy:s},e++;this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0),this.options.snapThreshold%1==0?(this.snapThresholdX=this.options.snapThreshold,this.snapThresholdY=this.options.snapThreshold):(this.snapThresholdX=i.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold),this.snapThresholdY=i.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold))});this.on("flick",function(){var n=this.options.snapSpeed||i.max(i.max(i.min(i.abs(this.x-this.startX),1e3),i.min(i.abs(this.y-this.startY),1e3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,n)})},_nearestSnap:function(n,t){var r=0,f=this.pages.length,u=0;if(i.abs(n-this.absStartX)<this.snapThresholdX&&i.abs(t-this.absStartY)<this.snapThresholdY)return this.currentPage;for(n>0?n=0:n<this.maxScrollX&&(n=this.maxScrollX),t>0?t=0:t<this.maxScrollY&&(t=this.maxScrollY);r<f;r++)if(n>=this.pages[r][0].cx){n=this.pages[r][0].x;break}for(f=this.pages[r].length;u<f;u++)if(t>=this.pages[0][u].cy){t=this.pages[0][u].y;break}return r==this.currentPage.pageX&&(r+=this.directionX,r<0?r=0:r>=this.pages.length&&(r=this.pages.length-1),n=this.pages[r][0].x),u==this.currentPage.pageY&&(u+=this.directionY,u<0?u=0:u>=this.pages[0].length&&(u=this.pages[0].length-1),t=this.pages[0][u].y),{x:n,y:t,pageX:r,pageY:u}},goToPage:function(n,t,r,u){u=u||this.options.bounceEasing,n>=this.pages.length?n=this.pages.length-1:n<0&&(n=0),t>=this.pages[0].length?t=this.pages[0].length-1:t<0&&(t=0);var f=this.pages[n][t].x,e=this.pages[n][t].y;r=r===undefined?this.options.snapSpeed||i.max(i.max(i.min(i.abs(f-this.x),1e3),i.min(i.abs(e-this.y),1e3)),300):r,this.currentPage={x:f,y:e,pageX:n,pageY:t},this.scrollTo(f,e,r,u)},next:function(n,t){var i=this.currentPage.pageX,r=this.currentPage.pageY;i++,i>=this.pages.length&&this.hasVericalScroll&&(i=0,r++),this.goToPage(i,r,n,t)},prev:function(n,t){var i=this.currentPage.pageX,r=this.currentPage.pageY;i--,i<0&&this.hasVericalScroll&&(i=0,r--),this.goToPage(i,r,n,t)},_initKeys:function(){var i={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40},t;if(typeof this.options.keyBindings=="object")for(t in this.options.keyBindings)typeof this.options.keyBindings[t]=="string"&&(this.options.keyBindings[t]=this.options.keyBindings[t].toUpperCase().charCodeAt(0));else this.options.keyBindings={};for(t in i)this.options.keyBindings[t]=this.options.keyBindings[t]||i[t];r.addEvent(n,"keydown",this);this.on("destroy",function(){r.removeEvent(n,"keydown",this)})},_key:function(n){var t=this.options.snap,u=t?this.currentPage.pageX:this.x,f=t?this.currentPage.pageY:this.y,o=r.getTime(),s=this.keyTime||0,e;this.options.useTransition&&this.isInTransition&&(e=this.getComputedPosition(),this._translate(i.round(e.x),i.round(e.y)),this.isInTransition=!1),this.keyAcceleration=o-s<200?i.min(this.keyAcceleration+.25,50):0;switch(n.keyCode){case this.options.keyBindings.pageUp:this.hasHorizontalScroll&&!this.hasVerticalScroll?u+=t?1:this.wrapperWidth:f+=t?1:this.wrapperHeight;break;case this.options.keyBindings.pageDown:this.hasHorizontalScroll&&!this.hasVerticalScroll?u-=t?1:this.wrapperWidth:f-=t?1:this.wrapperHeight;break;case this.options.keyBindings.end:u=t?this.pages.length-1:this.maxScrollX,f=t?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:u=0,f=0;break;case this.options.keyBindings.left:u+=t?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:f+=t?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:u-=t?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:f-=t?1:5+this.keyAcceleration>>0}if(t){this.goToPage(u,f);return}u>0?(u=0,this.keyAcceleration=0):u<this.maxScrollX&&(u=this.maxScrollX,this.keyAcceleration=0),f>0?(f=0,this.keyAcceleration=0):f<this.maxScrollY&&(f=this.maxScrollY,this.keyAcceleration=0),this.scrollTo(u,f,0),this.keyTime=o},_animate:function(n,t,i,u){function c(){var a=r.getTime(),y,p,v;if(a>=l){f.isAnimating=!1,f._translate(n,t),f.resetPosition(f.options.bounceTime);return}a=(a-s)/i,v=u(a),y=(n-e)*v+e,p=(t-o)*v+o,f._translate(y,p),f.isAnimating&&h(c)}var f=this,e=this.x,o=this.y,s=r.getTime(),l=s+i;this.isAnimating=!0,c()},handleEvent:function(n){switch(n.type){case"touchstart":case"MSPointerDown":case"mousedown":this._start(n);break;case"touchmove":case"MSPointerMove":case"mousemove":this._move(n);break;case"touchend":case"MSPointerUp":case"mouseup":case"touchcancel":case"MSPointerCancel":case"mousecancel":this._end(n);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(n);break;case"DOMMouseScroll":case"mousewheel":this._wheel(n);break;case"keydown":this._key(n)}}},o.prototype={handleEvent:function(n){switch(n.type){case"touchstart":case"MSPointerDown":case"mousedown":this._start(n);break;case"touchmove":case"MSPointerMove":case"mousemove":this._move(n);break;case"touchend":case"MSPointerUp":case"mouseup":case"touchcancel":case"MSPointerCancel":case"mousecancel":this._end(n)}},destroy:function(){this.options.interactive&&(r.removeEvent(this.indicator,"touchstart",this),r.removeEvent(this.indicator,"MSPointerDown",this),r.removeEvent(this.indicator,"mousedown",this),r.removeEvent(n,"touchmove",this),r.removeEvent(n,"MSPointerMove",this),r.removeEvent(n,"mousemove",this),r.removeEvent(n,"touchend",this),r.removeEvent(n,"MSPointerUp",this),r.removeEvent(n,"mouseup",this))},_start:function(t){var i=t.touches?t.touches[0]:t;t.preventDefault(),t.stopPropagation(),this.transitionTime(0),this.initiated=!0,this.lastPointX=i.pageX,this.lastPointY=i.pageY,this.startTime=r.getTime(),r.addEvent(n,"touchmove",this),r.addEvent(n,"MSPointerMove",this),r.addEvent(n,"mousemove",this)},_move:function(n){var t=n.touches?n.touches[0]:n,i,u,f,e,o=r.getTime();i=t.pageX-this.lastPointX,this.lastPointX=t.pageX,u=t.pageY-this.lastPointY,this.lastPointY=t.pageY,f=this.x+i,e=this.y+u,this._pos(f,e),n.preventDefault(),n.stopPropagation()},_end:function(t){this.initiated&&(this.initiated=!1,t.preventDefault(),t.stopPropagation(),r.removeEvent(n,"touchmove",this),r.removeEvent(n,"MSPointerMove",this),r.removeEvent(n,"mousemove",this))},transitionTime:function(n){n=n||0,this.indicatorStyle[r.style.transitionDuration]=n+"ms"},transitionTimingFunction:function(n){this.indicatorStyle[r.style.transitionTimingFunction]=n},refresh:function(){this.transitionTime(0),this.indicatorStyle.display=this.options.listenX&&!this.options.listenY?this.scroller.hasHorizontalScroll?"block":"none":this.options.listenY&&!this.options.listenX?this.scroller.hasVerticalScroll?"block":"none":this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none",this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll?(r.addClass(this.wrapper,"iScrollBothScrollbars"),r.removeClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&(this.options.listenX?this.wrapper.style.right="8px":this.wrapper.style.bottom="8px")):(r.removeClass(this.wrapper,"iScrollBothScrollbars"),r.addClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&(this.options.listenX?this.wrapper.style.right="2px":this.wrapper.style.bottom="2px"));var n=this.wrapper.offsetHeight;this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.options.resize?(this.indicatorWidth=i.max(i.round(this.wrapperWidth*this.wrapperWidth/this.scroller.scrollerWidth),8),this.indicatorStyle.width=this.indicatorWidth+"px"):this.indicatorWidth=this.indicator.clientWidth,this.maxPosX=this.wrapperWidth-this.indicatorWidth,this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX),this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.options.resize?(this.indicatorHeight=i.max(i.round(this.wrapperHeight*this.wrapperHeight/this.scroller.scrollerHeight),8),this.indicatorStyle.height=this.indicatorHeight+"px"):this.indicatorHeight=this.indicator.clientHeight,this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY),this.updatePosition()},updatePosition:function(){var n=i.round(this.sizeRatioX*this.scroller.x)||0,t=i.round(this.sizeRatioY*this.scroller.y)||0;this.options.ignoreBoundaries||(n<0?n=0:n>this.maxPosX&&(n=this.maxPosX),t<0?t=0:t>this.maxPosY&&(t=this.maxPosY)),this.x=n,this.y=t,this.scroller.options.useTransform?this.indicatorStyle[r.style.transform]="translate("+n+"px,"+t+"px)"+this.scroller.translateZ:(this.indicatorStyle.left=n+"px",this.indicatorStyle.top=t+"px")},_pos:function(n,t){n<0?n=0:n>this.maxPosX&&(n=this.maxPosX),t<0?t=0:t>this.maxPosY&&(t=this.maxPosY),this.scroller.scrollTo(i.round(n/this.sizeRatioX),i.round(t/this.sizeRatioY))}},u.ease=r.ease,u}(window,document,Math)