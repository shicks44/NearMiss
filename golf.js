(() => {
  const canvas = document.getElementById('golf-course');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const tee = { x: 47, y: 79 };
  const flag = { x: 200, y: 79 };
  const water = 216;
  const swingTime = 370;
  const flightTime = 1000;
  const finishTime = 420;
  let frame;

  function rect(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), width, height);
  }

  function pixels(color, points) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (const [index, [x, y]] of points.entries()) {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.fill();
  }

  function cloud(x, y, span) {
    rect('#fceccf', x, y + 4, span, 4);
    rect('#fff6db', x + 5, y, span - 11, 5);
    rect('#fff6db', x + 10, y - 3, 7, 3);
  }

  function pine(x, y, height) {
    rect('#214e48', x + 4, y, 3, height + 4);
    rect('#295c4c', x + 2, y + 4, 7, height - 4);
    rect('#295c4c', x, y + 8, 11, height - 8);
    rect('#427759', x + 2, y + 8, 2, height - 9);
  }

  function landscape() {
    rect('#76b6b4', 0, 0, 256, 30);
    rect('#a1ccc0', 0, 30, 256, 18);
    rect('#d6dbc0', 0, 48, 256, 23);
    rect('#ffd488', 179, 10, 23, 19);
    rect('#ffd488', 182, 7, 17, 25);
    cloud(23, 18, 29);
    cloud(102, 12, 25);
    cloud(216, 25, 22);
    pixels('#6a9691', [[0, 56], [32, 35], [43, 40], [54, 31], [85, 52], [119, 40], [151, 55], [205, 38], [256, 54], [256, 71], [0, 71]]);
    pixels('#4b796c', [[0, 59], [31, 50], [54, 58], [95, 48], [129, 60], [164, 52], [195, 59], [239, 48], [256, 58], [256, 71], [0, 71]]);
    for (const [x, y, height] of [[4, 51, 16], [15, 54, 13], [62, 56, 11], [75, 54, 13], [126, 56, 11], [140, 52, 15], [244, 52, 16]]) {
      pine(x, y, height);
    }

    rect('#36784c', 0, 67, 256, 29);
    rect('#559a54', 0, 70, 256, 13);
    rect('#428750', 0, 83, 256, 8);
    rect('#2a6746', 0, 91, 256, 5);
    rect('#73a85c', 10, 76, 43, 11);
    rect('#9bbf68', 14, 76, 36, 3);
    rect('#75a954', 74, 77, 89, 4);

    rect('#b3cc6d', 185, 73, 27, 13);
    rect('#c8db7c', 189, 71, 22, 3);
    rect('#8db456', 188, 86, 24, 3);
    rect('#efcf8b', 150, 84, 15, 5);
    rect('#dfaf6b', 154, 89, 10, 2);
    rect('#153e37', 197, 79, 7, 2);
    rect('#f9f3d6', 200, 56, 1, 23);
    rect('#ff734d', 201, 56, 10, 5);
    rect('#ffab6e', 201, 56, 6, 2);

    rect('#cfca8b', 212, 75, 4, 18);
    rect('#28778c', water, 76, 40, 20);
    rect('#55a8ad', water, 76, 40, 4);
    rect('#78c9bd', 223, 82, 12, 1);
    rect('#78c9bd', 239, 87, 13, 1);
    rect('#3d919e', 218, 92, 21, 1);
  }

  function golfer(pose) {
    rect('#23463b', 22, 79, 20, 3);
    rect('#27364b', 27, 71, 4, 8);
    rect('#263445', 33, 72, 4, 7);
    rect('#f7ebce', 27, 78, 5, 2);
    rect('#f7ebce', 33, 78, 6, 2);
    rect('#e89444', 26, 63, 12, 10);
    rect('#ffb252', 26, 63, 4, 8);
    rect('#f4bd8d', 28, 55, 9, 8);
    rect('#254b4b', 27, 53, 10, 4);
    rect('#254b4b', 32, 56, 7, 2);
    rect('#382f39', 35, 58, 1, 2);
    const clubs = [
      [[36, 66], [40, 68], [43, 76], [46, 77]],
      [[36, 64], [32, 61], [23, 54], [21, 55]],
      [[36, 64], [39, 61], [45, 50], [48, 49]]
    ];
    const [shoulder, hands, shaft, head] = clubs[pose];
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f4bd8d';
    ctx.beginPath();
    ctx.moveTo(...shoulder);
    ctx.lineTo(...hands);
    ctx.stroke();
    ctx.strokeStyle = '#f6e9cc';
    ctx.beginPath();
    ctx.moveTo(...hands);
    ctx.lineTo(...shaft);
    ctx.lineTo(...head);
    ctx.stroke();
  }

  function ball(x, y) {
    rect('#344753', x - 2, y - 2, 5, 5);
    rect('#fff9df', x - 1, y - 2, 3, 3);
  }

  function draw(elapsed = 0, result, ratio = 0) {
    landscape();
    const ready = !result || result.timedOut;
    const flying = !ready && elapsed >= swingTime;
    golfer(flying ? 2 : elapsed > 110 && !ready ? 1 : 0);
    if (!flying) {
      ball(tee.x, tee.y - 2);
      return;
    }

    const travel = Math.min(1, (elapsed - swingTime) / flightTime);
    const beyond = result.bust;
    const exact = ratio === 1;
    const landing = beyond ? Math.min(249, 222 + (ratio - 1) * 28)
      : tee.x + (flag.x - tee.x) * Math.max(0, ratio);
    const landingY = beyond ? 82 : flag.y;
    const x = tee.x + (landing - tee.x) * travel;
    const arc = Math.sin(Math.PI * travel) * (25 + 21 * Math.min(1, ratio));
    const y = tee.y - 2 + (landingY - tee.y + 2) * travel - arc;
    const settled = Math.min(1, Math.max(0, (elapsed - swingTime - flightTime) / finishTime));
    rect('#254f42', x - 3, landingY + 3, 7, 1);
    if (travel < 1 || (!beyond && !exact)) {
      const bounce = Math.sin(settled * Math.PI * 2) ** 2 * (1 - settled) * 6;
      ball(x, y - bounce);
    } else if (beyond) {
      const spread = 4 + settled * 11;
      rect('#9fe0d4', x - spread, y + 3, Math.round(spread * 2), 1);
      rect('#def8db', x - spread / 2, y - (1 - settled) * 11, 2, 3);
      rect('#b8eedc', x + spread / 2, y - (1 - settled) * 8, 2, 2);
    } else {
      rect('#fff1a4', flag.x - 4, flag.y - 5, 9, 1);
      rect('#fff1a4', flag.x, flag.y - 9, 1, 9);
    }
  }

  window.renderGolf = (result, target, animate = false) => {
    cancelAnimationFrame(frame);
    const ratio = result?.value != null ? result.value / target : 0;
    const duration = swingTime + flightTime + finishTime;
    if (!animate || !result || result.timedOut || reduceMotion.matches) {
      draw(result ? duration : 0, result, ratio);
      return;
    }
    draw(0, result, ratio);
    const start = performance.now();
    function tick(now) {
      const elapsed = Math.min(duration, now - start);
      draw(elapsed, result, ratio);
      if (elapsed < duration) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  };
})();
