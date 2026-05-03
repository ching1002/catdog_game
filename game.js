const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  score: document.querySelector("#scoreText"),
  best: document.querySelector("#bestText"),
  wave: document.querySelector("#waveText"),
  level: document.querySelector("#levelText"),
  hpFill: document.querySelector("#hpFill"),
  hpText: document.querySelector("#hpText"),
  xpFill: document.querySelector("#xpFill"),
  xpText: document.querySelector("#xpText"),
  comboFill: document.querySelector("#comboFill"),
  comboText: document.querySelector("#comboText"),
  saveState: document.querySelector("#saveState"),
  pauseButton: document.querySelector("#pauseButton"),
  pauseIcon: document.querySelector("#pauseIcon"),
  soundButton: document.querySelector("#soundButton"),
  soundIcon: document.querySelector("#soundIcon"),
  startPanel: document.querySelector("#startPanel"),
  startButton: document.querySelector("#startButton"),
  titleScreen: document.querySelector("#titleScreen"),
  enterGameButton: document.querySelector("#enterGameButton"),
  introScreen: document.querySelector("#introScreen"),
  introVideo: document.querySelector("#introVideo"),
  skipIntroButton: document.querySelector("#skipIntroButton"),
  upgradePanel: document.querySelector("#upgradePanel"),
  pausePanel: document.querySelector("#pausePanel"),
  resumeButton: document.querySelector("#resumeButton"),
  pauseRestartButton: document.querySelector("#pauseRestartButton"),
  gameOverPanel: document.querySelector("#gameOverPanel"),
  finalText: document.querySelector("#finalText"),
  restartButton: document.querySelector("#restartButton"),
  skillButton: document.querySelector("#skillButton"),
  toast: document.querySelector("#toast"),
  padButtons: [...document.querySelectorAll(".pad-btn")],
};

const saveKey = "catDogBattleSaveV1";
const defaultSave = {
  bestScore: 0,
  bestWave: 1,
  plays: 0,
  muted: false,
};

let saved = loadSave();

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
};

const keys = new Map([
  ["w", "up"],
  ["arrowup", "up"],
  ["s", "down"],
  ["arrowdown", "down"],
  ["a", "left"],
  ["arrowleft", "left"],
  ["d", "right"],
  ["arrowright", "right"],
]);

const game = {
  state: "ready",
  width: 1280,
  height: 720,
  dpr: 1,
  time: 0,
  lastTime: 0,
  score: 0,
  combo: 0,
  comboTimer: 0,
  comboBest: 0,
  wave: 1,
  waveKills: 0,
  waveTarget: 12,
  spawnTimer: 0,
  boss: null,
  bossActive: false,
  shake: 0,
  autoSaveTimer: 0,
  skillCooldown: 0,
  bannerTimer: 0,
  bannerText: "",
  stageName: "屋頂公園",
  player: null,
  bullets: [],
  enemyBullets: [],
  enemies: [],
  powerUps: [],
  defeatedBosses: [],
  particles: [],
  floatTexts: [],
  stars: [],
};

const audio = {
  ctx: null,
  ready: false,
};

const spriteSources = {
  catHero: "assets/sprites/cat-hero.png",
  dogSmall: "assets/sprites/dog-small.png",
  dogFast: "assets/sprites/dog-fast.png",
  dogBig: "assets/sprites/dog-big.png",
  dogDisc: "assets/sprites/dog-disc.png",
  dogBone: "assets/sprites/dog-bone.png",
  bossShiba: "assets/sprites/boss-shiba.png",
  bossDoghouse: "assets/sprites/boss-doghouse.png",
  projectileYarn: "assets/sprites/projectile-yarn.png",
  projectileBone: "assets/sprites/projectile-bone.png",
  projectileDisc: "assets/sprites/projectile-disc.png",
  pickupHeal: "assets/sprites/pickup-heal.png",
  pickupShield: "assets/sprites/pickup-shield.png",
  pickupRapid: "assets/sprites/pickup-rapid.png",
  pickupScore: "assets/sprites/pickup-score.png",
  fxExplosion: "assets/sprites/fx-explosion.png",
  background: "assets/backgrounds/pet-neighborhood.png",
};

const sprites = {};
const animations = {};

function loadSprites() {
  for (const [key, src] of Object.entries(spriteSources)) {
    const img = new Image();
    img.src = src;
    sprites[key] = img;
  }
  loadAnimationFrames();
}

