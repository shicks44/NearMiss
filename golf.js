(() => {
  const canvas = document.getElementById('golf-course');
  let ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const tee = { x: 47, y: 79 };
  const greenOffset = 64;
  const flag = { x: 200 + greenOffset, y: 79 };
  const water = 216;
  const swingTime = 370;
  const flightTime = 1900;
  const overshootFlightTime = 1450;
  const isExtremeOvershoot = ratio => ratio >= 8;
  const courseWidth = 256 + greenOffset;
  const courseHeight = 104;
  const finishTime = 420;
  const rollTime = 1050;
  const whiffTime = 1300;
  let frame;
  let finishShot;
  let lastScene = [];
  let selectedCourse = 'pine';
  let ballColor = '#fff9df';

  const courses = {
    pine: {
      sky: ['#76b6b4', '#a1ccc0', '#d6dbc0'], light: '#ffd488',
      ridges: ['#6a9691', '#4b796c'], ground: ['#36784c', '#559a54', '#428750', '#2a6746']
    },
    desert: {
      sky: ['#dd916e', '#efb382', '#f3cf98'], light: '#ffecab',
      ridges: ['#ba765b', '#955445'], ground: ['#8a733e', '#a69950', '#937e46', '#795b3c']
    },
    alpine: {
      sky: ['#758dad', '#a7b9d0', '#d9e2e6'], light: '#f8efdd',
      ridges: ['#aac1d0', '#657d9a'], ground: ['#839fae', '#b6cdd1', '#9fb4ba', '#647f8d']
    },
    moon: {
      sky: ['#171c3a', '#292957', '#4a4b77'], light: '#bacbf0',
      ridges: ['#736c9c', '#484b71'], ground: ['#45485a', '#757787', '#5b5f75', '#363b50']
    },
    coast: {
      sky: ['#73b9d8', '#b8dddd', '#e5e6c6'], light: '#fff0b1',
      ridges: ['#77a8b2', '#478394'], ground: ['#387861', '#68a46b', '#519470', '#325f54']
    },
    autumn: {
      sky: ['#dd8f60', '#e9ad6b', '#f1cb85'], light: '#ffe5a3',
      ridges: ['#987166', '#755758'], ground: ['#7d713d', '#9ba14c', '#8a8345', '#6a5e41']
    },
    marsh: {
      sky: ['#78918c', '#a1b1a1', '#ced0ac'], light: '#ddd7a2',
      ridges: ['#829d8b', '#618d78'], ground: ['#3a6b56', '#5e8f5f', '#4e7f65', '#315a51']
    },
    volcano: {
      sky: ['#432d40', '#a54c45', '#e5784e'], light: '#ffc585',
      ridges: ['#73464d', '#513841'], ground: ['#584849', '#766055', '#65524f', '#453c43'],
      hazard: ['#842f39', '#e95c3b', '#ffa350', '#ffc16c', '#ffde95']
    },
    aurora: {
      sky: ['#14283e', '#23445d', '#52687d'], light: '#c9dced',
      ridges: ['#7890a9', '#4a647c'], ground: ['#7c9ba9', '#adc8c9', '#92aeb7', '#557486']
    }
  };

  const surfaceFeel = {
    desert: { bounce: 7 },
    coast: { arc: 0.76, flight: 1700 },
    alpine: { roll: 1550, distance: 35, bounce: 3 },
    autumn: { roll: 880, distance: 20 },
    marsh: { roll: 670, distance: 14, bounce: 3 },
    volcano: { bounce: 11 },
    moon: { arc: 1.64, flight: 2700, roll: 1480, distance: 32, bounce: 8 },
    aurora: { arc: 1.28, flight: 2200, roll: 1650, distance: 36, bounce: 3 }
  };
  const waterColors = ['#28778c', '#55a8ad', '#9fe0d4', '#def8db', '#b8eedc'];

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

  function landmark(course) {
    if (course === 'coast') {
      rect('#438ba4', 0, 55, 256, 12);
      rect('#75bed0', 0, 55, 256, 2);
      rect('#e9ddbf', 126, 39, 7, 25);
      rect('#b84c45', 126, 44, 7, 4);
      rect('#b84c45', 126, 55, 7, 4);
      rect('#743a41', 124, 37, 11, 3);
      rect('#f9e3a4', 127, 38, 5, 3);
      rect('#5b7969', 119, 63, 20, 4);
    } else if (course === 'volcano') {
      pixels('#4a3440', [[72, 60], [104, 47], [124, 27], [136, 29], [167, 61]]);
      pixels('#fc7747', [[125, 28], [135, 29], [142, 42], [136, 40], [129, 32]]);
      rect('#ef9870', 124, 19, 5, 3);
      rect('#ec7954', 133, 13, 3, 3);
    } else if (course === 'aurora') {
      pixels('#447b79', [[0, 21], [41, 29], [77, 26], [130, 8], [165, 13], [200, 24], [256, 20], [256, 26], [199, 30], [164, 20], [131, 18], [82, 34], [42, 35], [0, 29]]);
      pixels('#8ec29e', [[0, 25], [42, 33], [83, 30], [133, 16], [166, 20], [200, 28], [256, 24], [256, 26], [200, 31], [165, 23], [132, 19], [85, 34], [42, 36], [0, 29]]);
    }
  }

  function landscape() {
    const { sky, light, ridges, ground, hazard = waterColors } = courses[selectedCourse];
    rect(sky[0], 0, 0, courseWidth, 30);
    rect(sky[1], 0, 30, courseWidth, 18);
    rect(sky[2], 0, 48, courseWidth, 23);
    rect(light, 179, 10, 23, 19);
    rect(light, 182, 7, 17, 25);
    ctx.save();
    ctx.scale(courseWidth / 256, 1);
    if (selectedCourse === 'moon' || selectedCourse === 'aurora') {
      for (const [x, y] of [[14, 13], [37, 31], [61, 18], [82, 5], [112, 29], [145, 17], [213, 15], [237, 6]]) {
        rect('#e5dcf0', x, y, 2, 2);
      }
    } else {
      cloud(23, 18, 29);
      cloud(102, 12, 25);
      cloud(216, 25, 22);
    }
    if (selectedCourse === 'desert') {
      pixels(ridges[0], [[0, 58], [28, 44], [68, 44], [92, 59], [111, 49], [149, 49], [190, 61], [213, 47], [246, 47], [256, 52], [256, 71], [0, 71]]);
      pixels(ridges[1], [[0, 61], [32, 55], [59, 55], [94, 63], [134, 58], [185, 61], [226, 55], [256, 59], [256, 71], [0, 71]]);
      for (const [x, y, height] of [[10, 51, 22], [65, 55, 17], [129, 53, 20], [244, 54, 19]]) {
        rect('#4c6940', x, y, 4, height);
        rect('#4c6940', x - 4, y + 6, 2, 7);
        rect('#4c6940', x - 4, y + 11, 7, 3);
        rect('#4c6940', x + 2, y + 8, 7, 3);
        rect('#4c6940', x + 7, y + 4, 2, 7);
      }
    } else {
      pixels(ridges[0], [[0, 56], [32, 35], [43, 40], [54, 31], [85, 52], [119, 40], [151, 55], [205, 38], [256, 54], [256, 71], [0, 71]]);
      pixels(ridges[1], [[0, 59], [31, 50], [54, 58], [95, 48], [129, 60], [164, 52], [195, 59], [239, 48], [256, 58], [256, 71], [0, 71]]);
      if (selectedCourse === 'alpine') {
        pixels('#e7eff4', [[45, 40], [54, 31], [66, 39], [59, 38], [56, 43], [52, 37]]);
        pixels('#e7eff4', [[192, 42], [205, 38], [219, 42], [210, 42], [207, 47], [202, 42]]);
      }
      landmark(selectedCourse);
      for (const [i, [x, y, height]] of [[4, 51, 16], [15, 54, 13], [62, 56, 11], [75, 54, 13], [126, 56, 11], [140, 52, 15], [244, 52, 16]].entries()) {
        if (selectedCourse === 'autumn') {
          rect('#64483a', x + 4, y + 7, 3, height);
          rect(i % 2 ? '#c27240' : '#de9f49', x, y + 4, 11, 7);
          rect(i % 2 ? '#df8a43' : '#efb757', x + 2, y + 1, 7, 7);
        } else if (selectedCourse === 'marsh') {
          rect('#486f56', x + 4, y + 11, 1, 13);
          rect('#57734a', x, y + 14, 1, 12);
          rect('#897357', x + 3, y + 10, 3, 3);
        } else if (selectedCourse === 'moon' || selectedCourse === 'volcano') {
          rect('#a697b2', x, y + 9, 8, 3);
          rect('#716982', x + 2, y + 12, 5, height - 6);
        } else {
          pine(x, y, height);
          if (selectedCourse === 'alpine' || selectedCourse === 'aurora') rect('#e4eff5', x + 2, y + 8, 7, 2);
        }
      }
    }

    ctx.restore();

    rect(ground[0], 0, 67, courseWidth, courseHeight - 67);
    rect(ground[1], 0, 70, courseWidth, 13);
    rect(ground[2], 0, 83, courseWidth, 8);
    rect(ground[3], 0, 91, courseWidth, courseHeight - 91);
    rect('#73a85c', 10, 76, 43, 11);
    rect('#9bbf68', 14, 76, 36, 3);
    rect('#75a954', 74, 77, 89 + greenOffset, 4);
    rect(ground[2], 102, 84, 22, 2);
    rect(ground[0], 167, 72, 15, 2);
    rect('#5a8054', 149, 81, 5, 2);
    rect('#5a8054', 190, 83, 8, 2);

    ctx.save();
    ctx.translate(greenOffset, 0);

    if (selectedCourse === 'marsh') {
      rect('#417e7d', 113, 87, 26, 4);
      rect('#77a377', 120, 87, 6, 2);
      rect('#c9a4ac', 122, 86, 2, 1);
    }
    if (selectedCourse === 'moon') {
      rect('#4e526b', 93, 85, 25, 4);
      rect('#9093aa', 96, 84, 15, 1);
    }

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
    rect(hazard[0], water, 76, 40, courseHeight - 76);
    rect(hazard[1], water, 76, 40, 4);
    rect(hazard[2], 223, 82, 12, 1);
    rect(hazard[2], 239, 87, 13, 1);
    rect('#3d919e', 218, 92, 21, 1);
    ctx.restore();
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
    rect(ballColor, x - 1, y - 2, 3, 3);
  }

  function draw(elapsed = 0, result, ratio = 0) {
    lastScene = [elapsed, result, ratio];
    const whiff = result?.timedOut;
    const flying = Boolean(result && !whiff && elapsed >= swingTime);
    const beyond = result?.bust;
    const extreme = beyond && isExtremeOvershoot(ratio);
    const motion = surfaceFeel[selectedCourse] ?? {};
    const shotFlightTime = extreme ? overshootFlightTime : motion.flight ?? flightTime;
    const shotRollTime = motion.roll ?? rollTime;
    const travel = flying ? Math.min(1, (elapsed - swingTime) / shotFlightTime) : 0;
    const exact = ratio === 1;
    const landing = extreme ? courseWidth + canvas.width
      : beyond ? Math.min(courseWidth - 7, flag.x + 22 + (ratio - 1) * 28)
      : tee.x + (flag.x - tee.x) * Math.max(0, ratio);
    const rolling = flying && !beyond;
    const settled = flying ? Math.max(0, (elapsed - swingTime - shotFlightTime) / (rolling ? shotRollTime : finishTime)) : 0;
    const rollDistance = rolling ? Math.min(motion.distance ?? 25, (landing - tee.x) * 0.27) : 0;
    const roll = 1 - (1 - Math.min(1, settled)) ** 3;
    const x = tee.x + (landing - tee.x - rollDistance) * travel + rollDistance * roll;
    const cameraX = Math.min(courseWidth - canvas.width, Math.max(0, x - Math.max(tee.x, canvas.width * 0.48)));
    ctx.setTransform(1, 0, 0, 1, -Math.round(cameraX), 0);
    landscape();
    if (whiff) {
      const stumble = Math.max(0, Math.min(1, (elapsed - swingTime) / (whiffTime - swingTime)));
      ctx.save();
      ctx.translate(33 - 11 * stumble, 69 + 5 * stumble);
      ctx.rotate(stumble * Math.PI * 2.5);
      ctx.translate(-33, -69);
      golfer(elapsed >= swingTime ? 2 : elapsed > 110 ? 1 : 0);
      ctx.restore();
      ball(tee.x, tee.y - 2);
      return;
    }
    golfer(flying ? 2 : elapsed > 110 && result ? 1 : 0);
    if (!flying) {
      ball(tee.x, tee.y - 2);
      return;
    }

    if (extreme) {
      for (const [delay, length, color] of [[0.08, 2, '#eabf78'], [0.04, 4, '#fff1a4']]) {
        const behind = Math.max(0, travel - delay);
        const trailX = tee.x + (landing - tee.x) * behind;
        const trailY = tee.y - 2 - behind * 135 - Math.sin(Math.PI * behind) * 40;
        rect(color, trailX, trailY, length, 2);
      }
      ball(x, tee.y - 2 - travel * 135 - Math.sin(Math.PI * travel) * 40);
      return;
    }

    const landingY = beyond ? 82 : flag.y;
    const arc = Math.sin(Math.PI * travel) * (18 + 17 * Math.min(1, ratio)) * (motion.arc ?? 1);
    const y = tee.y - 2 + (landingY - tee.y + 2) * travel - arc;
    const bounce = Math.sin(Math.min(1, settled * 3) * Math.PI * 2) ** 2
      * Math.max(0, 1 - settled * 3) * (motion.bounce ?? 5);
    rect('#254f42', x - 3, landingY + 3, 7, 1);
    if (travel < 1 || (!beyond && (!exact || settled < 0.9))) {
      ball(x, y - bounce);
    } else if (beyond) {
      const spread = 4 + settled * 11;
      const hazard = courses[selectedCourse].hazard ?? waterColors;
      rect(hazard[2], x - spread, y + 3, Math.round(spread * 2), 1);
      rect(hazard[3], x - spread / 2, y - (1 - settled) * 11, 2, 3);
      rect(hazard[4], x + spread / 2, y - (1 - settled) * 8, 2, 2);
    } else {
      const drop = Math.max(0, settled - 0.9) * shotRollTime / finishTime;
      if (drop < 0.24) {
        ball(flag.x, flag.y - 2 + drop * 9);
        rect('#153e37', flag.x - 3, flag.y + 1, 7, 2);
      }
      const burst = Math.min(1, Math.max(0, (drop - 0.24) / 0.76));
      if (burst > 0) {
        for (const [dx, dy, color] of [
          [-19, -24, '#fff1a4'], [-9, -15, '#ffab6e'], [0, -30, '#fff9df'],
          [8, -19, '#fff1a4'], [18, -25, '#ffab6e']
        ]) {
          const sparkX = flag.x + dx * burst;
          const sparkY = flag.y + dy * burst;
          rect(color, sparkX - 2, sparkY, 5, 1);
          rect(color, sparkX, sparkY - 2, 1, 5);
        }
      }
    }
  }

  function resize() {
    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(Math.max(72, Math.min(184, aspect * courseHeight)));
    canvas.height = courseHeight;
    draw(...lastScene);
  }

  window.setGolfCourse = id => {
    if (courses[id]) selectedCourse = id;
    canvas.dataset.course = selectedCourse;
    draw(...lastScene);
  };

  window.drawCoursePreview = (previewCanvas, id) => {
    const previewContext = previewCanvas.getContext('2d');
    if (!courses[id] || !previewContext) return;
    const previousContext = ctx;
    const previousCourse = selectedCourse;
    ctx = previewContext;
    selectedCourse = id;
    try {
      ctx.setTransform(previewCanvas.width / courseWidth, 0, 0, previewCanvas.height / courseHeight, 0, 0);
      landscape();
      golfer(0);
      ball(tee.x, tee.y - 2);
    } finally {
      ctx = previousContext;
      selectedCourse = previousCourse;
    }
  };

  window.setGolfBall = color => {
    ballColor = color;
    canvas.dataset.ballColor = color;
    draw(...lastScene);
  };

  window.skipGolfShot = () => finishShot?.();

  window.renderGolf = (result, target, animate = false, onFinish) => {
    cancelAnimationFrame(frame);
    finishShot = null;
    const ratio = result?.value != null ? result.value / target : 0;
    const motion = surfaceFeel[selectedCourse] ?? {};
    const duration = result?.timedOut ? whiffTime
      : result?.bust && isExtremeOvershoot(ratio) ? swingTime + overshootFlightTime
      : swingTime + (motion.flight ?? flightTime) + (result?.bust ? finishTime : motion.roll ?? rollTime) + (ratio === 1 ? finishTime : 0);
    if (!animate || !result || reduceMotion.matches) {
      draw(result ? duration : 0, result, ratio);
      onFinish?.();
      return;
    }
    finishShot = () => {
      cancelAnimationFrame(frame);
      finishShot = null;
      draw(duration, result, ratio);
      onFinish?.();
    };
    draw(0, result, ratio);
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      if (elapsed >= duration) {
        finishShot();
        return;
      }
      draw(elapsed, result, ratio);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  };
  resize();
  window.addEventListener('resize', resize);
})();
