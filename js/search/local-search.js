class LocalSearch{constructor({path:t="",unescape:e=false,top_n_per_article:n=1}){this.path=t;this.unescape=e;this.top_n_per_article=n;this.isfetched=false;this.datas=null}getIndexByWord(t,i,r=false){const c=[];const a=new Set;if(!r){i=i.toLowerCase()}t.forEach(t=>{if(this.unescape){const o=document.createElement("div");o.innerText=t;t=o.innerHTML}const e=t.length;if(e===0)return;let n=0;let s=-1;if(!r){t=t.toLowerCase()}while((s=i.indexOf(t,n))>-1){c.push({position:s,word:t});a.add(t);n=s+e}});c.sort((t,e)=>{if(t.position!==e.position){return t.position-e.position}return e.word.length-t.word.length});return[c,a]}mergeIntoSlice(t,e,n){let s=n[0];let{position:o,word:i}=s;const r=[];const c=new Set;while(o+i.length<=e&&n.length!==0){c.add(i);r.push({position:o,length:i.length});const a=o+i.length;n.shift();while(n.length!==0){s=n[0];o=s.position;i=s.word;if(a>o){n.shift()}else{break}}}return{hits:r,start:t,end:e,count:c.size}}highlightKeyword(t,e){let n="";let s=e.start;for(const{position:o,length:i}of e.hits){n+=t.substring(s,o);s=o+i;n+=`<mark class="search-keyword">${t.substr(o,i)}</mark>`}n+=t.substring(s,e.end);return n}getResultItems(w){const y=[];this.datas.forEach(({title:t,content:e,url:n})=>{const[s,o]=this.getIndexByWord(w,t);const[i,r]=this.getIndexByWord(w,e);const c=new Set([...o,...r]).size;const a=s.length+i.length;if(a===0)return;const l=[];if(s.length!==0){l.push(this.mergeIntoSlice(0,t.length,s))}let h=[];while(i.length!==0){const g=i[0];const{position:p}=g;const m=Math.max(0,p-20);const f=Math.min(e.length,p+100);h.push(this.mergeIntoSlice(m,f,i))}h.sort((t,e)=>{if(t.count!==e.count){return e.count-t.count}else if(t.hits.length!==e.hits.length){return e.hits.length-t.hits.length}return t.start-e.start});const d=parseInt(this.top_n_per_article,10);if(d>=0){h=h.slice(0,d)}let u="";n=new URL(n,location.origin);n.searchParams.append("highlight",w.join(" "));if(l.length!==0){u+=`<div class="local-search-hit-item"><a href="${n.href}"><span class="search-result-title">${this.highlightKeyword(t,l[0])}</span>`}else{u+=`<div class="local-search-hit-item"><a href="${n.href}"><span class="search-result-title">${t}</span>`}h.forEach(t=>{u+=`<p class="search-result">${this.highlightKeyword(e,t)}...</p></a>`});u+="</div>";y.push({item:u,id:y.length,hitCount:a,includedCount:c})});return y}fetchData(){const e=!this.path.endsWith("json");fetch(this.path).then(t=>t.text()).then(t=>{this.isfetched=true;this.datas=e?[...(new DOMParser).parseFromString(t,"text/xml").querySelectorAll("entry")].map(t=>({title:t.querySelector("title").textContent,content:t.querySelector("content").textContent,url:t.querySelector("url").textContent})):JSON.parse(t);this.datas=this.datas.filter(t=>t.title).map(t=>{t.title=t.title.trim();t.content=t.content?t.content.trim().replace(/<[^>]+>/g,""):"";t.url=decodeURIComponent(t.url).replace(/\/{2,}/g,"/");return t});window.dispatchEvent(new Event("search:loaded"))})}highlightText(e,t,n){const s=e.nodeValue;let o=t.start;const i=[];for(const{position:r,length:c}of t.hits){const a=document.createTextNode(s.substring(o,r));o=r+c;const l=document.createElement("mark");l.className=n;l.appendChild(document.createTextNode(s.substr(r,c)));i.push(a,l)}e.nodeValue=s.substring(o,t.end);i.forEach(t=>{e.parentNode.insertBefore(t,e)})}highlightSearchWords(t){const e=new URL(location.href).searchParams.get("highlight");const s=e?e.split(" "):[];if(!s.length||!t)return;const n=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null);const o=[];while(n.nextNode()){if(!n.currentNode.parentNode.matches("button, select, textarea, .mermaid"))o.push(n.currentNode)}o.forEach(t=>{const[e]=this.getIndexByWord(s,t.nodeValue);if(!e.length)return;const n=this.mergeIntoSlice(0,t.nodeValue.length,e);this.highlightText(t,n,"search-keyword")})}}window.addEventListener("load",()=>{const{path:t,top_n_per_article:e,unescape:n,languages:i}=GLOBAL_CONFIG.localSearch;const r=new LocalSearch({path:t,top_n_per_article:e,unescape:n});const c=document.querySelector("#local-search-input input");const a=document.getElementById("local-search-stats-wrap");const l=document.getElementById("loading-status");const s=()=>{if(!r.isfetched)return;const t=c.value.trim().toLowerCase();if(t!=="")l.innerHTML='<i class="fas fa-spinner fa-pulse"></i>';const e=t.split(/[-\s]+/);const n=document.getElementById("local-search-results");let s=[];if(t.length>0){s=r.getResultItems(e)}if(e.length===1&&e[0]===""){n.classList.add("no-result");n.textContent=""}else if(s.length===0){n.textContent="";a.innerHTML=`<div class="search-result-stats">${i.hits_empty.replace(/\$\{query}/,t)}</div>`}else{s.sort((t,e)=>{if(t.includedCount!==e.includedCount){return e.includedCount-t.includedCount}else if(t.hitCount!==e.hitCount){return e.hitCount-t.hitCount}return e.id-t.id});const o=i.hits_stats.replace(/\$\{hits}/,s.length);n.classList.remove("no-result");n.innerHTML=`<div class="search-result-list">${s.map(t=>t.item).join("")}</div>`;a.innerHTML=`<hr><div class="search-result-stats">${o}</div>`;window.pjax&&window.pjax.refresh(n)}l.textContent=""};let o=false;const h=document.getElementById("search-mask");const d=document.querySelector("#local-search .search-dialog");const u=()=>{if(window.innerWidth<768){d.style.setProperty("--search-height",window.innerHeight+"px")}};const g=()=>{const t=document.body.style;t.width="100%";t.overflow="hidden";btf.animateIn(h,"to_show 0.5s");btf.animateIn(d,"titleScale 0.5s");setTimeout(()=>{c.focus()},300);if(!o){!r.isfetched&&r.fetchData();c.addEventListener("input",s);o=true}document.addEventListener("keydown",function t(e){if(e.code==="Escape"){p();document.removeEventListener("keydown",t)}});u();window.addEventListener("resize",u)};const p=()=>{const t=document.body.style;t.width="";t.overflow="";btf.animateOut(d,"search_close .5s");btf.animateOut(h,"to_hide 0.5s");window.removeEventListener("resize",u)};const m=()=>{document.querySelector("#search-button > .search").addEventListener("click",g)};const f=()=>{document.querySelector("#local-search .search-close-button").addEventListener("click",p);h.addEventListener("click",p);if(GLOBAL_CONFIG.localSearch.preload){r.fetchData()}r.highlightSearchWords(document.getElementById("article-container"))};window.addEventListener("search:loaded",()=>{const t=document.getElementById("loading-database");t.nextElementSibling.style.display="block";t.remove()});m();f();window.addEventListener("pjax:complete",()=>{!btf.isHidden(h)&&p();r.highlightSearchWords(document.getElementById("article-container"));m()})});