const animationSources = {
  catIdle: { fps: 7, files: ["cat-idle-00.png", "cat-idle-01.png", "cat-idle-02.png", "cat-idle-03.png"], dir: "cat-idle" },
  catAttack: { fps: 12, files: ["cat-attack-00.png", "cat-attack-01.png", "cat-attack-02.png", "cat-attack-03.png"], dir: "cat-attack" },
  catHurt: { fps: 10, files: ["cat-hurt-00.png", "cat-hurt-01.png"], dir: "cat-hurt" },
  catNativeIdle: { fps: 8, files: ["cat-native-idle-00.png", "cat-native-idle-01.png", "cat-native-idle-02.png", "cat-native-idle-03.png"], dir: "cat-native-idle", root: "assets/animations-native" },
  catNativeAttack: { fps: 12, files: ["cat-native-attack-00.png", "cat-native-attack-01.png", "cat-native-attack-02.png", "cat-native-attack-03.png"], dir: "cat-native-attack", root: "assets/animations-native" },
  catNativeHurt: { fps: 10, files: ["cat-native-hurt-00.png", "cat-native-hurt-01.png", "cat-native-hurt-02.png", "cat-native-hurt-03.png"], dir: "cat-native-hurt", root: "assets/animations-native" },
  dogSmallRun: { fps: 9, files: ["dog-small-run-00.png", "dog-small-run-01.png", "dog-small-run-02.png", "dog-small-run-03.png"], dir: "dog-small-run" },
  dogFastRun: { fps: 13, files: ["dog-fast-run-00.png", "dog-fast-run-01.png", "dog-fast-run-02.png", "dog-fast-run-03.png"], dir: "dog-fast-run" },
  dogBigRun: { fps: 9, files: ["dog-big-run-00.png", "dog-big-run-01.png", "dog-big-run-02.png", "dog-big-run-03.png"], dir: "dog-big-run" },
  dogDiscRun: { fps: 9, files: ["dog-disc-run-00.png", "dog-disc-run-01.png", "dog-disc-run-02.png", "dog-disc-run-03.png"], dir: "dog-disc-run" },
  dogBoneRun: { fps: 9, files: ["dog-bone-run-00.png", "dog-bone-run-01.png", "dog-bone-run-02.png", "dog-bone-run-03.png"], dir: "dog-bone-run" },
  bossIdle: { fps: 6, files: ["boss-idle-00.png", "boss-idle-01.png", "boss-idle-02.png", "boss-idle-03.png"], dir: "boss-idle" },
  bossCharge: { fps: 8, files: ["boss-charge-00.png", "boss-charge-01.png", "boss-charge-02.png"], dir: "boss-charge" },
  bossDash: { fps: 14, files: ["boss-dash-00.png", "boss-dash-01.png", "boss-dash-02.png"], dir: "boss-dash" },
  bossDeath: { fps: 9, files: ["boss-death-00.png", "boss-death-01.png", "boss-death-02.png", "boss-death-03.png", "boss-death-04.png", "boss-death-05.png"], dir: "boss-death" },
  bossShibaIdle: { fps: 7, files: ["boss-shiba-native-idle-00.png", "boss-shiba-native-idle-01.png", "boss-shiba-native-idle-02.png", "boss-shiba-native-idle-03.png"], dir: "boss-shiba-native-idle", root: "assets/animations-native" },
  bossShibaRoar: { fps: 8, files: ["boss-shiba-native-roar-00.png", "boss-shiba-native-roar-01.png", "boss-shiba-native-roar-02.png", "boss-shiba-native-roar-03.png"], dir: "boss-shiba-native-roar", root: "assets/animations-native" },
  bossShibaShoot: { fps: 9, files: ["boss-shiba-native-shoot-00.png", "boss-shiba-native-shoot-01.png", "boss-shiba-native-shoot-02.png", "boss-shiba-native-shoot-03.png"], dir: "boss-shiba-native-shoot", root: "assets/animations-native" },
  bossShibaDash: { fps: 12, files: ["boss-shiba-native-dash-00.png", "boss-shiba-native-dash-01.png", "boss-shiba-native-dash-02.png", "boss-shiba-native-dash-03.png"], dir: "boss-shiba-native-dash", root: "assets/animations-native" },
  bossShibaDeath: { fps: 10, files: ["boss-shiba-native-death-00.png", "boss-shiba-native-death-01.png", "boss-shiba-native-death-02.png", "boss-shiba-native-death-03.png", "boss-shiba-native-death-04.png", "boss-shiba-native-death-05.png"], dir: "boss-shiba-native-death", root: "assets/animations-native" },
  bossDoghouseIdle: { fps: 7, files: ["boss-doghouse-native-idle-00.png", "boss-doghouse-native-idle-01.png", "boss-doghouse-native-idle-02.png", "boss-doghouse-native-idle-03.png"], dir: "boss-doghouse-native-idle", root: "assets/animations-native" },
  bossDoghouseRoar: { fps: 8, files: ["boss-doghouse-native-roar-00.png", "boss-doghouse-native-roar-01.png", "boss-doghouse-native-roar-02.png", "boss-doghouse-native-roar-03.png"], dir: "boss-doghouse-native-roar", root: "assets/animations-native" },
  bossDoghouseShoot: { fps: 9, files: ["boss-doghouse-native-shoot-00.png", "boss-doghouse-native-shoot-01.png", "boss-doghouse-native-shoot-02.png", "boss-doghouse-native-shoot-03.png"], dir: "boss-doghouse-native-shoot", root: "assets/animations-native" },
  bossDoghouseDash: { fps: 12, files: ["boss-doghouse-native-dash-00.png", "boss-doghouse-native-dash-01.png", "boss-doghouse-native-dash-02.png", "boss-doghouse-native-dash-03.png"], dir: "boss-doghouse-native-dash", root: "assets/animations-native" },
  bossDoghouseDeath: { fps: 10, files: ["boss-doghouse-native-death-00.png", "boss-doghouse-native-death-01.png", "boss-doghouse-native-death-02.png", "boss-doghouse-native-death-03.png", "boss-doghouse-native-death-04.png", "boss-doghouse-native-death-05.png"], dir: "boss-doghouse-native-death", root: "assets/animations-native" },
  bossMechaIdle: { fps: 7, files: ["boss-mecha-native-idle-00.png", "boss-mecha-native-idle-01.png", "boss-mecha-native-idle-02.png", "boss-mecha-native-idle-03.png"], dir: "boss-mecha-native-idle", root: "assets/animations-native" },
  bossMechaRoar: { fps: 8, files: ["boss-mecha-native-roar-00.png", "boss-mecha-native-roar-01.png", "boss-mecha-native-roar-02.png", "boss-mecha-native-roar-03.png"], dir: "boss-mecha-native-roar", root: "assets/animations-native" },
  bossMechaShoot: { fps: 9, files: ["boss-mecha-native-shoot-00.png", "boss-mecha-native-shoot-01.png", "boss-mecha-native-shoot-02.png", "boss-mecha-native-shoot-03.png"], dir: "boss-mecha-native-shoot", root: "assets/animations-native" },
  bossMechaDash: { fps: 12, files: ["boss-mecha-native-dash-00.png", "boss-mecha-native-dash-01.png", "boss-mecha-native-dash-02.png", "boss-mecha-native-dash-03.png"], dir: "boss-mecha-native-dash", root: "assets/animations-native" },
  bossMechaDeath: { fps: 10, files: ["boss-mecha-native-death-00.png", "boss-mecha-native-death-01.png", "boss-mecha-native-death-02.png", "boss-mecha-native-death-03.png", "boss-mecha-native-death-04.png", "boss-mecha-native-death-05.png"], dir: "boss-mecha-native-death", root: "assets/animations-native" },
  yarnLoop: { fps: 12, files: ["projectile-yarn-loop-00.png", "projectile-yarn-loop-01.png", "projectile-yarn-loop-02.png", "projectile-yarn-loop-03.png"], dir: "projectile-yarn-loop" },
  boneLoop: { fps: 12, files: ["projectile-bone-loop-00.png", "projectile-bone-loop-01.png", "projectile-bone-loop-02.png", "projectile-bone-loop-03.png"], dir: "projectile-bone-loop" },
  discLoop: { fps: 12, files: ["projectile-disc-loop-00.png", "projectile-disc-loop-01.png", "projectile-disc-loop-02.png", "projectile-disc-loop-03.png"], dir: "projectile-disc-loop" },
  explosionLoop: { fps: 14, files: ["fx-explosion-loop-00.png", "fx-explosion-loop-01.png", "fx-explosion-loop-02.png", "fx-explosion-loop-03.png", "fx-explosion-loop-04.png", "fx-explosion-loop-05.png"], dir: "fx-explosion-loop" },
};

function loadAnimationFrames() {
  for (const [key, spec] of Object.entries(animationSources)) {
    animations[key] = {
      fps: spec.fps,
      frames: spec.files.map((file) => {
        const img = new Image();
        img.src = `${spec.root || "assets/animations"}/${spec.dir}/${file}`;
        return img;
      }),
    };
  }
}

function loadSave() {
  try {
    return { ...defaultSave, ...JSON.parse(localStorage.getItem(saveKey) || "{}") };
  } catch {
    return { ...defaultSave };
  }
}

function writeSave() {
  localStorage.setItem(saveKey, JSON.stringify(saved));
  ui.saveState.textContent = "已自動存檔";
  ui.soundIcon.textContent = saved.muted ? "×" : "♪";
}

function initAudio() {
  if (audio.ready || saved.muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audio.ctx = audio.ctx || new AudioContext();
  if (audio.ctx.state === "suspended") audio.ctx.resume();
  audio.ready = true;
}

function playTone(freq, duration = 0.08, type = "sine", gain = 0.045) {
  if (saved.muted) return;
  initAudio();
  if (!audio.ctx) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const amp = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(audio.ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playSound(name) {
  const sounds = {
    shoot: [680, 0.045, "triangle", 0.018],
    hit: [210, 0.055, "square", 0.022],
    boom: [86, 0.12, "sawtooth", 0.04],
    level: [880, 0.16, "sine", 0.04],
    pickup: [980, 0.1, "triangle", 0.035],
    hurt: [130, 0.11, "sawtooth", 0.045],
    boss: [54, 0.24, "sawtooth", 0.05],
  };
  if (sounds[name]) playTone(...sounds[name]);
}

function showToast(text) {
  ui.toast.textContent = text;
  ui.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => ui.toast.classList.remove("show"), 1400);
}

function resize() {
  game.dpr = Math.min(window.devicePixelRatio || 1, 2);
  game.width = window.innerWidth;
  game.height = window.innerHeight;
  canvas.width = Math.floor(game.width * game.dpr);
  canvas.height = Math.floor(game.height * game.dpr);
  canvas.style.width = `${game.width}px`;
  canvas.style.height = `${game.height}px`;
  ctx.setTransform(game.dpr, 0, 0, game.dpr, 0, 0);
}

function createPlayer() {
  return {
    x: game.width * 0.18,
    y: game.height * 0.52,
    r: 28,
    hp: 100,
    maxHp: 100,
    level: 1,
    xp: 0,
    xpNext: 100,
    damage: 22,
    fireDelay: 0.34,
    fireTimer: 0,
    attackFlash: 0,
    speed: 310,
    defense: 0,
    invuln: 0,
    shield: 0,
    rapid: 0,
    upgrades: {
      maxHp: 0,
      damage: 0,
      fireRate: 0,
      defense: 0,
      speed: 0,
    },
  };
}

function resetGame() {
  initAudio();
  saved.plays += 1;
  game.state = "playing";
  game.time = 0;
  game.lastTime = performance.now();
  game.score = 0;
  game.combo = 0;
  game.comboTimer = 0;
  game.comboBest = 0;
  game.wave = 1;
  game.waveKills = 0;
  game.waveTarget = 12;
  game.spawnTimer = 0.8;
  game.boss = null;
  game.bossActive = false;
  game.shake = 0;
  game.skillCooldown = 0;
  game.bannerTimer = 0;
  game.bannerText = "";
  game.stageName = getStageName(1);
  game.player = createPlayer();
  game.bullets = [];
  game.enemyBullets = [];
  game.enemies = [];
  game.powerUps = [];
  game.defeatedBosses = [];
  game.particles = [];
  game.floatTexts = [];
  buildStars();
  ui.startPanel.classList.add("hidden");
  ui.gameOverPanel.classList.add("hidden");
  ui.upgradePanel.classList.add("hidden");
  ui.pausePanel.classList.add("hidden");
  ui.pauseIcon.textContent = "II";
  writeSave();
  updateUi();
  showToast("Wave 1");
}

function beginIntro() {
  initAudio();
  ui.titleScreen.classList.add("hidden");
  ui.startPanel.classList.add("hidden");
  ui.introScreen.classList.remove("hidden");
  ui.introVideo.currentTime = 0;
  const playPromise = ui.introVideo.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      ui.introVideo.setAttribute("controls", "controls");
      showToast("點擊影片播放前導");
    });
  }
}

