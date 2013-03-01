/*
@source: https://github.com/Quobis/QoffeeSIP
Copyright (C) Quobis
Licensed under GNU-LGPL-3.0-or-later (http://www.gnu.org/licenses/lgpl-3.0.html)
*/
(function(){var n,h,f=function(a,b){return function(){return a.apply(b,arguments)}},r={}.hasOwnProperty,p=function(a,b){function c(){this.constructor=a}for(var d in b)r.call(b,d)&&(a[d]=b[d]);c.prototype=b.prototype;a.prototype=new c;a.__super__=b.prototype;return a},q=[].slice,j=function(a){this.toggleMuteVideo=f(this.toggleMuteVideo,this);this.toggleMuteAudio=f(this.toggleMuteAudio,this);this.close=f(this.close,this);this.receiveAnswer=f(this.receiveAnswer,this);this.receiveOffer=f(this.receiveOffer,
this);this.receive=f(this.receive,this);this.createAnswer=f(this.createAnswer,this);this.createOffer=f(this.createOffer,this);this.setLocalDescription=f(this.setLocalDescription,this);this.triggerSDP=f(this.triggerSDP,this);this.createStream=f(this.createStream,this);this.createPeerConnection=f(this.createPeerConnection,this);this.start=f(this.start,this);this.browserSupport=f(this.browserSupport,this);var b,c;console.log("[INFO] RTC constructor");for(b in a)c=a[b],this[b]=c;null!=this.mediaElements?
(this.$dom1=this.mediaElements.localMedia,this.$dom2=this.mediaElements.remoteMedia):this.$dom1=this.$dom2=null;null==this.mediaConstraints&&(this.mediaConstraints={audio:!0,video:!0});this.browserSupport();this.iceServers=[];null!=this.stunServer&&this.iceServers.push(this.stunServer);null!=this.turnServer&&this.iceServers.push(this.turnServer);this.start()};p(j,Spine.Module);j.include(Spine.Events);j.prototype.browserSupport=function(){navigator.mozGetUserMedia&&(this.browser="firefox",this.getUserMedia=
navigator.mozGetUserMedia.bind(navigator),this.PeerConnection=mozRTCPeerConnection,this.RTCSessionDescription=mozRTCSessionDescription,this.attachStream=function(a,b){if(a)return console.log("[INFO] attachStream"),a.attr("src",window.URL.createObjectURL(b)),a.get(0).play()},MediaStream.prototype.getVideoTracks=function(){return[]},MediaStream.prototype.getAudioTracks=function(){return[]});if(navigator.webkitGetUserMedia&&(this.browser="chrome",this.getUserMedia=navigator.webkitGetUserMedia.bind(navigator),
this.PeerConnection=webkitRTCPeerConnection,this.RTCSessionDescription=RTCSessionDescription,this.attachStream=function(a,b){var c;if(null!=a)return console.log("[INFO] attachStream"),c=webkitURL.createObjectURL(b),a.attr("src",c)},webkitMediaStream.prototype.getVideoTracks||(webkitMediaStream.prototype.getVideoTracks=function(){return this.videoTracks}),webkitMediaStream.prototype.getAudioTracks||(webkitMediaStream.prototype.getAudioTracks=function(){return this.audioTracks}),!webkitRTCPeerConnection.prototype.getLocalStreams))return webkitRTCPeerConnection.prototype.getLocalStreams=
function(){return this.localStreams},webkitRTCPeerConnection.prototype.getRemoteStreams=function(){return this.remoteStreams}};j.prototype.start=function(){this.noMoreCandidates="firefox"===this.browser;return this.createPeerConnection()};j.prototype.createPeerConnection=function(){var a=this;console.log("[INFO] createPeerConnection");console.log("[MEDIA] ICE servers");console.log(this.iceServers);this.pc=new this.PeerConnection({iceServers:this.iceServers});this.pc.onaddstream=function(b){console.log("[MEDIA] Stream added");
a.attachStream(a.$dom2,b.stream);return a.trigger("remotestream",a.remotestream)};this.pc.onicecandidate=function(b){console.log("[INFO] onicecandidate");console.log(a.pc.iceState);if(b.candidate)return console.log("[INFO] New ICE candidate:"),b=b.candidate.candidate,console.log(""+b);console.log("[INFO] No more ice candidates");a.noMoreCandidates=!0;if(null!=a.pc.localDescription)return a.triggerSDP()};"chrome"===this.browser&&(this.pc.onicechange=function(){return console.log("[INFO] icestate changed -> "+
a.pc.iceState)},this.pc.onstatechange=function(){return console.log("[INFO] peerconnectionstate changed -> "+a.pc.readyState)},this.pc.onopen=function(){return console.log("[MEDIA] peerconnection opened")},this.pc.onclose=function(){return console.log("[INFO] peerconnection closed")});return this.createStream()};j.prototype.createStream=function(){var a=this;console.log("[INFO] createStream");return null!=this.localstream?(console.log("[INFO] Using media previously getted."),this.pc.addStream(this.localstream),
this.attachStream(this.$dom1,this.localstream)):this.getUserMedia(this.mediaConstraints,function(b){a.localstream=b;console.log("[INFO] getUserMedia successed");console.log(b);a.pc.addStream(a.localstream);a.attachStream(a.$dom1,a.localstream);a.trigger("localstream",a.localstream);return console.log("localstream",a.localstream)},function(b){console.error(b);console.error("GetUserMedia error");return a.trigger("error","getUserMedia")})};j.prototype.triggerSDP=function(){console.log("[MEDIA]");return this.trigger("sdp",
this.pc.localDescription.sdp)};j.prototype.setLocalDescription=function(a){var b=this;return this.pc.setLocalDescription(a,function(){console.log("[INFO] setLocalDescription successed");if(b.noMoreCandidates)return b.triggerSDP()},function(){return b.trigger("error","setLocalDescription",a)})};j.prototype.createOffer=function(){var a=this;console.log("[INFO] createOffer");return this.pc.createOffer(this.setLocalDescription,function(b){return a.trigger("error","createOffer",b)},{})};j.prototype.createAnswer=
function(){var a=this;console.log("[INFO] createAnswer");return this.pc.createAnswer(this.setLocalDescription,function(b){return a.trigger("error","createAnswer",b)},{})};j.prototype.receive=function(a,b,c){var d,e=this;null==c&&(c=function(){return null});d=new this.RTCSessionDescription({type:b,sdp:a});return this.pc.setRemoteDescription(d,function(){console.log("[INFO] Remote description setted.");console.log("[INFO] localDescription:");console.log(e.pc.localDescription);console.log("[INFO] remotelocalDescription:");
console.log(e.pc.remoteDescription);return c()},function(){return e.trigger("error","setRemoteDescription",d)})};j.prototype.receiveOffer=function(a,b){null==b&&(b=null);console.log("[INFO] Received offer");return this.receive(a,"offer",b)};j.prototype.receiveAnswer=function(a){console.log("[INFO] Received answer");return this.receive(a,"answer")};j.prototype.close=function(){this.$dom2.addClass("hidden");try{return this.pc.close()}catch(a){return console.log("[ERROR] Error closing peerconnection"),
console.log(a)}finally{this.pc=null,this.start()}};j.prototype.toggleMuteAudio=function(){var a,b,c,d,e;b=this.localstream.getAudioTracks();console.log(b);if(0===b.length)console.log("[MEDIA] No local audio available.");else{this.isAudioMuted?(c=!0,console.log("[MEDIA] Audio unmuted.")):(c=!1,console.log("[MEDIA] Audio muted."));d=0;for(e=b.length;d<e;d++)a=b[d],a.enabled=c;return this.isAudioMuted=!c}};j.prototype.toggleMuteVideo=function(){var a,b,c,d,e;c=this.localstream.getVideoTracks();console.log(c);
if(0===c.length)console.log("[MEDIA] No local audio available.");else{this.isVideoMuted?(a=!0,console.log("Video unmuted.")):(a=!1,console.log("Video muted."));d=0;for(e=c.length;d<e;d++)b=c[d],b.enabled=a;return this.isVideoMuted=!a}};window.RTC=j;var k=function(){};k.getRegExprResult=function(a,b,c){var d,e,f,g,h;e={};h=_.keys(c);f=0;for(g=h.length;f<g;f++)d=h[f],e[d]=void 0;b=b.exec(a);if(null!=b)for(d in c)a=c[d],a<b.length&&(e[d]=b[a]);return e};k.parse=function(a){var b;console.log("[INFO] Parsing");
console.log(a);b={};_.extend(b,{frame:a});_.extend(b,this.parseFirstLine(a));_.extend(b,this.parseVias(a));_.extend(b,this.parseFrom(a));_.extend(b,this.parseTo(a));_.extend(b,this.parseRecordRoutes(a));_.extend(b,this.parseRoute(a));_.extend(b,this.parseContact(a));_.extend(b,this.parseCallId(a));_.extend(b,this.parseCSeq(a));_.extend(b,this.parseChallenge(a));_.extend(b,this.parseExpires(a));_.extend(b,this.parseContentType(a));_.extend(b,this.parseContent(a));console.log("[INFO] Parsed");console.log(b);
return b};k.parseFirstLine=function(a){var b;a=a.split("\r\n")[0];if(/^SIP\/2\.0 \d+/.test(a))return b=a.split(" "),b=_.rest(b),a=parseInt(b[0]),b=_.rest(b),b=b.join(" "),{responseCode:a,meth:b,type:"response"};b=/(\w+)/.exec(a)[0];a.split(" ")[1].split(";");return{meth:b,type:"request"}};k.parseVias=function(a){var b,c;c=/Via\:\s+SIP\/2\.0\/[A-Z]+\s+([A-z0-9\.\:]+)/;a=_.filter(a.split("\r\n"),function(a){return c.test(a)});a=_.map(a,function(a){return a.replace(/;received=[A-z0-9\.\:]+/,"")});console.log(a);
0<a.length&&(b=this.getRegExprResult(a[0],c,{sentBy:1}),b=/branch=([^;\s]+)/,b=this.getRegExprResult(a[0],b,{branch:1}));console.log(_.extend({vias:a},b));return _.extend({vias:a},b)};k.parseRecordRoutes=function(a){var b;b=/Record-Route\:/i;return{recordRoutes:_.filter(a.split("\r\n"),function(a){return b.test(a)})}};k.parseFrom=function(a){return this.getRegExprResult(a,/From:(\s?".+"\s?)?\s*<?sips?:((.+)@[A-z0-9\.]+)>?(;tag=(.+))?/i,{from:2,ext:3,fromTag:5})};k.parseTo=function(a){return this.getRegExprResult(a,
/To:(\s?".+"\s?)?\s*<?sips?:((.+)@[A-z0-9\.]+)>?(;tag=(.+))?/i,{to:2,ext2:3,toTag:5})};k.parseCallId=function(a){return this.getRegExprResult(a,/Call-ID:\s(.+)/i,{callId:1})};k.parseRoute=function(a){var b,c,d,e,f;c=/Route\:/i;d="";f=a.split("\r\n");a=0;for(e=f.length;a<e;a++)b=f[a],c.test(b)&&(b=b.split(": "),d+=b[1]+"\r\nRoute: ");d=d.slice(0,-9);return{route:d}};k.parseContact=function(a){var b;b=this.getRegExprResult(a,/Contact\:\s<(.*)>/g,{contact:1});return _.extend(b,this.getRegExprResult(a,
/pub\-gruu=\"(.+?)\"/,{gruu:1}))};k.parseCSeq=function(a){a=this.getRegExprResult(a,/CSeq\:\s(\d+)\s(.+)/gi,{number:1,meth:2});a.number=parseInt(a.number);return{cseq:a}};k.parseChallenge=function(a){var b,c,d,e;e=/realm="(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|(([a-z]+\.)+[a-z]{2,3})|(\w+))"/;c=/nonce="(.{4,})"/;a=/^WWW-Authenticate\:.+$|^Proxy-Authenticate\:.+$/m.exec(a);null!=a&&(a=a[0],d=e.exec(a)[1],b=c.exec(a)[1]);return{realm:d,nonce:b}};k.parseExpires=function(a){return this.getRegExprResult(a,
/expires=(\d{1,4})/,{proposedExpires:1})};k.parseContentType=function(a){return this.getRegExprResult(a,/Content-Type: (.*)/i,{contentType:1})};k.parseContent=function(a){return{content:a.split("\r\n\r\n")[1]}};window.Parser=k;var m=function(a){this.set=f(this.set,this);this.set(a);null==this.domainName&&(this.domainName=""+this.randomString(12)+".invalid");null==this.IP&&(this.IP=this.randomIP());null==this.branch&&(this.branch="z9hG4bK"+this.randomString(30));if(null==this.cseq){this.cseq={};if(null==
(a=this.cseq).number)a.number=_.random(0,1E3);if(null==(a=this.cseq).meth)a.meth=this.meth;if(null==(a=this.cseq).meth)a.meth=""}null==this.fromTag&&(this.fromTag=this.randomString(20));null==this.toTag&&(this.toTag=this.randomString(20));null==this.callId&&(this.callId=this.randomString(16));this.regid=1;if(null==(a=m.prototype).uuid)a.uuid=this.getUuid()};m.prototype.set=function(a){var b,c,d;d=[];for(b in a)c=a[b],d.push(this[b]=c);return d};m.prototype.randomString=function(a,b){var c,d,e,f,g;
null==b&&(b=!1);b?e=Math.random().toString(16).slice(2):(e=Math.random().toString(32).slice(2),e=e.concat(Math.random().toString(32).toUpperCase().slice(2)));c=_.shuffle(e.split(""));e="";f=0;for(g=c.length;f<g;f++)d=c[f],e+=d;c=Math.min(e.length,a);for(e=e.slice(0,c);e.length<a;)e+=this.randomString(a-e.length,b);return e.slice(0,a)};m.prototype.getUuid=function(){if(null===localStorage.uuid||void 0===localStorage.uuid)localStorage.uuid=""+this.randomString(3,!0)+"-"+this.randomString(4,!0)+"-"+
this.randomString(8,!0);this.uuid=localStorage.uuid;this.getUuid=function(){return this.uuid};return this.uuid};m.prototype.randomIP=function(){var a,b;a=[];for(b=0;3>=b;++b)a.push(_.random(1,255));return a.join(".")};h=m;window.SipTransaction=h;var g=function(){this.setState=f(this.setState,this);this.sendInstantMessage=f(this.sendInstantMessage,this);this.sendWithSDP=f(this.sendWithSDP,this);this.send=f(this.send,this);this.hangup=f(this.hangup,this);this.answer=f(this.answer,this);this.call=f(this.call,
this);this.register=f(this.register,this);this.createMessage=f(this.createMessage,this);this.getDigest=f(this.getDigest,this);this.checkDialog=f(this.checkDialog,this);this.deleteTransaction=f(this.deleteTransaction,this);this.getTransaction=f(this.getTransaction,this);this.addTransaction=f(this.addTransaction,this);var a=this;g.__super__.constructor.apply(this,arguments);this.rtc=new j({mediaElements:this.mediaElements,mediaConstraints:this.mediaConstraints,turnServer:this.turnServer,stunServer:this.stunServer});
this.rtc.bind("localstream",function(b){return a.trigger("localstream",b)});this.rtc.bind("remotestream",function(b){return a.trigger("remotestream",b)});this.sipServer=this.server.ip;this.port=this.server.port;this.path=this.server.path||"";this.transport=this.server.transport||"ws";this._transactions={};this._instantMessages={};this.setState(0);null==this.hackViaTCP&&(this.hackViaTCP=!1);null==this.hackIpContact&&(this.hackIpContact=!1);this.websocket=new WebSocket(""+this.transport+"://"+this.sipServer+
":"+this.port+this.path,"sip");console.log(""+this.transport+"://"+this.sipServer+":"+this.port+this.path);this.info("websocket created");this.websocket.onopen=function(){a.info("websocket opened");return a.onopen()};this.websocket.onmessage=function(b){var c,d,e,f,g;c=k.parse(b.data);a.info("Input message",c);if(2<a.state&&"REGISTER"===c.cseq.meth){if(!a.getTransaction(c))return;switch(c.responseCode){case 200:a.info("RE-REGISTER answer",c);return;case 401:b=a.getTransaction(c);b.vias=c.vias;_.extend(b,
_.pick(c,"realm","nonce","toTag"));b.auth=!0;a.send(a.createMessage(b));return}}if(2<a.state&&"MESSAGE"===c.cseq.meth)switch(c.meth){case "MESSAGE":console.log("[MESSAGE] "+c.content);b={from:c.ext,to:c.ext2,content:c.content};a.trigger("instant-message",b);a.send(a.createMessage(new h(_.extend(c,{meth:"OK"}))));break;case "OK":console.log("[MESSAGE] OK");a.deleteInstantMessage(c);break;default:if(401===(f=!c.responseCode)||407===f)break;if(!a.getTransaction(c))break;b=a.getTransaction(c);_.extend(b,
_.pick(c,"realm","nonce","toTag"));b.proxyAuth=407===c.responseCode;b.auth=401===c.responseCode;a.send(a.createMessage(b))}else if(3<(g=a.state)&&9>g&&"INVITE"===c.meth)a.info("Another incoming call (BUSY)",c),b=_.clone(c),_.extend(b,{meth:"Busy here"}),a.send(a.createMessage(b));else switch(a.state){case 1:if(!a.getTransaction(c))break;e=a.getTransaction(c);e.vias=c.vias;switch(c.responseCode){case 200:return a.info("Register successful",c),a.setState(3,c),e.expires=c.proposedExpires/2,a.reRegister=
function(){return a.send(a.createMessage(a.getTransaction(e)))},d=setInterval(a.reRegister,1E3*e.expires),a.unregister=function(){console.log("[INFO] unregistering");e=a.getTransaction(c);e.expires=0;clearInterval(d);c=a.createMessage(e);a.send(c);return a.setState(0,c)},a.gruu=c.gruu;case 401:return a.setState(2,c),_.extend(e,_.pick(c,"realm","nonce","toTag")),e.cseq.number+=1,e.auth=!0,a.send(a.createMessage(e));default:return a.warning("Unexpected message",c)}case 2:if(!a.getTransaction(c))break;
e=a.getTransaction(c);e.vias=c.vias;switch(c.responseCode){case 200:return a.info("Successful register",c),a.setState(3,c),e.expires=c.proposedExpires/2,a.reRegister=function(){return a.send(a.createMessage(a.getTransaction(e)))},a.t=setInterval(a.reRegister,1E3*e.expires),a.gruu=c.gruu;case 401:return a.info("Unsusccessful register",c),a.setState(0,c);default:return a.warning("Unexpected message",c),a.setState(0,c)}case 3:switch(c.meth){case "INVITE":return e=new h(c),a.addTransaction(e),b=_.clone(e),
b.meth="Ringing",a.send(a.createMessage(b)),a.setState(6,c);default:return a.warning("Unexpected message",c)}case 4:if(!a.checkDialog(c))break;switch(c.meth){case "CANCEL":return a.info("Call ended"),a.setState(3,c);case "ACK":return a.setState(8,c);default:return a.warning("Unexpected message",c)}case 5:if(!a.getTransaction(c))break;e=a.getTransaction(c);switch(c.type){case "response":if(a.responsePhrases[c.responseCode])a.info(a.responsePhrases[c.responseCode],c);else{a.warning("Unexpected response",
c);return}switch(c.responseCode){case 180:return e.contact=c.contact;case 200:return a.info("Establishing call",c),a.rtc.receiveAnswer(c.content),_.extend(e,_.pick(c,"from","to","fromTag","toTag")),b=new h(c),b.meth="ACK",a.send(a.createMessage(b)),a.setState(7,c);case 401:case 407:return 401===c.responseCode&&a.info("AUTH",c),407===c.responseCode&&a.info("PROXY-AUTH",c),b=new h(_.omit(c,"nonce")),b.meth="ACK",b.vias=c.vias,a.send(a.createMessage(b)),e.vias=c.vias,e.cseq.number+=1,_.extend(e,_.pick(c,
"realm","nonce","toTag")),e.auth=401===c.responseCode,e.proxyAuth=407===c.responseCode,console.log(e),c=a.createMessage(e),a.sendWithSDP(c,"offer",null);default:if(400<=c.responseCode)return b=new h(_.omit(c,"nonce")),b.meth="ACK",b.vias=c.vias,a.send(a.createMessage(b)),a.setState(3),a.deleteTransaction("INVITE")}break;case "request":switch(c.meth){case "BYE":return a.info("Call ended",c),b=new h(c),b.meth="OK",a.send(a.createMessage(b)),a.setState(3,c);default:return a.warning("Unexpected message",
c)}}break;case 6:if(!a.checkDialog(c))break;a.info("RINGING",c);switch(c.meth){case "CANCEL":return a.info("Call ended",c),b=new h(c),b.meth="OK",a.send(a.createMessage(b)),a.setState(3,c)}break;case 7:case 8:if(!a.checkDialog(c))break;a.info("CALL ESTABLISHED",c);switch(c.meth){case "BYE":return a.info("Call ended",c),e=new h(c),e.vias=c.vias,e.meth="OK",b=_.clone(e),a.send(a.createMessage(b)),a.rtc.close(),a.setState(3,c)}break;case 9:if(!a.getTransaction(c))break;a.info("HANGING UP",c);a.info("Call ended",
c);a.rtc.close();return a.setState(3,c);case 10:if(!a.getTransaction(c))break;a.info("HANGING UP",c);a.info("Call ended",c);return a.setState(3,c)}};this.websocket.onclose=function(){return a.info("websocket closed")}};p(g,Spine.Controller);g.prototype.addTransaction=function(a){return this._transactions[a.branch]=a};g.prototype.getTransaction=function(a){return this._transactions[a.branch]};g.prototype.deleteTransaction=function(a){return this._transactions=_.omit(this._transactions,a.branch)};g.prototype.checkDialog=
function(a){return!_.isEmpty(_.find(this._transactions,function(b){return b.callId===a.callId}))};g.prototype.info=function(){var a;a=arguments[0];2<=arguments.length&&q.call(arguments,1);return console.log("[INFO]    "+a)};g.prototype.warning=function(){var a;a=arguments[0];2<=arguments.length&&q.call(arguments,1);return console.warn("[WARNING] "+a)};g.prototype.error=function(){var a;a=arguments[0];2<=arguments.length&&q.call(arguments,1);return console.error("[ERROR]   "+a)};g.prototype.states=
"OFFLINE;REGISTERING (before challenge);REGISTERING (after challenge);REGISTERED;INCOMING CALL;CALLING;RINGING;CALL STABLISHED (caller);CALL STABLISHED (callee);HANGING;CANCELLING".split(";");g.prototype.responsePhrases={100:"Trying",180:"Ringing",200:"OK",202:"Accepted",400:"Bad Request",401:"Unauthorized",403:"Forbidden",404:"Not Found (User not found)",407:"Proxy Authentication Required",408:"Request Time Out",481:"Call/Transaction Does Not Exists",486:"Busy Here",488:"Not acceptable here",500:"Server Internal Error",
503:"Service Unavaliable"};g.prototype.getDigest=function(a){var b,c;console.log(a);b=CryptoJS.MD5(""+a.ext+":"+a.realm+":"+a.pass);c=CryptoJS.MD5(""+a.meth+":"+a.requestUri);return CryptoJS.MD5(""+b+":"+a.nonce+":"+c)};g.prototype.createMessage=function(a){var b,c,d,e,f,g;a=new h(a);a.uri="sip:"+a.ext+"@"+(this.domain||this.sipServer);a.uri2="sip:"+a.ext2+"@"+(a.domain2||this.sipServer);a.targetUri="sip:"+this.sipServer;"BYE"===a.meth&&(a.cseq.number+=1);switch(a.meth){case "REGISTER":a.requestUri=
a.targetUri;d=""+a.meth+" "+a.requestUri+" SIP/2.0\r\n";break;case "INVITE":case "MESSAGE":case "CANCEL":a.requestUri=a.uri2;d=""+a.meth+" "+a.requestUri+" SIP/2.0\r\n";break;case "ACK":case "BYE":a.requestUri=a.contact||a.uri2;d=""+a.meth+" "+a.requestUri+" SIP/2.0\r\n";break;case "OK":d="SIP/2.0 200 OK\r\n";break;case "Ringing":d="SIP/2.0 180 Ringing\r\n";break;case "Busy here":d="SIP/2.0 486 Busy Here\r\n"}if("INVITE"===a.cseq.meth&&"ACK"!==a.meth&&_.isArray(a.recordRoutes)){g=a.recordRoutes;e=
0;for(f=g.length;e<f;e++)b=g[e],d+=b+"\r\n"}else switch(a.meth){case "REGISTER":case "INVITE":case "MESSAGE":case "CANCEL":d+="Route: <sip:"+this.sipServer+":"+this.port+";transport=ws;lr>\r\n";break;case "ACK":case "OK":case "BYE":"MESSAGE"!==a.cseq.meth&&(d+="Route: <sip:"+this.sipServer+":"+this.port+";transport=ws;lr=on>\r\n")}d=_.isArray(a.vias)?d+(a.vias.join("\r\n")+"\r\n"):d+("Via: SIP/2.0/"+(this.hackViaTCP&&"TCP"||this.transport.toUpperCase())+" "+a.domainName+";branch="+a.branch+"\r\n");
d+="From: "+a.uri+";tag="+a.fromTag+"\r\n";switch(a.meth){case "REGISTER":d+="To: "+a.uri+"\r\n";break;case "INVITE":case "MESSAGE":case "CANCEL":d+="To: "+a.uri2+"\r\n";break;default:d+="To: "+a.uri2+";tag="+a.toTag+"\r\n"}d+="Call-ID: "+a.callId+"\r\n";switch(a.meth){case "OK":d+="CSeq: "+a.cseq.number+" "+(a.cseq.meth||a.meth)+"\r\n";break;case "Ringing":d+="CSeq: "+a.cseq.number+" "+a.cseq.meth+"\r\n";break;case "ACK":d+="CSeq: "+a.cseq.number+" ACK\r\n";break;case "Busy here":d+="CSeq: "+a.cseq.number+
" INVITE\r\n";break;default:d+="CSeq: "+a.cseq.number+" "+a.meth+"\r\n"}d+="Max-Forwards: 70\r\n";if("REGISTER"===a.meth||"INVITE"===a.meth)d+="Allow: INVITE, ACK, CANCEL, BYE, MESSAGE\r\n";d+="Supported: path, outbound, gruu\r\nUser-Agent: QoffeeSIP 0.5\r\n";b=this.hackIpContact&&a.IP||a.domainName;switch(a.meth){case "Ringing":d=this.gruu?d+("Contact: <sip:"+a.ext2+"@"+b+";gr=urn:uuid:"+a.uuid+">\r\n"):d+("Contact: <sip:"+a.ext2+"@"+b+";transport=ws>\r\n");break;case "OK":"INVITE"===a.cseq.meth&&
(d=this.gruu?d+("Contact: <sip:"+a.ext2+"@"+b+";gr=urn:uuid:"+a.uuid+">\r\n"):d+("Contact: <sip:"+a.ext2+"@"+b+";transport=ws>\r\n"));break;case "REGISTER":d+="Contact: <sip:"+a.ext+"@"+b+";transport=ws>";break;case "INVITE":d=this.gruu?d+("Contact: <"+this.gruu+";ob>\r\n"):d+("Contact: <sip:"+a.ext+"@"+b+";transport=ws;ob>\r\n")}switch(a.meth){case "REGISTER":d+=";reg-id="+a.regid,d+=';+sip.instance="<urn:uuid:'+a.uuid+'>"',null!=a.expires&&(d+=";expires="+a.expires),d+="\r\n"}null!=a.nonce&&(b=
"",null!=a.opaque&&(b='opaque="'+a.opaque+'", '),!0===a.auth&&(c="REGISTER"===a.cseq.meth?a.targetUri:a.uri2,d+="Authorization:"),!0===a.proxyAuth&&(c=a.uri2,d+="Proxy-Authorization:"),a.response=this.getDigest(a),d+=' Digest username="'+a.ext+'",realm="'+a.realm+'",',d+='nonce="'+a.nonce+'",'+b+'uri="'+c+'",response="'+a.response+'",algorithm=MD5\r\n');switch(a.meth){case "INVITE":case "OK":d="INVITE"===a.cseq.meth?d+"Content-Type: application/sdp\r\n":d+"Content-Length: 0\r\n\r\n";break;case "MESSAGE":d+=
"Content-Length: "+(a.content.length||0)+"\r\n";d+="Content-Type: text/plain\r\n\r\n";d+=a.content;break;default:d+="Content-Length: 0\r\n\r\n"}return d};g.prototype.register=function(a,b,c){this.ext=a;this.pass=b;this.domain=c;a=new h({meth:"REGISTER",ext:this.ext,domain:this.domain,pass:this.pass||""});this.addTransaction(a);this.setState(1,a);a=this.createMessage(a);return this.send(a)};g.prototype.call=function(a,b){var c;c=new h({meth:"INVITE",ext:this.ext,pass:this.pass,ext2:a,domain2:b||this.domain});
this.addTransaction(c);this.setState(5,c);c=this.createMessage(c);return this.sendWithSDP(c,"offer",null)};g.prototype.answer=function(a){var b;b=_.clone(this.getTransaction({branch:a}));b.meth="OK";this.sendWithSDP(this.createMessage(b),"answer",this.getTransaction({branch:a}).content);return this.setState(4,b)};g.prototype.hangup=function(a){var b,c;b=function(a,b,c){var f;return f=[a[c],a[b]],a[b]=f[0],a[c]=f[1],f};a=this.getTransaction({branch:a});switch(this.state){case 5:return b=new h({meth:"CANCEL",
ext:this.ext,domain:this.domain,ext2:a.ext2,domain2:a.domain2}),_.extend(b,_.pick(a,"callId","fromTag","from","to","cseq","domainName","branch")),this.send(this.createMessage(b)),this.setState(10);case 6:return b=new h({meth:"Busy here",ext:this.ext,ext2:a.ext}),_.extend(b,_.pick(a,"callId","fromTag","from","to","cseq","domainName","branch","vias")),this.send(this.createMessage(b)),this.setState(9,b);case 7:return c=new h({meth:"BYE",ext:this.ext,ext2:a.ext2}),_.extend(c,_.pick(a,"callId","contact",
"fromTag","toTag","from","to","cseq")),this.send(this.createMessage(c)),this.addTransaction(c),this.setState(9,c),this.rtc.close();case 8:return c=new h({meth:"BYE",ext:this.ext,ext2:a.ext}),_.extend(c,_.pick(a,"callId","contact","fromTag","toTag","from","to","cseq","vias")),b(c,"fromTag","toTag"),b(c,"from","to"),this.send(this.createMessage(c)),this.addTransaction(c),this.setState(9,c),this.rtc.close()}};g.prototype.send=function(a){if(null!=a){console.log("[INFO] Sending data",a);try{return this.websocket.send(a)}catch(b){return this.error("websocket",
b)}}else return console.log("[INFO] Not sending data")};g.prototype.sendWithSDP=function(a,b,c){var d=this;this.rtc.bind("sdp",function(b){a+="Content-Length: "+b.length+"\r\n\r\n";a+=b;d.send(a);return d.rtc.unbind("sdp")});"offer"===b&&this.rtc.createOffer();if("answer"===b)return this.rtc.receiveOffer(c,function(){return d.rtc.createAnswer()})};g.prototype.sendInstantMessage=function(a,b){var c;c=new h({meth:"MESSAGE",ext:this.ext,pass:this.pass,ext2:a,content:b});this.addTransaction(c);return this.send(this.createMessage(c))};
g.prototype.setState=function(a,b){this.state=a;console.log("[INFO] New state  "+this.states[this.state]+("("+this.state+")"));return this.trigger("new-state",this.state,b)};n=g;window.SipStack=n;var l=function(a){this.toggleMuteAudio=f(this.toggleMuteAudio,this);this.toggleMuteVideo=f(this.toggleMuteVideo,this);this.off=f(this.off,this);this.on=f(this.on,this);this.chat=f(this.chat,this);this.unregister=f(this.unregister,this);this.hangup=f(this.hangup,this);this.answer=f(this.answer,this);this.call=
f(this.call,this);this.register=f(this.register,this);l.__super__.constructor.apply(this,arguments);this.sipStack=new n({server:this.server,stunServer:this.stunServer,turnServer:this.turnServer,hackViaTCP:this.hackViaTCP,hackIpContact:this.hackIpContact,mediaConstraints:this.mediaConstraints,mediaElements:this.mediaElements,onopen:this.onopen||function(){return!1}})};p(l,Spine.Controller);l.prototype.register=function(a,b,c){return this.sipStack.register(a,b,c)};l.prototype.call=function(a,b){return this.sipStack.call(a,
b)};l.prototype.answer=function(a){return this.sipStack.answer(a)};l.prototype.hangup=function(a){return this.sipStack.hangup(a)};l.prototype.unregister=function(){return this.sipStack.unregister()};l.prototype.chat=function(a,b){return this.sipStack.sendInstantMessage(a,b)};l.prototype.on=function(a,b){return this.sipStack.bind(a,b)};l.prototype.off=function(a,b){if(null!=b)return this.sipStack.unbind(a,b)};l.prototype.toggleMuteVideo=function(){return this.sipStack.rtc.toggleMuteVideo()};l.prototype.toggleMuteAudio=
function(){return this.sipStack.rtc.toggleMuteAudio()};window.API=l}).call(this);
