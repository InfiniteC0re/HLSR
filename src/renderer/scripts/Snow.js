const remote = require("@electron/remote");

var Snow = {
  el: "#events_background",
  density: 60000,
  maxHSpeed: 5,
  minFallSpeed: 2,
  canvas: null,
  ctx: null,
  particles: [],
  colors: [],
  mp: 1,
  quit: false,
  store: null,
  paused: false,
  currentWindow: null,
  date: null,
  init(store) {
    this.currentWindow = remote.getCurrentWindow();
    this.canvas = document.querySelector(this.el);
    this.ctx = this.canvas.getContext("2d");
    this.store = store;
    this.reset();

    setInterval(() => {
      this.render();
    }, 1000 / 60);

    this.currentWindow.on("blur", () => {
      this.date = Date.now();
    });

    this.currentWindow.on("focus", () => {
      this.date = null;
      this.paused = false;
    });

    document.addEventListener("click", () => {
      this.particles.forEach((p, i) => {
        if (Math.random() > 0.6) {
          p.vy += 10;
          p.vx += Math.random() * 10 - 5;
        }
      });
    });
  },
  reset() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.particles = [];
    this.mp = Math.ceil((this.w * this.h) / this.density);
    for (var i = 0; i < this.mp; i++) {
      var size = Math.random() * 4 + 3;
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        w: size,
        h: size,
        vy: this.minFallSpeed + Math.random(),
        vx: Math.random() * this.maxHSpeed - this.maxHSpeed / 2,
        fill: "#ffffff",
        s: Math.random() * 0.2 - 0.1,
      });
    }
  },

  render() {
    if ((this.date != null && this.paused) || this.store.state.noParticles)
      return;

    if (this.date != null) {
      let diff = Date.now() - this.date;

      if (diff > 1000) {
        this.paused = true;
      }
    }

    this.canvas.width = this.w;
    this.particles.forEach((p, i) => {
      p.y += p.vy;
      p.x += p.vx;
      this.ctx.fillStyle = p.fill;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);

      if (p.x > this.w + 5 || p.x < -5 || p.y > this.h || p.y < -15) {
        p.vy = this.minFallSpeed + Math.random();
        p.vx = Math.random() * this.maxHSpeed - this.maxHSpeed / 2;
        p.x = Math.random() * this.w;
        p.y = -10;
      }
    });
    
    if (this.quit) {
      return;
    }
  },
  destroy() {
    this.quit = true;
  },
};

export default {
  start(store) {
    return Snow.init(store);
  },
};