function finishIntro() {
  ui.introVideo.pause();
  ui.introScreen.classList.add("hidden");
  ui.introVideo.removeAttribute("controls");
  resetGame();
}

function buildStars() {
  game.stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * game.width,
    y: Math.random() * game.height,
    s: 0.4 + Math.random() * 1.8,
    p: Math.random() * 100,
  }));
}

function startLoop(now = performance.now()) {
  game.lastTime = now;
  requestAnimationFrame(loop);
}

function loop(now) {
  const dt = Math.min((now - game.lastTime) / 1000, 0.033);
  game.lastTime = now;

  if (game.state === "playing") {
    update(dt);
  }

  draw();
  requestAnimationFrame(loop);
}

function update(dt) {
  game.time += dt;
  game.shake = Math.max(0, game.shake - dt * 18);
  game.skillCooldown = Math.max(0, game.skillCooldown - dt);
  game.bannerTimer = Math.max(0, game.bannerTimer - dt);
  game.comboTimer = Math.max(0, game.comboTimer - dt);
  if (game.comboTimer <= 0) game.combo = 0;
  game.autoSaveTimer += dt;

  updatePlayer(dt);
  updateBullets(dt);
  updateEnemies(dt);
  updateEnemyBullets(dt);
  updatePowerUps(dt);
  updateDefeatedBosses(dt);
  updateParticles(dt);
  updateWave(dt);
  checkCollisions();

  if (game.autoSaveTimer > 5) {
    game.autoSaveTimer = 0;
    saveProgress();
  }

  updateUi();
}

function updatePlayer(dt) {
  const p = game.player;
  let dx = 0;
  let dy = 0;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  const mag = Math.hypot(dx, dy) || 1;

  p.x += (dx / mag) * p.speed * dt;
  p.y += (dy / mag) * p.speed * dt;
  p.x = clamp(p.x, p.r + 8, game.width - p.r - 8);
  p.y = clamp(p.y, p.r + 88, game.height - p.r - 10);
  p.invuln = Math.max(0, p.invuln - dt);
  p.attackFlash = Math.max(0, p.attackFlash - dt);
  p.shield = Math.max(0, p.shield - dt);
  p.rapid = Math.max(0, p.rapid - dt);

  p.fireTimer -= dt;
  if (p.fireTimer <= 0) {
    firePlayerBullet();
    p.fireTimer = p.fireDelay * (p.rapid > 0 ? 0.52 : 1);
  }
}

function firePlayerBullet() {
  const p = game.player;
  p.attackFlash = 0.24;
  const aim = getAimVector();
  const spread = p.upgrades.fireRate >= 3 ? [-0.12, 0, 0.12] : p.upgrades.damage >= 2 ? [-0.08, 0.08] : [0];
  for (const angle of spread) {
    const rotated = rotateVector(aim.x, aim.y, angle);
    game.bullets.push({
      x: p.x + 30,
      y: p.y - 2,
      vx: rotated.x * 640,
      vy: rotated.y * 640,
      r: 8,
      damage: p.damage,
      life: 1.4,
      pierce: p.upgrades.damage >= 4 ? 1 : 0,
    });
  }
  playSound("shoot");
}

function getAimVector() {
  const p = game.player;
  let target = game.boss || null;
  let best = target ? Infinity : Infinity;
  for (const e of game.enemies) {
    if (e.dead || e.hp <= 0 || e.x < p.x) continue;
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d < best) {
      best = d;
      target = e;
    }
  }
  if (!target) return { x: 1, y: 0 };
  const dx = target.x - p.x;
  const dy = target.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

function rotateVector(x, y, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: x * c - y * s,
    y: x * s + y * c,
  };
}

function triggerSkill() {
  if (game.state !== "playing" || game.skillCooldown > 0) return;
  game.skillCooldown = 8;
  game.shake = 3;
  for (let i = 0; i < 18; i += 1) {
    const angle = (Math.PI * 2 * i) / 18;
    game.bullets.push({
      x: game.player.x,
      y: game.player.y,
      vx: Math.cos(angle) * 520,
      vy: Math.sin(angle) * 520,
      r: 9,
      damage: game.player.damage * 1.4,
      life: 1.2,
      pierce: 0,
    });
  }
  playSound("level");
}

function updateBullets(dt) {
  for (const b of game.bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
  }
  game.bullets = game.bullets.filter((b) => b.life > 0 && b.x < game.width + 80 && b.y > -80 && b.y < game.height + 80);
}

function updateEnemyBullets(dt) {
  for (const b of game.enemyBullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (b.wave) b.y += Math.sin(game.time * 6 + b.seed) * 28 * dt;
  }
  game.enemyBullets = game.enemyBullets.filter((b) => b.life > 0 && b.x > -90 && b.y > -90 && b.y < game.height + 90);
}

function updatePowerUps(dt) {
  for (const item of game.powerUps) {
    const dx = game.player.x - item.x;
    const dy = game.player.y - item.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist < 155) {
      const pull = (1 - dist / 155) * 520;
      item.vx += (dx / dist) * pull * dt;
      item.y += (dy / dist) * pull * dt;
    }
    item.x += item.vx * dt;
    item.y += Math.sin(game.time * 5 + item.seed) * 18 * dt;
    item.life -= dt;
    item.spin += dt * 5;
  }
  game.powerUps = game.powerUps.filter((item) => item.life > 0 && item.x > -60);
}

function updateDefeatedBosses(dt) {
  for (const boss of game.defeatedBosses) {
    boss.t += dt;
    boss.y -= 18 * dt;
  }
  game.defeatedBosses = game.defeatedBosses.filter((boss) => boss.t < boss.duration);
}

function updateEnemies(dt) {
  for (const e of game.enemies) {
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.t += dt;
    if (e.pattern === "sine") {
      e.y += Math.sin(e.t * 4) * e.amp * dt;
    }
    if (e.shootDelay) {
      e.shootTimer -= dt;
      if (e.shootTimer <= 0) {
        shootEnemy(e);
        e.shootTimer = e.shootDelay * (0.75 + Math.random() * 0.5);
      }
    }
  }

  if (game.boss) {
    updateBoss(dt);
  }

  game.enemies = game.enemies.filter((e) => e.hp > 0 && e.x > -160);
}

