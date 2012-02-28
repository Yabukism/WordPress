if(typeof wp==="undefined"){var wp={}}(function(a,e){var c,h,d,g,b,f=Array.prototype.slice;h=function(i,j){var k=g(this,i,j);k.extend=this.extend;return k};d=function(){};g=function(j,i,k){var l;if(i&&i.hasOwnProperty("constructor")){l=i.constructor}else{l=function(){var m=j.apply(this,arguments);return m}}e.extend(l,j);d.prototype=j.prototype;l.prototype=new d();if(i){e.extend(l.prototype,i)}if(k){e.extend(l,k)}l.prototype.constructor=l;l.__super__=j.prototype;return l};b=e.Callbacks("once memory");c={};c.Class=function(m,l,j){var k,i=arguments;if(m&&l&&c.Class.applicator===m){i=l;e.extend(this,j||{})}k=this;if(this.instance){k=function(){return k.instance.apply(k,arguments)};e.extend(k,this)}k.initialize.apply(k,i);return k};c.Class.applicator={};c.Class.prototype.initialize=function(){};c.Class.prototype.extended=function(i){var j=this;while(typeof j.constructor!=="undefined"){if(j.constructor===i){return true}if(typeof j.constructor.__super__==="undefined"){return false}j=j.constructor.__super__}return false};c.Class.extend=h;c.Value=c.Class.extend({initialize:function(j,i){this._value=j;this.callbacks=e.Callbacks();e.extend(this,i||{})},instance:function(){return arguments.length?this.set.apply(this,arguments):this.get()},get:function(){return this._value},set:function(j){var i=this._value;j=this.validate(j);if(null===j||this._value===j){return this}this._value=j;this.callbacks.fireWith(this,[j,i]);return this},validate:function(i){return i},bind:function(i){this.callbacks.add.apply(this.callbacks,arguments);return this},unbind:function(i){this.callbacks.remove.apply(this.callbacks,arguments);return this},link:function(){var k=f.call(arguments),n=k.pop(),i=this,m,j,l;if(this.links){this.unlink()}this.links=[];if(!k.length){k=[n];n=function(o,p){return p}}while(j=k.shift()){if(this._parent&&e.type(j)=="string"){this.links.push(this._parent[j])}else{this.links.push(j)}}m=function(){var p,o;if(l){return i.set.original.apply(i,arguments)}l=true;p=i.links.concat(f.call(arguments));o=n.apply(i,p);l=false;if(typeof o!=="undefined"){i.set.original.call(i,o)}};m.original=this.set;this.set=m;e.each(this.links,function(o,p){p.bind(i.set)});this.set(this.get());return this},unlink:function(){var i=this.set;e.each(this.links,function(j,k){k.unbind(i)});delete this.links;this.set=this.set.original;return this}});c.ensure=function(i){return typeof i=="string"?e(i):i};sync={val:{update:function(){this.element[this._updater](this._value)},refresh:function(){this.set(this.element[this._refresher]())}}};c.Element=c.Value.extend({initialize:function(j,i){var l=c.Element.synchronizer.html,k;this.element=c.ensure(j);this.events="";if(this.element.is("input, select, textarea")){this.events+="change";l=c.Element.synchronizer.val;if(this.element.is("input")){k=this.element.prop("type");if(c.Element.synchronizer[k]){l=c.Element.synchronizer[k]}if("text"===k||"password"===k){this.events+=" keyup"}}}c.Value.prototype.initialize.call(this,null,e.extend(i||{},l));this._value=this.get();this.bind(this.update);this.refresh=e.proxy(this.refresh,this);this.element.bind(this.events,this.refresh)},find:function(i){return e(i,this.element)},refresh:function(){},update:function(){}});c.Element.synchronizer={};e.each(["html","val"],function(j,k){c.Element.synchronizer[k]={update:function(i){this.element[k](i)},refresh:function(){this.set(this.element[k]())}}});c.Element.synchronizer.checkbox={update:function(i){this.element.prop("checked",i)},refresh:function(){this.set(this.element.prop("checked"))}};c.Element.synchronizer.radio={update:function(i){this.element.filter(function(){return this.value===i}).prop("checked",true)},refresh:function(){this.set(this.element.filter(":checked").val())}};c.ValueFactory=function(i){i=i||c.Value;return function(k){var j=f.call(arguments,1);this[k]=new i(c.Class.applicator,j);this[k]._parent=this;return this[k]}};c.Values=c.Value.extend({defaultConstructor:c.Value,initialize:function(i){c.Value.prototype.initialize.call(this,{},i||{})},instance:function(i){return this.value(i)},value:function(i){return this._value[i]},has:function(i){return typeof this._value[i]!=="undefined"},add:function(j,i){if(this.has(j)){return}this._value[j]=i;this._value[j]._parent=this._value;return this._value[j]},set:function(i){if(this.has(i)){return this.pass("set",arguments)}return this.add(i,new this.defaultConstructor(c.Class.applicator,f.call(arguments,1)))},remove:function(i){delete this._value[i]},pass:function(j,i){var l,k;i=f.call(i);l=i.shift();if(!this.has(l)){return}k=this.value(l);return k[j].apply(k,i)}});e.each(["get","bind","unbind","link","unlink"],function(j,k){c.Values.prototype[k]=function(){return this.pass(k,arguments)}});c.Messenger=c.Class.extend({add:c.ValueFactory(),initialize:function(j,i){e.extend(this,i||{});this.add("url",j);this.add("origin").link("url",function(k){return k().replace(/([^:]+:\/\/[^\/]+).*/,"$1")});this.topics={};e.receiveMessage(e.proxy(this.receive,this),this.origin()||null)},receive:function(j){var i;console.log("messenger receiveMessage",arguments);i=JSON.parse(j.data);if(i&&i.id&&i.data&&this.topics[i.id]){this.topics[i.id].fireWith(this,[i.data])}},send:function(k,j){var i;if(!this.url()){return}console.log("sending message",k,j);i=JSON.stringify({id:k,data:j});e.postMessage(i,this.url(),this.targetWindow||null)},bind:function(k,j){var i=this.topics[k]||(this.topics[k]=e.Callbacks());i.add(j)},unbind:function(j,i){if(this.topics[j]){this.topics[j].remove(i)}}});c=e.extend(new c.Values(),c);a.customize=c})(wp,jQuery);