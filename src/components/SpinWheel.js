class SpinWheel {
  constructor(canvasId, options, onFinish) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.options = options;
    console.log("Options:", this.options);
    this.onFinish = onFinish;
    this.angleCurrent = 0;
    this.angleDelta = 0;
    this.size = this.canvas.width / 2;
    this.timerHandle = 0;
    this.maxSpeed = Math.PI / this.options.length;
    this.upTime = this.options.length * 100; // Customize duration
    this.downTime = this.options.length * 600; // Customize duration
    this.spinStart = 0;
    this.frames = 0;
    this.centerX = this.size;
    this.centerY = this.size;
    this.initCanvas();
    this.drawWheel();
  }

  initCanvas() {
    this.canvas.style.borderRadius = "50%"; // Set border radius for a circular shape
    this.canvas.addEventListener("click", this.spin.bind(this), false);
  }

  spin() {
    if (this.timerHandle === 0) {
      this.spinStart = new Date().getTime();
      this.maxSpeed = Math.PI / this.options.length;
      this.frames = 0;
      this.timerHandle = setInterval(
        this.onTimerTick.bind(this),
        this.options.length * 5
      );
    }
  }

  onTimerTick() {
    this.frames++;
    this.drawWheel();
    const duration = new Date().getTime() - this.spinStart;
    let progress = 0;
    let finished = false;

    if (duration < this.upTime) {
      progress = duration / this.upTime;
      this.angleDelta = this.maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / this.downTime;
      this.angleDelta =
        this.maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    this.angleCurrent += this.angleDelta;
    while (this.angleCurrent >= Math.PI * 2) this.angleCurrent -= Math.PI * 2;
    if (finished) {
      clearInterval(this.timerHandle);
      this.timerHandle = 0;
      this.angleDelta = 0;
      this.onFinish(this.options[this.getCurrentSegmentIndex()].text);
    }
  }

  getCurrentSegmentIndex() {
    const change = this.angleCurrent + Math.PI / 2;
    let i =
      this.options.length -
      Math.floor((change / (Math.PI * 2)) * this.options.length) -
      1;
    if (i < 0) i = i + this.options.length;
    return i;
  }

  drawWheel() {
    this.clear();
    this.drawSegments();
    this.drawCenterCircle();
    this.drawNeedle();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.size * 2, this.size * 2);
  }

  drawSegments() {
    const len = this.options.length;
    const PI2 = Math.PI * 2;
    let lastAngle = this.angleCurrent;
    this.ctx.lineWidth = 1;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.font = "1em Arial";
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + this.angleCurrent;
      console.log("Drawing segment", i, "from", lastAngle, "to", angle);
      this.drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }
  }

  drawSegment(key, lastAngle, angle) {
    const ctx = this.ctx;
    const value = this.options[key].text;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.arc(this.centerX, this.centerY, this.size, lastAngle, angle, false);
    ctx.lineTo(this.centerX, this.centerY);
    ctx.closePath();
    ctx.fillStyle = this.options[key].color;
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = "white";
    if (typeof value === "string") {
      ctx.fillText(value.substring(0, 21), this.size / 2 + 20, 0);
    } else {
      console.error("Invalid value:", value, "Type of value:", typeof value);
    }
    ctx.restore();
  }

  drawCenterCircle() {
    const ctx = this.ctx;
    const PI2 = Math.PI * 2;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 30, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.fill();
    ctx.stroke();
  }

  drawNeedle() {
    const ctx = this.ctx;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.centerX + 20, this.centerY - 30);
    ctx.lineTo(this.centerX - 20, this.centerY - 30);
    ctx.lineTo(this.centerX, this.centerY - this.centerY / 2.5);
    ctx.closePath();
    ctx.fill();
  }
}

export default SpinWheel;