function updateBoss(dt) {
  const b = game.boss;
  b.t += dt;
  const homeX = game.width - 170;
  const homeY = game.height * 0.5 + Math.sin(b.t * 1.6) * 54;

  if (b.chargeState === "idle" || b.chargeState === "return") {
    const ease = b.chargeState === "return" ? 1.9 : 0.7;
    b.x += (homeX - b.x) * dt * ease;
    b.y += (homeY - b.y) * dt * ease;
  }
  b.y = clamp(b.y, 140, game.height - 120);
  b.shootTimer -= dt;
  b.summonTimer -= dt;
  b.chargeTimer -= dt;
  b.roarTimer = Math.max(0, b.roarTimer - dt);
  b.shootFlash = Math.max(0, b.shootFlash - dt);

  if (b.chargeTimer <= 0 && b.chargeState === "idle") {
    b.chargeState = "warning";
    b.chargeWarning = 1.15;
    b.chargeY = game.player.y;
    b.chargeTimer = 7.5;
    game.bannerTimer = 1.1;
    game.bannerText = "Boss 衝刺預警";
    playSound("hurt");
  }

  if (b.chargeState === "warning") {
    b.chargeWarning -= dt;
    b.x += (homeX - b.x) * dt * 3;
    b.y += (b.chargeY - b.y) * dt * 5;
    if (b.chargeWarning <= 0) {
      b.chargeState = "dash";
      b.x = game.width + b.r + 24;
      b.y = b.chargeY;
      game.shake = 9;
      playSound("boss");
    }
  }

  if (b.chargeState === "dash") {
    b.x -= Math.max(1080, game.width * 1.75) * dt;
    b.y = b.chargeY;
    if (b.x < -b.r - 90) {
      b.chargeState = "return";
      b.x = game.width + b.r + 96;
      b.y = clamp(b.chargeY + random(-80, 80), 140, game.height - 120);
    }
  }

  if (b.chargeState === "return" && Math.abs(b.x - homeX) < 12) {
    b.chargeState = "idle";
  }

  if (b.shootTimer <= 0 && b.chargeState !== "dash") {
    bossAttack(b);
    b.shootTimer = Math.max(0.65, 1.55 - game.wave * 0.025);
  }

  if (b.summonTimer <= 0 && b.chargeState !== "dash") {
    spawnEnemy("small", b.x - 30, b.y + random(-60, 60));
    b.summonTimer = 4.2;
  }
}

function updateParticles(dt) {
  for (const p of game.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    p.vx *= 0.985;
    p.vy *= 0.985;
  }
  game.particles = game.particles.filter((p) => p.life > 0);

  for (const t of game.floatTexts) {
    t.y -= 34 * dt;
    t.life -= dt;
  }
  game.floatTexts = game.floatTexts.filter((t) => t.life > 0);
}

function updateWave(dt) {
  if (game.bossActive) return;

  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0 && game.waveKills < game.waveTarget) {
    spawnEnemy(pickEnemyType());
    game.spawnTimer = Math.max(0.28, 1.1 - game.wave * 0.035 - Math.random() * 0.18);
  }

  const waveCleared = game.waveKills >= game.waveTarget && game.enemies.length === 0;
  if (waveCleared) {
    nextWave();
  }
}

function nextWave() {
  game.wave += 1;
  game.waveKills = 0;
  game.waveTarget = 10 + game.wave * 3;
  game.stageName = getStageName(game.wave);
  addScore(120 + game.wave * 20, game.width * 0.5, 110);
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + 12);

  if (game.wave % 5 === 0) {
    spawnBoss();
  } else {
    showToast(`Wave ${game.wave}`);
  }

  saveProgress();
}

function getStageName(wave) {
  const stages = ["屋頂公園", "寵物店街", "河岸步道", "狗屋基地"];
  return stages[Math.floor((wave - 1) / 4) % stages.length];
}

function getStagePalette() {
  const palettes = {
    屋頂公園: ["#d8f0f1", "#f7e8c8", "#b7dbb2", "#78bc7b"],
    寵物店街: ["#dbe8ff", "#ffe6d1", "#d3c4ef", "#7fb7d6"],
    河岸步道: ["#cfedf4", "#e6f4d7", "#9bd0bc", "#5cae91"],
    狗屋基地: ["#eaded5", "#f3cfaa", "#c3b090", "#9a8065"],
  };
  return palettes[game.stageName] || palettes.屋頂公園;
}

function pickEnemyType() {
  const roll = Math.random();
  if (game.wave >= 9 && roll < 0.18) return "bone";
  if (game.wave >= 7 && roll < 0.34) return "disc";
  if (game.wave >= 5 && roll < 0.52) return "big";
  if (game.wave >= 3 && roll < 0.74) return "fast";
  return "small";
}

function spawnEnemy(type, x = game.width + 70, y = random(120, game.height - 80)) {
  const scale = 1 + game.wave * 0.025;
  const templates = {
    small: { r: 22, hp: 42, speed: 125, damage: 12, score: 35, xp: 18, color: "#d18b45" },
    fast: { r: 18, hp: 32, speed: 205, damage: 14, score: 45, xp: 20, color: "#f2a45d", pattern: "sine", amp: 42 },
    big: { r: 34, hp: 105, speed: 82, damage: 24, score: 80, xp: 34, color: "#9a6a3b" },
    disc: { r: 24, hp: 62, speed: 105, damage: 16, score: 65, xp: 28, color: "#cf785e", shootDelay: 2.2 },
    bone: { r: 24, hp: 72, speed: 96, damage: 18, score: 75, xp: 32, color: "#8a715a", shootDelay: 1.55 },
  };
  const base = templates[type];
  game.enemies.push({
    ...base,
    type,
    x,
    y,
    vx: -base.speed * (1 + game.wave * 0.018),
    vy: 0,
    hp: base.hp * scale,
    maxHp: base.hp * scale,
    damage: base.damage,
    t: 0,
    shootTimer: base.shootDelay ? random(0.5, base.shootDelay) : 0,
  });
}

function spawnBoss() {
  const bossLevel = Math.floor(game.wave / 5);
  const variants = [
    { name: "大型柴犬隊長", key: "shiba", r: 78 },
    { name: "狗屋堡壘", key: "doghouse", r: 84 },
    { name: "機甲狗", key: "mecha", r: 82 },
  ];
  const variant = variants[(bossLevel - 1) % variants.length];
  game.bossActive = true;
  game.boss = {
    type: "boss",
    name: variant.name,
    variant: variant.key,
    x: game.width + 150,
    y: game.height * 0.5,
    r: variant.r,
    hp: 680 + game.wave * 115,
    maxHp: 680 + game.wave * 115,
    damage: 24 + bossLevel * 3,
    t: 0,
    shootTimer: 1,
    summonTimer: 3.2,
    chargeTimer: 5.5,
    chargeState: "idle",
    chargeWarning: 0,
    roarTimer: 1.45,
    shootFlash: 0,
    chargeY: game.height * 0.5,
    score: 700 + game.wave * 90,
    xp: 140 + game.wave * 25,
  };
  game.shake = 7;
  game.bannerTimer = 2.2;
  game.bannerText = `Boss 來襲：${game.boss.name}`;
  game.floatTexts.push({ text: game.boss.name, x: game.width * 0.52, y: 120, life: 2, color: "#e84b5f" });
  showToast(game.bannerText);
  playSound("boss");
}

function shootEnemy(e) {
  const dx = game.player.x - e.x;
  const dy = game.player.y - e.y;
  const len = Math.hypot(dx, dy) || 1;
  const speed = e.type === "bone" ? 260 : 220;
  game.enemyBullets.push({
    x: e.x - e.r,
    y: e.y,
    vx: (dx / len) * speed,
    vy: (dy / len) * speed,
    r: e.type === "bone" ? 8 : 10,
    damage: e.type === "bone" ? 16 : 14,
    life: 4,
    kind: e.type === "bone" ? "bone" : "disc",
    wave: e.type === "disc",
    seed: Math.random() * 20,
  });
}

function bossAttack(b) {
  b.shootFlash = 0.42;
  const mode = Math.floor(b.t) % 3;
  if (mode === 0) {
    for (let i = -2; i <= 2; i += 1) {
      game.enemyBullets.push({
        x: b.x - 56,
        y: b.y + i * 18,
        vx: -280,
        vy: i * 42,
        r: 10,
        damage: b.damage,
        life: 4,
        kind: "bone",
      });
    }
  } else if (mode === 1) {
    for (let i = 0; i < 9; i += 1) {
      const angle = Math.PI + (i - 4) * 0.18;
      game.enemyBullets.push({
        x: b.x - 40,
        y: b.y,
        vx: Math.cos(angle) * 260,
        vy: Math.sin(angle) * 260,
        r: 9,
        damage: b.damage * 0.85,
        life: 4,
        kind: "disc",
        wave: true,
        seed: Math.random() * 20,
      });
    }
  } else {
    const dx = game.player.x - b.x;
    const dy = game.player.y - b.y;
    const len = Math.hypot(dx, dy) || 1;
    game.enemyBullets.push({
      x: b.x - 70,
      y: b.y,
      vx: (dx / len) * 350,
      vy: (dy / len) * 350,
      r: 15,
      damage: b.damage * 1.2,
      life: 4,
      kind: "bigBone",
    });
  }
}

