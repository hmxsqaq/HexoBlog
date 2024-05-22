const btf={debounce:function(i,a,s){let r;return function(){const t=this;const e=arguments;const n=function(){r=null;if(!s)i.apply(t,e)};const o=s&&!r;clearTimeout(r);r=setTimeout(n,a);if(o)i.apply(t,e)}},throttle:function(n,o,i){let a,s,r;let c=0;if(!i)i={};const l=function(){c=i.leading===false?0:(new Date).getTime();a=null;n.apply(s,r);if(!a)s=r=null};const t=function(){const t=(new Date).getTime();if(!c&&i.leading===false)c=t;const e=o-(t-c);s=this;r=arguments;if(e<=0||e>o){if(a){clearTimeout(a);a=null}c=t;n.apply(s,r);if(!a)s=r=null}else if(!a&&i.trailing!==false){a=setTimeout(l,e)}};return t},sidebarPaddingR:()=>{const t=window.innerWidth;const e=document.body.clientWidth;const n=t-e;if(t!==e){document.body.style.paddingRight=n+"px"}},snackbarShow:(t,e=false,n=2e3)=>{const{position:o,bgLight:i,bgDark:a}=GLOBAL_CONFIG.Snackbar;const s=document.documentElement.getAttribute("data-theme")==="light"?i:a;Snackbar.show({text:t,backgroundColor:s,showAction:e,duration:n,pos:o,customClass:"snackbar-css"})},diffDate:(t,e=false)=>{const n=new Date;const o=new Date(t);const i=n.getTime()-o.getTime();const a=1e3*60;const s=a*60;const r=s*24;const c=r*30;const{dateSuffix:l}=GLOBAL_CONFIG;if(!e)return parseInt(i/r);const d=i/c;const f=i/r;const u=i/s;const m=i/a;if(d>12)return o.toISOString().slice(0,10);if(d>=1)return`${parseInt(d)} ${l.month}`;if(f>=1)return`${parseInt(f)} ${l.day}`;if(u>=1)return`${parseInt(u)} ${l.hour}`;if(m>=1)return`${parseInt(m)} ${l.min}`;return l.just},loadComment:(t,e)=>{if("IntersectionObserver"in window){const n=new IntersectionObserver(t=>{if(t[0].isIntersecting){e();n.disconnect()}},{threshold:[0]});n.observe(t)}else{e()}},scrollToDest:(o,i=500)=>{const a=window.pageYOffset;const t=document.getElementById("page-header").classList.contains("fixed");if(a>o||t)o=o-70;if("scrollBehavior"in document.documentElement.style){window.scrollTo({top:o,behavior:"smooth"});return}let s=null;o=+o;window.requestAnimationFrame(function t(e){s=!s?e:s;const n=e-s;if(a<o){window.scrollTo(0,(o-a)*n/i+a)}else{window.scrollTo(0,a-(a-o)*n/i)}if(n<i){window.requestAnimationFrame(t)}else{window.scrollTo(0,o)}})},animateIn:(t,e)=>{t.style.display="block";t.style.animation=e},animateOut:(e,t)=>{e.addEventListener("animationend",function t(){e.style.display="";e.style.animation="";e.removeEventListener("animationend",t)});e.style.animation=t},getParents:(t,e)=>{for(;t&&t!==document;t=t.parentNode){if(t.matches(e))return t}return null},siblings:(e,n)=>{return[...e.parentNode.children].filter(t=>{if(n){return t!==e&&t.matches(n)}return t!==e})},wrap:(t,e,n)=>{const o=document.createElement(e);for(const[i,a]of Object.entries(n)){o.setAttribute(i,a)}t.parentNode.insertBefore(o,t);o.appendChild(t)},unwrap:t=>{const e=t.parentNode;if(e&&e!==document.body){e.replaceChild(t,e)}},isHidden:t=>t.offsetHeight===0&&t.offsetWidth===0,getEleTop:t=>{let e=t.offsetTop;let n=t.offsetParent;while(n!==null){e+=n.offsetTop;n=n.offsetParent}return e},loadLightbox:t=>{const e=GLOBAL_CONFIG.lightbox;if(e==="mediumZoom"){mediumZoom(t,{background:"var(--zoom-bg)"})}if(e==="fancybox"){t.forEach(t=>{if(t.parentNode.tagName!=="A"){const e=t.dataset.lazySrc||t.src;const n=t.title||t.alt||"";btf.wrap(t,"a",{href:e,"data-fancybox":"gallery","data-caption":n,"data-thumb":e})}});if(!window.fancyboxRun){Fancybox.bind("[data-fancybox]",{Hash:false,Thumbs:{showOnStart:false},Images:{Panzoom:{maxScale:4}},Carousel:{transition:"slide"},Toolbar:{display:{left:["infobar"],middle:["zoomIn","zoomOut","toggle1to1","rotateCCW","rotateCW","flipX","flipY"],right:["slideshow","thumbs","close"]}}});window.fancyboxRun=true}}},initJustifiedGallery:function(t){const e=t=>{if(!btf.isHidden(t)){fjGallery(t,{itemSelector:".fj-gallery-item",rowHeight:t.getAttribute("data-rowHeight"),gutter:4,onJustify:function(){this.$container.style.opacity="1"}})}};if(Array.from(t).length===0)e(t);else t.forEach(t=>{e(t)})},updateAnchor:t=>{if(t!==window.location.hash){if(!t)t=location.pathname;const e=GLOBAL_CONFIG_SITE.title;window.history.replaceState({url:location.href,title:e},e,t)}},getScrollPercent:(t,e)=>{const n=e.clientHeight;const o=document.documentElement.clientHeight;const i=e.offsetTop;const a=n>o?n-o:document.documentElement.scrollHeight-o;const s=(t-i)/a;const r=Math.round(s*100);const c=r>100?100:r<=0?0:r;return c},addModeChange:(t,e)=>{if(window.themeChange&&window.themeChange[t])return;window.themeChange={...window.themeChange,[t]:e}}};