/**
 * REA Soroban Abacus Interactive Simulator & Speed Math Game Engine
 * Features:
 * - 7-Rod Standard Japanese Soroban (1 upper bead = 5, 4 lower beads = 1)
 * - Authentic Web Audio API bead click sounds
 * - Real-time place value calculation (Units, Tens, Hundreds, Thousands, etc.)
 * - Speed Math practice challenge arcade
 */

class InteractiveAbacus {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.numRods = options.numRods || 7; // Default 7 rods: Millions to Units
    this.audioEnabled = true;
    this.audioCtx = null;

    // State: each rod has upperActive (boolean: true if bead pushed down to beam = 5)
    // and lowerCount (0 to 4: number of lower beads pushed up to beam)
    this.state = Array.from({ length: this.numRods }, () => ({
      upperActive: false,
      lowerCount: 0
    }));

    this.initAudio();
    this.render();
    this.bindEvents();
    this.updateDisplay();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  playClickSound(frequency = 420) {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (err) {
      // Audio fallback silent
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="abacus-frame p-3 sm:p-5 rounded-2xl w-full max-w-2xl mx-auto shadow-2xl">
        <!-- Top Status Bar: Total Value & Bead Reset -->
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-amber-900/40 text-amber-200">
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase tracking-wider font-semibold text-amber-300">Soroban Value:</span>
            <span id="abacus-total-val" class="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white bg-black/40 px-3 py-0.5 rounded-lg border border-amber-500/30">0</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="abacus-sound-toggle" class="px-2.5 py-1 text-xs font-semibold rounded bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/50 flex items-center gap-1 transition">
              <span id="sound-icon">🔊</span> <span class="hidden sm:inline">Sound</span>
            </button>
            <button id="abacus-clear-btn" class="px-3 py-1 text-xs font-bold rounded bg-amber-600 hover:bg-amber-500 text-white shadow transition flex items-center gap-1">
              <span>↺</span> Reset
            </button>
          </div>
        </div>

        <!-- Upper Rod Readout Labels (e.g. 100k, 10k, 1k, 100, 10, 1) -->
        <div class="grid grid-cols-7 gap-1 sm:gap-3 text-center mb-1 text-[10px] sm:text-xs font-bold text-amber-300/80 font-mono">
          <span>100K</span>
          <span>10K</span>
          <span>1K</span>
          <span>100</span>
          <span>10</span>
          <span class="text-amber-100 font-extrabold underline decoration-amber-400">1s</span>
          <span class="text-amber-400">0.1</span>
        </div>

        <!-- Abacus Beads Grid -->
        <div class="relative bg-amber-950/70 p-2 sm:p-4 rounded-xl border border-amber-900 shadow-inner overflow-hidden">
          <!-- Upper Deck (Heaven Beads - Value 5) -->
          <div class="grid grid-cols-7 gap-1 sm:gap-3 h-16 sm:h-20 relative">
            ${this.renderUpperDeck()}
          </div>

          <!-- Reckoning Beam Separator -->
          <div class="abacus-beam w-full my-1 rounded-sm flex items-center justify-around">
            <span class="beam-dot left-[35.7%]"></span>
            <span class="beam-dot left-[78.5%]"></span>
          </div>

          <!-- Lower Deck (Earth Beads - 4 Beads of Value 1) -->
          <div class="grid grid-cols-7 gap-1 sm:gap-3 h-36 sm:h-44 relative pt-1">
            ${this.renderLowerDeck()}
          </div>
        </div>

        <!-- Per Rod Value Indicator Footers -->
        <div class="grid grid-cols-7 gap-1 sm:gap-3 text-center mt-2">
          ${Array.from({ length: this.numRods }).map((_, i) => `
            <div id="rod-val-${i}" class="text-xs sm:text-sm font-mono font-bold py-1 bg-amber-950/90 text-amber-300 rounded border border-amber-800/40">0</div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderUpperDeck() {
    return Array.from({ length: this.numRods }).map((_, rodIdx) => {
      return `
        <div class="relative flex justify-center items-center h-full">
          <!-- Rod Spine -->
          <div class="abacus-rod absolute top-0 bottom-0 w-2 rounded-full"></div>
          <!-- Upper Bead (Value 5) -->
          <div 
            class="abacus-bead upper-bead cursor-pointer" 
            data-rod="${rodIdx}"
            style="top: 2px;"
          >
            <div class="bead-body"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderLowerDeck() {
    return Array.from({ length: this.numRods }).map((_, rodIdx) => {
      return `
        <div class="relative flex justify-center h-full lower-rod-container" data-rod="${rodIdx}">
          <!-- Rod Spine -->
          <div class="abacus-rod absolute top-0 bottom-0 w-2 rounded-full"></div>
          <!-- 4 Lower Beads -->
          ${[0, 1, 2, 3].map(beadIdx => `
            <div 
              class="abacus-bead lower-bead cursor-pointer" 
              data-rod="${rodIdx}" 
              data-index="${beadIdx}"
              style="bottom: ${(3 - beadIdx) * 26 + 4}px;"
            >
              <div class="bead-body"></div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  bindEvents() {
    // Upper Beads Click
    this.container.querySelectorAll('.upper-bead').forEach(bead => {
      bead.addEventListener('click', (e) => {
        const rodIdx = parseInt(bead.getAttribute('data-rod'));
        this.toggleUpperBead(rodIdx);
      });
    });

    // Lower Beads Click
    this.container.querySelectorAll('.lower-bead').forEach(bead => {
      bead.addEventListener('click', (e) => {
        const rodIdx = parseInt(bead.getAttribute('data-rod'));
        const beadIdx = parseInt(bead.getAttribute('data-index'));
        this.handleLowerBeadClick(rodIdx, beadIdx);
      });
    });

    // Reset button
    const clearBtn = this.container.querySelector('#abacus-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.reset();
        this.playClickSound(300);
      });
    }

    // Sound toggle
    const soundToggle = this.container.querySelector('#abacus-sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        const icon = this.container.querySelector('#sound-icon');
        if (icon) icon.textContent = this.audioEnabled ? '🔊' : '🔇';
      });
    }
  }

  toggleUpperBead(rodIdx) {
    const isNowActive = !this.state[rodIdx].upperActive;
    this.state[rodIdx].upperActive = isNowActive;

    const beadEl = this.container.querySelector(`.upper-bead[data-rod="${rodIdx}"]`);
    if (beadEl) {
      // If active, push down closer to beam
      beadEl.style.top = isNowActive ? 'calc(100% - 28px)' : '4px';
    }

    this.playClickSound(isNowActive ? 520 : 380);
    this.updateDisplay();
  }

  handleLowerBeadClick(rodIdx, clickedBeadIdx) {
    const currentActiveCount = this.state[rodIdx].lowerCount;
    // Lower beads are indexed 0 (closest to beam) to 3 (furthest from beam)
    // If clicked bead is currently active, clicking it deactivates it and beads below it
    // If clicked bead is inactive, clicking it activates it and beads above it
    const beadRank = clickedBeadIdx + 1; // 1 to 4

    if (currentActiveCount >= beadRank) {
      // Deactivate down to clickedBeadIdx
      this.state[rodIdx].lowerCount = clickedBeadIdx;
    } else {
      // Activate up to beadRank
      this.state[rodIdx].lowerCount = beadRank;
    }

    this.updateLowerBeadPositions(rodIdx);
    this.playClickSound(440 + this.state[rodIdx].lowerCount * 30);
    this.updateDisplay();
  }

  updateLowerBeadPositions(rodIdx) {
    const activeCount = this.state[rodIdx].lowerCount;
    const beads = this.container.querySelectorAll(`.lower-rod-container[data-rod="${rodIdx}"] .lower-bead`);

    beads.forEach((beadEl, idx) => {
      // idx 0 is top bead (nearest to beam)
      if (idx < activeCount) {
        // Active: pushed UP towards beam
        beadEl.style.bottom = `calc(100% - ${(idx + 1) * 26 + 2}px)`;
      } else {
        // Inactive: rests at the BOTTOM
        const inactiveOffset = (3 - idx) * 26 + 4;
        beadEl.style.bottom = `${inactiveOffset}px`;
      }
    });
  }

  getRodValue(rodIdx) {
    const upper = this.state[rodIdx].upperActive ? 5 : 0;
    const lower = this.state[rodIdx].lowerCount;
    return upper + lower;
  }

  calculateTotal() {
    let total = 0;
    // Rod 0 = 100,000 (10^5)
    // Rod 1 = 10,000  (10^4)
    // Rod 2 = 1,000   (10^3)
    // Rod 3 = 100     (10^2)
    // Rod 4 = 10      (10^1)
    // Rod 5 = 1       (10^0)
    // Rod 6 = 0.1     (10^-1)
    const multipliers = [100000, 10000, 1000, 100, 10, 1, 0.1];

    for (let i = 0; i < this.numRods; i++) {
      total += this.getRodValue(i) * multipliers[i];
    }

    return Math.round(total * 10) / 10;
  }

  updateDisplay() {
    for (let i = 0; i < this.numRods; i++) {
      const rodVal = this.getRodValue(i);
      const valEl = this.container.querySelector(`#rod-val-${i}`);
      if (valEl) {
        valEl.textContent = rodVal;
        valEl.classList.toggle('bg-amber-800', rodVal > 0);
        valEl.classList.toggle('text-white', rodVal > 0);
      }
    }

    const totalEl = this.container.querySelector('#abacus-total-val');
    if (totalEl) {
      const total = this.calculateTotal();
      totalEl.textContent = total.toLocaleString('en-IN', {
        minimumFractionDigits: total % 1 !== 0 ? 1 : 0,
        maximumFractionDigits: 1
      });
    }

    // Trigger custom event if page is listening for game challenges
    const event = new CustomEvent('abacusChange', { detail: { total: this.calculateTotal() } });
    this.container.dispatchEvent(event);
  }

  setRodValue(rodIdx, value) {
    value = Math.max(0, Math.min(9, Math.floor(value)));
    const upper = value >= 5;
    const lower = value % 5;

    this.state[rodIdx].upperActive = upper;
    this.state[rodIdx].lowerCount = lower;

    const upperEl = this.container.querySelector(`.upper-bead[data-rod="${rodIdx}"]`);
    if (upperEl) {
      upperEl.style.top = upper ? 'calc(100% - 28px)' : '4px';
    }

    this.updateLowerBeadPositions(rodIdx);
  }

  setNumber(num) {
    this.reset();
    const str = Math.floor(num).toString().padStart(6, '0');
    // First 6 rods for integers, last rod for decimal 0
    for (let i = 0; i < 6; i++) {
      const digit = parseInt(str[i] || '0');
      this.setRodValue(i, digit);
    }
    this.setRodValue(6, Math.round((num % 1) * 10));
    this.updateDisplay();
    this.playClickSound(600);
  }

  reset() {
    for (let i = 0; i < this.numRods; i++) {
      this.state[i].upperActive = false;
      this.state[i].lowerCount = 0;

      const upperEl = this.container.querySelector(`.upper-bead[data-rod="${i}"]`);
      if (upperEl) upperEl.style.top = '4px';
      this.updateLowerBeadPositions(i);
    }
    this.updateDisplay();
  }
}

// Export / global attachment
window.InteractiveAbacus = InteractiveAbacus;