function checkCollisions() {
  const p = game.player;

  for (const b of game.bullets) {
    for (const e of game.enemies) {
      if (e.dead || e.hp <= 0) continue;
      if (circleHit(b, e)) {
        e.hp -= b.damage;
        burst(b.x, b.y, "#fff2a3", 5);
        playSound("hit");
        if (b.pierce > 0) {
          b.pierce -= 1;
        } else {
          b.life = 0;
        }
        if (e.hp <= 0) defeatEnemy(e);
        break;
      }
    }

    if (game.boss && circleHit(b, game.boss)) {
      game.boss.hp -= b.damage;
      burst(b.x, b.y, "#ffd66b", 6);
      playSound("hit");
      if (b.pierce > 0) {
        b.pierce -= 1;
      } else {
        b.life = 0;
      }
      if (game.boss.hp <= 0) defeatBoss();
    }
  }

  for (const e of game.enemies) {
    if (e.dead || e.hp <= 0) continue;
    if (circleHit(p, e)) {
      damagePlayer(e.damage);
      e.hp = 0;
      burst(e.x, e.y, "#ff755f", 14);
    }
  }

  if (game.boss && circleHit(p, game.boss)) {
    damagePlayer(game.boss.damage * 1.4);
  }

  for (const b of game.enemyBullets) {
    if (circleHit(p, b)) {
      damagePlayer(b.damage);
      b.life = 0;
      burst(b.x, b.y, "#e84b5f", 8);
    }
  }

  for (const item of game.powerUps) {
    if (circleHit(p, item)) {
      collectPowerUp(item);
    }
  }
}

function defeatEnemy(e) {
  if (e.dead) return;
  e.dead = true;
  game.waveKills += 1;
  addCombo();
  addScore(e.score, e.x, e.y);
  addXp(e.xp);
  burst(e.x, e.y, e.color, e.r > 24 ? 22 : 14);
  if (Math.random() < (e.r > 30 ? 0.18 : 0.08)) {
    spawnPowerUp(e.x, e.y);
  }
  game.shake = Math.max(game.shake, e.r > 30 ? 4 : 2);
  playSound("boom");
}

function defeatBoss() {
  const b = game.boss;
  addCombo();
  addCombo();
  addScore(b.score, b.x, b.y);
  addXp(b.xp);
  burst(b.x, b.y, "#f7bd3a", 46);
  spawnPowerUp(b.x - 60, b.y);
  spawnPowerUp(b.x + 10, b.y + 38);
  game.floatTexts.push({ text: "Boss 擊破", x: b.x - 60, y: b.y - 80, life: 1.6, color: "#25b5a5" });
  game.defeatedBosses.push({ x: b.x, y: b.y, r: b.r, variant: b.variant, t: 0, duration: 0.72 });
  game.boss = null;
  game.bossActive = false;
  game.enemyBullets = [];
  game.shake = 10;
  playSound("boss");
  saveProgress();
}

function spawnPowerUp(x, y) {
  const types = ["heal", "shield", "rapid", "score"];
  const type = types[Math.floor(Math.random() * types.length)];
  game.powerUps.push({
    type,
    x,
    y,
    vx: -70,
    r: 16,
    life: 8,
    seed: Math.random() * 20,
    spin: 0,
  });
}

function collectPowerUp(item) {
  const p = game.player;
  if (item.type === "heal") {
    p.hp = Math.min(p.maxHp, p.hp + 28);
    showToast("鮮魚罐頭：回復體力");
  }
  if (item.type === "shield") {
    p.shield = 7;
    showToast("紙箱護盾：短暫減傷");
  }
  if (item.type === "rapid") {
    p.rapid = 6;
    showToast("貓薄荷：射速提升");
  }
  if (item.type === "score") {
    addScore(180 + game.wave * 12, item.x, item.y);
    showToast("金色毛線：加分");
  }
  item.life = 0;
  burst(item.x, item.y, "#25b5a5", 16);
  playSound("pickup");
}

function addScore(amount, x, y) {
  const multiplier = getComboMultiplier();
  const finalAmount = Math.round(amount * multiplier);
  game.score += finalAmount;
  game.floatTexts.push({ text: `+${finalAmount}`, x, y, life: 0.9, color: multiplier > 1 ? "#ff755f" : "#172033" });
}

function addCombo() {
  game.combo += 1;
  game.comboBest = Math.max(game.comboBest, game.combo);
  game.comboTimer = 3.2;
  if (game.combo > 0 && game.combo % 10 === 0) {
    showToast(`Combo ${game.combo}`);
    playSound("pickup");
  }
}

function getComboMultiplier() {
  return Math.min(3, 1 + Math.floor(game.combo / 8) * 0.2);
}

function addXp(amount) {
  const p = game.player;
  p.xp += amount;
  while (p.xp >= p.xpNext) {
    p.xp -= p.xpNext;
    p.level += 1;
    p.xpNext = Math.round(p.xpNext * 1.22 + 24);
    game.state = "upgrade";
    ui.upgradePanel.classList.remove("hidden");
    playSound("level");
    showToast(`升級到 Lv ${p.level}`);
    updateUi();
    break;
  }
}

function applyUpgrade(type) {
  const p = game.player;
  p.upgrades[type] += 1;
  if (type === "maxHp") {
    p.maxHp += 20;
    p.hp = Math.min(p.maxHp, p.hp + 35);
  }
  if (type === "damage") p.damage += 5;
  if (type === "fireRate") p.fireDelay = Math.max(0.12, p.fireDelay - 0.035);
  if (type === "defense") p.defense += 2.5;
  if (type === "speed") p.speed += 24;

  ui.upgradePanel.classList.add("hidden");
  game.state = "playing";
  saveProgress();
}

function damagePlayer(amount) {
  const p = game.player;
  if (p.invuln > 0 || game.state !== "playing") return;
  const shieldFactor = p.shield > 0 ? 0.45 : 1;
  const reduced = Math.max(3, (amount - p.defense) * shieldFactor);
  p.hp -= reduced;
  p.invuln = 0.85;
  game.shake = 6;
  game.floatTexts.push({ text: `-${Math.round(reduced)}`, x: p.x - 18, y: p.y - 42, life: 0.8, color: "#e84b5f" });
  playSound("hurt");
  if (p.hp <= 0) {
    p.hp = 0;
    endGame();
  }
}

function endGame() {
  game.state = "gameover";
  saved.bestScore = Math.max(saved.bestScore, game.score);
  saved.bestWave = Math.max(saved.bestWave, game.wave);
  writeSave();
  ui.finalText.textContent = `本局分數 ${game.score}，到達 Wave ${game.wave}，最高 Combo ${game.comboBest}`;
  ui.gameOverPanel.classList.remove("hidden");
}

function saveProgress() {
  saved.bestScore = Math.max(saved.bestScore, game.score);
  saved.bestWave = Math.max(saved.bestWave, game.wave);
  writeSave();
}

function togglePause() {
  if (game.state === "playing") {
    game.state = "paused";
    ui.pauseIcon.textContent = "▶";
    ui.pausePanel.classList.remove("hidden");
  } else if (game.state === "paused") {
    game.state = "playing";
    ui.pauseIcon.textContent = "II";
    ui.pausePanel.classList.add("hidden");
    game.lastTime = performance.now();
  }
}

function updateUi() {
  const p = game.player || createPlayer();
  ui.score.textContent = String(game.score);
  ui.best.textContent = String(Math.max(saved.bestScore, game.score));
  ui.wave.textContent = String(game.wave);
  ui.level.textContent = String(p.level);
  ui.hpText.textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;
  ui.xpText.textContent = `${Math.floor(p.xp)} / ${p.xpNext}`;
  ui.hpFill.style.width = `${clamp((p.hp / p.maxHp) * 100, 0, 100)}%`;
  ui.xpFill.style.width = `${clamp((p.xp / p.xpNext) * 100, 0, 100)}%`;
  ui.comboText.textContent = `${game.combo} x${getComboMultiplier().toFixed(1)}`;
  ui.comboFill.style.width = `${clamp((game.comboTimer / 3.2) * 100, 0, 100)}%`;
  ui.skillButton.disabled = game.skillCooldown > 0 || game.state !== "playing";
  ui.skillButton.textContent = game.skillCooldown > 0 ? `${game.skillCooldown.toFixed(0)}秒` : "毛球爆發";
  ui.soundIcon.textContent = saved.muted ? "×" : "♪";
  for (const button of ui.upgradePanel.querySelectorAll("[data-upgrade]")) {
    const type = button.dataset.upgrade;
    button.dataset.level = `Lv ${p.upgrades?.[type] || 0}`;
  }
}

