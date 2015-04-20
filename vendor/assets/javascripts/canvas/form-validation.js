/** Verify.js - v0.0.1 - 2013/06/12
 * https://github.com/jpillora/verify
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(e,t,i){function n(e,t){function n(){f("ajax error"),t.callback("There has been an error")}function r(){c.prompt(l,!1);for(var e=s.loading[p];e.length;)e.pop().success.apply(t,arguments);s.loaded[p]=arguments}var o={method:"GET",timeout:15e3},u=t._exec,l="GroupRuleExecution"===u.type?u.element.domElem:t.field,h=e.success,d=e.error,c=u.element.options,p=JSON?JSON.stringify(e):a(),m={success:h,error:d||n};if(s.loaded[p]){var g=s.loaded[p],v=m.success;return v.apply(t,g),i}if(s.loading[p]||(s.loading[p]=[]),s.loading[p].push(m),1===s.loading[p].length){c.prompt(l,"Checking...","load");var y={success:r,error:r};u.ajax=$.ajax($.extend(o,e,y))}}function r(e){$.extend(!0,this,e)}(function(t){function n(){this.suppressLog||a("log",this,arguments)}function r(){a("warn",this,arguments)}function s(){a("info",this,arguments)}function a(n,r,s){if(e.console!==i&&e.console.isFake!==!0){var a=t.map(s,h);a[0]=[r.prefix,a[0],r.postfix].join("");var o="boolean"===t.type(a[a.length-1])?a.pop():null;o===!0&&e.console.group(a[0]),a[0]&&null===o&&(e.navigator.userAgent.indexOf("MSIE")>=0?e.console.log(a.join(",")):e.console[n].apply(e.console,a)),o===!1&&e.console.groupEnd()}}function o(e){return{log:function(){n.apply(e,arguments)},warn:function(){r.apply(e,arguments)},info:function(){s.apply(e,arguments)}}}e.console===i&&(e.console={isFake:!0});for(var u=["log","warn","info","group","groupCollapsed","groupEnd"],l=u.length-1;l>=0;l--)e.console[u[l]]===i&&(e.console[u[l]]=t.noop);if(t){var h=function(e){return e},d=function(e){return e=t.extend({},d.defaults,e),o(e)};d.defaults={suppressLog:!1,prefix:"",postfix:""},t.extend(d,o(d.defaults)),t.console===i&&(t.console=d),t.consoleNoConflict=d}})(jQuery);var s={loading:{},loaded:{}},a=function(){return a.curr++};a.curr=1,$.fn.verifyScrollView=function(e){var t=$(this).first();return 1!==t.length?$(this):$(this).verifyScrollTo(t,e)},$.fn.verifyScrollTo=function(e,t,i){"function"==typeof t&&2==arguments.length&&(i=t,t=e);var n=$.extend({scrollTarget:e,offsetTop:50,duration:500,easing:"swing"},t);return this.each(function(){var e=$(this),t="number"==typeof n.scrollTarget?n.scrollTarget:$(n.scrollTarget),r="number"==typeof t?t:t.offset().top+e.scrollTop()-parseInt(n.offsetTop,10);e.animate({scrollTop:r},parseInt(n.duration,10),n.easing,function(){"function"==typeof i&&i.call(this)})})},$.fn.equals=function(e){if($(this).length!==e.length)return!1;for(var t=0,i=$(this).length;i>t;++t)if($(this)[t]!==e[t])return!1;return!0};var o=null;(function(){var e=!1,t=/xyz/.test(function(){})?/\b_super\b/:/.*/;o=function(){},o.extend=function(i){function n(){!e&&this.init&&this.init.apply(this,arguments)}var r=this.prototype;e=!0;var s=new this;e=!1;for(var a in i)s[a]="function"==typeof i[a]&&"function"==typeof r[a]&&t.test(i[a])?function(e,t){return function(){var i=this._super;this._super=r[e];var n=t.apply(this,arguments);return this._super=i,n}}(a,i[a]):i[a];return n.prototype=s,n.prototype.constructor=n,n.extend=arguments.callee,n}})();var u=o.extend({init:function(e,t){this.name=t?t:"Set_"+a(),this.array=[],this.addAll(e)},indexOf:function(e){for(var t=0,i=this.array.length;i>t;++t)if($.isFunction(e)?e(this.get(t)):this.equals(this.get(t),e))return t;return-1},find:function(e){return this.get(this.indexOf(e))||null},get:function(e){return this.array[e]},has:function(e){return!!this.find(e)},add:function(e){return this.has(e)?!1:(this.array.push(e),!0)},addAll:function(e){if(!e)return 0;$.isArray(e)||(e=[e]);for(var t=0,i=0,n=e.length;n>i;++i)this.add(e[i])&&t++;return t},remove:function(e){for(var t=[],i=0,n=this.array.length;n>i;++i)this.equals(this.get(i),e)||t.push(this.get(i));return this.array=t,e},removeAll:function(){this.array=[]},equals:function(e,t){return e&&t&&e.equals!==i&&t.equals!==i?e.equals(t):e===t},each:function(e){for(var t=0,i=this.array.length;i>t;++t)if(e(this.get(t))===!1)return},map:function(e){return $.map(this.array,e)},filter:function(e){return $.grep(this.array,e)},size:function(){return this.array.length},getArray:function(){return this.array}}),l=u.extend({init:function(e,t,i){this.type=e,this._super(t,i)},add:function(e){e instanceof this.type?this._super(e):this.log("add failed - invalid type")}}),h={create:function(e){function t(){}return t.prototype=e,new t},bind:$.proxy,checkOptions:function(e){if(e)for(var t in e)g[t]===i&&p("Invalid option: '"+t+"'")},appendArg:function(e,t,i){i||(i=0);var n=[].slice.call(e,i);return n[i]=t+n[i],n},memoize:function(e){return function(){for(var t=Array.prototype.slice.call(arguments),i="",n=t.length,r=null;n--;)r=t[n],i+=r===Object(r)?JSON.stringify(r):r,e.memoize||(e.memoize={});return i in e.memoize?e.memoize[i]:e.memoize[i]=e.apply(this,t)}},dateToString:function(e){return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()},parseDate:function(e){var t=e.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!t)return null;var n;if($.datepicker!==i)try{var r=$.datepicker.parseDate("dd/mm/yy",e);n=new Date(r)}catch(s){return null}else n=new Date(parseInt(t[3],10),parseInt(t[2],10)-1,parseInt(t[1],10));return n},isRTL:function(e){var i=$(t),n=$("body"),r=e&&e.hasClass("rtl")||e&&"rtl"===(e.attr("dir")||"").toLowerCase()||i.hasClass("rtl")||"rtl"===(i.attr("dir")||"").toLowerCase()||n.hasClass("rtl")||"rtl"===(n.attr("dir")||"").toLowerCase();return Boolean(r)}},d="0.0.1",c=$.consoleNoConflict({prefix:"verify.js: "}),f=c.log,p=c.warn,m=c.info,g={debug:!1,autoInit:!0,validateAttribute:"data-validate",validationEventTrigger:"blur",scroll:!0,focusFirstField:!0,hideErrorOnChange:!1,skipHiddenFields:!0,skipDisabledFields:!0,errorClass:"error",errorContainer:function(e){return e},reskinContainer:function(e){return e},beforeSubmit:function(e,t){return t},track:$.noop,showPrompt:!0,prompt:function(e,t,i){"function"===$.type($.notify)&&(i||(i={color:"red"}),$.notify(e,t,i))}};r.prototype=g;var v=o.extend({name:"Class",toString:function(){return(this.type?this.type+": ":"")+(this.name?this.name+": ":"")},log:function(){g.debug&&f.apply(this,h.appendArg(arguments,""+this))},warn:function(){p.apply(this,h.appendArg(arguments,""+this))},info:function(){m.apply(this,h.appendArg(arguments,""+this))},bind:function(e){var t=this[e];t&&$.isFunction(t)&&(this[e]=h.bind(t,this))},bindAll:function(){for(var e in this)this.bind(e)},nextTick:function(t,i,n){var r=this;return e.setTimeout(function(){t.apply(r,i)},n||0)}}),y=v.extend({init:function(e,t){return this.name=e,$.isPlainObject(t)?(this.type=t.__ruleType,this.extendInterface(t.extend),this.userObj||(this.userObj={}),$.extend(this.userObj,t),this.buildFn(),this.ready=this.fn!==i,i):this.warn("rule definition must be a function or an object")},extendInterface:function(e){if(e&&"string"==typeof e){for(var t,i=e;i;){if(i===this.name)return this.error("Rule already extends '%s'",i);t=b.getRawRule(i),i=t?t.extend:null}var n=b.getRule(e);if(!n)return this.warn("Rule missing '%s'",i);if(this.parent=n,!(n instanceof y))return this.error("Cannot extend: '"+otherName+"' invalid type");this.userObj=h.create(n.userObj),this.userObj.parent=n.userObj}},buildFn:function(){if($.isFunction(this.userObj.fn))this.fn=this.userObj.fn;else{if("regexp"!==$.type(this.userObj.regex))return this.error("Rule has no function");this.fn=function(e){return function(t){var i=RegExp(e);return t.val().match(i)?!0:t.message||"Invalid Format"}}(this.userObj.regex)}},defaultInterface:{log:f,warn:p,ajax:function(e){n(e,this)}},defaultFieldInterface:{val:function(){return this.field.val.apply(this.field,arguments)}},defaultGroupInterface:{val:function(e,t){var n=this.field(e);return n?t===i?n.val():n.val(t):i},field:function(e){var t=$.grep(this._exec.members,function(t){return t.id===e}),i=t.length?t[0].element.domElem:null;return i||this.warn("Cannot find group element with id: '"+e+"'"),i},fields:function(){return $().add($.map(this._exec.members,function(e){return e.element.domElem}))}},buildInterface:function(e){var t=[];return t.push({}),t.push(this.userObj),t.push(this.defaultInterface),"field"===this.type&&(t.push(this.defaultFieldInterface),t.push({field:e.element.domElem})),"group"===this.type&&t.push(this.defaultGroupInterface),t.push({prompt:e.element.options.prompt,form:e.element.form.domElem,callback:e.callback,args:e.args,_exec:e}),$.extend.apply(this,t)}}),b=null;(function(){var e=function(e){for(var t,n,r=e.split(""),s=[],a=0,o=0,u=r.length;u>o;++o){if(t=r[o],"("===t&&a++,")"===t&&a--,a>1)return null;","===t&&1===a&&(r[o]=";")}return 0!==a?null:($.each(r.join("").split(","),function(t,r){return(n=r.match(/^(\w+)(\.(\w+))?(\#(\w+))?(\(([^;\)]+(\;[^;\)]+)*)\))?$/))?(r={},r.name=n[1],n[3]&&(r.scope=n[3]),n[5]&&(r.id=n[5]),r.args=n[7]?n[7].split(";"):[],s.push(r),i):p("Invalid validate attribute: "+e)}),s)},t=h.memoize(e),n={},r={},s=function(e,t){for(var i in t)n[i]&&p("validator '%s' already exists",i),$.isFunction(t[i])&&(t[i]={fn:t[i]}),t[i].__ruleType=e;$.extend(!0,n,t)},a=function(e){s("field",e)},o=function(e){s("group",e)},u=function(e){return n[e]},l=function(e){var t=r[e],i=n[e];return i?t||(t=r[e]=new y(e,i)):p("Missing rule: "+e),t},d=function(e){var i=e.form.options.validateAttribute,n=e.domElem.attr(i);return n?t(n):null},c=function(e){var t=!1,i=null,n=[];return"ValidationField"!==e.type?p("Cannot get rules from invalid type"):e.domElem?(i=this.parseAttribute(e),i&&i.length?($.each(i,function(e,i){/required/.test(i.name)&&(t=!0),i.rule=l(i.name),i.rule&&n.push(i)}),n.required=t,n):n):n};b={addFieldRules:a,addGroupRules:o,getRule:l,getRawRule:u,parseString:e,parseAttribute:d,parseElement:c}})();var x=null;(function(){var e=v.extend({type:"ValidationElement",init:function(e){if(!e||!e.length)throw"Missing Element";return this.domElem=e,this.bindAll(),this.name=this.domElem.attr("name")||this.domElem.attr("id")||a(),this.execution=null,e.data("verify")?!1:(e.data("verify",this),!0)},equals:function(t){var i,n;return this.domElem?(i=this.domElem,t.jquery?n=t:t instanceof e&&t.domElem&&(n=t.domElem),i&&n?i.equals(n):!1):!1}}),n=e.extend({type:"ValidationField",init:function(e,t){this._super(e),this.form=t,this.options=t.options,this.groups=t.groups,this.ruleNames=null,this.touched=!1},validate:function(e){e||(e=$.noop);var t=new w(this);t.execute().done(function(){e(!0)}).fail(function(){e(!1)})},update:function(){this.rules=b.parseElement(this);for(var e=0;this.rules.length>e;++e){var t=this.rules[e];if(t.rule&&"group"===t.rule.type){this.groups[t.name]||(this.groups[t.name]={});var i=t.scope||"default";this.groups[t.name][i]||(this.groups[t.name][i]=new l(n)),this.groups[t.name][i].add(this)}}},handleResult:function(e){var t=this.options,i=t.reskinContainer(this.domElem);if(!i||!i.length)return this.warn("No reskin element found. Check 'reskinContainer' option.");t.showPrompt&&t.prompt(i,e.response);var n=t.errorContainer(i);n&&n.length&&n.toggleClass(t.errorClass,!e.success),this.options.track("Validate",[this.form.name,this.name].join(" "),e.success?"Valid":e.response?'"'+e.response+'"':"Silent Fail")},scrollFocus:function(e){var t=$.noop;this.options.focusFirstField&&(t=function(){e.focus()}),this.options.scroll?e.verifyScrollView(t):this.options.focusFirstField&&field.focus()}});x=e.extend({type:"ValidationForm",init:function(e,s){if(this._super(e),!e.is("form"))throw"Must be a form";this.options=new r(s),this.fields=new l(n),this.groups={},this.fieldByName={},this.invalidFields={},this.fieldHistory={},this.submitResult=i,this.submitPending=!1,this.cache={ruleNames:{},ajax:{loading:{},loaded:{}}},$(t).ready(this.domReady)},extendOptions:function(e){$.extend(!0,this.options,e)},domReady:function(){this.bindEvents(),this.updateFields(),this.log("bound to "+this.fields.size()+" elems")},bindEvents:function(){this.domElem.on("keyup.jqv","input",this.onKeyup).on("blur.jqv","input[type=text]:not(.hasDatepicker),input:not([type].hasDatepicker)",this.onValidate).on("change.jqv","input[type=text].hasDatepicker,select,[type=checkbox],[type=radio]",this.onValidate).on("submit.jqv",this.onSubmit).trigger("initialised.jqv")},unbindEvents:function(){this.domElem.off(".jqv")},updateFields:function(){var e="["+this.options.validateAttribute+"]";this.domElem.find(e).each(this.updateField)},updateField:function(e,t){e.jquery!==i&&(t=e),t.jquery===i&&(t=$(t));var r,s,a="input:not([type=hidden]),select,textarea";return t.is(a)?(s=t,r=this.fields.find(s),r||(r=new n(s,this),this.fields.add(r)),r.update(),r):this.warn("Validators will not work on container elements ("+t.prop("tagName")+"). Please use INPUT, SELECT or TEXTAREA.")},onSubmit:function(e){var t=!1;return this.submitPending&&this.warn("pending..."),this.submitPending||this.submitResult!==i?this.submitResult!==i&&(t=this.options.beforeSubmit.call(this.domElem,e,this.submitResult)):(this.submitPending=!0,this.validate(this.doSubmit)),t||e.preventDefault(),t},doSubmit:function(e){this.log("doSubmit",e),this.submitPending=!1,this.submitResult=e,this.domElem.submit(),this.submitResult=i},onKeyup:function(e){this.options.hideErrorOnChange&&this.options.prompt($(e.currentTarget),null)},onValidate:function(e){var t=$(e.currentTarget),i=t.data("verify")||this.updateField(t);i.log("validate"),i.validate($.noop)},validate:function(e){e||(e=$.noop),this.updateFields();var t=new E(this);t.execute().done(function(){e(!0)}).fail(function(){e(!1)})}})})();var E=null,w=null;(function(){var e={NOT_STARTED:0,RUNNING:1,COMPLETE:2},t=v.extend({type:"Execution",init:function(t,i){this.element=t,t&&(this.prevExec=t.execution,t.execution=this,this.options=this.element.options,this.domElem=t.domElem),this.parent=i,this.name="#"+a(),this.status=e.NOT_STARTED,this.bindAll(),this.d=this.restrictDeferred(),this.d.done(this.executePassed),this.d.fail(this.executeFailed)},isPending:function(){return this.prevExec&&this.prevExec.status!==e.COMPLETE},toString:function(){return this._super()+"["+this.element.name+(this.rule?":"+this.rule.name:"")+"] "},serialize:function(e){var t=this.mapExecutables(e);if(!$.isArray(t)||0===t.length)return this.resolve();var i=t[0](),n=1,r=t.length;if(this.log("SERIALIZE",r),!i||!i.pipe)throw"Invalid Deferred Object";for(;r>n;n++)i=i.pipe(t[n]);return i.done(this.resolve).fail(this.reject),this.d.promise()},parallelize:function(e){function t(e){s++,s===o&&r.resolve(e)}function i(e){u||(u=!0,r.reject(e))}var n=this.mapExecutables(e),r=this,s=0,a=0,o=n.length,u=!1;if(this.log("PARALLELIZE",o),!$.isArray(n)||0===o)return this.resolve();for(;o>a;++a){var l=n[a]();if(!l||!l.done||!l.fail)throw"Invalid Deferred Object";l.done(t).fail(i)}return this.d.promise()},mapExecutables:function(e){return $.map(e,function(e){if($.isFunction(e))return e;if($.isFunction(e.execute))return e.execute;throw"Invalid executable"})},linkPass:function(e){e.d.done(this.resolve)},linkFail:function(e){e.d.fail(this.reject)},link:function(e){this.linkPass(e),this.linkFail(e)},execute:function(){for(var t=this.parent,i=[];t;)i.unshift(t.name),t=t.parent;var n="("+i.join(" < ")+")";return this.log(this.parent?n:"","executing..."),this.status=e.RUNNING,this.domElem&&this.domElem.triggerHandler("validating"),!0},executePassed:function(e){this.success=!0,this.response=this.filterResponse(e),this.executed()},executeFailed:function(e){this.success=!1,this.response=this.filterResponse(e),this.executed()},executed:function(){this.status=e.COMPLETE,this.log((this.success?"Passed":"Failed")+": "+this.response),this.domElem&&this.domElem.triggerHandler("validated",this.success)},resolve:function(e){return this.resolveOrReject(!0,e)},reject:function(e){return this.resolveOrReject(!1,e)},resolveOrReject:function(e,t){var i=e?"__resolve":"__reject";if(!this.d||!this.d[i])throw"Invalid Deferred Object";return this.nextTick(this.d[i],[t],0),this.d.promise()},filterResponse:function(e){return"string"==typeof e?e:null},restrictDeferred:function(e){return e||(e=$.Deferred()),e.__reject=e.reject,e.__resolve=e.resolve,e.reject=e.resolve=function(){console.error("Use execution.resolve|reject()")},e}});E=t.extend({type:"FormExecution",init:function(e){this._super(e),this.ajaxs=[],this.children=this.element.fields.map($.proxy(function(e){return new w(e,this)},this))},execute:function(){return this._super(),this.isPending()?(this.warn("pending... (waiting for %s)",this.prevExec.name),this.reject()):(this.log("exec fields #"+this.children.length),this.parallelize(this.children))}}),w=t.extend({type:"FieldExecution",init:function(e,t){this._super(e,t),t instanceof E&&(this.formExecution=t),e.touched=!0,this.children=[]},execute:function(){if(this._super(),this.isPending())return this.warn("pending... (waiting for %s)",this.prevExec.name),this.reject();var e=b.parseElement(this.element);return this.skip=this.skipValidations(e),this.skip?this.resolve():(this.children=$.map(e,$.proxy(function(e){return"group"===e.rule.type?new r(e,this):new n(e,this)},this)),this.serialize(this.children))},skipValidations:function(e){return 0===e.length?(this.log("skip (no validators)"),!0):e.required||$.trim(this.domElem.val())?this.options.skipHiddenFields&&this.options.reskinContainer(this.domElem).is(":hidden")?(this.log("skip (hidden)"),!0):this.options.skipDisabledFields&&this.domElem.is("[disabled]")?(this.log("skip (disabled)"),!0):!1:(this.warn("skip (not required)"),!0)},executed:function(){this._super();var e,t=this,i=this.children;for(e=0;i.length>e;++e)if(i[e].success===!1){t=i[e];break}this.element.handleResult(t)}});var n=t.extend({type:"RuleExecution",init:function(e,t){this._super(null,t),this.rule=e.rule,this.args=e.args,this.element=this.parent.element,this.options=this.element.options,this.rObj={}},callback:function(e){clearTimeout(this.t),this.callbackCount++,this.log(this.rule.name+" (cb:"+this.callbackCount+"): "+e),this.callbackCount>1||(e===i&&this.warn("Undefined result"),e===!0?this.resolve(e):this.reject(e))},timeout:function(){this.warn("timeout!"),this.callback("Timeout")},execute:function(){if(this._super(),this.callbackCount=0,!this.element||!this.rule.ready)return this.warn(this.element?"not  ready.":"invalid parent."),this.resolve();this.t=setTimeout(this.timeout,1e4),this.r=this.rule.buildInterface(this);var e;try{e=this.rule.fn(this.r)}catch(t){e=!0,console.error("Error caught in validation rule: '"+this.rule.name+"', skipping.\nERROR: "+(""+t)+"\nSTACK:"+t.stack)}return e!==i&&this.nextTick(this.callback,[e]),this.d.promise()}}),r=n.extend({type:"GroupRuleExecution",init:function(e,t){if(this._super(e,t),this.groupName=e.name,this.id=e.id,this.scope=e.scope||"default",this.group=this.element.groups[this.groupName][this.scope],!this.group)throw"Missing Group Set";1===this.group.size()&&this.warn("Group only has 1 field. Consider a field rule.")},execute:function(){var t,n,r,s=this.group.exec,a=this.parent,o=a&&a.parent,u=!o,l=o instanceof E,h=!1;if(s&&s.status!==e.COMPLETE){for(this.members=s.members,t=0;this.members.length>t;++t)this.element===this.members[t].element&&(h=!0);if(h)return this.log("ALREADY A MEMBER OF %s",s.name),this.reject(),i;this.log("SLAVE TO %s",s.name),this.members.push(this),this.link(s),this.parent&&s.linkFail(this.parent)}else this.log("MASTER"),this.members=[this],this.executeGroup=this._super,s=this.group.exec=this,l&&s.linkFail(o);if(u)for(t=0;this.group.size()>t;++t)if(n=this.group.get(t),this.element!==n){if(this.log("CHECK:",n.name),!n.touched)return this.log("FIELD NOT READY: ",n.name),this.reject();r=n.execution,r&&r.status!==e.COMPLETE&&r.reject(),this.log("STARTING ",n.name),r=new w(n,this),r.execute()}var d=this.group.size(),c=s.members.length;return d===c&&s.status===e.NOT_STARTED?(s.log("RUN"),s.executeGroup()):this.log("WAIT ("+c+"/"+d+")"),this.d.promise()},filterResponse:function(e){if(!e||!this.members.length)return this._super(e);var t=$.isPlainObject(e),i="string"==typeof e;return i&&this===this.group.exec?e:t&&e[this.id]?e[this.id]:null}})})(),$.fn.validate=function(e){var t=$(this).data("verify");t?t.validate(e):p("element does not have verifyjs attached")},$.fn.validate.version=d,$.fn.verify=function(e){return this.each(function(){var t=$.verify.forms.find($(this));return e===!1||"destroy"===e?(t&&(t.unbindEvents(),$.verify.forms.remove(t)),i):(h.checkOptions(e),t?(t.extendOptions(e),t.updateFields()):(t=new x($(this),e),$.verify.forms.add(t)),i)})},$.verify=function(e){h.checkOptions(e),$.extend(g,e)},$.extend($.verify,{version:d,updateRules:b.updateRules,addRules:b.addFieldRules,addFieldRules:b.addFieldRules,addGroupRules:b.addGroupRules,log:m,warn:p,defaults:g,globals:g,utils:h,forms:new l(x,[],"FormSet"),_hidden:{ruleManager:b}}),$(function(){g.autoInit&&$("form").filter(function(){return $(this).find("["+g.validateAttribute+"]").length>0}).verify()}),f("plugin added."),function(t){return t.verify===i?(e.alert("Please include verify.js before each rule file"),i):(t.verify.addFieldRules({currency:{regex:/^\-?\$?\d{1,2}(,?\d{3})*(\.\d+)?$/,message:"Invalid monetary value"},email:{regex:/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:"Invalid email address"},url:{regex:/^https?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/,message:"Invalid URL"},alphanumeric:{regex:/^[0-9A-Za-z]+$/,message:"Use digits and letters only"},street_number:{regex:/^\d+[A-Za-z]?(-\d+)?[A-Za-z]?$/,message:"Street Number only"},number:{regex:/^\d+$/,message:"Use digits only"},numberSpace:{regex:/^[\d\ ]+$/,message:"Use digits and spaces only"},postcode:{regex:/^\d{4}$/,message:"Invalid postcode"},date:{fn:function(e){return t.verify.utils.parseDate(e.val())?!0:e.message},message:"Invalid date"},required:{fn:function(e){return e.requiredField(e,e.field)},requiredField:function(e,i){var n=i.val();switch(i.prop("type")){case"radio":case"checkbox":var r=i.attr("name"),s=i.data("fieldGroup");if(s||(s=e.form.find("input[name='"+r+"']"),i.data("fieldGroup",s)),s.is(":checked"))break;return 1===s.size()?e.messages.single:e.messages.multiple;default:if(!t.trim(n))return e.messages.all}return!0},messages:{all:"This field is required",multiple:"Please select an option",single:"This checkbox is required"}},regex:{fn:function(e){var t;try{var i=e.args[0];t=RegExp(i)}catch(n){return e.warn("Invalid regex: "+i),!0}return e.val().match(t)?!0:e.args[1]||e.message},message:"Invalid format"},pattern:{extend:"regex"},asyncTest:function(e){e.prompt(e.field,"Please wait..."),setTimeout(function(){e.callback()},2e3)},phone:function(e){e.val(e.val().replace(/\D/g,""));var t=e.val();return t.match(/^\+?[\d\s]+$/)?t.match(/^\+/)?!0:t.match(/^0/)?10!==t.replace(/\s/g,"").length?"Must be 10 digits long":!0:"Number must start with 0":"Use digits and spaces only"},size:function(e){var t=e.val(),n=e.args[0],r=e.args[1];if(n!==i&&r===i){var s=parseInt(n,10);if(e.val().length!==s)return"Must be "+s+" characters"}else if(n!==i&&r!==i){var a=parseInt(n,10);if(r=parseInt(r,10),a>t.length||t.length>r)return"Must be between "+a+" and "+r+" characters"}else e.warn("size validator parameter error on field: "+e.field.attr("name"));return!0},min:function(e){var t=e.val(),i=parseInt(e.args[0],10);return i>t.length?"Must be at least "+i+" characters":!0},max:function(e){var t=e.val(),i=parseInt(e.args[0],10);return t.length>i?"Must be at most "+i+" characters":!0},decimal:function(e){var t=e.val(),i=e.args[0]?parseInt(e.args[0],10):2;if(!t.match(/^\d+(,\d{3})*(\.\d+)?$/))return"Invalid decimal value";var n=parseFloat(t.replace(/[^\d\.]/g,"")),r=Math.pow(10,i);return n=Math.round(n*r)/r,e.field.val(n),!0},minVal:function(e){var t=parseFloat(e.val().replace(/[^\d\.]/g,"")),i=e.args[1]||"",n=parseFloat(e.args[0]);return n>t?"Must be greater than "+n+i:!0},maxVal:function(e){var t=parseFloat(e.val().replace(/[^\d\.]/g,"")),i=e.args[1]||"",n=parseFloat(e.args[0]);return t>n?"Must be less than "+n+i:!0},rangeVal:function(e){var t=parseFloat(e.val().replace(/[^\d\.]/g,"")),i=e.args[2]||"",n=e.args[3]||"",r=parseFloat(e.args[0]),s=parseFloat(e.args[1]);return t>s||r>t?"Must be between "+i+r+n+"\nand "+i+s+n:!0},agreement:function(e){return e.field.is(":checked")?!0:"You must agree to continue"},minAge:function(e){var i=parseInt(e.args[0],10);if(!i||isNaN(i))return console.log("WARNING: Invalid Age Param: "+i),!0;new Date;var n=new Date;n.setFullYear(n.getFullYear()-i);var r=t.verify.utils.parseDate(e.val());return"Invalid Date"===r?"Invalid Date":r>n?"You must be at least "+i:!0}}),t.verify.addGroupRules({dateRange:function(e){var i=e.field("start"),n=e.field("end");if(0===i.length||0===n.length)return e.warn("Missing dateRange fields, skipping..."),!0;var r=t.verify.utils.parseDate(i.val());if(!r)return"Invalid Start Date";var s=t.verify.utils.parseDate(n.val());return s?r>=s?"Start Date must come before End Date":!0:"Invalid End Date"},requiredAll:{extend:"required",fn:function(e){var i,n=(e.fields().length,[]),r=[];return e.fields().each(function(t,s){i=e.requiredField(e,s),i===!0?n.push(s):r.push({field:s,message:i})}),n.length>0&&r.length>0?(t.each(r,function(t,i){e.prompt(i.field,i.message)}),!1):!0}}}),i)}(jQuery)})(window,document);