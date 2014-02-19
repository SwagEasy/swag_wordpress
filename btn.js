var SwagEasy = SwagEasy || {};

SwagEasy.buttons = {};
SwagEasy.storeId = 250;
SwagEasy.swagStyles = "<style>@-webkit-keyframes swagFadeIn{0%{opacity:0;-webkit-transform:translateY(20px)}100%{opacity:1;-webkit-transform:translateY(0)}}@-moz-keyframes swagFadeIn{0%{opacity:0;-moz-transform:translateY(20px)}100%{opacity:1;-moz-transform:translateY(0)}}@-o-keyframes swagFadeIn{0%{opacity:0;-o-transform:translateY(20px)}100%{opacity:1;-o-transform:translateY(0)}}@keyframes swagFadeIn{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}#swagframe.swagFadeIn{-webkit-animation-name:swagFadeIn;-moz-animation-name:swagFadeIn;-o-animation-name:swagFadeIn;animation-name:swagFadeIn}#swagframe.animated{-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;-ms-animation-fill-mode:both;-o-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-duration:1s;-moz-animation-duration:1s;-ms-animation-duration:1s;-o-animation-duration:1s;animation-duration:1s}#swagframe{position:fixed;z-index:100;top:5vh;width:90vw;height:0;left:5vw;overflow-y:hidden;-webkit-overflow-scrolling:touch;background-color:transparent;box-shadow:inset 0 0 25px #fff;transition:all .8s ease-in-out}#swagoverlay{z-index:99;position:absolute;height:100%;width:100%;top:0;left:0;background-color:rgba(0,0,0,.6)}</style>";

!function(){window.Trails=function(){function a(){var a;a=this,window.onhashchange=function(b){return a._handle(b.newURL)},window.onload=function(){return a._handle(window.location)}}return a.prototype.routes=[],a.prototype.route=function(a,b){var c,d,e,f;return e=a,c=Array.prototype.slice.call(arguments),a=c.shift(),f=a.match(/:([\w\d]+)/g)||[],f=f.map(function(a){return a.substring(1)}),a=new RegExp("^"+a.replace(/\./,"\\.").replace(/\*/g,"(.+)").replace(/:([\w\d]+)/g,"([^/?]+)")+"$"),d={path:a,originalPath:e,handler:b,paramNames:f},this.routes.push(d)},a.prototype.vomit=function(){return this.routes},a.prototype._handle=function(a){var b,c,d,e,f,g;return e=document.createElement("a"),e.href=a,d=e.hash.replace("#!",""),f=this._match(d),f||alert("404"),c={},g=f.path.exec(d),g&&(g.shift(),g.map(decodeURIComponent).forEach(function(a,b){return f.paramNames&&f.paramNames.length>b?c[f.paramNames[b]]=a:a?(c.splat=c.splat||[],c.splat.push(a)):void 0})),b={full:f.originalPath,params:c},f.handler(b)},a.prototype._match=function(a){var b,c,d,e,f;for(c={},f=this.routes,d=0,e=f.length;e>d;d++)b=f[d],a.match(b.path||decodeURIComponent(a).match(b.path))&&(c=b);return c},a}()}.call(this);

// Generated by CoffeeScript 1.6.3
var deepLinking, firstScript, hideframe, iframeResizeHandler, initSwagEasyStore, is_touch_device, jquery, makeButtons, sendToStore, setupStore, storeReady, swagpop, swagpush;

storeReady = false;

sendToStore = function(path) {
  jQuery('#swagframe').attr('src', path);
  return swagpop();
};

is_touch_device = function() {
  return !!("ontouchstart" in window) || !!("onmsgesturechange" in window);
};

swagpop = function() {
  var frame, overlay;
  overlay = jQuery("#swagoverlay")[0];
  frame = jQuery("#swagframe")[0];
  if (is_touch_device()) {
    window.location.href = SwagEasy.store_url;
    return;
  }
  frame.setAttribute("style", "height: 90vh;");
  frame.className = "animated fadeInUp";
  overlay.setAttribute("style", "display:block");
  return iframeResizeHandler();
};

hideframe = function() {
  var frame, overlay;
  overlay = jQuery("#swagoverlay")[0];
  frame = jQuery("#swagframe")[0];
  frame.className = "animated fadeOutDown";
  frame.setAttribute("style", "height: 0;");
  return overlay.setAttribute("style", "display:none;");
};

iframeResizeHandler = function() {
  jQuery('#swagoverlay').width(jQuery(document).width());
  return jQuery('#swagoverlay').height(jQuery(document).height());
};

initSwagEasyStore = function() {
  makeButtons(SwagEasy.buttons.xpaths);
  setupStore(SwagEasy.storeId, SwagEasy.swagStyles);
  return deepLinking();
};

setupStore = function(merchantId, styles) {
  var iframeString;
  if (jQuery('#swagframe')[0]) {
    return;
  }
  iframeString = "<iframe id=\"swagframe\" src=\"" + SwagEasy.store_url + "\" seamless onload=\"\"></iframe>";
  jQuery("body").append(iframeString);
  jQuery('#swagframe').load(function() {
    return storeReady = true;
  });
  jQuery("body").append("<div id=\"swagoverlay\" style=\"display:none;\"></div>");
  jQuery("body").append(styles);
  jQuery("#swagoverlay").on("click", hideframe);
  jQuery(window).resize(iframeResizeHandler);
  return iframeResizeHandler();
};

makeButtons = function(btns) {
  jQuery('.swag-button').each(function(index, btn) {
    jQuery(btn).click(function(e) {
      if (!storeReady) {
        return;
      }
      swagpop();
      return e.preventDefault();
    });
  });
};

deepLinking = function() {
  var nosend = false;
  var handler = function(e) {
    var path;

    try {
      path = e.data.replace('#!', '');  
    } catch (err) {
      console.log(err);
      path = '';
      if(window.location.href.indexOf('#!/store/p') > -1) {
        path = window.location.href.substr(window.location.href.indexOf('#!/store/') + 9,window.location.href.length - window.location.href.indexOf('#!/store') - 8);
        if(!nosend) {
          sendToStore(SwagEasy.store_url + '/' + path);
          nosend = true;
        }
      }
    }

    
    window.location.hash = "#!/store/" + path;
  };
  var router = new Trails;

  window.addEventListener('message', handler, false);
  router.route('/store', function(path) {
    return sendToStore();
  });
  router.route('/store/', function(path) {
    return sendToStore();
  });
  return router.route('/store/p/:slug', function(path) {
    var url;
    url = "" + SwagEasy.store_url + "/p/" + path.params.slug;
    console.log(url);
    return sendToStore(url);
  });
};

jquery = document.createElement('script');

jquery.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';

jquery.onload = function() {
  jQuery.noConflict();
  if(jQuery('.swag-button.no-store').length > 0) {
    SwagEasy.store_url = 'http://swageasy.com/notsetup';
  } else {
    SwagEasy.store_url = 'http://' + jQuery('#swagscript').attr('subdomain') + '.swageasy.com';
  }
  
  return jQuery(document).ready(function() {
    return initSwagEasyStore();
  });
};

firstScript = document.getElementsByTagName('script')[0];

firstScript.parentNode.appendChild(jquery);