function draw() {
  const sx = game.shake ? random(-game.shake, game.shake) : 0;
  const sy = game.shake ? random(-game.shake, game.shake) : 0;
  ctx.save();
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.translate(sx, sy);
  drawBackground();
  drawParticlesBack();
  drawPlayerBullets();
  drawWarnings();
  drawEnemies();
  drawBoss();
  drawDefeatedBosses();
  drawPowerUps();
  drawEnemyBullets();
  drawPlayer();
  drawParticlesFront();
  drawBossBar();
  drawBanner();
  drawFloatTexts();

  if (game.state === "paused") {
    drawPaused();
  }

  ctx.restore();
}

function drawBackground() {
  const w = game.width;
  const h = game.height;
  const scroll = (game.time * 55) % w;
  const palette = getStagePalette();

  if (isImageReady(sprites.background)) {
    drawScrollingBackground(sprites.background, scroll * 0.42);
    drawGround(scroll, h, palette[3]);
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = "#172033";
    ctx.font = "900 18px Microsoft JhengHei, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(game.stageName, game.width - 18, game.height - 24);
    ctx.restore();
    return;
  }

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, palette[0]);
  sky.addColorStop(0.56, palette[1]);
  sky.addColorStop(1, palette[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.35;
  for (const s of game.stars) {
    const x = (s.x - scroll * s.s * 0.22 + w * 2) % w;
    drawStar(x, s.y * 0.62 + 40, s.s + 2, "#fffaf0");
  }
  ctx.globalAlpha = 1;

  drawCloudLayer(scroll * 0.22, 98, "#fffaf0", 0.56);
  drawCloudLayer(scroll * 0.34, 178, "#f8fffb", 0.38);
  drawHills(scroll * 0.2, h - 175, "#86c89a", 0.45);
  drawCity(scroll * 0.48, h - 190);
  drawGround(scroll, h, palette[3]);

  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.fillStyle = "#172033";
  ctx.font = "900 18px Microsoft JhengHei, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(game.stageName, game.width - 18, game.height - 24);
  ctx.restore();
}

function drawScrollingBackground(img, scroll) {
  const coverScale = Math.max(game.height / img.height, game.width / img.width);
  const drawW = img.width * coverScale;
  const drawH = img.height * coverScale;
  const y = (game.height - drawH) * 0.5;
  const offset = scroll % drawW;
  ctx.save();
  ctx.globalAlpha = 0.72;
  for (let x = -offset - drawW; x < game.width + drawW; x += drawW) {
    ctx.drawImage(img, x, y, drawW, drawH);
  }
  ctx.restore();
}

function drawCloudLayer(scroll, y, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = -1; i < 7; i += 1) {
    const x = i * 260 - (scroll % 260);
    ellipse(x + 40, y, 56, 22);
    ellipse(x + 82, y - 12, 44, 24);
    ellipse(x + 124, y, 62, 26);
  }
  ctx.restore();
}

function drawHills(scroll, y, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, game.height);
  for (let x = -200; x <= game.width + 240; x += 80) {
    const px = x - (scroll % 160);
    ctx.lineTo(px, y + Math.sin((px + game.time * 20) * 0.012) * 26);
  }
  ctx.lineTo(game.width, game.height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCity(scroll, y) {
  ctx.save();
  ctx.globalAlpha = 0.22;
  for (let i = -1; i < 12; i += 1) {
    const x = i * 130 - (scroll % 130);
    const bh = 48 + ((i * 37) % 64);
    roundRect(x, y - bh, 84, bh, 4, "#6d8792");
    roundRect(x + 18, y - bh - 20, 48, 22, 4, "#6d8792");
  }
  ctx.restore();
}

function drawGround(scroll, h, color = "#78bc7b") {
  const y = h - 58;
  ctx.fillStyle = color;
  ctx.fillRect(0, y, game.width, 80);
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#fff3bd";
  for (let i = -1; i < 18; i += 1) {
    const x = i * 100 - (scroll % 100);
    ctx.fillRect(x, y + 14, 52, 7);
  }
  ctx.globalAlpha = 1;
}

function drawPlayer() {
  const p = game.player;
  if (!p) return;
  if (p.invuln > 0 && Math.floor(game.time * 18) % 2 === 0) return;

  ctx.save();
  ctx.translate(p.x, p.y);
  const bob = Math.sin(game.time * 8) * 2.5;
  ctx.translate(0, bob);

  ctx.fillStyle = "rgba(23, 32, 51, 0.18)";
  ellipse(0, 28, 34, 10);

  const anim = p.invuln > 0 ? animations.catNativeHurt : p.attackFlash > 0 ? animations.catNativeAttack : animations.catNativeIdle;
  if (drawAnimationCentered(anim, 0, -4, p.r * 3.05, p.r * 3.05, game.time)) {
    if (p.shield > 0) {
      ctx.globalAlpha = 0.42 + Math.sin(game.time * 10) * 0.08;
      ctx.strokeStyle = "#70d5ff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, -2, 42, 40, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    return;
  }

  if (drawSpriteCentered(sprites.catHero, 0, -4, p.r * 2.7, p.r * 2.7)) {
    ctx.restore();
    return;
  }

  ctx.fillStyle = "#ffcf7d";
  ctx.strokeStyle = "#172033";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(-24, -14);
  ctx.lineTo(-15, -42);
  ctx.lineTo(-4, -17);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(24, -14);
  ctx.lineTo(15, -42);
  ctx.lineTo(4, -17);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ellipse(0, -5, 31, 26, "#ffcf7d", true);
  ellipse(-8, 8, 24, 20, "#f6a55f", true);

  ctx.fillStyle = "#172033";
  ellipse(-10, -9, 3, 5);
  ellipse(10, -9, 3, 5);
  ctx.fillStyle = "#ff755f";
  ellipse(0, -1, 4, 3);
  ctx.strokeStyle = "#172033";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-4, 4);
  ctx.quadraticCurveTo(0, 8, 4, 4);
  ctx.stroke();

  ctx.strokeStyle = "#172033";
  ctx.lineWidth = 2;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 12, 1);
    ctx.lineTo(side * 30, -4);
    ctx.moveTo(side * 12, 6);
    ctx.lineTo(side * 30, 7);
    ctx.stroke();
  }

  ctx.fillStyle = "#25b5a5";
  ellipse(8, 24, 6, 7);

  if (p.shield > 0) {
    ctx.globalAlpha = 0.42 + Math.sin(game.time * 10) * 0.08;
    ctx.strokeStyle = "#70d5ff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, -2, 42, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawPlayerBullets() {
  for (const b of game.bullets) {
    if (drawAnimationWorld(animations.yarnLoop, b.x, b.y, b.r * 4.6, b.r * 4.0, game.time + b.life)) continue;
    if (drawSpriteWorld(sprites.projectileYarn, b.x, b.y, b.r * 4.6, b.r * 4.0, game.time * 4)) continue;
    const glow = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.r * 3);
    glow.addColorStop(0, "#ffffff");
    glow.addColorStop(0.42, "#fff2a3");
    glow.addColorStop(1, "rgba(255, 210, 92, 0)");
    ctx.fillStyle = glow;
    ellipse(b.x, b.y, b.r * 3, b.r * 2);
    ellipse(b.x, b.y, b.r, b.r, "#fffaf0");
  }
}

function drawEnemies() {
  for (const e of game.enemies) {
    drawDog(e.x, e.y, e.r, e.color, e.type);
    drawMiniBar(e.x, e.y - e.r - 15, e.r * 2, 5, e.hp / e.maxHp, "#e84b5f");
  }
}

