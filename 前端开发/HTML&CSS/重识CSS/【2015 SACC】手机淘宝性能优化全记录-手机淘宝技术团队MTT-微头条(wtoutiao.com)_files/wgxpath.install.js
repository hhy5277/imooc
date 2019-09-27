!function(){function t(t){return function(){return this[t]}}function n(t){return function(){return t}}function e(t){var n=typeof t;if("object"==n){if(!t)return"null";if(t instanceof Array)return"array";if(t instanceof Object)return n;var e=Object.prototype.toString.call(t);if("[object Window]"==e)return"object";if("[object Array]"==e||"number"==typeof t.length&&"undefined"!=typeof t.splice&&"undefined"!=typeof t.propertyIsEnumerable&&!t.propertyIsEnumerable("splice"))return"array";if("[object Function]"==e||"undefined"!=typeof t.call&&"undefined"!=typeof t.propertyIsEnumerable&&!t.propertyIsEnumerable("call"))return"function"}else if("function"==n&&"undefined"==typeof t.call)return"object";return n}function r(t){return"string"==typeof t}function i(t){return t.call.apply(t.bind,arguments)}function o(t,n){if(!t)throw Error();if(2<arguments.length){var e=Array.prototype.slice.call(arguments,2);return function(){var r=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(r,e),t.apply(n,r)}}return function(){return t.apply(n,arguments)}}function a(){return a=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?i:o,a.apply(null,arguments)}function u(t){var n=Array.prototype.slice.call(arguments,1);return function(){var e=n.slice();return e.push.apply(e,arguments),t.apply(this,e)}}function s(t){function n(){}var e=q;n.prototype=e.prototype,t.t=e.prototype,t.prototype=new n}function c(t,n,e){this.a=t,this.b=n||1,this.d=e||1}function f(){return Ln.navigator?Ln.navigator.userAgent:null}function l(){var t=Ln.document;return t?t.documentMode:void 0}function h(t){if(!re[t]){for(var n=0,e=String(ee).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),r=String(t).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),i=Math.max(e.length,r.length),o=0;0==n&&i>o;o++){var a=e[o]||"",u=r[o]||"",s=RegExp("(\\d*)(\\D*)","g"),c=RegExp("(\\d*)(\\D*)","g");do{var f=s.exec(a)||["","",""],l=c.exec(u)||["","",""];if(0==f[0].length&&0==l[0].length)break;n=((0==f[1].length?0:parseInt(f[1],10))<(0==l[1].length?0:parseInt(l[1],10))?-1:(0==f[1].length?0:parseInt(f[1],10))>(0==l[1].length?0:parseInt(l[1],10))?1:0)||((0==f[2].length)<(0==l[2].length)?-1:(0==f[2].length)>(0==l[2].length)?1:0)||(f[2]<l[2]?-1:f[2]>l[2]?1:0)}while(0==n)}re[t]=n>=0}}function p(t,n,e,r){this.a=t,this.nodeName=e,this.nodeValue=r,this.nodeType=2,this.parentNode=this.ownerElement=n}function d(t,n){var e=ue&&"href"==n.nodeName?t.getAttribute(n.nodeName,2):n.nodeValue;return new p(n,t,n.nodeName,e)}function g(t){this.b=t,this.a=0}function v(t){t=t.match(se);for(var n=0;n<t.length;n++)ce.test(t[n])&&t.splice(n,1);return new g(t)}function w(t,n){return t.b[t.a+(n||0)]}function b(t){return t.b[t.a++]}function m(t,n){var e;t:{e=t.length;for(var i=r(t)?t.split(""):t,o=0;e>o;o++)if(o in i&&n.call(void 0,i[o],o,t)){e=o;break t}e=-1}return 0>e?null:r(t)?t.charAt(e):t[e]}function y(){return fe.concat.apply(fe,arguments)}function E(t,n,e){return 2>=arguments.length?fe.slice.call(t,n):fe.slice.call(t,n,e)}function x(t,n){if(t.contains&&1==n.nodeType)return t==n||t.contains(n);if("undefined"!=typeof t.compareDocumentPosition)return t==n||Boolean(16&t.compareDocumentPosition(n));for(;n&&t!=n;)n=n.parentNode;return n==t}function N(t,n){if(t==n)return 0;if(t.compareDocumentPosition)return 2&t.compareDocumentPosition(n)?1:-1;if(qn&&!(qn&&oe>=9)){if(9==t.nodeType)return-1;if(9==n.nodeType)return 1}if("sourceIndex"in t||t.parentNode&&"sourceIndex"in t.parentNode){var e=1==t.nodeType,r=1==n.nodeType;if(e&&r)return t.sourceIndex-n.sourceIndex;var i=t.parentNode,o=n.parentNode;return i==o?T(t,n):!e&&x(i,n)?-1*S(t,n):!r&&x(o,t)?S(n,t):(e?t.sourceIndex:i.sourceIndex)-(r?n.sourceIndex:o.sourceIndex)}return r=9==t.nodeType?t:t.ownerDocument||t.document,e=r.createRange(),e.selectNode(t),e.collapse(!0),r=r.createRange(),r.selectNode(n),r.collapse(!0),e.compareBoundaryPoints(Ln.Range.START_TO_END,r)}function S(t,n){var e=t.parentNode;if(e==n)return-1;for(var r=n;r.parentNode!=e;)r=r.parentNode;return T(r,t)}function T(t,n){for(var e=n;e=e.previousSibling;)if(e==t)return-1;return 1}function I(t){var n=null,e=t.nodeType;if(1==e&&(n=t.textContent,n=void 0==n||null==n?t.innerText:n,n=void 0==n||null==n?"":n),"string"!=typeof n)if(ae&&"title"==t.nodeName.toLowerCase()&&1==e)n=t.text;else if(9==e||1==e){t=9==e?t.documentElement:t.firstChild;for(var e=0,r=[],n="";t;){do 1!=t.nodeType&&(n+=t.nodeValue),ae&&"title"==t.nodeName.toLowerCase()&&(n+=t.text),r[e++]=t;while(t=t.firstChild);for(;e&&!(t=r[--e].nextSibling););}}else n=t.nodeValue;return""+n}function O(t,n,e){if(null===n)return!0;try{if(!t.getAttribute)return!1}catch(r){return!1}return ue&&"class"==n&&(n="className"),null==e?!!t.getAttribute(n):t.getAttribute(n,2)==e}function k(t,n,e,i,o){return(ae?R:A).call(null,t,n,r(e)?e:null,r(i)?i:null,o||new B)}function R(t,n,e,r,i){if(t instanceof pn||8==t.b||e&&null===t.b){var o=n.all;if(!o)return i;if(t=M(t),"*"!=t&&(o=n.getElementsByTagName(t),!o))return i;if(e){for(var a=[],u=0;n=o[u++];)O(n,e,r)&&a.push(n);o=a}for(u=0;n=o[u++];)"*"==t&&"!"==n.tagName||F(i,n);return i}return _(t,n,e,r,i),i}function A(t,n,e,r,i){return n.getElementsByName&&r&&"name"==e&&!qn?(n=n.getElementsByName(r),he(n,function(n){t.a(n)&&F(i,n)})):n.getElementsByClassName&&r&&"class"==e?(n=n.getElementsByClassName(r),he(n,function(n){n.className==r&&t.a(n)&&F(i,n)})):t instanceof fn?_(t,n,e,r,i):n.getElementsByTagName&&(n=n.getElementsByTagName(t.d()),he(n,function(t){O(t,e,r)&&F(i,t)})),i}function P(t,n,e,r,i){var o;if((t instanceof pn||8==t.b||e&&null===t.b)&&(o=n.childNodes)){var a=M(t);return"*"==a||(o=pe(o,function(t){return t.tagName&&t.tagName.toLowerCase()==a}))?(e&&(o=pe(o,function(t){return O(t,e,r)})),he(o,function(t){"*"==a&&("!"==t.tagName||"*"==a&&1!=t.nodeType)||F(i,t)}),i):i}return D(t,n,e,r,i)}function D(t,n,e,r,i){for(n=n.firstChild;n;n=n.nextSibling)O(n,e,r)&&t.a(n)&&F(i,n);return i}function _(t,n,e,r,i){for(n=n.firstChild;n;n=n.nextSibling)O(n,e,r)&&t.a(n)&&F(i,n),_(t,n,e,r,i)}function M(t){if(t instanceof fn){if(8==t.b)return"!";if(null===t.b)return"*"}return t.d()}function B(){this.b=this.a=null,this.i=0}function C(t){this.b=t,this.a=this.d=null}function j(t,n){if(!t.a)return n;if(!n.a)return t;for(var e=t.a,r=n.a,i=null,o=null,a=0;e&&r;)e.b==r.b||e.b instanceof p&&r.b instanceof p&&e.b.a==r.b.a?(o=e,e=e.a,r=r.a):0<N(e.b,r.b)?(o=r,r=r.a):(o=e,e=e.a),(o.d=i)?i.a=o:t.a=o,i=o,a++;for(o=e||r;o;)o.d=i,i=i.a=o,a++,o=o.a;return t.b=i,t.i=a,t}function U(t,n){var e=new C(n);e.a=t.a,t.b?t.a.d=e:t.a=t.b=e,t.a=e,t.i++}function F(t,n){var e=new C(n);e.d=t.b,t.a?t.b.a=e:t.a=t.b=e,t.b=e,t.i++}function L(t){return(t=t.a)?t.b:null}function Y(t){return(t=L(t))?I(t):""}function V(t,n){return new H(t,!!n)}function H(t,n){this.d=t,this.b=(this.c=n)?t.b:t.a,this.a=null}function X(t){var n=t.b;if(null==n)return null;var e=t.a=n;return t.b=t.c?n.d:n.a,e.b}function $(t){switch(t.nodeType){case 1:return u(W,t);case 9:return $(t.documentElement);case 2:return t.ownerElement?$(t.ownerElement):K;case 11:case 10:case 6:case 12:return K;default:return t.parentNode?$(t.parentNode):K}}function K(){return null}function W(t,n){if(t.prefix==n)return t.namespaceURI||"http://www.w3.org/1999/xhtml";var e=t.getAttributeNode("xmlns:"+n);return e&&e.specified?e.value||null:t.parentNode&&9!=t.parentNode.nodeType?W(t.parentNode,n):null}function q(t){this.g=t,this.b=this.f=!1,this.d=null}function G(t){return"\n  "+t.toString().split("\n").join("\n  ")}function z(t,n){t.f=n}function J(t,n){t.b=n}function Q(t,n){var e=t.a(n);return e instanceof B?+Y(e):+e}function Z(t,n){var e=t.a(n);return e instanceof B?Y(e):""+e}function tn(t,n){var e=t.a(n);return e instanceof B?!!e.i:!!e}function nn(t,n,e){q.call(this,t.g),this.c=t,this.e=n,this.j=e,this.f=n.f||e.f,this.b=n.b||e.b,this.c==we&&(e.b||e.f||4==e.g||0==e.g||!n.d?n.b||n.f||4==n.g||0==n.g||!e.d||(this.d={name:e.d.name,l:n}):this.d={name:n.d.name,l:e})}function en(t,n,e,r,i){n=n.a(r),e=e.a(r);var o;if(n instanceof B&&e instanceof B){for(i=V(n),r=X(i);r;r=X(i))for(n=V(e),o=X(n);o;o=X(n))if(t(I(r),I(o)))return!0;return!1}if(n instanceof B||e instanceof B){for(n instanceof B?i=n:(i=e,e=n),i=V(i),n=typeof e,r=X(i);r;r=X(i)){switch(n){case"number":r=+I(r);break;case"boolean":r=!!I(r);break;case"string":r=I(r);break;default:throw Error("Illegal primitive type for comparison.")}if(t(r,e))return!0}return!1}return i?"boolean"==typeof n||"boolean"==typeof e?t(!!n,!!e):"number"==typeof n||"number"==typeof e?t(+n,+e):t(n,e):t(+n,+e)}function rn(t,n,e,r){this.a=t,this.p=n,this.g=e,this.k=r}function on(t,n,e,r){if(ve.hasOwnProperty(t))throw Error("Binary operator already created: "+t);return t=new rn(t,n,e,r),ve[t.toString()]=t}function an(t,n){if(n.a.length&&4!=t.g)throw Error("Primary expression must evaluate to nodeset if filter has predicate(s).");q.call(this,t.g),this.c=t,this.e=n,this.f=t.f,this.b=t.b}function un(t,n){if(n.length<t.o)throw Error("Function "+t.h+" expects at least"+t.o+" arguments, "+n.length+" given");if(null!==t.n&&n.length>t.n)throw Error("Function "+t.h+" expects at most "+t.n+" arguments, "+n.length+" given");t.s&&he(n,function(n,e){if(4!=n.g)throw Error("Argument "+e+" to function "+t.h+" is not of type Nodeset: "+n)}),q.call(this,t.g),this.e=t,this.c=n,z(this,t.f||ge(n,function(t){return t.f})),J(this,t.r&&!n.length||t.q&&!!n.length||ge(n,function(t){return t.b}))}function sn(t,n,e,r,i,o,a,u,s){this.h=t,this.g=n,this.f=e,this.r=r,this.q=i,this.k=o,this.o=a,this.n=void 0!==u?u:a,this.s=!!s}function cn(t,n,e,r,i,o,a,u){if(be.hasOwnProperty(t))throw Error("Function already created: "+t+".");be[t]=new sn(t,n,e,r,!1,i,o,a,u)}function fn(t,n){switch(this.e=t,this.c=void 0!==n?n:null,this.b=null,t){case"comment":this.b=8;break;case"text":this.b=3;break;case"processing-instruction":this.b=7;break;case"node":break;default:throw Error("Unexpected argument")}}function ln(t){return"comment"==t||"text"==t||"processing-instruction"==t||"node"==t}function hn(t){q.call(this,3),this.c=t.substring(1,t.length-1)}function pn(t,n){this.h=t.toLowerCase(),this.c=n?n.toLowerCase():"http://www.w3.org/1999/xhtml"}function dn(t){q.call(this,1),this.c=t}function gn(t,n){if(q.call(this,t.g),this.e=t,this.c=n,this.f=t.f,this.b=t.b,1==this.c.length){var e=this.c[0];e.m||e.c!=ye||(e=e.j,"*"!=e.d()&&(this.d={name:e.d(),l:null}))}}function vn(){q.call(this,4)}function wn(){q.call(this,4)}function bn(t,n){this.a=t,this.b=!!n}function mn(t,n,e){for(e=e||0;e<t.a.length;e++)for(var r,i=t.a[e],o=V(n),a=n.i,u=0;r=X(o);u++){var s=t.b?a-u:u+1;if(r=i.a(new c(r,s,a)),"number"==typeof r)s=s==r;else if("string"==typeof r||"boolean"==typeof r)s=!!r;else{if(!(r instanceof B))throw Error("Predicate.evaluate returned an unexpected type.");s=0<r.i}if(!s){s=o,r=s.d;var f=s.a;if(!f)throw Error("Next must be called at least once before remove.");var l=f.d,f=f.a;l?l.a=f:r.a=f,f?f.d=l:r.b=l,r.i--,s.a=null}}return n}function yn(t,n,e,r){q.call(this,4),this.c=t,this.j=n,this.e=e||new bn([]),this.m=!!r,n=0<this.e.a.length?this.e.a[0].d:null,t.b&&n&&(t=n.name,t=ae?t.toLowerCase():t,this.d={name:t,l:n.l});t:{for(t=this.e,n=0;n<t.a.length;n++)if(e=t.a[n],e.f||1==e.g||0==e.g){t=!0;break t}t=!1}this.f=t}function En(t,n,e,r){this.h=t,this.d=n,this.a=e,this.b=r}function xn(t,n,e,r){if(me.hasOwnProperty(t))throw Error("Axis already created: "+t);return n=new En(t,n,e,!!r),me[t]=n}function Nn(t){q.call(this,1),this.c=t,this.f=t.f,this.b=t.b}function Sn(t){q.call(this,4),this.c=t,z(this,ge(this.c,function(t){return t.f})),J(this,ge(this.c,function(t){return t.b}))}function Tn(t,n){this.a=t,this.b=n}function In(t){for(var n,e=[];;){On(t,"Missing right hand side of binary expression."),n=Bn(t);var r=b(t.a);if(!r)break;var i=(r=ve[r]||null)&&r.p;if(!i){t.a.a--;break}for(;e.length&&i<=e[e.length-1].p;)n=new nn(e.pop(),e.pop(),n);e.push(n,r)}for(;e.length;)n=new nn(e.pop(),e.pop(),n);return n}function On(t,n){if(t.a.b.length<=t.a.a)throw Error(n)}function kn(t,n){var e=b(t.a);if(e!=n)throw Error("Bad token, expected: "+n+" got: "+e)}function Rn(t){if(t=b(t.a),")"!=t)throw Error("Bad token: "+t)}function An(t){if(t=b(t.a),2>t.length)throw Error("Unclosed literal string");return new hn(t)}function Pn(t){var n=b(t.a),e=n.indexOf(":");if(-1==e)return new pn(n);var r=n.substring(0,e);if(t=t.b(r),!t)throw Error("Namespace prefix not declared: "+r);return n=n.substr(e+1),new pn(n,t)}function Dn(t){var n,e,r=[];if("/"==w(t.a)||"//"==w(t.a)){if(n=b(t.a),e=w(t.a),"/"==n&&(t.a.b.length<=t.a.a||"."!=e&&".."!=e&&"@"!=e&&"*"!=e&&!/(?![0-9])[\w]/.test(e)))return new vn;e=new vn,On(t,"Missing next location step."),n=_n(t,n),r.push(n)}else{t:{switch(n=w(t.a),e=n.charAt(0)){case"$":throw Error("Variable reference not allowed in HTML XPath");case"(":b(t.a),n=In(t),On(t,'unclosed "("'),kn(t,")");break;case'"':case"'":n=An(t);break;default:if(isNaN(+n)){if(ln(n)||!/(?![0-9])[\w]/.test(e)||"("!=w(t.a,1)){n=null;break t}for(n=b(t.a),n=be[n]||null,b(t.a),e=[];")"!=w(t.a)&&(On(t,"Missing function argument list."),e.push(In(t)),","==w(t.a));)b(t.a);On(t,"Unclosed function argument list."),Rn(t),n=new un(n,e)}else n=new dn(+b(t.a))}"["==w(t.a)&&(e=new bn(Mn(t)),n=new an(n,e))}if(n){if("/"!=w(t.a)&&"//"!=w(t.a))return n;e=n}else n=_n(t,"/"),e=new wn,r.push(n)}for(;"/"==w(t.a)||"//"==w(t.a);)n=b(t.a),On(t,"Missing next location step."),n=_n(t,n),r.push(n);return new gn(e,r)}function _n(t,n){var e,r,i;if("/"!=n&&"//"!=n)throw Error('Step op should be "/" or "//"');if("."==w(t.a))return r=new yn(Ie,new fn("node")),b(t.a),r;if(".."==w(t.a))return r=new yn(Se,new fn("node")),b(t.a),r;var o;if("@"==w(t.a))o=ye,b(t.a),On(t,"Missing attribute name");else if("::"==w(t.a,1)){if(!/(?![0-9])[\w]/.test(w(t.a).charAt(0)))throw Error("Bad token: "+b(t.a));if(e=b(t.a),o=me[e]||null,!o)throw Error("No axis with name: "+e);b(t.a),On(t,"Missing node name")}else o=Ee;if(e=w(t.a),/(?![0-9])[\w]/.test(e.charAt(0)))if("("==w(t.a,1)){if(!ln(e))throw Error("Invalid node type: "+e);if(e=b(t.a),!ln(e))throw Error("Invalid type name: "+e);kn(t,"("),On(t,"Bad nodetype"),i=w(t.a).charAt(0);var a=null;('"'==i||"'"==i)&&(a=An(t)),On(t,"Bad nodetype"),Rn(t),e=new fn(e,a)}else e=Pn(t);else{if("*"!=e)throw Error("Bad token: "+b(t.a));e=Pn(t)}return i=new bn(Mn(t),o.a),r||new yn(o,e,i,"//"==n)}function Mn(t){for(var n=[];"["==w(t.a);){b(t.a),On(t,"Missing predicate expression.");var e=In(t);n.push(e),On(t,"Unclosed predicate expression."),kn(t,"]")}return n}function Bn(t){if("-"==w(t.a))return b(t.a),new Nn(Bn(t));var n=Dn(t);if("|"!=w(t.a))t=n;else{for(n=[n];"|"==b(t.a);)On(t,"Missing next union location path."),n.push(Dn(t));t.a.a--,t=new Sn(n)}return t}function Cn(t,r){if(!t.length)throw Error("Empty XPath expression.");var i=v(t);if(i.b.length<=i.a)throw Error("Invalid XPath expression.");r?"function"==e(r)||(r=a(r.lookupNamespaceURI,r)):r=n(null);var o=In(new Tn(i,r));if(!(i.b.length<=i.a))throw Error("Bad token: "+b(i));this.evaluate=function(t,n){var e=o.a(new c(t));return new jn(e,n)}}function jn(t,n){if(0==n)if(t instanceof B)n=4;else if("string"==typeof t)n=2;else if("number"==typeof t)n=1;else{if("boolean"!=typeof t)throw Error("Unexpected evaluation result.");n=3}if(2!=n&&1!=n&&3!=n&&!(t instanceof B))throw Error("value could not be converted to the specified type");this.resultType=n;var e;switch(n){case 2:this.stringValue=t instanceof B?Y(t):""+t;break;case 1:this.numberValue=t instanceof B?+Y(t):+t;break;case 3:this.booleanValue=t instanceof B?0<t.i:!!t;break;case 4:case 5:case 6:case 7:var r=V(t);e=[];for(var i=X(r);i;i=X(r))e.push(i instanceof p?i.a:i);this.snapshotLength=t.i,this.invalidIteratorState=!1;break;case 8:case 9:r=L(t),this.singleNodeValue=r instanceof p?r.a:r;break;default:throw Error("Unknown XPathResult type.")}var o=0;this.iterateNext=function(){if(4!=n&&5!=n)throw Error("iterateNext called with wrong result type");return o>=e.length?null:e[o++]},this.snapshotItem=function(t){if(6!=n&&7!=n)throw Error("snapshotItem called with wrong result type");return t>=e.length||0>t?null:e[t]}}function Un(t){this.lookupNamespaceURI=$(t)}function Fn(t){t=t||Ln;var n=t.document;n.evaluate||(t.XPathResult=jn,n.evaluate=function(t,n,e,r){return new Cn(t,e).evaluate(n,r)},n.createExpression=function(t,n){return new Cn(t,n)},n.createNSResolver=function(t){return new Un(t)})}var Ln=this;Function.prototype.bind=Function.prototype.bind||function(t){if(1<arguments.length){var n=Array.prototype.slice.call(arguments,1);return n.unshift(this,t),a.apply(null,n)}return a(this,t)};var Yn,Vn,Hn,Xn;Xn=Hn=Vn=Yn=!1;var $n;if($n=f()){var Kn=Ln.navigator;Yn=0==$n.lastIndexOf("Opera",0),Vn=!Yn&&(-1!=$n.indexOf("MSIE")||-1!=$n.indexOf("Trident")),Hn=!Yn&&-1!=$n.indexOf("WebKit"),Xn=!Yn&&!Hn&&!Vn&&"Gecko"==Kn.product}var Wn,qn=Vn,Gn=Xn,zn=Hn;t:{var Jn,Qn="";if(Yn&&Ln.opera)var Zn=Ln.opera.version,Qn="function"==typeof Zn?Zn():Zn;else if(Gn?Jn=/rv\:([^\);]+)(\)|;)/:qn?Jn=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:zn&&(Jn=/WebKit\/(\S+)/),Jn)var te=Jn.exec(f()),Qn=te?te[1]:"";if(qn){var ne=l();if(ne>parseFloat(Qn)){Wn=String(ne);break t}}Wn=Qn}var ee=Wn,re={},ie=Ln.document,oe=ie&&qn?l()||("CSS1Compat"==ie.compatMode?parseInt(ee,10):5):void 0,ae=qn&&!(qn&&oe>=9),ue=qn&&!(qn&&oe>=8),se=RegExp("\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+|\\/\\/|\\.\\.|::|\\d+(?:\\.\\d*)?|\\.\\d+|\"[^\"]*\"|'[^']*'|[!<>]=|\\s+|.","g"),ce=/^\s/,fe=Array.prototype,le=fe.indexOf?function(t,n,e){return fe.indexOf.call(t,n,e)}:function(t,n,e){if(e=null==e?0:0>e?Math.max(0,t.length+e):e,r(t))return r(n)&&1==n.length?t.indexOf(n,e):-1;for(;e<t.length;e++)if(e in t&&t[e]===n)return e;return-1},he=fe.forEach?function(t,n,e){fe.forEach.call(t,n,e)}:function(t,n,e){for(var i=t.length,o=r(t)?t.split(""):t,a=0;i>a;a++)a in o&&n.call(e,o[a],a,t)},pe=fe.filter?function(t,n,e){return fe.filter.call(t,n,e)}:function(t,n,e){for(var i=t.length,o=[],a=0,u=r(t)?t.split(""):t,s=0;i>s;s++)if(s in u){var c=u[s];n.call(e,c,s,t)&&(o[a++]=c)}return o},de=fe.reduce?function(t,n,e,r){return r&&(n=a(n,r)),fe.reduce.call(t,n,e)}:function(t,n,e,r){var i=e;return he(t,function(e,o){i=n.call(r,i,e,o,t)}),i},ge=fe.some?function(t,n,e){return fe.some.call(t,n,e)}:function(t,n,e){for(var i=t.length,o=r(t)?t.split(""):t,a=0;i>a;a++)if(a in o&&n.call(e,o[a],a,t))return!0;return!1};!Gn&&!qn||qn&&qn&&oe>=9||Gn&&h("1.9.1"),qn&&h("9"),s(nn),nn.prototype.a=function(t){return this.c.k(this.e,this.j,t)},nn.prototype.toString=function(){var t="Binary Expression: "+this.c,t=t+G(this.e);return t+=G(this.j)},rn.prototype.toString=t("a");var ve={};on("div",6,1,function(t,n,e){return Q(t,e)/Q(n,e)}),on("mod",6,1,function(t,n,e){return Q(t,e)%Q(n,e)}),on("*",6,1,function(t,n,e){return Q(t,e)*Q(n,e)}),on("+",5,1,function(t,n,e){return Q(t,e)+Q(n,e)}),on("-",5,1,function(t,n,e){return Q(t,e)-Q(n,e)}),on("<",4,2,function(t,n,e){return en(function(t,n){return n>t},t,n,e)}),on(">",4,2,function(t,n,e){return en(function(t,n){return t>n},t,n,e)}),on("<=",4,2,function(t,n,e){return en(function(t,n){return n>=t},t,n,e)}),on(">=",4,2,function(t,n,e){return en(function(t,n){return t>=n},t,n,e)});var we=on("=",3,2,function(t,n,e){return en(function(t,n){return t==n},t,n,e,!0)});on("!=",3,2,function(t,n,e){return en(function(t,n){return t!=n},t,n,e,!0)}),on("and",2,2,function(t,n,e){return tn(t,e)&&tn(n,e)}),on("or",1,2,function(t,n,e){return tn(t,e)||tn(n,e)}),s(an),an.prototype.a=function(t){return t=this.c.a(t),mn(this.e,t)},an.prototype.toString=function(){var t;return t="Filter:"+G(this.c),t+=G(this.e)},s(un),un.prototype.a=function(t){return this.e.k.apply(null,y(t,this.c))},un.prototype.toString=function(){var t="Function: "+this.e;if(this.c.length)var n=de(this.c,function(t,n){return t+G(n)},"Arguments:"),t=t+G(n);return t},sn.prototype.toString=t("h");var be={};cn("boolean",2,!1,!1,function(t,n){return tn(n,t)},1),cn("ceiling",1,!1,!1,function(t,n){return Math.ceil(Q(n,t))},1),cn("concat",3,!1,!1,function(t){var n=E(arguments,1);return de(n,function(n,e){return n+Z(e,t)},"")},2,null),cn("contains",2,!1,!1,function(t,n,e){return n=Z(n,t),t=Z(e,t),-1!=n.indexOf(t)},2),cn("count",1,!1,!1,function(t,n){return n.a(t).i},1,1,!0),cn("false",2,!1,!1,n(!1),0),cn("floor",1,!1,!1,function(t,n){return Math.floor(Q(n,t))},1),cn("id",4,!1,!1,function(t,n){function e(t){if(ae){var n=i.all[t];if(n){if(n.nodeType&&t==n.id)return n;if(n.length)return m(n,function(n){return t==n.id})}return null}return i.getElementById(t)}var r=t.a,i=9==r.nodeType?r:r.ownerDocument,r=Z(n,t).split(/\s+/),o=[];he(r,function(t){t=e(t),!t||0<=le(o,t)||o.push(t)}),o.sort(N);var a=new B;return he(o,function(t){F(a,t)}),a},1),cn("lang",2,!1,!1,n(!1),1),cn("last",1,!0,!1,function(t){if(1!=arguments.length)throw Error("Function last expects ()");return t.d},0),cn("local-name",3,!1,!0,function(t,n){var e=n?L(n.a(t)):t.a;return e?e.nodeName.toLowerCase():""},0,1,!0),cn("name",3,!1,!0,function(t,n){var e=n?L(n.a(t)):t.a;return e?e.nodeName.toLowerCase():""},0,1,!0),cn("namespace-uri",3,!0,!1,n(""),0,1,!0),cn("normalize-space",3,!1,!0,function(t,n){return(n?Z(n,t):I(t.a)).replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")},0,1),cn("not",2,!1,!1,function(t,n){return!tn(n,t)},1),cn("number",1,!1,!0,function(t,n){return n?Q(n,t):+I(t.a)},0,1),cn("position",1,!0,!1,function(t){return t.b},0),cn("round",1,!1,!1,function(t,n){return Math.round(Q(n,t))},1),cn("starts-with",2,!1,!1,function(t,n,e){return n=Z(n,t),t=Z(e,t),0==n.lastIndexOf(t,0)},2),cn("string",3,!1,!0,function(t,n){return n?Z(n,t):I(t.a)},0,1),cn("string-length",1,!1,!0,function(t,n){return(n?Z(n,t):I(t.a)).length},0,1),cn("substring",3,!1,!1,function(t,n,e,r){if(e=Q(e,t),isNaN(e)||1/0==e||-1/0==e)return"";if(r=r?Q(r,t):1/0,isNaN(r)||-1/0===r)return"";e=Math.round(e)-1;var i=Math.max(e,0);return t=Z(n,t),1/0==r?t.substring(i):(n=Math.round(r),t.substring(i,e+n))},2,3),cn("substring-after",3,!1,!1,function(t,n,e){return n=Z(n,t),t=Z(e,t),e=n.indexOf(t),-1==e?"":n.substring(e+t.length)},2),cn("substring-before",3,!1,!1,function(t,n,e){return n=Z(n,t),t=Z(e,t),t=n.indexOf(t),-1==t?"":n.substring(0,t)},2),cn("sum",1,!1,!1,function(t,n){for(var e=V(n.a(t)),r=0,i=X(e);i;i=X(e))r+=+I(i);return r},1,1,!0),cn("translate",3,!1,!1,function(t,n,e,r){n=Z(n,t),e=Z(e,t);var i=Z(r,t);for(t=[],r=0;r<e.length;r++){var o=e.charAt(r);o in t||(t[o]=i.charAt(r))}for(e="",r=0;r<n.length;r++)o=n.charAt(r),e+=o in t?t[o]:o;return e},3),cn("true",2,!1,!1,n(!0),0),fn.prototype.a=function(t){return null===this.b||this.b==t.nodeType},fn.prototype.d=t("e"),fn.prototype.toString=function(){var t="Kind Test: "+this.e;return null===this.c||(t+=G(this.c)),t},s(hn),hn.prototype.a=t("c"),hn.prototype.toString=function(){return"Literal: "+this.c},pn.prototype.a=function(t){var n=t.nodeType;return 1!=n&&2!=n?!1:"*"!=this.h&&this.h!=t.nodeName.toLowerCase()?!1:this.c==(t.namespaceURI?t.namespaceURI.toLowerCase():"http://www.w3.org/1999/xhtml")},pn.prototype.d=t("h"),pn.prototype.toString=function(){return"Name Test: "+("http://www.w3.org/1999/xhtml"==this.c?"":this.c+":")+this.h},s(dn),dn.prototype.a=t("c"),dn.prototype.toString=function(){return"Number: "+this.c},s(gn),s(vn),vn.prototype.a=function(t){var n=new B;return t=t.a,9==t.nodeType?F(n,t):F(n,t.ownerDocument),n},vn.prototype.toString=n("Root Helper Expression"),s(wn),wn.prototype.a=function(t){var n=new B;return F(n,t.a),n},wn.prototype.toString=n("Context Helper Expression"),gn.prototype.a=function(t){var n=this.e.a(t);if(!(n instanceof B))throw Error("Filter expression must evaluate to nodeset.");t=this.c;for(var e=0,r=t.length;r>e&&n.i;e++){var i,o=t[e],a=V(n,o.c.a);if(o.f||o.c!=Ne)if(o.f||o.c!=Te)for(i=X(a),n=o.a(new c(i));null!=(i=X(a));)i=o.a(new c(i)),n=j(n,i);else i=X(a),n=o.a(new c(i));else{for(i=X(a);(n=X(a))&&(!i.contains||i.contains(n))&&8&n.compareDocumentPosition(i);i=n);n=o.a(new c(i))}}return n},gn.prototype.toString=function(){var t;if(t="Path Expression:"+G(this.e),this.c.length){var n=de(this.c,function(t,n){return t+G(n)},"Steps:");t+=G(n)}return t},bn.prototype.toString=function(){return de(this.a,function(t,n){return t+G(n)},"Predicates:")},s(yn),yn.prototype.a=function(t){var n=t.a,e=null,e=this.d,r=null,i=null,o=0;if(e&&(r=e.name,i=e.l?Z(e.l,t):null,o=1),this.m)if(this.f||this.c!=Ee)if(t=V(new yn(xe,new fn("node")).a(t)),n=X(t))for(e=this.k(n,r,i,o);null!=(n=X(t));)e=j(e,this.k(n,r,i,o));else e=new B;else e=k(this.j,n,r,i),e=mn(this.e,e,o);else e=this.k(t.a,r,i,o);return e},yn.prototype.k=function(t,n,e,r){return t=this.c.d(this.j,t,n,e),t=mn(this.e,t,r)},yn.prototype.toString=function(){var t;if(t="Step:"+G("Operator: "+(this.m?"//":"/")),this.c.h&&(t+=G("Axis: "+this.c)),t+=G(this.j),this.e.a.length){var n=de(this.e.a,function(t,n){return t+G(n)},"Predicates:");t+=G(n)}return t},En.prototype.toString=t("h");var me={};xn("ancestor",function(t,n){for(var e=new B,r=n;r=r.parentNode;)t.a(r)&&U(e,r);return e},!0),xn("ancestor-or-self",function(t,n){var e=new B,r=n;do t.a(r)&&U(e,r);while(r=r.parentNode);return e},!0);var ye=xn("attribute",function(t,n){var e=new B,r=t.d();if("style"==r&&n.style&&ae)return F(e,new p(n.style,n,"style",n.style.cssText)),e;var i=n.attributes;if(i)if(t instanceof fn&&null===t.b||"*"==r)for(var o,r=0;o=i[r];r++)ae?o.nodeValue&&F(e,d(n,o)):F(e,o);else(o=i.getNamedItem(r))&&(ae?o.nodeValue&&F(e,d(n,o)):F(e,o));return e},!1),Ee=xn("child",function(t,n,e,i,o){return(ae?P:D).call(null,t,n,r(e)?e:null,r(i)?i:null,o||new B)},!1,!0);xn("descendant",k,!1,!0);var xe=xn("descendant-or-self",function(t,n,e,r){var i=new B;return O(n,e,r)&&t.a(n)&&F(i,n),k(t,n,e,r,i)},!1,!0),Ne=xn("following",function(t,n,e,r){var i=new B;do for(var o=n;o=o.nextSibling;)O(o,e,r)&&t.a(o)&&F(i,o),i=k(t,o,e,r,i);while(n=n.parentNode);return i},!1,!0);xn("following-sibling",function(t,n){for(var e=new B,r=n;r=r.nextSibling;)t.a(r)&&F(e,r);return e},!1),xn("namespace",function(){return new B},!1);var Se=xn("parent",function(t,n){var e=new B;if(9==n.nodeType)return e;if(2==n.nodeType)return F(e,n.ownerElement),e;var r=n.parentNode;return t.a(r)&&F(e,r),e},!1),Te=xn("preceding",function(t,n,e,r){var i=new B,o=[];do o.unshift(n);while(n=n.parentNode);for(var a=1,u=o.length;u>a;a++){var s=[];for(n=o[a];n=n.previousSibling;)s.unshift(n);for(var c=0,f=s.length;f>c;c++)n=s[c],O(n,e,r)&&t.a(n)&&F(i,n),i=k(t,n,e,r,i)}return i},!0,!0);xn("preceding-sibling",function(t,n){for(var e=new B,r=n;r=r.previousSibling;)t.a(r)&&U(e,r);return e},!0);var Ie=xn("self",function(t,n){var e=new B;return t.a(n)&&F(e,n),e},!1);s(Nn),Nn.prototype.a=function(t){return-Q(this.c,t)},Nn.prototype.toString=function(){return"Unary Expression: -"+G(this.c)},s(Sn),Sn.prototype.a=function(t){var n=new B;return he(this.c,function(e){if(e=e.a(t),!(e instanceof B))throw Error("Path expression must evaluate to NodeSet.");n=j(n,e)}),n},Sn.prototype.toString=function(){return de(this.c,function(t,n){return t+G(n)},"Union Expression:")},jn.ANY_TYPE=0,jn.NUMBER_TYPE=1,jn.STRING_TYPE=2,jn.BOOLEAN_TYPE=3,jn.UNORDERED_NODE_ITERATOR_TYPE=4,jn.ORDERED_NODE_ITERATOR_TYPE=5,jn.UNORDERED_NODE_SNAPSHOT_TYPE=6,jn.ORDERED_NODE_SNAPSHOT_TYPE=7,jn.ANY_UNORDERED_NODE_TYPE=8,jn.FIRST_ORDERED_NODE_TYPE=9;var Oe=["wgxpath","install"],ke=Ln;Oe[0]in ke||!ke.execScript||ke.execScript("var "+Oe[0]);for(var Re;Oe.length&&(Re=Oe.shift());)Oe.length||void 0===Fn?ke=ke[Re]?ke[Re]:ke[Re]={}:ke[Re]=Fn}();