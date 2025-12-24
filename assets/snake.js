// Minimal, clean snake game optimized for subtlety and responsiveness.
(function(){
  const canvas = document.getElementById('snake');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');

  // Logical grid (keeps the game crisp across sizes)
  const GRID = 16; // number of cells per row in logical space
  let size = Math.min(canvas.width, canvas.height);
  let cell = Math.floor(size / GRID);

  let snake = [{x:6,y:8},{x:5,y:8},{x:4,y:8}];
  let dir = {x:1,y:0};
  let apple = spawnApple();
  let lastMove = 0;
  const speed = 120; // ms per move (slow, subtle)
  let running = true;
  let score = 0;

  function resize(){
    size = Math.min(canvas.clientWidth, canvas.clientHeight);
    canvas.width = size;
    canvas.height = size;
    cell = Math.max(8, Math.floor(size / GRID));
    draw();
  }
  window.addEventListener('resize', resize);
  resize();

  function spawnApple(){
    const occupied = new Set(snake.map(s=>s.x+','+s.y));
    while(true){
      const x = Math.floor(Math.random()*GRID);
      const y = Math.floor(Math.random()*GRID);
      if(!occupied.has(x+','+y)) return {x,y};
    }
  }

  function draw(){
    // backdrop
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // subtle grid background
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw apple
    drawCell(apple.x, apple.y, 'linear-gradient');

    // draw snake
    for(let i=0;i<snake.length;i++){
      const s = snake[i];
      const t = i===0 ? 0.95 : 0.6 - (i/snake.length)*0.4;
      ctx.fillStyle = `rgba(122,227,255,${t})`;
      roundRect((s.x*cell)+cell*0.08, (s.y*cell)+cell*0.08, cell*0.84, cell*0.84, cell*0.18);
      ctx.fill();
    }

    // overlay subtle gloss on head
    const hd = snake[0];
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    roundRect((hd.x*cell)+cell*0.08, (hd.y*cell)+cell*0.08, cell*0.84, cell*0.38, cell*0.18);
    ctx.fill();

    scoreEl.textContent = `— ${score}`;
  }

  function drawCell(gx, gy){
    // apple style
    const x = gx*cell; const y=gy*cell;
    const r = cell*0.12;
    const grad = ctx.createLinearGradient(x,y,x+cell,y+cell);
    grad.addColorStop(0,'#7ae3ff');
    grad.addColorStop(1,'#59b5d6');
    ctx.fillStyle = grad;
    roundRect(x+cell*0.12, y+cell*0.12, cell*0.76, cell*0.76, r);
    ctx.fill();
  }

  function roundRect(x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  function step(ts){
    if(!lastMove) lastMove = ts;
    if(ts - lastMove > speed){
      lastMove = ts;
      if(running){
        moveSnake();
      }
    }
    draw();
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  function moveSnake(){
    const head = {x: (snake[0].x + dir.x + GRID) % GRID, y: (snake[0].y + dir.y + GRID) % GRID };
    // collision with self
    if(snake.some(s=>s.x===head.x && s.y===head.y)){
      // reset subtle
      snake = [{x:6,y:8},{x:5,y:8},{x:4,y:8}];
      dir = {x:1,y:0};
      apple = spawnApple();
      score = 0;
      return;
    }
    snake.unshift(head);
    if(head.x===apple.x && head.y===apple.y){
      score += 1;
      apple = spawnApple();
    } else {
      snake.pop();
    }
  }

  // input - arrows + swipe for mobile
  window.addEventListener('keydown', e=>{
    const k = e.key;
    if(k==='ArrowUp' && dir.y!==1) dir={x:0,y:-1};
    if(k==='ArrowDown' && dir.y!==-1) dir={x:0,y:1};
    if(k==='ArrowLeft' && dir.x!==1) dir={x:-1,y:0};
    if(k==='ArrowRight' && dir.x!==-1) dir={x:1,y:0};
  });

  let touchStart = null;
  window.addEventListener('touchstart', e=>{ touchStart = e.changedTouches[0]; });
  window.addEventListener('touchend', e=>{
    if(!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.clientX;
    const dy = t.clientY - touchStart.clientY;
    if(Math.abs(dx) > Math.abs(dy)){
      if(dx>10 && dir.x!==-1) dir={x:1,y:0};
      if(dx<-10 && dir.x!==1) dir={x:-1,y:0};
    } else {
      if(dy>10 && dir.y!==-1) dir={x:0,y:1};
      if(dy<-10 && dir.y!==1) dir={x:0,y:-1};
    }
    touchStart = null;
  });

  // ensure initial fit
  resize();
})();
