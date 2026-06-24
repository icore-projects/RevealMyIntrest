(function(){

  const categories = [
    {key:'electronics', label:'Electronics',              eyebrow:'About electronics & hardware',           colorVar:'--electronics-bright', colorBase:'--electronics'},
    {key:'software',     label:'Software & IT',            eyebrow:'About software & IT',                    colorVar:'--software-bright',     colorBase:'--software'},
    {key:'manpower',     label:'Manpower / Field Work',     eyebrow:'About hands-on & field work',            colorVar:'--manpower-bright',     colorBase:'--manpower'},
    {key:'bpa',          label:'BPA — Business Process',    eyebrow:'About business process & office work',   colorVar:'--bpa-bright',          colorBase:'--bpa'},
  ];

  const questions = [
    // ELECTRONICS
    {cat:'electronics', text:"I enjoy taking apart gadgets or appliances just to see how they work inside."},
    {cat:'electronics', text:"I find it interesting to learn about circuits, sensors, and electronic components."},
    {cat:'electronics', text:"I'd rather try repairing a broken device than just replace it."},
    {cat:'electronics', text:"I'm curious about how machines, robots, or embedded systems actually function."},
    {cat:'electronics', text:"I enjoy hands-on lab work involving wiring, soldering, or testing circuits."},
    {cat:'electronics', text:"News about new electronic gadgets or hardware excites me more than most other news."},

    // SOFTWARE / IT
    {cat:'software', text:"I enjoy writing code or solving logical and programming puzzles."},
    {cat:'software', text:"I like exploring new apps, software tools, or websites to understand how they're built."},
    {cat:'software', text:"I can sit with a bug for hours until I find what's actually wrong."},
    {cat:'software', text:"Building or fixing something inside a database, website, or app genuinely interests me."},
    {cat:'software', text:"I enjoy picking up a new programming language or tool on my own time."},
    {cat:'software', text:"Given the choice, I'd pick a computer-based job over a hands-on physical one."},

    // MANPOWER / FIELD WORK
    {cat:'manpower', text:"I'd rather be active and moving around than sitting at a desk all day."},
    {cat:'manpower', text:"I'm comfortable working with tools, machinery, or out on a worksite."},
    {cat:'manpower', text:"I don't mind physical work, and I don't mind getting my hands dirty."},
    {cat:'manpower', text:"I'd rather supervise or coordinate a team on-site than work alone on a screen."},
    {cat:'manpower', text:"I feel confident handling tasks that need physical effort or stamina."},
    {cat:'manpower', text:"On-field jobs — construction, maintenance, logistics, operations — appeal to me more than office jobs."},

    // BPA / BUSINESS PROCESS
    {cat:'bpa', text:"I actually like following a clear, structured process rather than figuring things out from scratch each time."},
    {cat:'bpa', text:"I'm comfortable with documentation, data entry, or paperwork-heavy tasks."},
    {cat:'bpa', text:"I enjoy interacting with customers or clients and resolving their queries."},
    {cat:'bpa', text:"I'd rather have a stable, predictable office routine than an unpredictable one."},
    {cat:'bpa', text:"I'm good at maintaining records, schedules, and following procedures precisely."},
    {cat:'bpa', text:"A desk job built around communication, coordination, or back-office support would suit me."},
  ];

  const catNotes = {
    electronics: {
      low:"Circuits and hardware don't pull at your attention much yet.",
      mid:"Hardware interests you sometimes, but it's not the first thing you reach for.",
      high:"Taking things apart and seeing how they work genuinely excites you."
    },
    software: {
      low:"Code and software aren't where your attention naturally goes.",
      mid:"You can engage with software work, but it doesn't fully grab you yet.",
      high:"Logic, code, and digital systems are where your attention naturally goes."
    },
    manpower: {
      low:"Physical, on-site work isn't where you picture yourself.",
      mid:"You don't mind hands-on or field work, but it's not your first choice.",
      high:"Being active, on-site, and hands-on is genuinely where you feel useful."
    },
    bpa: {
      low:"Structured, paperwork-heavy office work feels more like a chore than a fit.",
      mid:"You can handle process-driven office work, just without much enthusiasm.",
      high:"Process, documentation, and structured office work feel natural to you."
    }
  };

  const fieldProfiles = {
    electronics: {
      tagline:"Hardware pulls you in.",
      blurb:"You're drawn to the physical side of technology — circuits, devices, the moment something stops being a black box and starts being a system you understand. Electronics & Communication, Electrical, Instrumentation, or embedded-systems roles would let you keep building things you can actually hold."
    },
    software: {
      tagline:"Code and logic pull you in.",
      blurb:"You're drawn to building and fixing things that live on a screen — apps, websites, systems — the kind of problem you solve by thinking harder, not moving your hands. Computer Science, IT, software development, or related tech roles match this pull well."
    },
    manpower: {
      tagline:"Hands-on, on-ground work pulls you in.",
      blurb:"You're drawn to work where you see and feel the result immediately — being active, working with people and machines on-site rather than at a desk. Technician, supervisor, field operations, logistics, or skilled-trade roles would use this strength well."
    },
    bpa: {
      tagline:"Structured office & process work pulls you in.",
      blurb:"You're drawn to order — clear processes, documentation, communication, getting things right and repeatable. Business process, back-office, admin, or customer-facing roles in BPO/ITES and corporate operations would suit this naturally."
    }
  };

  function noteFor(score){
    if(score<40) return 'low';
    if(score<70) return 'mid';
    return 'high';
  }

  // ---------------- STATE ----------------
  let current = 0;
  const answers = new Array(questions.length).fill(null);

  const screens = {
    intro: document.getElementById('screen-intro'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result'),
  };
  function showScreen(name){
    Object.values(screens).forEach(s=>s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  const qCatEl = document.getElementById('q-cat');
  const qTextEl = document.getElementById('q-text');
  const dotsEl = document.getElementById('scale-dots');
  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-fill');
  const backBtn = document.getElementById('back-btn');
  const root = document.documentElement;

  function renderQuestion(){
    const q = questions[current];
    const cat = categories.find(c=>c.key===q.cat);
    root.style.setProperty('--accent', `var(${cat.colorVar})`);
    qCatEl.textContent = cat.eyebrow;
    qTextEl.textContent = q.text;
    progressText.textContent = `Question ${current+1} of ${questions.length}`;
    progressFill.style.width = (current/questions.length*100) + '%';
    backBtn.disabled = current===0;

    dotsEl.innerHTML = '';
    for(let v=1; v<=5; v++){
      const b = document.createElement('button');
      b.className = 'dot-btn' + (answers[current]===v ? ' active' : '');
      b.setAttribute('aria-label', 'Answer ' + v + ' of 5');
      b.addEventListener('click', ()=>selectAnswer(v));
      dotsEl.appendChild(b);
    }
  }

  function selectAnswer(value){
    answers[current] = value;
    renderQuestion();
    setTimeout(()=>{
      if(current < questions.length-1){
        current++;
        renderQuestion();
      } else {
        buildResults();
        showScreen('result');
      }
    }, 280);
  }

  backBtn.addEventListener('click', ()=>{
    if(current>0){ current--; renderQuestion(); }
  });

  document.getElementById('start-btn').addEventListener('click', ()=>{
    current = 0;
    renderQuestion();
    showScreen('quiz');
  });

  document.getElementById('retake-btn').addEventListener('click', ()=>{
    current = 0;
    answers.fill(null);
    renderQuestion();
    showScreen('intro');
  });

  // ---------------- RESULTS ----------------
  function scoreFor(catKey){
    const vals = [];
    questions.forEach((q,i)=>{ if(q.cat===catKey) vals.push(answers[i]); });
    const sum = vals.reduce((a,b)=>a+(b||3),0);
    const avg = sum/vals.length; // 1..5
    return Math.round((avg-1)/4*100); // 0..100
  }

  function polar(angleDeg, radius, cx, cy){
    const rad = (angleDeg-90) * Math.PI/180;
    return { x: cx + radius*Math.cos(rad), y: cy + radius*Math.sin(rad) };
  }

  function buildRing(scores, topColorVar){
    const cx=150, cy=150, maxR=104, n=categories.length, step=360/n;
    let svg = `<svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg">`;

    // guide rings
    [0.25,0.5,0.75,1].forEach(f=>{
      let pts=[];
      for(let i=0;i<n;i++){
        const p = polar(i*step, maxR*f, cx, cy);
        pts.push(p.x.toFixed(1)+','+p.y.toFixed(1));
      }
      svg += `<polygon points="${pts.join(' ')}" fill="none" stroke="var(--line)" stroke-width="1"/>`;
    });

    // spokes
    for(let i=0;i<n;i++){
      const p = polar(i*step, maxR, cx, cy);
      svg += `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="var(--line)" stroke-width="1"/>`;
    }

    // data polygon
    let dataPts=[];
    for(let i=0;i<n;i++){
      const r = (scores[i]/100)*maxR;
      const p = polar(i*step, r, cx, cy);
      dataPts.push(p);
    }
    svg += `<polygon points="${dataPts.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ')}" fill="var(${topColorVar})" fill-opacity="0.16" stroke="var(${topColorVar})" stroke-width="1.5"/>`;

    // dots — each colored by its own category
    dataPts.forEach((p,i)=>{
      svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="var(${categories[i].colorVar})"/>`;
    });

    // labels
    for(let i=0;i<n;i++){
      const lp = polar(i*step, maxR+34, cx, cy);
      const dx = lp.x - cx;
      const dy = lp.y - cy;
      let anchor = 'middle';
      if(dx > 8) anchor = 'start';
      else if(dx < -8) anchor = 'end';
      let baseline = 4;
      if(dy < -8) baseline = -2;
      else if(dy > 8) baseline = 11;
      const lines = categories[i].label.toUpperCase().split(' / ').join(' ').split(' & ');
      svg += `<text x="${lp.x.toFixed(1)}" y="${(lp.y+baseline).toFixed(1)}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-size="9.5" letter-spacing="0.4" fill="var(--paper-dim)">${categories[i].label.toUpperCase()}</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  function buildLegend(){
    const legendEl = document.getElementById('legend');
    legendEl.innerHTML = categories.map(c=>`
      <div class="legend-item">
        <span class="swatch" style="background:var(${c.colorVar})"></span> ${c.label}
      </div>
    `).join('') + `<div class="legend-item" style="max-width:210px; color:var(--paper-faint); margin-top:6px;">Each spoke is one field. The shape is your pattern, not a ranking of worth.</div>`;
  }

  function buildResults(){
    const scores = categories.map(c=>scoreFor(c.key));
    const maxScore = Math.max(...scores);
    const topIdx = categories.map((c,i)=>i).filter(i=>scores[i]===maxScore);

    // sort all indices by score desc for "second pull" check
    const sortedIdx = categories.map((c,i)=>i).sort((a,b)=>scores[b]-scores[a]);
    const topColorVar = categories[topIdx[0]].colorVar;

    document.getElementById('result-pct-num').textContent = maxScore;

    if(topIdx.length === 1){
      const top = categories[topIdx[0]];
      const profile = fieldProfiles[top.key];
      document.getElementById('result-pct-sup').textContent = `% pull toward ${top.label}`;
      document.getElementById('result-title').textContent = profile.tagline;
      document.getElementById('result-blurb').textContent = profile.blurb;

      const secondIdx = sortedIdx[1];
      const secondEl = document.getElementById('result-second');
      if(secondIdx !== undefined && (maxScore - scores[secondIdx]) <= 10 && maxScore !== scores[secondIdx]){
        secondEl.textContent = `Your second-strongest pull is toward ${categories[secondIdx].label} (${scores[secondIdx]}%) — close enough that it's worth keeping in view too.`;
        secondEl.classList.remove('hidden');
      } else {
        secondEl.classList.add('hidden');
      }
    } else {
      const names = topIdx.map(i=>categories[i].label).join(' & ');
      document.getElementById('result-pct-sup').textContent = `% — tied pull`;
      document.getElementById('result-title').textContent = `${names} are pulling equally.`;
      document.getElementById('result-blurb').textContent = "Two paths are tugging at you with about the same strength right now. That's more common than it sounds, and it usually means both are genuinely worth exploring further — through a project, an internship, or just talking to someone already in each field — before you commit to one.";
      document.getElementById('result-second').classList.add('hidden');
    }

    document.getElementById('ring-wrap').innerHTML = buildRing(scores, topColorVar);
    buildLegend();

    const rowsEl = document.getElementById('cat-rows');
    rowsEl.innerHTML = '';
    categories.forEach((c,i)=>{
      const score = scores[i];
      const note = catNotes[c.key][noteFor(score)];
      const row = document.createElement('div');
      row.className = 'cat-row';
      row.innerHTML = `
        <div class="cat-row-top">
          <span class="cat-row-name">${c.label}</span>
          <span class="cat-row-score">${score}%</span>
        </div>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${score}%; background:var(${c.colorVar})"></div></div>
        <div class="cat-row-note">"${note}"</div>
      `;
      rowsEl.appendChild(row);
    });
  }

  renderQuestion();

})();
