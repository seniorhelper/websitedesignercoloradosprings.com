/* Planner, readiness checklist, capability block builder and season planner. Plain JS, no tracking. */
(function(){
'use strict';
var d=document;
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||'null');localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
function copy(text,btn){
  function done(){if(!btn)return;var t=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=t},1600)}
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(done,fallback)}else fallback();
  function fallback(){var ta=d.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.top='-1000px';d.body.appendChild(ta);ta.select();try{d.execCommand('copy');done()}catch(e){}d.body.removeChild(ta)}
}
function toForm(text,interest){
  var f=$('#start form');if(!f)return;var ta=$('textarea[name=message]',f);
  if(ta){ta.value=text.slice(0,2900)}
  if(interest){var sel=$('select[name=interest]',f);if(sel){$$('option',sel).forEach(function(o){if(o.textContent===interest)sel.value=o.value})}}
  $('#start').scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(function(){var n=$('input[name=name]',f);if(n)n.focus({preventScroll:true})},700);
}
window.CSX={copy:copy,toForm:toForm};

/* ---------- 1. Website planner ---------- */
var pl=$('#planner');
if(pl){
  var IND={
    home:{n:'Home services and trades',p:['One page for each trade or service you offer','Emergency or same-day service page (only if you really offer it)','Project gallery with your own before-and-after photos','Warranty or financing page, if you offer either'],f:['Tap-to-call button in the header on every screen size','Quote form that accepts a photo of the problem','Service-area list that matches your Google Business Profile']},
    health:{n:'Healthcare, dental and wellness',p:['One page per treatment or service','Provider bios with real credentials','New-patient page: what to expect, insurance accepted, what to bring','Location page with parking and building-access details'],f:['Appointment request or a link to your scheduling system','Patient intake kept inside a HIPAA-appropriate system, never a plain website form','Readable type, strong contrast and full keyboard navigation']},
    defense:{n:'Defense, aerospace or government contractor',p:['Capability statement page: UEI, CAGE, NAICS codes and set-aside status','Past performance you are allowed to share','Careers page that states clearance requirements','How to buy from us: contract vehicles and a named contact'],f:['Downloadable one-page capability statement','Identifiers that match SAM.gov exactly','No controlled or sensitive information collected through public forms','Section 508 and WCAG 2.1 AA accessibility']},
    tourism:{n:'Tourism, lodging or attraction',p:['One page per room type, tour or experience','Plan-your-visit page: seasons, hours, directions, parking','Groups, private bookings and events','Nearby things to do, written by someone who has done them'],f:['Book-now button wired to the booking platform you already use','Season and conditions note you can update yourself in a minute','Photo-heavy pages that still load fast on a weak signal']},
    outdoor:{n:'Outdoor recreation, guide or gear shop',p:['One page per trip, lesson or rental','What to bring, and altitude tips for visitors','Waivers, deposits and cancellation policy','Conditions updates (trail, river, weather)'],f:['Online booking with deposits through your existing system','Waiver link sent before arrival','Weather and cancellation rules stated in plain words']},
    food:{n:'Restaurant, cafe or brewery',p:['Menu as real text, not only a PDF or photo','Hours, location and parking','Private events and catering','Your story'],f:['Order or reservation link above the fold','Current hours in your schema and your Google profile','Food photos sized for phones']},
    pro:{n:'Professional services',p:['One page per practice area or service','Team bios with credentials you actually hold','What working with you looks like, step by step','Resource or FAQ library'],f:['Consultation booking','Disclaimers your profession requires','Real reviews and memberships, nothing inflated']},
    retail:{n:'Retail shop or online store',p:['Category and product pages','Shipping, returns and local pickup','Store hours and location','Seasonal collections or gift guides'],f:['Secure checkout on Shopify or custom code','Product schema with price and availability','Local pickup for Springs shoppers']},
    nonprofit:{n:'Nonprofit, church or community group',p:['Mission and impact','One page per program or ministry','Events calendar','Volunteer and give pages'],f:['Donation link through a trusted processor','Event sign-up forms','Accessible design for every age and ability']}
  };
  var GOAL={
    calls:{f:'Click-to-call everywhere plus call tracking, so you can see which pages ring the phone'},
    book:{p:'Booking page with your real availability',f:'Online booking or a short request form that works after hours'},
    sell:{p:'Online store pages with checkout',f:'Checkout, shipping and tax set up before launch'},
    hire:{p:'Careers page with open roles and a simple way to apply',f:'Job posting schema on each open role'},
    contracts:{p:'Capability statement page',f:'Downloadable capability statement'},
    ai:{f:'An answer-first summary near the top of each key page, plus FAQ and business schema that match what is on the page'},
    quote:{f:'Quote form that asks only the three to five questions you always ask on the phone'}
  };
  var HAVE={
    logo:'A logo file (SVG or a large PNG). No logo yet? Budget time to make one before design starts.',
    photos:'Fifteen to thirty real photos of your work, your team and your place. Stock photos do not build trust.',
    copy:'Notes on each service: what it is, who it is for, what it costs or how you price it, and common questions.',
    reviews:'Links to your Google reviews and permission to quote happy customers by first name.',
    domain:'Your domain login (or plan to register one). Make sure the domain is in your name, not a past vendor\'s.',
    site:''
  };
  var out=$('#plout'),last='';
  function vals(name){return $$('input[name='+name+']:checked',pl).map(function(i){return i.value})}
  function build(){
    var ind=(vals('pind')[0])||'home',I=IND[ind],goals=vals('pgoal'),areas=vals('parea'),have=vals('phave');
    var core=['Home: who you help, where, and the one next step','About: your real story, team and proof','Contact: phone, form, hours and a map if people visit','Services overview that links to every service page','Reviews: real ones, linked to the source','FAQ: the questions you answer on the phone every week','Privacy policy'];
    var indp=I.p.slice(),feats=['Mobile-first layout, then scaled up for desktop','Page titles, descriptions and headings written for real searches','Analytics and Search Console connected at launch'].concat(I.f);
    goals.forEach(function(g){var G=GOAL[g];if(!G)return;if(G.p&&indp.join('|').toLowerCase().indexOf(G.p.toLowerCase().slice(0,12))<0)indp.push(G.p);if(G.f&&feats.indexOf(G.f)<0)feats.push(G.f)});
    var areap=[],warn='';
    if(areas.length&&areas.length<=3){areas.forEach(function(a){areap.push(a+' page with details only a local would know')})}
    else if(areas.length>3){areap.push('One service-area page covering all '+areas.length+' areas you picked');areap.push('Individual pages for your top two or three areas, only where you have real local jobs, photos or customers to talk about');warn='You picked '+areas.length+' areas. Copy-paste pages that only swap the town name tend to get ignored by Google and can drag the whole site down. Start with one strong service-area page and add individual town pages as you collect real local work.'}
    var gather=Object.keys(HAVE).filter(function(k){return have.indexOf(k)<0&&HAVE[k]}).map(function(k){return HAVE[k]});
    if(have.indexOf('site')>=0)gather.push('A list of every URL on your current site, so each one can be redirected and no rankings are lost in the move.');
    var n=core.length+indp.length+areap.length,big=goals.indexOf('sell')>=0||n>18,size=n<=12?'Focused':(n<=18?'Mid-size':'Large');
    var time=size==='Focused'?'Smaller sites like this can sometimes go live in about 24 hours once your content is ready.':'Builds this size usually take 7 days or more.';
    if(big)time+=' Stores, portals and custom apps can take 30 to 60 days or longer. Your strategy call sets the real timeline.';else time+=' Your strategy call sets the real timeline.';
    var h='<h3>Your plan: '+esc(I.n)+'</h3><p><span class="x-pill">'+size+' site</span><span class="x-pill">About '+n+' pages</span><span class="x-pill">'+(areas.length||'No')+' area'+(areas.length===1?'':'s')+' picked</span></p><p>'+esc(time)+'</p>';
    function list(t,a){return a.length?'<h3>'+t+'</h3><ul>'+a.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':''}
    h+=list('Core pages',core)+list('Pages for your industry and goals',indp)+list('Area pages',areap);
    if(warn)h+='<div class="x-warn">'+esc(warn)+'</div>';
    h+=list('Features that matter for you',feats)+list('What to gather before the build',gather.length?gather:['You have the basics. Bring your top three competitors and the questions customers ask most.']);
    out.innerHTML=h;out.hidden=false;$('#placts').hidden=false;
    last='Website plan from websitedesignercoloradosprings.com\nBusiness: '+I.n+'\nGoals: '+(goals.join(', ')||'not picked')+'\nAreas: '+(areas.join(', ')||'not picked')+'\nSize: '+size+', about '+n+' pages\n\nCore pages:\n- '+core.join('\n- ')+'\n\nIndustry and goal pages:\n- '+indp.join('\n- ')+(areap.length?'\n\nArea pages:\n- '+areap.join('\n- '):'')+'\n\nFeatures:\n- '+feats.join('\n- ')+'\n\nTo gather:\n- '+(gather.join('\n- ')||'basics covered');
    store('cs-plan',{i:ind,g:goals,a:areas,h:have});
  }
  var saved=store('cs-plan');
  if(saved){$$('input',pl).forEach(function(i){var v=i.value;if((i.name==='pind'&&saved.i===v)||(i.name==='pgoal'&&saved.g.indexOf(v)>=0)||(i.name==='parea'&&saved.a.indexOf(v)>=0)||(i.name==='phave'&&saved.h.indexOf(v)>=0))i.checked=true})}
  $('#plgo').addEventListener('click',function(){build();out.scrollIntoView({behavior:'smooth',block:'start'})});
  pl.addEventListener('change',function(){if(!out.hidden)build()});
  $('#plcopy').addEventListener('click',function(){copy(last,this)});
  $('#plsend').addEventListener('click',function(){toForm(last,'New custom-coded website')});
  $('#plprint').addEventListener('click',function(){window.print()});
}

/* ---------- 2. Readiness checklist ---------- */
var ck=$('#readiness');
if(ck){
  var boxes=$$('.x-item>input',ck),KEY='cs-ready';
  var st=store(KEY)||{};
  boxes.forEach(function(b){if(st[b.id])b.checked=true});
  function upd(){
    var tot=0,done=0,groups={},save={};
    boxes.forEach(function(b){var g=b.getAttribute('data-g');groups[g]=groups[g]||{t:0,d:0};groups[g].t++;tot++;if(b.checked){groups[g].d++;done++;save[b.id]=1}b.parentNode.classList.toggle('done',b.checked)});
    store(KEY,save);
    var pct=Math.round(done/tot*100);$('#rdnum').innerHTML=done+'<small> / '+tot+'</small>';
    $$('#rdbars [data-g]').forEach(function(row){var g=groups[row.getAttribute('data-g')];if(!g)return;var p=Math.round(g.d/g.t*100);$('i',row).style.width=p+'%';$('span',row).textContent=g.d+' of '+g.t})
    var weak=Object.keys(groups).sort(function(a,b){return groups[a].d/groups[a].t-groups[b].d/groups[b].t})[0];
    var names={speed:'Speed',access:'Accessibility',local:'Local search',ai:'AI answers',leads:'Lead capture'};
    var msg=done===0?'Check off what your site already does. Your progress saves in this browser.':pct>=90?'Strong. Your site covers the basics most local competitors miss. Re-check after every redesign or plugin update.':pct>=60?'Solid start. Your weakest area right now is '+names[weak]+'. Fix that group first; it is usually where the leads are leaking.':'There is real room to grow. Start with '+names[weak]+', then work down the list. Most fixes on this page are one-time jobs.';
    $('#rdmsg').textContent=msg;
    var gaps=boxes.filter(function(b){return !b.checked}).map(function(b){return '- '+$('label[for='+b.id+']',ck).textContent});
    ck.setAttribute('data-gaps','Readiness score: '+done+' of '+tot+'\nOpen items:\n'+gaps.join('\n'));
  }
  boxes.forEach(function(b){b.addEventListener('change',upd)});
  $('#rdhide').addEventListener('change',function(){ck.classList.toggle('x-hideok',this.checked)});
  $('#rdreset').addEventListener('click',function(){boxes.forEach(function(b){b.checked=false});upd()});
  $('#rdsend').addEventListener('click',function(){toForm(ck.getAttribute('data-gaps')||'','Website redesign')});
  $('#rdcopy').addEventListener('click',function(){copy(ck.getAttribute('data-gaps')||'',this)});
  upd();
}

/* ---------- 3. Capability block builder ---------- */
var cb=$('#capbuild');
if(cb){
  function v(n){var e=$('[name='+n+']',cb);return e?e.value.trim():''}
  function render(){
    var name=v('cname')||'Your Company, LLC',uei=v('cuei').toUpperCase(),cage=v('ccage').toUpperCase(),naics=v('cnaics').split(/[\s,;]+/).filter(Boolean),sets=$$('input[name=cset]:checked',cb).map(function(i){return i.value}),comp=v('ccomp').split(/\n+/).map(function(s){return s.trim()}).filter(Boolean),poc=v('cpoc');
    var chk=[];
    chk.push(uei?(/^[A-Z0-9]{12}$/.test(uei)?['ok','UEI looks right (12 characters)']:['bad','UEI should be 12 letters and numbers']):['bad','Add your UEI']);
    chk.push(cage?(/^[A-Z0-9]{5}$/.test(cage)?['ok','CAGE looks right (5 characters)']:['bad','CAGE codes are 5 letters and numbers']):['bad','Add your CAGE code']);
    var badN=naics.filter(function(n){return !/^\d{6}$/.test(n)});
    chk.push(naics.length?(badN.length?['bad','NAICS codes are 6 digits: check '+badN.slice(0,3).join(', ')]:['ok',naics.length+' NAICS code'+(naics.length>1?'s':'')+' formatted correctly']):['bad','Add at least one NAICS code']);
    chk.push(comp.length?(comp.length<=6?['ok',comp.length+' core competencies']:['bad','Trim to your strongest 3 to 6 competencies']):['bad','List 3 to 6 core competencies']);
    chk.push(poc?['ok','Named point of contact']:['bad','Add a named point of contact']);
    $('#capchk').innerHTML=chk.map(function(c){return '<span class="x-pill '+c[0]+'">'+esc(c[1])+'</span>'}).join('');
    var h='<h3>'+esc(name)+'</h3><dl><dt>UEI</dt><dd>'+esc(uei||'—')+'</dd><dt>CAGE</dt><dd>'+esc(cage||'—')+'</dd><dt>NAICS</dt><dd>'+esc(naics.join(', ')||'—')+'</dd><dt>Status</dt><dd>'+esc(sets.join(', ')||'—')+'</dd></dl>';
    if(comp.length)h+='<b>Core competencies</b><ul>'+comp.map(function(c){return '<li>'+esc(c)+'</li>'}).join('')+'</ul>';
    if(poc)h+='<p style="margin:8px 0 0"><b>Point of contact:</b> '+esc(poc)+'</p>';
    $('#capprev').innerHTML=h;
    cb.setAttribute('data-text',name+'\nUEI: '+(uei||'-')+'\nCAGE: '+(cage||'-')+'\nNAICS: '+(naics.join(', ')||'-')+'\nStatus: '+(sets.join(', ')||'-')+(comp.length?'\nCore competencies:\n- '+comp.join('\n- '):'')+(poc?'\nPoint of contact: '+poc:''));
    cb.setAttribute('data-html','<section class="capability">\n'+h.replace(/<dt>/g,'\n  <dt>').replace(/<li>/g,'\n  <li>')+'\n</section>');
  }
  cb.addEventListener('input',render);cb.addEventListener('change',render);
  $('#capcopyt').addEventListener('click',function(){copy(cb.getAttribute('data-text'),this)});
  $('#capcopyh').addEventListener('click',function(){copy(cb.getAttribute('data-html'),this)});
  $('#capsend').addEventListener('click',function(){toForm('Capability page draft:\n'+cb.getAttribute('data-text'),'New custom-coded website')});
  render();
}

/* ---------- 4. Season planner ---------- */
var sp=$('#season');
if(sp){
  var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var EXTRA={lodging:'Update minimum stays, holiday rates and check-in notes.',tours:'Confirm departure times, pickup points and what is included.',outfit:'Post the gear list and send the waiver link with every booking.',food:'Update the seasonal menu, patio hours and event nights.',attract:'Update ticket times, last-entry rules and parking notes.',events:'Publish next season\'s open dates and a simple inquiry form.'};
  var PRE={summer:[5,6,7],fall:[5,6,7,8,9],winter:[11,0,1,2],year:[4,5,6,7,8,9]};
  function peaks(){return $$('input[name=smon]',sp).map(function(i){return i.checked})}
  function draw(){
    var pk=peaks(),type=($('select[name=stype]',sp)||{}).value||'tours',h='',n=pk.filter(Boolean).length,txt=[];
    if(!n){$('#scal').innerHTML='<p class="note">Pick at least one busy month to see your calendar.</p>';return}
    for(var i=0;i<12;i++){
      var role,tasks;
      if(pk[i]){role=['peak','Busy season'];tasks=['Post conditions, closures and sell-out notices with a date on them.','Turn repeat phone questions into FAQ entries.','Ask happy guests for a Google review the same day.']}
      else if(pk[(i+1)%12]){role=['pre','Final prep'];tasks=['Publish this season\'s rates, hours and photos.','Check that every booking button opens the right calendar.',EXTRA[type]]}
      else if(pk[(i+2)%12]){role=['pre','Plan ahead'];tasks=['Write or refresh your seasonal landing page and a trip-planning guide.','Run a speed check on your busiest pages.']}
      else if(pk[(i+11)%12]){role=['post','Wind down'];tasks=['Switch the homepage to your shoulder-season offer.','Send thank-you emails that ask for reviews.','Note what visitors asked about all season.']}
      else{role=['off','Build window'];tasks=['Best time for redesigns, new pages and speed fixes.','Write evergreen guides: altitude, what to bring, rainy-day ideas.']}
      h+='<div class="x-m '+role[0]+'"><b>'+M[i]+'</b><span class="x-tag">'+role[1]+'</span><ul>'+tasks.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul></div>';
      txt.push(M[i]+' ('+role[1]+'): '+tasks.join(' '));
    }
    $('#scal').innerHTML=h;sp.setAttribute('data-text','Season website calendar\n'+txt.join('\n'));
  }
  $$('[data-preset]',sp).forEach(function(b){b.addEventListener('click',function(){var p=PRE[b.getAttribute('data-preset')];$$('input[name=smon]',sp).forEach(function(c,i){c.checked=p.indexOf(i)>=0});draw()})});
  sp.addEventListener('change',draw);
  $('#scopy').addEventListener('click',function(){copy(sp.getAttribute('data-text')||'',this)});
  $('#ssend').addEventListener('click',function(){toForm(sp.getAttribute('data-text')||'','New custom-coded website')});
  draw();
}
})();