function drawWarnings() {
  ctx.save();
  for (const e of game.enemies) {
    if (e.x > game.width - 24 && (e.type === "fast" || e.type === "big")) {
      const alpha = 0.45 + Math.sin(game.time * 12) * 0.22;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = e.type === "fast" ? "#ff755f" : "#f7bd3a";
      ctx.beginPath();
      ctx.moveTo(game.width - 28, e.y);
      ctx.lineTo(game.width - 8, e.y - 13);
      ctx.lineTo(game.width - 8, e.y + 13);
      ctx.closePath();
      ctx.fill();
    }
  }

  if (game.boss && (game.boss.chargeState === "warning" || game.boss.chargeState === "dash")) {
    ctx.globalAlpha = 0.24 + Math.sin(game.time * 18) * 0.12;
    ctx.fillStyle = "#e84b5f";
    ctx.fillRect(0, game.boss.chargeY - 18, game.width, 36);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fffaf0";
    ctx.font = "900 14px Microsoft JhengHei, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("衝刺路線", 18, game.boss.chargeY - 24);
  }
  ctx.restore();
}

function drawDog(x, y, r, color, type) {
  const runAnim = {
    small: animations.dogSmallRun,
    fast: animations.dogFastRun,
    big: animations.dogBigRun,
    disc: animations.dogDiscRun,
    bone: animations.dogBoneRun,
  }[type];
  if (drawAnimationWorld(runAnim, x, y, r * 2.85, r * 2.65, game.time + x * 0.01)) return;

  const sprite = {
    small: sprites.dogSmall,
    fast: sprites.dogFast,
    big: sprites.dogBig,
    disc: sprites.dogDisc,
    bone: sprites.dogBone,
    boss: sprites.bossShiba,
  }[type];
  if (drawSpriteWorld(sprite, x, y, r * (type === "boss" ? 3.1 : 2.7), r * (type === "boss" ? 2.8 : 2.35))) {
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(23, 32, 51, 0.14)";
  ellipse(0, r * 0.9, r * 1.1, r * 0.3);

  ellipse(0, 0, r * 1.08, r * 0.86, color, true);
  ellipse(-r * 0.36, -r * 0.42, r * 0.28, r * 0.42, darken(color), true);
  ellipse(r * 0.36, -r * 0.42, r * 0.28, r * 0.42, darken(color), true);
  ellipse(-r * 0.18, -r * 0.12, r * 0.1, r * 0.13, "#172033");
  ellipse(r * 0.18, -r * 0.12, r * 0.1, r * 0.13, "#172033");
  ellipse(0, r * 0.1, r * 0.16, r * 0.1, "#3d2a22");

  ctx.strokeStyle = "#172033";
  ctx.lineWidth = Math.max(2, r * 0.08);
  ctx.beginPath();
  ctx.moveTo(-r * 0.7, r * 0.1);
  ctx.quadraticCurveTo(-r * 1.08, -r * 0.15, -r * 1.22, -r * 0.45);
  ctx.stroke();

  if (type === "disc") {
    ellipse(-r * 1.1, -r * 0.75, r * 0.36, r * 0.12, "#25b5a5", true);
  }
  if (type === "bone") {
    drawBone(-r * 1.1, -r * 0.7, r * 0.32);
  }
  ctx.restore();
}

function drawBoss() {
  if (!game.boss) return;
  const b = game.boss;
  const bossAnim = getBossAnimation(b);
  if (drawAnimationWorld(bossAnim, b.x, b.y + 10, b.r * 3.55, b.r * 3.55, game.time)) {
    return;
  }
  const bossSprite = b.variant === "doghouse" ? sprites.bossDoghouse : sprites.bossShiba;
  if (!drawSpriteWorld(bossSprite, b.x, b.y + 8, b.r * 3.15, b.r * 3.1)) {
    drawDog(b.x, b.y, b.r, "#b46d42", "boss");
  }
}

function getBossAnimation(b) {
  const map = {
    shiba: {
      idle: animations.bossShibaIdle,
      roar: animations.bossShibaRoar,
      shoot: animations.bossShibaShoot,
      dash: animations.bossShibaDash,
    },
    doghouse: {
      idle: animations.bossDoghouseIdle,
      roar: animations.bossDoghouseRoar,
      shoot: animations.bossDoghouseShoot,
      dash: animations.bossDoghouseDash,
    },
    mecha: {
      idle: animations.bossMechaIdle,
      roar: animations.bossMechaRoar,
      shoot: animations.bossMechaShoot,
      dash: animations.bossMechaDash,
    },
  };
  const set = map[b.variant] || map.shiba;
  if (b.chargeState === "dash" || b.chargeState === "warning") return set.dash;
  if (b.roarTimer > 0) return set.roar;
  if (b.shootFlash > 0) return set.shoot;
  return set.idle;
}

function drawDefeatedBosses() {
  for (const boss of game.defeatedBosses) {
    const anim = boss.variant === "doghouse" ? animations.bossDoghouseDeath : boss.variant === "mecha" ? animations.bossMechaDeath : animations.bossShibaDeath;
    drawAnimationWorld(anim, boss.x, boss.y + 10, boss.r * 3.55, boss.r * 3.55, boss.t);
  }
}

function drawEnemyBullets() {
  for (const b of game.enemyBullets) {
    if (b.kind === "disc") {
      if (drawAnimationWorld(animations.discLoop, b.x, b.y, b.r * 4.4, b.r * 3.7, game.time + b.seed)) continue;
      if (drawSpriteWorld(sprites.projectileDisc, b.x, b.y, b.r * 4.4, b.r * 3.7, game.time * 5)) continue;
      ellipse(b.x, b.y, b.r * 1.45, b.r * 0.62, "#25b5a5", true);
      ellipse(b.x, b.y, b.r * 0.72, b.r * 0.28, "#fffaf0");
    } else {
      if (drawAnimationWorld(animations.boneLoop, b.x, b.y, b.r * 5.2, b.r * 2.8, game.time + b.x * 0.01)) continue;
      if (drawSpriteWorld(sprites.projectileBone, b.x, b.y, b.r * 5.2, b.r * 2.8, Math.sin(game.time * 8 + b.x) * 0.4)) continue;
      drawBone(b.x, b.y, b.r);
    }
  }
}

function drawPowerUps() {
  for (const item of game.powerUps) {
    const sprite = {
      heal: sprites.pickupHeal,
      shield: sprites.pickupShield,
      rapid: sprites.pickupRapid,
      score: sprites.pickupScore,
    }[item.type];
    if (drawSpriteWorld(sprite, item.x, item.y, item.r * 3.25, item.r * 3.25, Math.sin(item.spin) * 0.08)) continue;
    const colors = {
      heal: "#35c28d",
      shield: "#70d5ff",
      rapid: "#ff755f",
      score: "#f7bd3a",
    };
    const labels = {
      heal: "+",
      shield: "□",
      rapid: "×",
      score: "$",
    };
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.spin);
    ellipse(0, 0, item.r + 7, item.r + 7, "rgba(255,250,240,0.68)");
    ellipse(0, 0, item.r, item.r, colors[item.type], true);
    ctx.rotate(-item.spin);
    ctx.fillStyle = "#172033";
    ctx.font = "900 18px Microsoft JhengHei, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labels[item.type], 0, 1);
    ctx.restore();
  }
}

function drawBone(x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(game.time * 8 + x) * 0.4);
  ctx.fillStyle = "#fffaf0";
  ctx.strokeStyle = "#172033";
  ctx.lineWidth = 2;
  roundRect(-r * 1.5, -r * 0.35, r * 3, r * 0.7, r * 0.2, "#fffaf0", true);
  ellipse(-r * 1.5, -r * 0.42, r * 0.55, r * 0.45, "#fffaf0", true);
  ellipse(-r * 1.5, r * 0.42, r * 0.55, r * 0.45, "#fffaf0", true);
  ellipse(r * 1.5, -r * 0.42, r * 0.55, r * 0.45, "#fffaf0", true);
  ellipse(r * 1.5, r * 0.42, r * 0.55, r * 0.45, "#fffaf0", true);
  ctx.restore();
}

function drawParticlesBack() {
  for (const p of game.particles.filter((item) => item.back)) {
    drawParticle(p);
  }
}

function drawParticlesFront() {
  for (const p of game.particles.filter((item) => !item.back)) {
    drawParticle(p);
  }
}

