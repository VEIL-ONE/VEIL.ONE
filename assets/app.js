// Simple minimalist snake game + issued button micro-interactions
(() => {
  // Issued button micro-animation
  const btn = document.getElementById('issuedBtn');
  btn.addEventListener('click', () => {
    btn.blur();
    btn.classList.add('pressed');
    btn.style.transform = 'scale(0.98)';
    setTimeout(()=>{btn.style.transform='';btn.classList.remove('pressed')},220);
  });

  // Snake game
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const scale = 20; // size of each cell
  const rows = Math.floor(canvas.height / scale);
  const cols = Math.floor(canvas.width / scale);

  let snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
  let dir = {x:1,y:0};
  let apple = randomApple();
  let speed = 120; // ms per tick
  let running = true;

  function randomApple(){
    return {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
  }

  function draw(){
    // background
    ctx.fillStyle = '#020202';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // apple
    ctx.fillStyle = '#ff4d6d';
    ctx.fillRect(apple.x*scale+2, apple.y*scale+2, scale-4, scale-4);

    // snake
    for(let i=0;i<snake.length;i++){
      const s = snake[i];
      ctx.fillStyle = i===0 ? '#00ffd8' : '#0debb3';
      ctx.fillRect(s.x*scale+1, s.y*scale+1, scale-2, scale-2);
    }

    // subtle brand overlay
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = '#ffffff';
    ctx.font = '80px sans-serif';
    ctx.fillText('VEIL / ONE', 10, canvas.height - 10);
    ctx.globalAlpha = 1;
  }

  function tick(){
    if(!running) return;
    // move
    const head = {x: (snake[0].x + dir.x + cols)%cols, y: (snake[0].y + dir.y + rows)%rows};

    // collision with self
    if(snake.some(s => s.x===head.x && s.y===head.y)){
      // reset
      snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
      dir = {x:1,y:0};
      apple = randomApple();
    } else {
      snake.unshift(head);
      // eat apple
      if(head.x===apple.x && head.y===apple.y){
        apple = randomApple();
      } else {
        snake.pop();
      }
    }

    draw();
  }

  // controls
  window.addEventListener('keydown', e => {
    const k = e.key;
    if(k==='ArrowUp' && dir.y===0) dir = {x:0,y:-1};
    if(k==='ArrowDown' && dir.y===0) dir = {x:0,y:1};
    if(k==='ArrowLeft' && dir.x===0) dir = {x:-1,y:0};
    if(k==='ArrowRight' && dir.x===0) dir = {x:1,y:0};
    if(k===' '){ running = !running; }
  });

  // touch controls for mobile (simple swipe)
  let touchStart = null;
  canvas.addEventListener('touchstart', e => { touchStart = e.touches[0]; });
  canvas.addEventListener('touchend', e => {
    if(!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.clientX; const dy = t.clientY - touchStart.clientY;
    if(Math.abs(dx) > Math.abs(dy)){
      if(dx>10 && dir.x===0) dir={x:1,y:0};
      if(dx<-10 && dir.x===0) dir={x:-1,y:0};
    } else {
      if(dy>10 && dir.y===0) dir={x:0,y:1};
      if(dy<-10 && dir.y===0) dir={x:0,y:-1};
    }
    touchStart=null;
  });

  // start loop
  draw();
  setInterval(tick, speed);
})();
