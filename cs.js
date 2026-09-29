(function(){
'use strict';
var d=document,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,c){return (c||d).querySelector(s)}function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
window.CS={$:$,$$:$$,reduce:reduce};

/* mobile nav */
var hdr=$('.hdr'),bg=$('.burger'),mn=$('.mnav');
function setHH(){if(hdr)d.documentElement.style.setProperty('--hh',hdr.getBoundingClientRect().bottom+'px')}
if(bg&&mn){
  bg.addEventListener('click',function(){setHH();var o=bg.getAttribute('aria-expanded')==='true';bg.setAttribute('aria-expanded',o?'false':'true');mn.classList.toggle('open',!o);d.body.classList.toggle('navlock',!o)});
  $$('a',mn).forEach(function(a){a.addEventListener('click',function(){bg.setAttribute('aria-expanded','false');mn.classList.remove('open');d.body.classList.remove('navlock')})});
  window.addEventListener('resize',function(){setHH();if(window.innerWidth>1120){bg.setAttribute('aria-expanded','false');mn.classList.remove('open');d.body.classList.remove('navlock')}});
  window.addEventListener('scroll',setHH,{passive:true});
}

/* email assembly */
function addr(el){try{return atob(el.getAttribute('data-a'))+String.fromCharCode(64)+atob(el.getAttribute('data-b'))}catch(e){return ''}}
$$('a.eml').forEach(function(a){var m=addr(a);if(!m)return;a.href='mailto:'+m;if(!a.getAttribute('data-keep'))a.textContent=m});
window.CS.addr=addr;

/* reveal + counters + charts */
function fmt(n,f){var s=Math.round(n).toLocaleString('en-US');return (f&&f.pre||'')+s+(f&&f.suf||'')}
function count(el){var to=parseFloat(el.getAttribute('data-count')),pre=el.getAttribute('data-pre')||'',suf=el.getAttribute('data-suf')||'',dec=parseInt(el.getAttribute('data-dec')||'0',10);
  if(reduce){el.textContent=pre+to.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;return}
  var t0=null,dur=1400;function st(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3),v=to*e;el.textContent=pre+v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;if(p<1)requestAnimationFrame(st)}requestAnimationFrame(st)}
function chart(el){
  var c;try{c=JSON.parse(el.getAttribute('data-chart'))}catch(e){return}
  var W=640,H=c.h||300,P={l:c.type==='hbar'?150:56,r:20,t:20,b:c.type==='hbar'?20:56},cols=c.colors||['#C8452C','#FF8A3D','#FFC53D','#1F8A5B','#2E8BFF','#7B5CFF'];
  var pre=c.pre||'',suf=c.suf||'',s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+(c.label||'chart').replace(/"/g,'')+'">';
  function money(v){return pre+(v>=1000?(v/1000).toLocaleString('en-US',{maximumFractionDigits:1})+'K':Math.round(v).toLocaleString('en-US'))+suf}
  if(c.type==='bar'||c.type==='hbar'){
    var mx=Math.max.apply(null,c.values)*1.12,n=c.values.length;
    if(c.type==='bar'){var bw=(W-P.l-P.r)/n;for(var g=0;g<=4;g++){var gy=P.t+(H-P.t-P.b)*g/4;s+='<line x1="'+P.l+'" x2="'+(W-P.r)+'" y1="'+gy+'" y2="'+gy+'" stroke="#eee2d6"/><text x="'+(P.l-8)+'" y="'+(gy+4)+'" text-anchor="end" font-size="12" fill="#6b7280">'+money(mx*(1-g/4))+'</text>'}
      c.values.forEach(function(v,i){var h=(H-P.t-P.b)*v/mx,x=P.l+i*bw+bw*.16,y=H-P.b-h;s+='<rect class="bar" style="transition-delay:'+(i*.12)+'s" x="'+x+'" y="'+y+'" width="'+(bw*.68)+'" height="'+h+'" rx="8" fill="'+cols[i%cols.length]+'"/><text x="'+(x+bw*.34)+'" y="'+(y-7)+'" text-anchor="middle" font-size="13" font-weight="700" fill="#1B1F2A">'+money(v)+'</text><text x="'+(x+bw*.34)+'" y="'+(H-P.b+20)+'" text-anchor="middle" font-size="12" fill="#374151">'+c.labels[i]+'</text>'});}
    else{var bh=(H-P.t-P.b)/n;c.values.forEach(function(v,i){var w=(W-P.l-P.r-70)*v/mx,y=P.t+i*bh+bh*.18;s+='<text x="'+(P.l-10)+'" y="'+(y+bh*.42)+'" text-anchor="end" font-size="13" fill="#1B1F2A" font-weight="600">'+c.labels[i]+'</text><rect class="hbar" style="transition-delay:'+(i*.1)+'s" x="'+P.l+'" y="'+y+'" width="'+w+'" height="'+(bh*.62)+'" rx="7" fill="'+cols[i%cols.length]+'"/><text x="'+(P.l+w+8)+'" y="'+(y+bh*.42)+'" font-size="13" font-weight="700" fill="#1B1F2A">'+(c.raw?pre+v.toLocaleString('en-US')+suf:money(v))+'</text>'});}
  }else if(c.type==='line'){
    var all=[];c.series.forEach(function(se){all=all.concat(se.values)});var mx2=Math.max.apply(null,all)*1.1,n2=c.labels.length,sx=(W-P.l-P.r)/(n2-1);
    for(var g2=0;g2<=4;g2++){var gy2=P.t+(H-P.t-P.b)*g2/4;s+='<line x1="'+P.l+'" x2="'+(W-P.r)+'" y1="'+gy2+'" y2="'+gy2+'" stroke="#eee2d6"/><text x="'+(P.l-8)+'" y="'+(gy2+4)+'" text-anchor="end" font-size="12" fill="#6b7280">'+money(mx2*(1-g2/4))+'</text>'}
    c.labels.forEach(function(l,i){if(i%(c.every||1)===0)s+='<text x="'+(P.l+i*sx)+'" y="'+(H-P.b+20)+'" text-anchor="middle" font-size="12" fill="#374151">'+l+'</text>'});
    c.series.forEach(function(se,k){var pts=se.values.map(function(v,i){return (P.l+i*sx).toFixed(1)+','+(H-P.b-(H-P.t-P.b)*v/mx2).toFixed(1)}).join(' ');s+='<polyline class="lpath" style="transition-delay:'+(k*.25)+'s" points="'+pts+'" fill="none" stroke="'+(se.color||cols[k])+'" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>';
      s+='<rect x="'+(P.l+10+k*190)+'" y="'+(H-18)+'" width="14" height="6" rx="3" fill="'+(se.color||cols[k])+'"/><text x="'+(P.l+30+k*190)+'" y="'+(H-12)+'" font-size="12" fill="#1B1F2A">'+se.name+'</text>'});
  }
  s+='</svg>';var box=el.querySelector('.cbody')||el;box.insertAdjacentHTML('afterbegin',s);
}
$$('[data-chart]').forEach(chart);
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var t=e.target;t.classList.add('in');if(t.hasAttribute('data-count'))count(t);io.unobserve(t)}})},{threshold:.18}):null;
$$('.rv,[data-count],[data-chart]').forEach(function(el){if(io&&!reduce)io.observe(el);else{el.classList.add('in');if(el.hasAttribute('data-count'))count(el)}});

