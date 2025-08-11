var yt=Object.defineProperty;var At=Object.getOwnPropertyDescriptor;var A=(i,t,e,s)=>{for(var r=s>1?void 0:s?At(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&yt(t,e,r),r};var j=globalThis,q=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),rt=new WeakMap,C=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=rt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&rt.set(e,t))}return t}toString(){return this.cssText}},it=i=>new C(typeof i=="string"?i:i+"",void 0,F),K=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new C(e,i,F)},ot=(i,t)=>{if(q)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=j.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Z=q?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return it(e)})(i):i;var{is:bt,defineProperty:xt,getOwnPropertyDescriptor:Et,getOwnPropertyNames:St,getOwnPropertySymbols:wt,getPrototypeOf:Dt}=Object,v=globalThis,nt=v.trustedTypes,Ct=nt?nt.emptyScript:"",Pt=v.reactiveElementPolyfillSupport,P=(i,t)=>i,H={toAttribute(i,t){switch(t){case Boolean:i=i?Ct:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},z=(i,t)=>!bt(i,t),at={attribute:!0,type:String,converter:H,reflect:!1,useDefault:!1,hasChanged:z};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),v.litPropertyMetadata??(v.litPropertyMetadata=new WeakMap);var f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=at){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&xt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=Et(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let h=r?.call(this);o?.call(this,n),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??at}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let t=Dt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let e=this.properties,s=[...St(e),...wt(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(Z(r))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:H).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:H;this._$Em=r;let h=n.fromAttribute(e,o.type);this[r]=h??this._$Ej?.get(r)??h,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){let r=this.constructor,o=this[t];if(s??(s=r.getPropertyOptions(t)),!((s.hasChanged??z)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,h=this[r];n!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,o,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[P("elementProperties")]=new Map,f[P("finalized")]=new Map,Pt?.({ReactiveElement:f}),(v.reactiveElementVersions??(v.reactiveElementVersions=[])).push("2.1.1");var U=globalThis,B=U.trustedTypes,ht=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,mt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+$,Ht=`<${ft}>`,E=document,O=()=>E.createComment(""),M=i=>i===null||typeof i!="object"&&typeof i!="function",et=Array.isArray,Tt=i=>et(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,lt=/>/g,b=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,pt=/"/g,_t=/^(?:script|style|textarea|title)$/i,st=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),_=st(1),zt=st(2),Bt=st(3),S=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ut=new WeakMap,x=E.createTreeWalker(E,129);function gt(i,t){if(!et(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(t):t}var Ut=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=T;for(let h=0;h<e;h++){let a=i[h],l,p,c=-1,m=0;for(;m<a.length&&(n.lastIndex=m,p=n.exec(a),p!==null);)m=n.lastIndex,n===T?p[1]==="!--"?n=ct:p[1]!==void 0?n=lt:p[2]!==void 0?(_t.test(p[2])&&(r=RegExp("</"+p[2],"g")),n=b):p[3]!==void 0&&(n=b):n===b?p[0]===">"?(n=r??T,c=-1):p[1]===void 0?c=-2:(c=n.lastIndex-p[2].length,l=p[1],n=p[3]===void 0?b:p[3]==='"'?pt:dt):n===pt||n===dt?n=b:n===ct||n===lt?n=T:(n=b,r=void 0);let g=n===b&&i[h+1].startsWith("/>")?" ":"";o+=n===T?a+Ht:c>=0?(s.push(l),a.slice(0,c)+mt+a.slice(c)+$+g):a+$+(c===-2?h:g)}return[gt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},k=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,h=t.length-1,a=this.parts,[l,p]=Ut(t,e);if(this.el=i.createElement(l,s),x.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=x.nextNode())!==null&&a.length<h;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(mt)){let m=p[n++],g=r.getAttribute(c).split($),L=/([.?@])?(.*)/.exec(m);a.push({type:1,index:o,name:L[2],strings:g,ctor:L[1]==="."?X:L[1]==="?"?Y:L[1]==="@"?G:D}),r.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:o}),r.removeAttribute(c));if(_t.test(r.tagName)){let c=r.textContent.split($),m=c.length-1;if(m>0){r.textContent=B?B.emptyScript:"";for(let g=0;g<m;g++)r.append(c[g],O()),x.nextNode(),a.push({type:2,index:++o});r.append(c[m],O())}}}else if(r.nodeType===8)if(r.data===ft)a.push({type:2,index:o});else{let c=-1;for(;(c=r.data.indexOf($,c+1))!==-1;)a.push({type:7,index:o}),c+=$.length-1}o++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function w(i,t,e=i,s){if(t===S)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=M(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=w(i,r._$AS(i,t.values),r,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??E).importNode(e,!0);x.currentNode=r;let o=x.nextNode(),n=0,h=0,a=s[0];for(;a!==void 0;){if(n===a.index){let l;a.type===2?l=new R(o,o.nextSibling,this,t):a.type===1?l=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(l=new tt(o,this,t)),this._$AV.push(l),a=s[++h]}n!==a?.index&&(o=x.nextNode(),n++)}return x.currentNode=E,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},R=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),M(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Tt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=k.createElement(gt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Q(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=ut.get(t.strings);return e===void 0&&ut.set(t.strings,e=new k(t)),e}k(t){et(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(O()),this.O(O()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=w(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==S,n&&(this._$AH=t);else{let h=t,a,l;for(t=o[0],a=0;a<o.length-1;a++)l=w(this,h[s+a],e,a),l===S&&(l=this._$AH[a]),n||(n=!M(l)||l!==this._$AH[a]),l===d?t=d:t!==d&&(t+=(l??"")+o[a+1]),this._$AH[a]=l}n&&!r&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends D{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},Y=class extends D{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},G=class extends D{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??d)===S)return;let s=this._$AH,r=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==d&&(s===d||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},tt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Ot=U.litHtmlPolyfillSupport;Ot?.(k,R),(U.litHtmlVersions??(U.litHtmlVersions=[])).push("3.3.1");var vt=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new R(t.insertBefore(O(),o),o,void 0,e??{})}return r._$AI(i),r};var N=globalThis,y=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=vt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,N.litElementHydrateSupport?.({LitElement:y});var Mt=N.litElementPolyfillSupport;Mt?.({LitElement:y});(N.litElementVersions??(N.litElementVersions=[])).push("4.2.1");var $t=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var kt={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:z},Rt=(i=kt,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(h){let a=t.get.call(this);t.set.call(this,h),this.requestUpdate(n,a,i)},init(h){return h!==void 0&&this.C(n,void 0,i,h),h}}}if(s==="setter"){let{name:n}=e;return function(h){let a=this[n];t.call(this,h),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function V(i){return(t,e)=>typeof e=="object"?Rt(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function I(i){return V({...i,state:!0,attribute:!1})}var u=class extends y{constructor(){super(...arguments);this._events=[];this._loading=!1;this._error=null;this._currentDate=new Date}setConfig(e){if(!e||!Array.isArray(e.entities)||e.entities.length===0)throw new Error("entities is required and must list one or more calendar.* entity_ids");this._config={minTime:"06:00:00",maxTime:"22:00:00",slotDuration:"00:30:00",nowIndicator:!0,scrollTime:"07:00:00",slotEventOverlap:!0,cacheMinutes:10,suppressDuplicates:!0,todayOnly:!1,height:520,...e}}connectedCallback(){super.connectedCallback(),this._loadEvents(),this._nowInterval=window.setInterval(()=>{this.requestUpdate()},6e4)}disconnectedCallback(){super.disconnectedCallback(),this._nowInterval&&(clearInterval(this._nowInterval),this._nowInterval=void 0)}render(){if(this._error)return _`
        <ha-card>
          <div class="error">${this._error}</div>
        </ha-card>
      `;if(this._loading)return _`
        <ha-card>
          <div class="loading">Loading events...</div>
        </ha-card>
      `;let e=this._getHours(),s=this._filterTodayEvents(),r=this._getNowPosition();return _`
      <ha-card style="height: ${this._config.height}px">
        ${this._config.todayOnly?_`
          <div class="header">
            <div class="date-display">
              ${this._formatDate(this._currentDate)}
            </div>
          </div>
        `:_`
          <div class="header">
            <button @click=${this._previousDay}>‹</button>
            <div class="date-display">
              ${this._formatDate(this._currentDate)}
            </div>
            <button @click=${this._nextDay}>›</button>
            <button @click=${this._today}>Today</button>
          </div>
        `}
        
        <div class="grid-container">
          <div class="time-grid">
            ${e.map(o=>_`
              <div class="hour-row">
                <div class="hour-label">${this._formatHour(o)}</div>
              </div>
            `)}
            
            <div class="event-container">
              ${s.map(o=>this._renderEvent(o))}
            </div>
            
            ${this._config.nowIndicator&&r!==null?_`
              <div class="now-indicator" style="top: ${r}px"></div>
            `:d}
          </div>
        </div>
      </ha-card>
    `}_renderEvent(e){let s=this._calculateEventPosition(e);return s?_`
      <div
        class="event"
        style="
          top: ${s.top}px;
          height: ${s.height}px;
          background-color: ${e.color||"var(--primary-color)"};
        "
        @click=${()=>this._handleEventClick(e)}
      >
        <div class="event-title">${e.title}</div>
        <div class="event-time">
          ${this._formatTime(e.start)} - ${this._formatTime(e.end)}
        </div>
      </div>
    `:d}_calculateEventPosition(e){let s=parseInt(this._config.minTime.split(":")[0]),r=parseInt(this._config.maxTime.split(":")[0]),o=60,n=e.start.getHours()+e.start.getMinutes()/60,h=e.end.getHours()+e.end.getMinutes()/60;if(h<=s||n>=r)return null;let a=Math.max(n,s),l=Math.min(h,r),p=(a-s)*o,c=Math.max((l-a)*o,20);return{top:p,height:c}}_getNowPosition(){let e=new Date,s=parseInt(this._config.minTime.split(":")[0]),r=parseInt(this._config.maxTime.split(":")[0]),o=e.getHours()+e.getMinutes()/60;return o<s||o>r||!this._isToday(this._currentDate)?null:(o-s)*60}_getHours(){let e=parseInt(this._config.minTime.split(":")[0]),s=parseInt(this._config.maxTime.split(":")[0]),r=[];for(let o=e;o<=s;o++)r.push(o);return r}_formatHour(e){let s=e>=12?"PM":"AM";return`${e>12?e-12:e===0?12:e} ${s}`}_formatTime(e){let s=e.getHours(),r=e.getMinutes(),o=s>=12?"PM":"AM",n=s>12?s-12:s===0?12:s,h=r.toString().padStart(2,"0");return`${n}:${h} ${o}`}_formatDate(e){return e.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}_isToday(e){let s=new Date;return e.toDateString()===s.toDateString()}_filterTodayEvents(){return this._events.filter(e=>new Date(e.start).toDateString()===this._currentDate.toDateString())}async _loadEvents(){if(this.hass){this._loading=!0,this._error=null;try{let e=new Date(this._currentDate);e.setHours(0,0,0,0);let s=new Date(e);s.setDate(s.getDate()+1);let r=[];for(let o of this._config.entities){let n=`calendars/${o}?start=${e.toISOString()}&end=${s.toISOString()}`,h=await this.hass.callApi("GET",n);for(let a of h){let l=new Date(a.start.dateTime||a.start.date||a.start),p=new Date(a.end.dateTime||a.end.date||a.end);a.start.date&&!a.start.dateTime||r.push({title:a.summary||"Untitled",start:l,end:p,color:this._config.colors?.[o],entityId:o})}}this._events=r}catch(e){this._error=e.message||"Failed to load events"}finally{this._loading=!1}}}_handleEventClick(e){let s=new CustomEvent("hass-more-info",{detail:{entityId:e.entityId},bubbles:!0,composed:!0});this.dispatchEvent(s)}_previousDay(){this._currentDate=new Date(this._currentDate),this._currentDate.setDate(this._currentDate.getDate()-1),this._loadEvents()}_nextDay(){this._currentDate=new Date(this._currentDate),this._currentDate.setDate(this._currentDate.getDate()+1),this._loadEvents()}_today(){this._currentDate=new Date,this._loadEvents()}getCardSize(){return 6}static getStubConfig(){return{type:"custom:TimeGridCalendarCard",entities:["calendar.personal"],minTime:"06:00:00",maxTime:"22:00:00"}}};u.styles=K`
    :host {
      display: block;
      --grid-color: var(--divider-color, rgba(128,128,128,.3));
      --now-color: var(--accent-color, var(--primary-color, #03a9f4));
      --header-height: 40px;
      --hour-width: 60px;
    }
    ha-card {
      overflow: hidden;
      height: 100%;
    }
    .header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid var(--grid-color);
      background: var(--card-background-color);
    }
    .header button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      padding: 8px;
      margin: 0 4px;
      border-radius: 4px;
    }
    .header button:hover {
      background: var(--secondary-background-color);
    }
    .date-display {
      flex: 1;
      text-align: center;
      font-weight: 500;
    }
    .grid-container {
      height: calc(100% - var(--header-height));
      overflow-y: auto;
      position: relative;
      background: var(--card-background-color);
    }
    .time-grid {
      position: relative;
      min-height: 100%;
    }
    .hour-row {
      height: 60px;
      border-top: 1px solid var(--grid-color);
      position: relative;
    }
    .hour-row:first-child {
      border-top: none;
    }
    .hour-label {
      position: absolute;
      left: 0;
      top: -10px;
      width: var(--hour-width);
      text-align: center;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .event-container {
      position: absolute;
      left: var(--hour-width);
      right: 0;
      top: 0;
      bottom: 0;
    }
    .event {
      position: absolute;
      left: 0;
      right: 8px;
      background: var(--primary-color);
      color: white;
      padding: 4px;
      border-radius: 4px;
      font-size: 12px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .event:hover {
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 10;
    }
    .event-title {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event-time {
      font-size: 11px;
      opacity: 0.9;
    }
    .now-indicator {
      position: absolute;
      left: var(--hour-width);
      right: 0;
      height: 2px;
      background: var(--now-color);
      pointer-events: none;
      z-index: 5;
    }
    .now-indicator::before {
      content: '';
      position: absolute;
      left: -8px;
      top: -4px;
      width: 10px;
      height: 10px;
      background: var(--now-color);
      border-radius: 50%;
    }
    .loading {
      padding: 20px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      padding: 16px;
      color: var(--error-color);
    }
  `,A([V({attribute:!1})],u.prototype,"hass",2),A([I()],u.prototype,"_events",2),A([I()],u.prototype,"_loading",2),A([I()],u.prototype,"_error",2),A([I()],u.prototype,"_currentDate",2),u=A([$t("time-grid-calendar-card")],u);customElements.get("time-grid-calendar-card")||customElements.define("time-grid-calendar-card",u);export{u as TimeGridCalendarCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
