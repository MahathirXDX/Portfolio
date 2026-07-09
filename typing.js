/* ==========================================================================
   typing.js
   Infinite looping "type → pause → delete → next word" animation.
   Usage: new TypingEffect(el, ["Word One", "Word Two"]).start();
   ========================================================================== */

class TypingEffect {
  /**
   * @param {HTMLElement} el        Element whose textContent gets typed into
   * @param {string[]} words        List of words/phrases to cycle through
   * @param {Object} [opts]
   * @param {number} [opts.typeSpeed=90]     ms per character while typing
   * @param {number} [opts.deleteSpeed=45]   ms per character while deleting
   * @param {number} [opts.pauseAfterType=1400]  ms to hold once fully typed
   * @param {number} [opts.pauseAfterDelete=300] ms to hold once fully deleted
   */
  constructor(el, words, opts = {}) {
    this.el = el;
    this.words = words && words.length ? words : ['Developer'];
    this.typeSpeed = opts.typeSpeed ?? 90;
    this.deleteSpeed = opts.deleteSpeed ?? 45;
    this.pauseAfterType = opts.pauseAfterType ?? 1400;
    this.pauseAfterDelete = opts.pauseAfterDelete ?? 300;

    this.wordIndex = 0;
    this.charIndex = 0;
    this.deleting = false;
    this.timer = null;

    // Respect users who prefer reduced motion: just show the first word.
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  start() {
    if (this.reducedMotion) {
      this.el.textContent = this.words[0];
      return;
    }
    this._tick();
  }

  stop() {
    clearTimeout(this.timer);
  }

  _tick() {
    const currentWord = this.words[this.wordIndex];

    if (!this.deleting) {
      this.charIndex++;
      this.el.textContent = currentWord.slice(0, this.charIndex);

      if (this.charIndex === currentWord.length) {
        this.deleting = true;
        this.timer = setTimeout(() => this._tick(), this.pauseAfterType);
        return;
      }
      this.timer = setTimeout(() => this._tick(), this.typeSpeed);
    } else {
      this.charIndex--;
      this.el.textContent = currentWord.slice(0, this.charIndex);

      if (this.charIndex === 0) {
        this.deleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        this.timer = setTimeout(() => this._tick(), this.pauseAfterDelete);
        return;
      }
      this.timer = setTimeout(() => this._tick(), this.deleteSpeed);
    }
  }
}
