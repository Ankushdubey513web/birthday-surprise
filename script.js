/* ========================================================
   GLOBAL NAVIGATION & MUSIC
======================================================== */
function goTo(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Scratch screen active hote hi canvas ko initialize karein
    if (screenId === "screen-scratch") {
      setTimeout(initScratchCanvas, 100);
    }
  }
}

// Background Floating Hearts
function createFloatingHearts() {
  const container = document.getElementById("heartsContainer");
  const hearts = ["❤️", "💖", "💕", "🌸", "✨", "💙"];
  setInterval(() => {
    const h = document.createElement("span");
    h.className = "floating-heart";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.animationDuration = (5 + Math.random() * 5) + "s";
    h.style.fontSize = (14 + Math.random() * 14) + "px";
    container.appendChild(h);
    setTimeout(() => h.remove(), 10000);
  }, 500);
}
createFloatingHearts();

// Music Controller
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;

function playAudio() {
  if (!isPlaying) {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add("playing");
    }).catch(() => {});
  }
}

musicToggle.onclick = () => {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicToggle.classList.remove("playing");
  } else {
    bgMusic.play();
    isPlaying = true;
    musicToggle.classList.add("playing");
  }
};

/* ========================================================
   1. GIFT BOX SCREEN
======================================================== */
function openGift() {
  playAudio();
  const box = document.getElementById("giftBox");
  box.classList.add("opened");
  setTimeout(() => {
    goTo("screen-pin");
  }, 900);
}

/* ========================================================
   2. PIN LOCK SCREEN
======================================================== */
const CORRECT_PIN = "2709";
let enteredPin = "";

function updatePinDots() {
  const dots = document.querySelectorAll(".p-dot");
  dots.forEach((dot, index) => {
    if (index < enteredPin.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
}

function pressKey(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    updatePinDots();
    if (enteredPin.length === 4) {
      checkPin();
    }
  }
}

function deleteKey() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
  }
}

function checkPin() {
  const status = document.getElementById("pinStatus");
  const lock = document.getElementById("lockIcon");
  if (enteredPin === CORRECT_PIN) {
    lock.textContent = "🔓";
    status.textContent = "Welcome! 💕 Opening...";
    setTimeout(() => {
      goTo("screen-curtain");
    }, 700);
  } else {
    const screen = document.getElementById("screen-pin");
    screen.classList.add("shake");
    status.textContent = "Incorrect Pin! Try again.";
    setTimeout(() => {
      screen.classList.remove("shake");
      enteredPin = "";
      updatePinDots();
      status.textContent = "";
    }, 800);
  }
}