function drawParticle(p) {
  ctx.save();
  ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
  if (p.fx && drawAnimationCentered(animations.explosionLoop, p.x, p.y, p.size * 5.4, p.size * 5.4, game.time + p.seed)) {
    ctx.restore();
    return;
  }
  if (p.fx && drawSpriteCentered(sprites.fxExplosion, p.x, p.y, p.size * 4.6, p.size * 4.6, p.spin || 0)) {
    ctx.restore();
    return;
  }
  ellipse(p.x, p.y, p.size, p.size, p.color);
  ctx.restore();
}

function drawFloatTexts() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "900 20px Microsoft JhengHei, sans-serif";
  for (const t of game.floatTexts) {
    ctx.globalAlpha = clamp(t.life, 0, 1);
    ctx.fillStyle = t.color;
    ctx.strokeStyle = "rgba(255,250,240,0.9)";
    ctx.lineWidth = 4;
    ctx.strokeText(t.text, t.x, t.y);
    ctx.fillText(t.text, t.x, t.y);
  }
  ctx.restore();
}

function drawBossBar() {
  if (!game.boss) return;
  const w = Math.min(520, game.width - 220);
  const x = (game.width - w) / 2;
  const y = 86;
  drawMiniBar(x + w / 2, y, w, 14, game.boss.hp / game.boss.maxHp, "#e84b5f");
  ctx.fillStyle = "#172033";
  ctx.font = "900 13px Microsoft JhengHei, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(game.boss.name, x + w / 2, y - 12);
}

function drawBanner() {
  if (game.bannerTimer <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp(game.bannerTimer / 0.5, 0, 1);
  ctx.fillStyle = "rgba(23,32,51,0.84)";
  roundRect(game.width / 2 - 210, 126, 420, 46, 8, "rgba(23,32,51,0.84)");
  ctx.fillStyle = "#fffaf0";
  ctx.textAlign = "center";
  ctx.font = "900 22px Microsoft JhengHei, sans-serif";
  ctx.fillText(game.bannerText, game.width / 2, 156);
  ctx.restore();
}

function drawMiniBar(x, y, w, h, pct, color) {
  ctx.save();
  ctx.fillStyle = "rgba(23,32,51,0.16)";
  roundRect(x - w / 2, y, w, h, h / 2, "rgba(23,32,51,0.16)");
  roundRect(x - w / 2, y, w * clamp(pct, 0, 1), h, h / 2, color);
  ctx.restore();
}

function drawPaused() {
  ctx.save();
  ctx.fillStyle = "rgba(23,32,51,0.36)";
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.fillStyle = "#fffaf0";
  ctx.textAlign = "center";
  ctx.font = "900 44px Microsoft JhengHei, sans-serif";
  ctx.fillText("暫停", game.width / 2, game.height / 2);
  ctx.font = "700 18px Microsoft JhengHei, sans-serif";
  ctx.fillText("按 P 或右上按鈕繼續", game.width / 2, game.height / 2 + 38);
  ctx.restore();
}

function burst(x, y, color, count) {
  if (count >= 12) {
    game.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: Math.min(26, count * 0.7),
      color,
      life: 0.28,
      maxLife: 0.28,
      fx: true,
      spin: random(-0.2, 0.2),
      seed: Math.random() * 4,
    });
  }
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = random(60, 310);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: random(3, 9),
      color: Math.random() > 0.25 ? color : "#fffaf0",
      life: random(0.28, 0.74),
      maxLife: 0.74,
      back: Math.random() > 0.65,
    });
  }
}

function circleHit(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) <= a.r + b.r;
}

function isImageReady(img) {
  return img && img.complete && img.naturalWidth > 0;
}

function drawSpriteWorld(img, x, y, width, height, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  const ok = drawSpriteCentered(img, 0, 0, width, height, rotation);
  ctx.restore();
  return ok;
}

function drawAnimationWorld(anim, x, y, width, height, time, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  const ok = drawAnimationCentered(anim, 0, 0, width, height, time, rotation);
  ctx.restore();
  return ok;
}

function drawAnimationCentered(anim, x, y, width, height, time, rotation = 0) {
  if (!anim || !anim.frames?.length) return false;
  const readyFrames = anim.frames.filter(isImageReady);
  if (!readyFrames.length) return false;
  const frameIndex = Math.floor(time * anim.fps) % readyFrames.length;
  return drawSpriteCentered(readyFrames[frameIndex], x, y, width, height, rotation);
}

function drawSpriteCentered(img, x, y, width, height, rotation = 0) {
  if (!isImageReady(img)) return false;
  const aspect = img.naturalWidth / img.naturalHeight;
  let drawW = width;
  let drawH = height;
  if (drawW / drawH > aspect) {
    drawW = drawH * aspect;
  } else {
    drawH = drawW / aspect;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
  return true;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function darken(color) {
  const map = {
    "#d18b45": "#8f562c",
    "#f2a45d": "#a76335",
    "#9a6a3b": "#604125",
    "#cf785e": "#88483f",
    "#8a715a": "#5f4d3e",
    "#b46d42": "#734127",
  };
  return map[color] || "#6a4633";
}

function ellipse(x, y, rx, ry, fill, stroke = false) {
  if (fill) ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  if (stroke) ctx.stroke();
}

function roundRect(x, y, w, h, r, fill, stroke = false) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  if (stroke) ctx.stroke();
}

function drawStar(x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function setDir(dir, value) {
  input[dir] = value;
  for (const button of ui.padButtons) {
    if (button.dataset.dir === dir) button.classList.toggle("active", value);
  }
}

window.addEventListener("resize", () => {
  resize();
  buildStars();
});

window.addEventListener("keydown", (event) => {
  const dir = keys.get(event.key.toLowerCase());
  if (dir) {
    event.preventDefault();
    setDir(dir, true);
  }
  if (event.key.toLowerCase() === "p") togglePause();
  if (event.code === "Space") {
    event.preventDefault();
    triggerSkill();
  }
  if (event.key.toLowerCase() === "b" && event.shiftKey && game.state === "playing") {
    game.enemies = [];
    game.waveKills = game.waveTarget;
    nextWave();
  }
});

window.addEventListener("keyup", (event) => {
  const dir = keys.get(event.key.toLowerCase());
  if (dir) {
    event.preventDefault();
    setDir(dir, false);
  }
});

for (const button of ui.padButtons) {
  const dir = button.dataset.dir;
  const on = (event) => {
    event.preventDefault();
    setDir(dir, true);
  };
  const off = (event) => {
    event.preventDefault();
    setDir(dir, false);
  };
  button.addEventListener("pointerdown", on);
  button.addEventListener("pointerup", off);
  button.addEventListener("pointercancel", off);
  button.addEventListener("pointerleave", off);
}

ui.enterGameButton.addEventListener("click", beginIntro);
ui.introVideo.addEventListener("ended", finishIntro);
ui.skipIntroButton.addEventListener("click", finishIntro);
ui.startButton.addEventListener("click", resetGame);
ui.restartButton.addEventListener("click", resetGame);
ui.pauseRestartButton.addEventListener("click", resetGame);
ui.resumeButton.addEventListener("click", togglePause);
ui.pauseButton.addEventListener("click", togglePause);
ui.skillButton.addEventListener("click", triggerSkill);
ui.soundButton.addEventListener("click", () => {
  saved.muted = !saved.muted;
  if (!saved.muted) {
    initAudio();
    playSound("pickup");
  }
  writeSave();
  showToast(saved.muted ? "音效關閉" : "音效開啟");
});
ui.upgradePanel.addEventListener("click", (event) => {
  const button = event.target.closest("[data-upgrade]");
  if (button) applyUpgrade(button.dataset.upgrade);
});

window.__catDogDebug = {
  boss: () =>
    game.boss
      ? {
          name: game.boss.name,
          variant: game.boss.variant,
          x: game.boss.x,
          y: game.boss.y,
          state: game.boss.chargeState,
          chargeY: game.boss.chargeY,
        }
      : null,
  state: () => ({
    wave: game.wave,
    score: game.score,
    combo: game.combo,
  }),
};

loadSprites();
resize();
buildStars();
game.player = createPlayer();
ui.best.textContent = String(saved.bestScore);
updateUi();
startLoop();
