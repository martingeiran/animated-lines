const titles = document.querySelectorAll("h1");
const titleColors = [];
titles.forEach((title) => {
  titleColors.push(title.dataset.color);
});
const intersectionObserver = new IntersectionObserver((entries) => {
  // If intersectionRatio is 0, the target is out of view
  // and we do not need to do anything.
  if (entries[0].intersectionRatio <= 0) return;
  titles.forEach((title) => {
    titleColors.forEach((tc) => {
      title.classList.remove(tc);
    });
    console.log(entries);
    title.classList.add(entries[0].target.dataset.color);
  });
});
// start observing
titles.forEach((title) => {
  intersectionObserver.observe(title);
});

const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = (canvas.width = window.innerWidth);
const canvasHeight = (canvas.height = window.innerHeight); // Adjust the height as needed
const lines = [];
const constants = [];
for (let i = 0; i < 20; i++) {
  constants.push({
    d: Math.random() * 80,
    a: Math.random() * 80,
    b: Math.random() * 0.01,
    c: Math.random() * 0.01,
    phase: Math.random() * 2 * Math.PI,
  });
}

// Create and initialize lines with amplitude and frequency
for (let i = 0; i < 5; i++) {
  lines.push({
    func: function (x) {
      return constants
        .slice(i, i + constants.length / lines.length)
        .reduce((acc, curr) => {
          return (
            acc +
            curr.a * Math.sin(curr.b * x + curr.phase) +
            curr.d * Math.cos(curr.c * x + curr.phase)
          );
        }, 0);
    },
    lineWidth: Math.random() * 5 + 1,
  });
}

console.log(lines);
let color = document.querySelector("canvas").style;
const compStyles = window.getComputedStyle(titles[0]);

function drawLines() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  aIncrement = 0.0000001 * 0;
  bIncrement = 0.0000001 * 0;
  cIncrement = 0.0000001 * 0;
  dIncrement = 0.0000001 * 0;
  phaseIncrement = 0.00001;
  // Draw grey background
  ctx.fillStyle = "#fecb0001";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.stroke();
  for (let i = 0; i < lines.length; i++) {
    line = lines[i];
    ctx.beginPath();
    for (let x = 0; x < canvasWidth; x += 5) {
      // const y = line.amplitude * Math.sin(line.frequency * x + line.phase) + canvasHeight / 2;
      const y = line.func(x) + canvasHeight / 2;
      ctx.lineTo(x, y);

      // Increment amplitude and frequency smoothly
      line.amplitude += line.amplitudeIncrement;
      line.frequency += line.frequencyIncrement;
      line.phase += line.phaseIncrement;

      // Limit how much they can deviate
      line.amplitude = Math.min(
        canvasHeight / 3,
        Math.max(canvasHeight / 2 - 50, line.amplitude)
      );
      line.frequency = Math.min(0.001, Math.max(0.0005, line.frequency));
      for (let constant of constants) {
        constant.a += aIncrement;
        constant.b += bIncrement;
        constant.c += cIncrement;
        constant.d += dIncrement;
        constant.phase += phaseIncrement;
      }
    }
    ctx.strokeStyle = compStyles.color; // You can change the color to your preference
    ctx.lineWidth = line.lineWidth;
    ctx.stroke();
  }

  requestAnimationFrame(drawLines);
}

drawLines();