// Live Time for Lock Screen
function updateClock() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const el = document.getElementById("lockTime");
  if (el) el.textContent = `${hrs}:${mins}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ========================================================
   3. CURTAIN REVEAL SCREEN
======================================================== */
function openCurtains() {
  const curtains = document.getElementById("curtains");
  curtains.classList.add("open");
  setTimeout(() => {
    curtains.style.display = "none";
  }, 1300);
}

/* ========================================================
   4. BIRTHDAY CAKE & LIVE AGE STATS
======================================================== */
// Birthday: 27 September 2005 (matches video's 19 years / 2709 PIN)
const BIRTH_DATE = new Date("2007-09-27T00:00:00");

function calculateAgeStats() {
  const now = new Date();
  const diffMs = now - BIRTH_DATE;

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMins = Math.floor(diffMs / (1000 * 60));
  const approxYears = Math.floor(totalDays / 365.25);

  document.getElementById("statYears").textContent = approxYears;
  document.getElementById("statDays").textContent = totalDays.toLocaleString();
  document.getElementById("statHours").textContent = totalHours.toLocaleString();
  document.getElementById("statMins").textContent = totalMins.toLocaleString();
}
calculateAgeStats();

let candlesBlown = false;
function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;

  document.getElementById("flame1").classList.add("off");
  document.getElementById("flame2").classList.add("off");

  const s1 = document.getElementById("smoke1");
  const s2 = document.getElementById("smoke2");
  s1.classList.add("puff");
  s2.classList.add("puff");

  document.getElementById("cakeHint").textContent = "Candles blown! 🎂✨";
  document.getElementById("blowBtn").textContent = "🔥 Relight";
  document.getElementById("blowBtn").onclick = relightCandles;
  document.getElementById("cakeNextWrap").classList.remove("hidden");
}

function relightCandles() {
  candlesBlown = false;
  document.getElementById("flame1").classList.remove("off");
  document.getElementById("flame2").classList.remove("off");
  document.getElementById("cakeHint").textContent = "Tap the cake to blow the candles 🎂";
  document.getElementById("blowBtn").textContent = "💨 Blow candles";
  document.getElementById("blowBtn").onclick = blowCandles;
}

/* ========================================================
   5. POLAROID MEMORIES STACK
======================================================== */
let activePolaroid = 0;
const polaroidCards = document.querySelectorAll(".polaroid-card");
const polaroidDots = document.querySelectorAll("#polaroidDots .dot");

function nextPolaroid() {
  if (polaroidCards.length === 0) return;
  const currentCard = polaroidCards[activePolaroid];
  currentCard.classList.add("slide-out");

  setTimeout(() => {
    currentCard.classList.remove("slide-out");
    currentCard.style.zIndex = "1";
    activePolaroid = (activePolaroid + 1) % polaroidCards.length;

    polaroidCards.forEach((c, i) => {
      const order = (i - activePolaroid + polaroidCards.length) % polaroidCards.length;
      c.style.zIndex = polaroidCards.length - order;
    });

    polaroidDots.forEach((d, i) => {
      d.classList.toggle("on", i === activePolaroid);
    });
  }, 350);
}

/* ========================================================
   6. BALLOON POP WISHES (8 Wishes from Video)
======================================================== */
const balloonWishes = [
  "I just want to see you happy, always. ❤️",
  "Please take care of yourself, because you mean more to me than you know. 🫶",
  "You are my favourite person, always 💕",
  "Your smile is something I'll always want to protect. 😊❤️",
  "Whenever life feels heavy, remember—you never have to face it all alone. 🤍",
  "I am the luckiest, because of you ✨",
  "May Kanha Ji always keep you safe, peaceful and smiling. 🦚💙",
  "And if I get one wish for myself... I'd wish to keep being a reason behind your smile. ❤️✨"
];

const balloonColors = [
  "#ff5388", "#ffbe3d", "#5bbaff", "#9b68eb", 
  "#51d683", "#ff6b6b", "#e65ca8", "#f7cf45"
];

const balloonsContainer = document.getElementById("balloonsContainer");
let poppedCount = 0;

balloonWishes.forEach((wish, idx) => {
  const b = document.createElement("div");
  b.className = "balloon-item";
  b.style.backgroundColor = balloonColors[idx];
  b.onclick = () => {
    if (b.classList.contains("popped")) return;
    b.classList.add("popped");
    poppedCount++;

    // Sound effect using Web Audio API (zero external audio dependency)
    playPopSound();

    const toast = document.getElementById("wishToast");
    const toastText = document.getElementById("wishToastText");
    toastText.textContent = wish;
    toast.classList.remove("hidden");

    document.getElementById("popCounter").textContent = `Popped ${poppedCount}/8`;

    if (poppedCount === 8) {
      document.getElementById("balloonNextBtn").classList.remove("hidden");
    }
  };
  balloonsContainer.appendChild(b);
});

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

/* ========================================================
   7. PHOTO SLIDING PUZZLE (3x3 with "Solve it for me")
======================================================== */
let puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 8 is empty space
let moves = 0;
const board = document.getElementById("puzzleBoard");

function renderPuzzle() {
  board.innerHTML = "";
  puzzleTiles.forEach((tileIndex, pos) => {
    const tile = document.createElement("div");
    tile.className = "puzzle-tile";
    if (tileIndex === 8) {
      tile.classList.add("empty");
    } else {
      const row = Math.floor(tileIndex / 3);
      const col = tileIndex % 3;
      tile.style.backgroundPosition = `-${col * 87}px -${row * 87}px`;
      tile.onclick = () => moveTile(pos);
    }
    board.appendChild(tile);
  });
}

function moveTile(pos) {
  const emptyPos = puzzleTiles.indexOf(8);
  const validMoves = [pos - 1, pos + 1, pos - 3, pos + 3];

  const sameRow = Math.floor(pos / 3) === Math.floor(emptyPos / 3);
  const isAdjacent = (pos - 1 === emptyPos && sameRow) ||
                     (pos + 1 === emptyPos && sameRow) ||
                     (pos - 3 === emptyPos) ||
                     (pos + 3 === emptyPos);

  if (isAdjacent) {
    [puzzleTiles[pos], puzzleTiles[emptyPos]] = [puzzleTiles[emptyPos], puzzleTiles[pos]];
    moves++;
    document.getElementById("moveCount").textContent = moves;
    renderPuzzle();
    checkPuzzleWin();
  }
}

function shufflePuzzle() {
  moves = 0;
  document.getElementById("moveCount").textContent = "0";
  for (let i = puzzleTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puzzleTiles[i], puzzleTiles[j]] = [puzzleTiles[j], puzzleTiles[i]];
  }
  // Ensure 8 is empty somewhere
  renderPuzzle();
}

function autoSolvePuzzle() {
  puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  renderPuzzle();
  triggerPuzzleWin();
}

function checkPuzzleWin() {
  const won = puzzleTiles.every((val, index) => val === index);
  if (won) triggerPuzzleWin();
}

function triggerPuzzleWin() {
  document.getElementById("puzzleSolvedFull").classList.remove("hidden");
  document.getElementById("puzzleControls").classList.add("hidden");
  document.getElementById("puzzleNextBtn").classList.remove("hidden");
}

shufflePuzzle();

/* ========================================================
   8. SCRATCH CARD SCREEN
======================================================== */
/* ========================================================
   8. SCRATCH CARD SCREEN (FIXED)
======================================================== */
const scratchCanvas = document.getElementById("scratchCanvas");
const scratchCardBox = document.getElementById("scratchCardBox");
const sCtx = scratchCanvas.getContext("2d");
let isScratching = false;
let isScratchedComplete = false;

function initScratchCanvas() {
  if (!scratchCardBox) return;

  const rect = scratchCardBox.getBoundingClientRect();
  // Fallback dimension agar calculation ke time bounding box 0 ho
  const w = rect.width || 300;
  const h = rect.height || 200;

  scratchCanvas.width = w;
  scratchCanvas.height = h;

  // Golden shimmer gradient draw karein
  const g = sCtx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#d49729");
  g.addColorStop(0.3, "#ffd97d");
  g.addColorStop(0.7, "#b87c17");
  g.addColorStop(1, "#ffe296");
  sCtx.fillStyle = g;
  sCtx.fillRect(0, 0, w, h);

  sCtx.fillStyle = "#4a320f";
  sCtx.font = "bold 18px DM Sans, sans-serif";
  sCtx.textAlign = "center";
  sCtx.fillText("Scratch here 🪙", w / 2, h / 2 - 5);
  sCtx.font = "12px DM Sans, sans-serif";
  sCtx.fillText("drag your finger across the card", w / 2, h / 2 + 20);
}

// Window resize par canvas update
window.addEventListener("resize", () => {
  const scratchScreen = document.getElementById("screen-scratch");
  if (scratchScreen && scratchScreen.classList.contains("active")) {
    initScratchCanvas();
  }
});

function scratchDraw(e) {
  if (isScratchedComplete || scratchCanvas.width === 0 || scratchCanvas.height === 0) return;

  const rect = scratchCanvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  sCtx.globalCompositeOperation = "destination-out";
  sCtx.beginPath();
  sCtx.arc(x, y, 26, 0, Math.PI * 2);
  sCtx.fill();

  calculateScratchProgress();
}

function calculateScratchProgress() {
  // Width/Height zero hone par check rok dein
  if (!scratchCanvas.width || !scratchCanvas.height) return;

  try {
    const imgData = sCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    let cleared = 0;
    for (let i = 3; i < imgData.data.length; i += 32) {
      if (imgData.data[i] === 0) cleared++;
    }
    const total = imgData.data.length / 32;
    const pct = Math.min(100, Math.round((cleared / total) * 100));
    
    const progBar = document.getElementById("scratchProgress");
    if (progBar) progBar.style.width = pct + "%";

    if (pct > 40 && !isScratchedComplete) {
      isScratchedComplete = true;
      scratchCanvas.style.transition = "opacity 0.6s ease";
      scratchCanvas.style.opacity = "0";
      setTimeout(() => {
        scratchCanvas.style.display = "none";
        document.getElementById("scratchNextBtn").classList.remove("hidden");
      }, 600);
    }
  } catch (err) {
    console.warn("Scratch progress check pending:", err);
  }
}

// Mouse Events
scratchCanvas.addEventListener("mousedown", (e) => { 
  isScratching = true; 
  scratchDraw(e); 
});
window.addEventListener("mouseup", () => { isScratching = false; });
scratchCanvas.addEventListener("mousemove", (e) => { 
  if (isScratching) scratchDraw(e); 
});

// Touch Events for Mobile
scratchCanvas.addEventListener("touchstart", (e) => { 
  isScratching = true; 
  scratchDraw(e); 
}, { passive: true });
window.addEventListener("touchend", () => { isScratching = false; });
scratchCanvas.addEventListener("touchmove", (e) => { 
  if (isScratching) scratchDraw(e); 
}, { passive: true });

/* ========================================================
   9. ENVELOPE & TYPEWRITER LETTER
======================================================== */
const letterParagraphs = [
  "Sabse pehle, tumhe tumhare birthday ki dil se bahut saari shubhkamnayein. Main bas itna chahta hoon ki tumhari zindagi ka har aane wala din tumhare liye aur bhi khoobsurat ho. Tumhari har chhoti-badi wish poori ho, tumhe har kadam par khushiyan milen aur tumhari ye pyari si smile hamesha tumhare chehre par bani rahe. 😊❤️",
  "Kuch log humari life mein bina kisi planning ke aa jaate hain, lekin pata nahi kab woh humare liye itne special ban jaate hain ki unke baare mein sochna bhi ek alag si feeling de jata hai. Tum bhi mere liye unhi khaas logon mein se ho. Tumse judi chhoti-chhoti baatein bhi kabhi-kabhi mere chehre par ek smile le aati hain.",
  "Tum Kanha ji ko itna maanti ho, isliye aaj tumhare birthday par meri ek chhoti si prayer Kanha ji se bhi hai—woh tumhe hamesha apni kripa mein rakhein, tumhare har mushkil waqt mein tumhara haath thaame rakhein, tumhe har galat raaste se bachayein aur tumhari zindagi ko sukoon, pyaar aur khushiyon se bhar dein. 🙏💙🦚",
  "Tum zindagi mein jo bhi banna chahti ho, jo bhi achieve karna chahti ho, Kanha ji tumhe usmein safalta dein. Aur jab kabhi zindagi thodi difficult lage, to yaad rakhna—koi bhi waqt hamesha ke liye nahi hota. Mushkilein aati hain, lekin woh guzar bhi jaati hain.",
  "Ye chhota sa gift shayad duniya ka sabse bada ya sabse mehenga gift nahi hai, lekin ise choose karte waqt mere mind mein sirf tum thi. Bas mann mein laga ki tumhare liye kuch aisa hona chahiye jo tumhe pasand aaye aur jab bhi tum ise dekho, tumhe mere taraf se di hui ek chhoti si smile yaad aa jaye. ❤️",
  "Aur ek baat jo main dil se kehna chahta hoon... Life mein chahe kabhi bhi koi situation kitni bhi difficult kyun na ho jaaye, please kabhi khud ko akela mat samajhna. Agar kabhi tumhe lage ki sab kuch tumhare against ho raha hai, ya tumhare paas apni baat kehne ke liye koi nahi hai, to yaad rakhna ki main tumhare saath hoon. Tumhari khushi ke waqt tumhare liye khush hona ho, ya mushkil waqt mein tumhari baat sunni ho—main jitna mere bas mein hoga, utna tumhare saath khada rahunga.",
  "Main tumhari life mein kya place rakhta hoon, ye main tum par chhodta hoon... bas itna chahta hoon ki meri presence kabhi tumhare liye burden nahi, balki ek comfort ho. Aur shayad isi wajah se tum mere liye thodi si zyada special ho. ❤️",
  "Aaj birthday hai, to itni serious baatein bahut ho gayi! 😄 Khoob smile karna, cake enjoy karna, apne favourite logon ke saath time spend karna aur apna special day bilkul special tarike se celebrate karna. 🎂✨",
  "Once again, Happy Birthday! ❤️ Kanha ji tumhe hamesha khush rakhein, tumhari har genuine wish poori karein, tumko har mushkil se door rakhein aur tumhari smile ko hamesha aise hi banaye rakhein. 🙏💙🦚",
  "Take care of yourself,\nKeep smiling,\nand always remember—\nyou are more special than you probably realise. ❤️\n\nForever yours, with all my heart ❤️"
];

function openLetterEnvelope() {
  const env = document.getElementById("envelope");
  env.classList.add("open");
  setTimeout(() => {
    document.getElementById("envelopeView").classList.add("hidden");
    document.getElementById("letterView").classList.remove("hidden");
    startLetterTypewriter();
  }, 900);
}

function startLetterTypewriter() {
  const container = document.getElementById("typewriterTarget");
  container.innerHTML = "";
  let pIdx = 0;

  function typeNextParagraph() {
    if (pIdx >= letterParagraphs.length) return;
    const p = document.createElement("p");
    if (pIdx === letterParagraphs.length - 1) {
      p.className = "letter-sign";
    }
    container.appendChild(p);

    const fullText = letterParagraphs[pIdx];
    let cIdx = 0;

    const interval = setInterval(() => {
      p.textContent += fullText.charAt(cIdx);
      cIdx++;
      if (cIdx >= fullText.length) {
        clearInterval(interval);
        pIdx++;
        setTimeout(typeNextParagraph, 200);
      }
    }, 15);
  }

  typeNextParagraph();
}