(() => {
  const DATA = [
    {category:'ELEMENTS',difficulty:'EASY',prompt:'Name a chemical element with an atomic number as close as possible without going over.',unit:'atomic number',targets:[18,26,36,47,54,79,92],source:'IUPAC Periodic Table',url:'https://iupac.org/what-we-do/periodic-table-of-elements/',items:[['Hydrogen',1,'H'],['Helium',2,'He'],['Carbon',6,'C'],['Oxygen',8,'O'],['Neon',10,'Ne'],['Sodium',11,'Na'],['Silicon',14,'Si'],['Sulfur',16,'S'],['Argon',18,'Ar'],['Calcium',20,'Ca'],['Iron',26,'Fe'],['Copper',29,'Cu'],['Zinc',30,'Zn'],['Bromine',35,'Br'],['Krypton',36,'Kr'],['Silver',47,'Ag'],['Tin',50,'Sn'],['Iodine',53,'I'],['Xenon',54,'Xe'],['Gold',79,'Au'],['Mercury',80,'Hg'],['Lead',82,'Pb'],['Uranium',92,'U'],['Plutonium',94,'Pu'],['Oganesson',118,'Og']]},
    {category:'PLANETS',difficulty:'MEDIUM',prompt:'Name a planet with an average diameter as close as possible without going over.',unit:'km across',targets:[7000,13000,25000,50000,100000,130000],source:'NASA Solar System Exploration',url:'https://science.nasa.gov/solar-system/planets/',items:[['Mercury',4879],['Mars',6779],['Venus',12104],['Earth',12742],['Neptune',49244],['Uranus',50724],['Saturn',116460],['Jupiter',139820]]},
    {category:'MOUNTAINS',difficulty:'MEDIUM',prompt:'Name a famous mountain with a summit elevation as close as possible without going over.',unit:'metres above sea level',targets:[6000,7000,8000,8500,8800],source:'Peakbagger / authoritative peak references',url:'https://www.peakbagger.com/',items:[['Mount Kilimanjaro',5895],['Denali',6190],['Aconcagua',6961],['Mount Elbrus',5642],['Mount Vinson',4892],['Puncak Jaya',4884],['Mount Logan',5959],['Cho Oyu',8188],['Manaslu',8163],['Dhaulagiri I',8167],['Makalu',8485],['Lhotse',8516],['Kangchenjunga',8586],['K2',8611],['Mount Everest',8849]]},
    {category:'MOVIES',difficulty:'EASY',prompt:'Name a movie with a theatrical runtime as close as possible without going over.',unit:'minutes',targets:[100,120,140,160,180,200],source:'AFI Catalog / studio theatrical runtimes',url:'https://catalog.afi.com/',items:[['Toy Story',81],['The Lion King (1994)',88],['Jaws',124],['The Matrix',136],['Titanic',194],['The Dark Knight',152],['Interstellar',169],['The Godfather',175],['Avatar',162],['Oppenheimer',180],['The Lord of the Rings: The Fellowship of the Ring',178],['Jurassic Park',127],['Finding Nemo',100],['Inception',148],['The Avengers',143],['Spider-Man: Into the Spider-Verse',117]]},
    {category:'COUNTRIES',difficulty:'HARD',prompt:'Name a country with a land area as close as possible without going over.',unit:'thousand km²',targets:[100,300,500,1000,3000,8000],source:'CIA World Factbook (land area snapshots)',url:'https://www.cia.gov/the-world-factbook/field/area/',items:[['Iceland',100],['Greece',131],['Nepal',143],['New Zealand',263],['Italy',294],['Japan',365],['Germany',349],['Sweden',410],['Spain',499],['Thailand',511],['Egypt',995],['South Africa',1214],['Mexico',1944],['Saudi Arabia',2149],['India',2973],['Australia',7692],['Brazil',8358],['United States',9147],['China',9388],['Canada',9093]]},
    {category:'ANIMALS',difficulty:'MEDIUM',prompt:'Name an animal with a typical lifespan as close as possible without going over.',unit:'years',targets:[10,20,40,60,80,100],source:'San Diego Zoo Animal Fact Sheets (typical ranges)',url:'https://animals.sandiegozoo.org/',items:[['House mouse',2],['Domestic cat',15],['African grey parrot',50],['African elephant',65],['Blue whale',90],['Giant tortoise',100],['Red fox',5],['Bald eagle',20],['Horse',30],['Chimpanzee',40],['Orca',50],['Bowhead whale',200]]}
  ];
  const $=id=>document.getElementById(id), views=['intro','game','results','stats'];
  const state={rounds:[],index:0,practice:false,date:null,deadline:null};
  const read=()=>{try{return JSON.parse(localStorage.getItem('nearmiss-v1')||'{}')}catch{return{}}};
  const write=o=>localStorage.setItem('nearmiss-v1',JSON.stringify(o));
  const utcDate=()=>new Date().toISOString().slice(0,10);
  const dayNumber=()=>Math.floor((Date.parse(utcDate()+'T00:00:00Z')-Date.UTC(2026,0,1))/86400000)+1;
  const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
  const rng=seed=>()=>{seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^seed>>>15,1|seed);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296};
  const fmt=(v,unit)=>unit==='thousand km²'?`${v.toLocaleString()}k km²`:unit==='km across'?`${v.toLocaleString()} km`:unit==='years'?`${v} years`:unit==='minutes'?`${v} min`:unit==='metres above sea level'?`${v.toLocaleString()} m`:String(v);
  const metric=(v,unit)=>unit==='thousand km²'?`${v.toLocaleString()}k km²`:unit==='km across'?`${v.toLocaleString()} km`:unit==='years'?`${v} years`:unit==='minutes'?`${v} min`:unit==='metres above sea level'?`${v.toLocaleString()} m`:v.toLocaleString();
  const makePuzzle=(key)=>{const r=rng(hash(key)),decks=[...DATA],out=[];for(let i=0;i<5;i++){const d=decks.splice(Math.floor(r()*decks.length),1)[0],target=d.targets[Math.floor(r()*d.targets.length)];out.push({...d,target,answers:d.items.map(([name,value,...aliases])=>({name,value,aliases}))})}return out};
  function show(name){views.forEach(v=>$(v).classList.toggle('hidden',v!==name));window.scrollTo(0,0)}
  function current(){return state.rounds[state.index]}
  const roundDuration = 30000;
  let roundClock;
  let statsReturn = 'intro';

  function resume() {
    const date = utcDate();
    const daily = read().days?.[date];
    if (!daily) return false;
    state.practice = false;
    state.date = date;
    state.rounds = daily.rounds || [];
    state.index = daily.index || 0;
    state.deadline = daily.deadline ?? null;
    if (daily.done) {
      renderResults(daily);
      return true;
    }
    if (!state.rounds.length) return false;
    show('game');
    renderRound();
    return true;
  }

  function persist() {
    if (state.practice) return;
    const all = read();
    all.days ||= {};
    if (all.days[state.date]?.done) return;
    all.days[state.date] = {
      rounds: state.rounds, index: state.index, deadline: state.deadline, done: false
    };
    write(all);
  }

  function start(practice = false) {
    state.practice = practice;
    state.date = utcDate();
    state.rounds = makePuzzle(practice ? state.date + ':practice:' + hash(state.date + ':practice:' + Date.now()) : state.date);
    state.index = 0;
    state.deadline = null;
    show('game');
    renderRound();
  }

  function renderRound() {
    const q = current();
    if (!q) {
      finish();
      return;
    }
    $('round-category').textContent = q.category;
    $('round-difficulty').textContent = q.difficulty;
    $('round-count').innerHTML = `${String(state.index + 1).padStart(2, '0')} <b>/ 05</b>`;
    $('round-progress').style.width = `${((state.index + 1) / 5) * 100}%`;
    $('question-prompt').textContent = q.prompt;
    $('target-value').textContent = fmt(q.target, q.unit);
    $('daily-label').textContent = state.practice ? 'PRACTICE MODE' : `DAILY NO. ${String(dayNumber()).padStart(3, '0')}`;
    if (q.result) {
      renderShot(q);
      return;
    }
    $('entry-area').classList.remove('hidden');
    $('reveal').classList.add('hidden');
    $('round-clock').classList.remove('hidden');
    $('answer-input').value = '';
    clearAnswerError();
    window.renderGolf?.();
    state.deadline ??= Date.now() + roundDuration;
    persist();
    clearInterval(roundClock);
    updateRoundClock();
    if (!q.result) {
      roundClock = setInterval(updateRoundClock, 100);
      $('answer-input').focus({ preventScroll: true });
    }
  }

  function updateRoundClock() {
    const remaining = Math.max(0, state.deadline - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    const clock = $('round-clock');
    const display = `${seconds}s`;
    if ($('round-seconds').textContent !== display) $('round-seconds').textContent = display;
    clock.style.setProperty('--time-remaining', remaining / roundDuration);
    clock.classList.toggle('urgent', seconds <= 5);
    if (remaining === 0) {
      completeShot(current(), { name: 'No shot', score: 0, timedOut: true, label: 'Time’s up - No points' });
    }
  }

  const answerHint = 'Type your answer, then lock it in.';
  const normalizeAnswer = value => value.toLowerCase().normalize('NFD')
    .replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

  function editDistance(a, b) {
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    let earlier;
    for (let i = 1; i <= a.length; i++) {
      const row = [i];
      for (let j = 1; j <= b.length; j++) {
        row[j] = Math.min(row[j - 1] + 1, previous[j] + 1,
          previous[j - 1] + Number(a[i - 1] !== b[j - 1]));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          row[j] = Math.min(row[j], earlier[j - 2] + 1);
        }
      }
      earlier = previous;
      previous = row;
    }
    return previous[b.length];
  }

  function matchAnswer(raw, answers) {
    const candidates = answers.map(answer => ({
      answer,
      names: [answer.name, ...(answer.aliases ?? [])].map(normalizeAnswer)
    }));
    const exact = candidates.filter(({ names }) => names.includes(raw));
    if (exact.length) {
      return exact.length === 1 ? { answer: exact[0].answer, corrected: false } : null;
    }

    const maxEdits = raw.length >= 8 ? 2 : raw.length >= 4 ? 1 : 0;
    if (!maxEdits) return null;
    let bestDistance = maxEdits + 1;
    let bestAnswer = null;
    for (const { answer, names } of candidates) {
      const distance = Math.min(Infinity, ...names
        .filter(name => name.length >= 4 && Math.abs(name.length - raw.length) <= maxEdits)
        .map(name => editDistance(raw, name)));
      if (distance < bestDistance) {
        bestDistance = distance;
        bestAnswer = answer;
      } else if (distance === bestDistance) {
        bestAnswer = null;
      }
    }
    return bestAnswer ? { answer: bestAnswer, corrected: true } : null;
  }

  function clearAnswerError() {
    $('answer-input').removeAttribute('aria-invalid');
    $('input-hint').textContent = answerHint;
  }

  function score(q,a){return a.value>q.target?0:Math.min(100,Math.max(0,Math.round(100*a.value/q.target)))}
  function shotLabel(q, a, points) {
    if (a.value > q.target) return 'OB - No points';
    if (a.value === q.target) return 'Hole in one!';
    if (a.value / q.target >= 0.9) return 'On the green';
    if (points >= 75) return 'Just off the green';
    if (points >= 50) return 'Fairway finder';
    return 'In the rough';
  }

  function submit(event) {
    event.preventDefault();
    if ($('entry-area').classList.contains('hidden')) return;
    if (Date.now() >= state.deadline) {
      updateRoundClock();
      return;
    }
    const q = current();
    const input = $('answer-input');
    const raw = normalizeAnswer(input.value);
    const match = raw && matchAnswer(raw, q.answers);
    if (!match) {
      input.setAttribute('aria-invalid', 'true');
      $('input-hint').textContent = input.value.trim() ? 'Wrong hole, try again' : 'Enter an answer first.';
      input.focus();
      return;
    }
    const { answer: a, corrected } = match;
    const points = score(q, a);
    completeShot(q, {
      name: a.name, value: a.value, score: points, bust: a.value > q.target,
      corrected, label: shotLabel(q, a, points), source: q.source, url: q.url
    });
  }

  function completeShot(q, result) {
    q.result = result;
    state.deadline = null;
    persist();
    renderShot(q, true);
    if (!$('game').classList.contains('hidden')) $('next-btn').focus({ preventScroll: true });
  }

  function renderShot(q, animate = false) {
    clearInterval(roundClock);
    const result = q.result;
    const { name, value, score: points, bust, timedOut, corrected } = result;
    $('round-clock').classList.add('hidden');
    $('entry-area').classList.add('hidden');
    $('reveal').classList.remove('hidden');
    $('reveal').dataset.outcome = bust ? 'bust' : timedOut ? 'timeout' : value === q.target ? 'exact' : 'under';
    $('result-pick-label').textContent = corrected ? 'AUTOCORRECTED PICK' : timedOut ? 'ROUND RESULT' : 'YOUR PICK';
    $('result-name').textContent = name;
    $('score-chip').textContent = points;
    $('score-chip').className = 'score-chip ' + (bust || timedOut ? 'bust' : points < 75 ? 'close' : '');
    $('actual-value').textContent = timedOut ? '—' : metric(value, q.unit);
    $('difference').textContent = timedOut ? '—' : metric(Math.abs(q.target - value), q.unit);
    $('result-label').textContent = result.label;
    const source = $('source-note');
    source.classList.toggle('hidden', timedOut === true);
    $('source-link').href = q.url;
    $('source-link').textContent = q.source;
    $('next-btn').innerHTML = state.index === 4 ? 'See your score <span>↗</span>' : 'Next round <span>↗</span>';
    window.renderGolf?.(result, q.target, animate);
  }

  function advance() {
    if (!current()?.result || $('reveal').classList.contains('hidden')) return;
    state.index++;
    state.deadline = null;
    if (state.index >= 5) {
      finish();
      return;
    }
    renderRound();
  }
  function titleFor(n){return n>=475?'INSANE':n>=450?'SHARPSHOOTER':n>=400?'DANGEROUS':n>=350?'SOLID':n>=250?'MID':'ROUGH DAY'}
  function finish(){const score=state.rounds.reduce((n,q)=>n+(q.result?.score||0),0),result={rounds:state.rounds,index:5,done:true,score,date:state.date};if(!state.practice){const all=read();all.days=all.days||{};if(all.days[state.date]?.done){renderResults(all.days[state.date]);return}all.days[state.date]=result;all.history=all.history||[];if(!all.history.some(x=>x.date===state.date))all.history.push({date:state.date,score});all.history=all.history.slice(-14);const prior=all.stats||{games:0,best:0,streak:0,longest:0,lastDate:null};const yesterday=new Date(Date.parse(state.date+'T00:00:00Z')-86400000).toISOString().slice(0,10);prior.games++;prior.best=Math.max(prior.best,score);prior.streak=prior.lastDate===yesterday?prior.streak+1:prior.lastDate===state.date?prior.streak:1;prior.longest=Math.max(prior.longest,prior.streak);prior.lastDate=state.date;all.stats=prior;write(all)}renderResults(result)}
  function renderResults(result){const rounds=result.rounds||[],score=result.score??rounds.reduce((a,q)=>a+(q.result?.score||0),0),busts=rounds.filter(q=>q.result?.bust).length,perfect=rounds.filter(q=>q.result?.score===100).length;$('final-title').textContent=titleFor(score)+'.';$('total-score').textContent=String(score).padStart(3,'0');$('results-sub').textContent=state.practice?'Practice round complete. Daily stats stay untouched.':`Daily no. ${String(dayNumber()).padStart(3,'0')} · ${new Intl.DateTimeFormat('en',{weekday:'long',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(utcDate()+'T00:00:00Z'))} UTC`;$('score-list').innerHTML=rounds.map((q,i)=>`<div class="score-row"><span class="score-index">0${i+1}</span><div><div class="score-name">${escapeHtml(q.result?.name||'—')}</div><div class="score-category">${q.category} · ${q.result?.label||''}</div></div><span class="score-points">${q.result?.score??0}</span><span class="score-symbol ${q.result?.bust?'bust':''}">${q.result?.timedOut?'–':q.result?.bust?'×':q.result?.score===100?'★':'●'}</span></div>`).join('');const best=rounds.reduce((a,q)=>!a||q.result.score>a.result.score?q:a,null);$('result-metrics').innerHTML=`<div class="metric"><span>BUSTS</span><b>${busts}</b></div><div class="metric"><span>PERFECTS</span><b>${perfect}</b></div><div class="metric"><span>BEST ROUND</span><b>${best?.category||'—'}</b></div>`;$('practice-btn').textContent=state.practice?'Try another practice':'Practice mode';$('share-btn').onclick=()=>share(rounds,score,busts);tick();show('results')}
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function share(rounds,score,busts){const text=`NEAR MISS #${String(dayNumber()).padStart(3,'0')} 🎯\n\n${rounds.map(q=>q.result?.timedOut?'⌛':q.result?.bust?'🟥':q.result?.score===100?'🎯':q.result?.score>=90?'🟩':q.result?.score>=75?'🟨':q.result?.score>=50?'🟧':'⬜').join('  ')}\n\n${score}/500 · ${busts} BUST${busts===1?'':'S'}\n${window.location.host}`;try{if(navigator.share)await navigator.share({title:'My NEAR MISS score',text});else{await navigator.clipboard.writeText(text);toast('Score copied. Go compare.')}}catch(e){if(e.name!=='AbortError')toast('Could not share right now.')}}
  function tick(){const update=()=>{const n=new Date(),next=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()+1),d=Math.max(0,next-n.getTime()),h=Math.floor(d/3600000),m=Math.floor(d%3600000/60000),s=Math.floor(d%60000/1000);$('countdown').textContent=[h,m,s].map(x=>String(x).padStart(2,'0')).join(':')};update();clearInterval(window.countdownInterval);window.countdownInterval=setInterval(update,1000)}
  function openStats(){if(!$('stats').classList.contains('hidden'))return;statsReturn=views.find(view=>!$(view).classList.contains('hidden'));const all=read(),s=all.stats||{games:0,best:0,streak:0,longest:0},hist=all.history||[];$('stats-grid').innerHTML=[[s.games,'GAMES'],[s.best,'BEST SCORE'],[s.streak,'CURRENT STREAK'],[s.longest,'BEST STREAK'],[hist.length?Math.round(hist.reduce((a,x)=>a+x.score,0)/hist.length):0,'AVG SCORE'],[hist.reduce((a,x)=>a+x.score,0),'TOTAL POINTS']].map(([v,l])=>`<div class="stat-cell"><label>${l}</label><strong>${String(v).padStart(2,'0')}</strong></div>`).join('');$('chart').innerHTML=Array.from({length:7},(_,i)=>hist[hist.length-7+i]).map(x=>`<div class="chart-col"><div class="chart-bar" style="height:${Math.max(3,(x?.score||0)/5)}%" title="${x?.score||0}"></div><span>${x?.date?.slice(5)||'·'}</span></div>`).join('');show('stats')}
  function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
  $('start-btn').onclick=()=>resume()||start(false);$('answer-input').addEventListener('input', clearAnswerError);
  $('clear-input').onclick = () => {
    $('answer-input').value = '';
    clearAnswerError();
    $('answer-input').focus();
  };
  $('entry-area').addEventListener('submit', submit);
  $('next-btn').onclick=advance;$('practice-btn').onclick=()=>start(true);$('stats-open').onclick=openStats;$('stats-close').onclick=()=>show(statsReturn);$('help-open').onclick=()=>$('help-dialog').showModal();$('about-open').onclick=()=>$('about-dialog').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('daily-label').textContent=`DAILY NO. ${String(dayNumber()).padStart(3,'0')}`;$('footer-today').textContent=new Intl.DateTimeFormat('en',{month:'short',day:'numeric',timeZone:'UTC'}).format(new Date());if(!resume()){$('start-btn').textContent='Play today';}
})();
