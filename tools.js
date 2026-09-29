(function(){
'use strict';
var d=document;function $(s,c){return (c||d).querySelector(s)}function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
function money(n){return '$'+Math.round(n).toLocaleString('en-US')}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

/* ---------- 1. Deal calculator ---------- */
var dc=$('#dealcalc');
if(dc){
  var q=$('#dq',dc),j=$('#dj',dc),x=$('#dx',dc),w=$('#dw',dc),out=$('#dout',dc),svgBox=$('#dchart',dc);
  function line(quote){var W=640,H=260,P={l:60,r:16,t:16,b:40},mx=Math.max(quote,99*48)*1.1,sx=(W-P.l-P.r)/48;
    function y(v){return H-P.b-(H-P.t-P.b)*v/mx}
    var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Upfront cost versus subscribe-to-own over 48 months">';
    for(var g=0;g<=4;g++){var gy=P.t+(H-P.t-P.b)*g/4,v=mx*(1-g/4);s+='<line x1="'+P.l+'" x2="'+(W-P.r)+'" y1="'+gy+'" y2="'+gy+'" stroke="#eee2d6"/><text x="'+(P.l-8)+'" y="'+(gy+4)+'" text-anchor="end" font-size="12" fill="#6b7280">$'+(v>=1000?(v/1000).toFixed(v<10000?1:0)+'K':Math.round(v))+'</text>'}
    [0,12,24,36,48].forEach(function(m){s+='<text x="'+(P.l+m*sx)+'" y="'+(H-P.b+20)+'" text-anchor="middle" font-size="12" fill="#374151">'+(m?m+' mo':'Start')+'</text>'});
    s+='<polyline points="'+P.l+','+y(quote)+' '+(W-P.r)+','+y(quote)+'" fill="none" stroke="#1B1F2A" stroke-width="4" stroke-dasharray="8 6"/>';
    var pts=[];for(var m=0;m<=48;m++)pts.push((P.l+m*sx).toFixed(1)+','+y(99*m).toFixed(1));
    s+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#C8452C" stroke-width="5" stroke-linecap="round"/>';
    s+='<rect x="'+(P.l+8)+'" y="'+(H-14)+'" width="14" height="6" fill="#1B1F2A"/><text x="'+(P.l+28)+'" y="'+(H-8)+'" font-size="12">Upfront build, paid on day one</text><rect x="'+(P.l+250)+'" y="'+(H-14)+'" width="14" height="6" fill="#C8452C"/><text x="'+(P.l+270)+'" y="'+(H-8)+'" font-size="12">$99/mo subscribe-to-own, paid as you go</text></svg>';
    svgBox.innerHTML=s;}
  function calc(){var Q=+q.value,J=+j.value,X=+x.value,Wm=+w.value;
    $('#dqv',dc).textContent=money(Q);$('#djv',dc).textContent=money(J);$('#dxv',dc).textContent=X;$('#dwv',dc).textContent=Wm+(Wm===1?' month':' months');
    var kept=Q-99,waitLoss=J*X*Wm,t24=99*24,t36=99*36,t48=99*48;
    out.innerHTML='<div class="grid g2"><div><span class="src">Cash that stays in your business on day one</span><div class="big">'+money(Math.max(0,kept))+'</div></div><div><span class="src">Your estimate of what waiting '+Wm+' mo could cost</span><div class="big" style="color:#C8452C">'+money(waitLoss)+'</div></div></div><p class="note" style="margin-top:12px">Subscribe-to-own totals: 24 months '+money(t24)+' &middot; 36 months '+money(t36)+' &middot; 48 months '+money(t48)+'. The buyout option opens between years two and four at a fair market value we set once the site is working for you. The "waiting" number is simple math on your own inputs (jobs &times; job value &times; months), not a prediction.</p>';
    line(Q);}
  [q,j,x,w].forEach(function(i){i.addEventListener('input',calc)});calc();
}

/* ---------- 2. Website cost calculator ---------- */
var cc=$('#costcalc');
if(cc){
  var base={diy:[72,360],std:[3500,8500],custom:[6000,18000],dom:[20000,50000]};
  function ccalc(){var t=$('input[name=ctype]:checked',cc).value,p=+$('#cpages',cc).value,feats=$$('input[name=cf]:checked',cc).map(function(i){return i.value}),content=$('#ccontent',cc).value;
    $('#cpv',cc).textContent=p;
    var lo=base[t][0],hi=base[t][1];
    if(t!=='diy'){var extra=Math.max(0,p-8);lo+=extra*150;hi+=extra*450;
      feats.forEach(function(f){var add={shop:[1500,6000],book:[500,2500],bot:[1000,10000],tools:[1500,8000],ml:[1000,4000],blog:[300,1500]}[f];if(add){lo+=add[0];hi+=add[1]}});
      if(content==='we'){lo+=p*100;hi+=p*350}}
    var r=$('#cout',cc),path={diy:'DIY drag-and-drop builder',std:'Standard WordPress or Shopify build',custom:'Custom-coded site',dom:'Market-domination build (automation, sales-trained bot, tools)'}[t];
    var y1=t==='diy'?'Around '+money(lo)+' to '+money(hi)+' a year':money(lo)+' to '+money(hi)+' upfront';
    r.innerHTML='<span class="src">'+path+' &middot; typical market range</span><div class="big">'+y1+'</div>'+
      (t==='diy'?'<p>You build it yourself. Our DIY builder at buyweburl.com starts at $5.99/mo.</p>':'<p><b>Or skip the big check:</b> custom-coded sites start at <b>$99/mo</b> on our subscribe-to-own program, with a buyout option in years two through four. Bigger builds run a higher monthly, quoted after a short call.</p>')+
      '<p class="note">Ranges are a planning estimate built from published local pricing (standard small-business sites commonly run $3,500 to $8,500 in Colorado Springs) plus typical add-on costs. They are not a quote.</p>';
    var bars=$('#cbars',cc),mx=hi*1.05,rows=[['Low end',lo,'#FFC53D'],['High end',hi,'#C8452C'],['Subscribe-to-own, first year',t==='diy'?0:1188,'#1F8A5B']];
    bars.innerHTML=rows.map(function(rw){return '<div style="margin:8px 0"><div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700"><span>'+rw[0]+'</span><span>'+(rw[1]?money(rw[1]):'n/a')+'</span></div><div style="height:14px;background:#f3ebe2;border-radius:8px;overflow:hidden"><div style="height:100%;width:'+Math.max(1,rw[1]/mx*100)+'%;background:'+rw[2]+';border-radius:8px;transition:width .6s"></div></div></div>'}).join('');}
  $$('input,select',cc).forEach(function(i){i.addEventListener('input',ccalc);i.addEventListener('change',ccalc)});ccalc();
}

/* ---------- PSI helper ---------- */
function normUrl(u){u=(u||'').trim();if(!u)return '';if(!/^https?:\/\//i.test(u))u='https://'+u;try{var x=new URL(u);if(!/\./.test(x.hostname))return '';return x.href}catch(e){return ''}}
function psi(url,cats){var q='https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&url='+encodeURIComponent(url)+cats.map(function(c){return '&category='+c}).join('');
  return fetch(q).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()})}
function gauge(el,score){var pct=Math.max(0,Math.min(100,score)),col=pct>=90?'#1F8A5B':pct>=50?'#FF8A3D':'#C8452C',len=283;
  el.innerHTML='<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="Score '+pct+'"><circle cx="60" cy="60" r="45" fill="none" stroke="#f1e8de" stroke-width="12"/><circle cx="60" cy="60" r="45" fill="none" stroke="'+col+'" stroke-width="12" stroke-linecap="round" stroke-dasharray="'+len+'" stroke-dashoffset="'+len+'" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1.4s ease-out"/><text x="60" y="68" text-anchor="middle" font-family="Unbounded,system-ui,sans-serif" font-weight="800" font-size="30" fill="'+col+'">'+pct+'</text></svg>';
  var c=el.querySelectorAll('circle')[1];requestAnimationFrame(function(){requestAnimationFrame(function(){c.style.strokeDashoffset=len*(1-pct/100)})});}

/* ---------- 3. Speed test ---------- */
var st=$('#speedtest');
if(st){
  var form=$('form',st),res=$('#sres',st);
  form.addEventListener('submit',function(e){e.preventDefault();var url=normUrl($('#surl',st).value);if(!url){res.innerHTML='<p class="fmsg err">Enter a full web address, like yourbusiness.com</p>';return}
    res.innerHTML='<div class="out"><p><b>Running Google\'s mobile test on '+esc(url)+'...</b> This takes 15 to 40 seconds because it really loads your page on a simulated phone.</p><div class="sbar" style="height:10px;background:#f3ebe2;border-radius:6px;overflow:hidden"><div style="height:100%;width:8%;background:linear-gradient(90deg,#2E8BFF,#7B5CFF);animation:sload 30s linear forwards"></div></div></div><style>@keyframes sload{to{width:92%}}</style>';
    psi(url,['performance']).then(function(j){
      var lr=j.lighthouseResult,a=lr.audits,sc=Math.round((lr.categories.performance.score||0)*100);
      function m(k){return a[k]?a[k].displayValue||'':'n/a'}
      var lcp=a['largest-contentful-paint']?a['largest-contentful-paint'].numericValue/1000:0,tbt=a['total-blocking-time']?a['total-blocking-time'].numericValue:0,cls=a['cumulative-layout-shift']?a['cumulative-layout-shift'].numericValue:0;
      var plain=[];
      plain.push(lcp<=2.5?'Your main content shows up fast enough (LCP '+m('largest-contentful-paint')+').':'Your main content takes '+m('largest-contentful-paint')+' to appear on a phone. Google\'s "good" line is 2.5 seconds, and every extra second is a chance for a visitor to hit back.');
      plain.push(tbt<=200?'The page responds to taps without much lag.':'The page is busy running scripts (blocking time '+m('total-blocking-time')+'), so taps can feel sticky.');
      plain.push(cls<=.1?'The layout stays put while loading.':'Things jump around while loading (layout shift '+m('cumulative-layout-shift')+'), which causes mis-taps.');
      var field='';if(j.loadingExperience&&j.loadingExperience.overall_category){field='<p class="note">Real-visitor data from Chrome users rates this page: <b>'+esc(j.loadingExperience.overall_category.toLowerCase())+'</b>.</p>'}
      res.innerHTML='<div class="out"><div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap"><div class="gauge"></div><div><span class="src">Google Lighthouse mobile performance</span><div class="big">'+sc+' / 100</div><p class="note">First paint '+m('first-contentful-paint')+' &middot; Largest paint '+m('largest-contentful-paint')+' &middot; Blocking '+m('total-blocking-time')+' &middot; Shift '+m('cumulative-layout-shift')+' &middot; Speed index '+m('speed-index')+'</p></div></div><ul>'+plain.map(function(p){return '<li>'+p+'</li>'}).join('')+'</ul>'+field+'</div>';
      gauge($('.gauge',res),sc);
    }).catch(function(){res.innerHTML='<div class="out"><p><b>Google\'s free testing line is busy right now.</b> Give it a minute and try again, or run the same test directly at <a href="https://pagespeed.web.dev/" rel="noopener" target="_blank">pagespeed.web.dev</a>. Some sites also block automated tests.</p></div>'});
  });
}

/* ---------- 4. Website grader ---------- */
var gr=$('#grader');
if(gr){
  var gform=$('form',gr),gres=$('#gres',gr);
  gform.addEventListener('submit',function(e){e.preventDefault();var url=normUrl($('#gurl',gr).value);
    var qs=$$('.gq',gr),yes=qs.filter(function(q){return q.checked}).length,qScore=Math.round(yes/qs.length*100),missing=qs.filter(function(q){return !q.checked}).map(function(q){return q.getAttribute('data-fix')});
    function finish(ps){var cats=ps?[ps.performance,ps.accessibility,ps['best-practices'],ps.seo]:null,tech=cats?Math.round(cats.reduce(function(a,b){return a+b},0)/4):null,total=tech===null?qScore:Math.round(tech*.6+qScore*.4);
      var L=total>=90?'A':total>=80?'B':total>=70?'C':total>=60?'D':'F',col={A:'#1F8A5B',B:'#2E8BFF',C:'#FF8A3D',D:'#C8452C',F:'#a8331f'}[L];
      var h='<div class="out"><div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap"><div class="grade" style="width:120px;height:120px;border-radius:24px;display:grid;place-items:center;background:'+col+';color:#fff;font:800 64px Unbounded,system-ui,sans-serif;transform:rotateY(90deg);transition:transform .7s cubic-bezier(.3,1.5,.5,1)">'+L+'</div><div><span class="src">Overall score</span><div class="big">'+total+' / 100</div><p class="note">'+(tech===null?'Based on your business checklist only (Google\'s test was unavailable).':'60% Google Lighthouse (mobile) + 40% your business checklist.')+'</p></div></div>';
      if(cats)h+='<div class="grid g4" style="margin-top:14px">'+[['Performance',cats[0]],['Accessibility',cats[1]],['Best practices',cats[2]],['SEO basics',cats[3]]].map(function(c){return '<div class="stat"><span class="src">'+c[0]+'</span><div class="num" style="font-size:32px">'+c[1]+'</div></div>'}).join('')+'</div>';
      if(missing.length)h+='<h3 style="margin-top:18px">What is holding it back</h3><ul>'+missing.map(function(m){return '<li>'+m+'</li>'}).join('')+'</ul>';else h+='<p><b>Your business checklist is perfect.</b> Now it comes down to speed, content and authority.</p>';
      gres.innerHTML=h+'</div>';var g=$('.grade',gres);requestAnimationFrame(function(){requestAnimationFrame(function(){g.style.transform='none'})});}
    if(!url){finish(null);return}
    gres.innerHTML='<div class="out"><p><b>Grading '+esc(url)+'...</b> Google is loading your page on a simulated phone. Hang tight for 20 to 50 seconds.</p></div>';
    psi(url,['performance','accessibility','best-practices','seo']).then(function(j){var c=j.lighthouseResult.categories,o={};Object.keys(c).forEach(function(k){o[k]=Math.round((c[k].score||0)*100)});finish(o)}).catch(function(){finish(null)});
  });
}

/* ---------- 5. Headline analyzer ---------- */
var ha=$('#headline');
if(ha){
  var hi=$('#hin',ha),hs=$('#hsub',ha),hc=$('#hcta',ha),ho=$('#hout',ha),meter=$('#hmeter',ha);
  var power=['free','new','now','proven','fast','faster','easy','instantly','guaranteed','finally','secret','simple','today','save','more','best','first','stop','never','without','real','own','boost','grow','win','get'];
  var outcome=['more','grow','get','save','book','win','leads','calls','customers','sales','money','revenue','rank','found','jobs','clients','time'];
  var jargon=['synergy','solutions','leverage','innovative','cutting-edge','world-class','best-in-class','robust','seamless','holistic','paradigm','utilize','bespoke','next-gen','empower'];
  var local=['colorado springs','springs','pueblo','durango','monument','fountain','manitou','woodland park','falcon','canon city','cañon city','colorado','briargate','el paso county','southern colorado'];
  var verbs=['call','get','book','start','claim','see','try','grab','schedule','request','talk','text','shop','join','reserve','order'];
  function analyze(){var t=(hi.value||'').trim(),low=t.toLowerCase(),words=t?t.split(/\s+/):[],n=words.length,checks=[],score=0;
    if(!t){ho.innerHTML='<p class="note">Type a headline to see it scored live.</p>';meter.style.width='0%';$('#hsc',ha).textContent='0';return}
    function ck(ok,pts,good,bad){checks.push([ok,ok?good:bad]);if(ok)score+=pts}
    ck(n>=5&&n<=12,20,'Length is in the sweet spot ('+n+' words).',n<5?'Only '+n+' words. Add the outcome the reader gets.':n+' words is long. Cut to 12 or fewer so it reads in one glance.');
    var pw=power.filter(function(p){return new RegExp('\\b'+p+'\\b').test(low)});ck(pw.length>0,15,'Uses a power word ('+pw.slice(0,3).join(', ')+').','No power word. Try one of: stop, finally, own, faster, without.');
    var oc=outcome.filter(function(p){return new RegExp('\\b'+p+'\\b').test(low)});ck(oc.length>0,20,'Names an outcome the reader wants ('+oc.slice(0,3).join(', ')+').','No clear outcome. What does the reader GET: calls, customers, time back?');
    ck(/\b(you|your|you're)\b/.test(low),10,'Speaks to the reader ("you").','Add "you" or "your". Make it about them, not you.');
    ck(/\d/.test(t),10,'Has a number, which adds specificity.','No number. Specific numbers (24 hours, $99, 3 steps) beat vague claims.');
    var jg=jargon.filter(function(p){return low.indexOf(p)>-1});ck(jg.length===0,10,'No agency jargon.','Cut the jargon: '+jg.join(', ')+'. Real people do not talk like that.');
    var lc=local.filter(function(p){return low.indexOf(p)>-1});ck(lc.length>0,10,'Has a local cue ('+lc[0]+').','No local cue. Naming your city builds instant trust with local buyers.');
    var cta=(hc.value||'').trim().toLowerCase(),cv=verbs.filter(function(v){return cta.indexOf(v)===0||cta.indexOf(' '+v+' ')>-1});ck(cta&&cv.length>0,5,'Button starts with an action verb.',cta?'Your button text should start with a verb like Call, Get or Book.':'Add your button text below to check it.');
    score=Math.min(100,score);meter.style.width=score+'%';meter.style.background=score>=80?'#1F8A5B':score>=55?'#FF8A3D':'#C8452C';$('#hsc',ha).textContent=score;
    var kw=oc[0]||'more customers',place=lc[0]?lc[0].replace(/\b\w/g,function(c){return c.toUpperCase()}):'[your city]';
    ho.innerHTML='<ul class="hchecks" style="list-style:none;padding:0">'+checks.map(function(c){return '<li style="margin:6px 0"><b style="color:'+(c[0]?'#1F8A5B':'#C8452C')+'">'+(c[0]?'&#10003;':'&#9679;')+'</b> '+c[1]+'</li>'}).join('')+'</ul>'+
      '<h3 style="margin-top:14px">Three proven frames to test</h3><ol><li>Get '+esc(kw)+' in '+esc(place)+' without [the headache they hate].</li><li>Stop [losing X]. Start [getting Y], starting today.</li><li>The [city]\'s [fastest / friendliest / most-booked] [service]. [Proof in 5 words].</li></ol><p class="note">Frames, not finished copy. Writing the version that converts for your market is exactly what we do.</p>';}
  [hi,hs,hc].forEach(function(i){i.addEventListener('input',analyze)});analyze();
}

/* ---------- 6. Service-area planner ---------- */
var am=$('#areamap');
if(am){
  var T=[['Colorado Springs',38.834,-104.821],['Monument',39.092,-104.873],['Woodmoor',39.101,-104.847],['Palmer Lake',39.122,-104.917],['Black Forest',39.013,-104.700],['Falcon',38.933,-104.608],['Peyton',39.029,-104.483],['Calhan',39.035,-104.297],['Fountain',38.682,-104.701],['Security-Widefield',38.747,-104.714],['Manitou Springs',38.860,-104.917],['Woodland Park',38.994,-105.057],['Divide',38.943,-105.160],['Cripple Creek',38.747,-105.178],['Cañon City',38.441,-105.242],['Florence',38.390,-105.118],['Pueblo',38.254,-104.609],['Pueblo West',38.350,-104.722],['Castle Rock',39.372,-104.856],['Denver',39.739,-104.990],['Walsenburg',37.624,-104.780],['Trinidad',37.169,-104.500],['Rocky Ford',38.052,-103.720],['La Junta',37.985,-103.544],['Limon',39.264,-103.692],['Salida',38.535,-105.999],['Buena Vista',38.842,-106.131],['Alamosa',37.470,-105.870],['Durango',37.275,-107.880]];
  var box={n:39.95,s:36.95,w:-108.3,e:-103.25},W=640,H=460;
  function px(lat,lon){return [(lon-box.w)/(box.e-box.w)*W,(box.n-lat)/(box.n-box.s)*H]}
  function dist(a,b){var R=3958.8,r=Math.PI/180,dl=(b[1]-a[1])*r,dn=(b[2]-a[2])*r,x=Math.sin(dn/2)*Math.sin(dn/2)+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin(dl/2)*Math.sin(dl/2);return 2*R*Math.asin(Math.sqrt(x))}
  var sel=$('#abase',am),rad=$('#arad',am);
  T.forEach(function(t,i){if(t[0]==='Denver'||t[0]==='Castle Rock')return;var o=d.createElement('option');o.value=i;o.textContent=t[0];sel.appendChild(o)});
  var pre=am.getAttribute('data-base');if(pre){T.forEach(function(t,i){if(t[0]===pre)sel.value=i})}
  function draw(){var b=T[+sel.value],r=+rad.value;$('#aradv',am).textContent=r+' miles';
    var c=px(b[1],b[2]),mpp=W/((box.e-box.w)*69*Math.cos(38.3*Math.PI/180)),rx=r*mpp,ry=r*(H/((box.n-box.s)*69));
    var inR=[];var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Map of southern Colorado towns within '+r+' miles of '+b[0]+'"><defs><linearGradient id="mapg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef6ff"/><stop offset="1" stop-color="#fff1e4"/></linearGradient></defs><rect width="'+W+'" height="'+H+'" rx="18" fill="url(#mapg)"/>';
    s+='<path d="M'+px(39.9,-105.35).join(' ')+' L'+px(39.2,-105.1).join(' ')+' L'+px(38.84,-105.05).join(' ')+' L'+px(38.4,-105.3).join(' ')+' L'+px(37.9,-105.2).join(' ')+' L'+px(37.3,-105.0).join(' ')+' L'+px(37.0,-105.1).join(' ')+'" fill="none" stroke="#c9b8a6" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>';
    s+='<text x="'+px(39.55,-105.9)[0]+'" y="'+px(39.55,-105.9)[1]+'" font-size="12" fill="#8b7a69">Front Range</text>';
    s+='<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="'+rx+'" ry="'+ry+'" fill="rgba(46,139,255,.12)" stroke="#2E8BFF" stroke-width="2" stroke-dasharray="6 5"/>';
    T.forEach(function(t,i){var p=px(t[1],t[2]),dd=dist(b,t),on=dd<=r&&t[0]!=='Denver'&&t[0]!=='Castle Rock';if(on&&t!==b)inR.push([t[0],dd]);var isB=t===b;
      s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(isB?8:5)+'" fill="'+(isB?'#C8452C':on?'#2E8BFF':'#b7ab9e')+'" stroke="#fff" stroke-width="2"/><text x="'+(p[0]+8)+'" y="'+(p[1]-7)+'" font-size="'+(isB?13:11)+'" font-weight="'+(isB?800:600)+'" fill="'+(on||isB?'#1B1F2A':'#8b7a69')+'">'+t[0]+'</text>'});
    s+='</svg>';$('#asvg',am).innerHTML=s;
    inR.sort(function(a,b2){return a[1]-b2[1]});
    var list=[b[0]].concat(inR.map(function(x){return x[0]})).slice(0,20);
    $('#alist',am).innerHTML='<p><b>'+(inR.length+1)+' towns</b> within '+r+' miles of '+b[0]+'.</p><ol>'+inR.slice(0,24).map(function(x){return '<li>'+x[0]+' <span class="src">('+Math.round(x[1])+' mi)</span></li>'}).join('')+'</ol><label style="margin-top:10px">Google Business Profile service areas (max 20, closest first)</label><textarea id="agbp" rows="3" readonly>'+list.join(', ')+'</textarea><button type="button" class="btn btn-blue" id="acopy" style="margin-top:8px">Copy list</button><p class="note">Each of these towns can also earn its own location page. That is how service-area businesses show up beyond their home city.</p>';
    $('#acopy',am).onclick=function(){var ta=$('#agbp',am);ta.select();try{navigator.clipboard.writeText(ta.value)}catch(e){d.execCommand('copy')}this.textContent='Copied!'};}
  sel.addEventListener('change',draw);rad.addEventListener('input',draw);draw();
}
})();