/* forms */
var loaded=Date.now(),touched=false;
['keydown','pointerdown','touchstart'].forEach(function(ev){d.addEventListener(ev,function(){touched=true},{passive:true,once:true})});
window.CS.send=function(fields,subject){
  var f=$('form[data-a]');var a=f?addr(f):atob('aW5mbw==')+String.fromCharCode(64)+atob('ZXlldG9hZC5jb20=');
  var body=Object.assign({_subject:subject||'Website lead',_template:'table',_captcha:'false',page:location.pathname,site:location.hostname},fields);
  return fetch('https://formsubmit.co/ajax/'+a,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()}).then(function(j){return j&&(j.success===true||j.success==='true')?'ok':'unconfirmed'}).catch(function(){return 'fail'});
};
$$('form[data-a]').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();var msg=$('.fmsg',f),hp=f.querySelector('[name=_honey]');
    if(hp&&hp.value)return;
    if(!touched||Date.now()-loaded<3500){msg.className='fmsg err';msg.textContent='One sec, please try again.';return}
    var data={},bad=false;$$('input,select,textarea',f).forEach(function(i){if(!i.name||i.name==='_honey')return;var v=(i.value||'').trim();if(v.length>(i.name==='message'?3000:200))bad=true;data[i.name]=v});
    if(bad){msg.className='fmsg err';msg.textContent='That looks a little long. Mind trimming it?';return}
    if(!data.name||!(data.phone||data.email)){msg.className='fmsg err';msg.textContent='Please add your name and a phone or email.';return}
    var btn=$('button[type=submit]',f);btn.disabled=true;msg.className='fmsg';msg.textContent='Sending...';
    window.CS.send(data,(f.getAttribute('data-subject')||'Colorado Springs website lead')+' - '+d.title).then(function(r){
      btn.disabled=false;
      if(r==='ok'){msg.className='fmsg ok';msg.textContent='Got it! We will reach out shortly. Want it faster? Call 1-800-481-8638.';f.reset()}
      else if(r==='unconfirmed'){msg.className='fmsg ok';msg.textContent='Sent. If you do not hear from us soon, call 1-800-481-8638.'}
      else{msg.className='fmsg err';msg.textContent='Your message did not go through. Please call 1-800-481-8638.'}
    });
  });
});
$$('[data-year]').forEach(function(y){y.textContent=new Date().getFullYear()});
})();
