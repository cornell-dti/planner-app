_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[11],{0:function(e,t,n){n("qQbD"),e.exports=n("bBV7")},"5WRv":function(e,t,n){var r=n("iNmH"),a=n("Qatm"),o=n("Zhxd"),i=n("kluZ");e.exports=function(e){return r(e)||a(e)||o(e)||i()}},"9fEB":function(e,t,n){"use strict";n("OvAC");t.__esModule=!0,t.defaultHead=f,t.default=void 0;var r,a=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=s();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var o=r?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(n,a,o):n[a]=e[a]}n.default=e,t&&t.set(e,n);return n}(n("mXGw")),o=(r=n("GlZI"))&&r.__esModule?r:{default:r},i=n("9rrO"),u=n("bxxT"),c=n("vI6Y");function s(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return s=function(){return e},e}function f(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[a.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(a.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function d(e,t){return"string"===typeof t||"number"===typeof t?e:t.type===a.default.Fragment?e.concat(a.default.Children.toArray(t.props.children).reduce((function(e,t){return"string"===typeof t||"number"===typeof t?e:e.concat(t)}),[])):e.concat(t)}var l=["name","httpEquiv","charSet","itemProp"];function p(e,t){return e.reduce((function(e,t){var n=a.default.Children.toArray(t.props.children);return e.concat(n)}),[]).reduce(d,[]).reverse().concat(f(t.inAmpMode)).filter(function(){var e=new Set,t=new Set,n=new Set,r={};return function(a){var o=!0;if(a.key&&"number"!==typeof a.key&&a.key.indexOf("$")>0){var i=a.key.slice(a.key.indexOf("$")+1);e.has(i)?o=!1:e.add(i)}switch(a.type){case"title":case"base":t.has(a.type)?o=!1:t.add(a.type);break;case"meta":for(var u=0,c=l.length;u<c;u++){var s=l[u];if(a.props.hasOwnProperty(s))if("charSet"===s)n.has(s)?o=!1:n.add(s);else{var f=a.props[s],d=r[s]||new Set;d.has(f)?o=!1:(d.add(f),r[s]=d)}}}return o}}()).reverse().map((function(e,t){var n=e.key||t;return a.default.cloneElement(e,{key:n})}))}function m(e){var t=e.children,n=(0,a.useContext)(i.AmpStateContext),r=(0,a.useContext)(u.HeadManagerContext);return a.default.createElement(o.default,{reduceComponentsToState:p,headManager:r,inAmpMode:(0,c.isInAmpMode)(n)},t)}m.rewind=function(){};var h=m;t.default=h},"9rrO":function(e,t,n){"use strict";var r;t.__esModule=!0,t.AmpStateContext=void 0;var a=((r=n("mXGw"))&&r.__esModule?r:{default:r}).default.createContext({});t.AmpStateContext=a},GlZI:function(e,t,n){"use strict";var r=n("5WRv"),a=n("SDJZ"),o=n("NToG"),i=(n("T1e2"),n("eef+")),u=n("K4DB"),c=n("+IV6");function s(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=c(e);if(t){var a=c(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return u(this,n)}}t.__esModule=!0,t.default=void 0;var f=n("mXGw"),d=function(e){i(n,e);var t=s(n);function n(e){var o;return a(this,n),(o=t.call(this,e))._hasHeadManager=void 0,o.emitChange=function(){o._hasHeadManager&&o.props.headManager.updateHead(o.props.reduceComponentsToState(r(o.props.headManager.mountedInstances),o.props))},o._hasHeadManager=o.props.headManager&&o.props.headManager.mountedInstances,o}return o(n,[{key:"componentDidMount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.add(this),this.emitChange()}},{key:"componentDidUpdate",value:function(){this.emitChange()}},{key:"componentWillUnmount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.delete(this),this.emitChange()}},{key:"render",value:function(){return null}}]),n}(f.Component);t.default=d},Hglc:function(e,t,n){},OvAC:function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},Qatm:function(e,t){e.exports=function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},hUgY:function(e,t,n){"use strict";n.r(t);var r=n("mXGw"),a=n.n(r),o=n("9fEB"),i=n.n(o),u=(n("Hglc"),n("3YGk"),n("AA9E")),c=n("MnTT"),s=n("gjB/"),f=n("7rcb"),d=a.a.createElement;Object(u.a)(),Object(f.a)(),Object(c.b)(),Object(s.b)();var l=null!=="/544"?"/544":"";t.default=function(e){var t=e.Component,n=e.pageProps;return d(a.a.Fragment,null,d(i.a,null,d("meta",{charSet:"utf-8"}),d("link",{rel:"shortcut icon",href:"".concat(l,"/favicon.ico")}),d("meta",{name:"viewport",content:"width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"}),d("meta",{name:"theme-color",content:"#F7F7F7"}),d("meta",{property:"og:description",content:"Samwise is a task manager for Cornell students who put in work."}),d("meta",{property:"og:image",content:"".concat(l,"/banner.png")}),d("link",{rel:"manifest",href:"".concat(l,"/manifest.json")}),d("title",null,"Samwise")),d(t,n))}},iNmH:function(e,t,n){var r=n("+Sw5");e.exports=function(e){if(Array.isArray(e))return r(e)}},kluZ:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},qQbD:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n("hUgY")}])},vI6Y:function(e,t,n){"use strict";t.__esModule=!0,t.isInAmpMode=i,t.useAmp=function(){return i(a.default.useContext(o.AmpStateContext))};var r,a=(r=n("mXGw"))&&r.__esModule?r:{default:r},o=n("9rrO");function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,n=void 0!==t&&t,r=e.hybrid,a=void 0!==r&&r,o=e.hasQuery,i=void 0!==o&&o;return n||a&&i}}},[[0,1,2,0,3,4]]]);