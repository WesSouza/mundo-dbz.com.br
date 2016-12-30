(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Body {
  constructor({ element }) {
    this.el = element;
    setTimeout(() => element.classList.add('-has-transitions-enabled'), 100);
  }
}

module.exports = Body;

},{}],2:[function(require,module,exports){
class Gallery {
  constructor({ element }) {
    this.el = element;

    this.state = {};
    this.previousState = {};
    this.images = [];

    this.$html = document.querySelector('html');
    this.$fullscreen = element.querySelector('[data-ref="Gallery-fullscreen"]');
    this.$fullscreenImage = element.querySelector('[data-ref="Gallery-fullscreen-image"]');
    this.$fullscreenPrevious = element.querySelector('[data-ref="Gallery-fullscreen-previous"]');
    this.$fullscreenNext = element.querySelector('[data-ref="Gallery-fullscreen-next"]');

    element.addEventListener('keydown', (event) => this.handleKeyDown(event));
    this.$fullscreen.addEventListener('click', (event) => this.handleFullscreenClick(event));
    this.$fullscreenPrevious.addEventListener('click', (event) => this.handleFullscreenNavigationClick(event, -1));
    this.$fullscreenNext.addEventListener('click', (event) => this.handleFullscreenNavigationClick(event, 1));

    Array.from(element.querySelectorAll('[data-ref="Gallery-image-open"]')).forEach((element, i) => {
      this.images.push(element.getAttribute('href'));
      element.addEventListener('click', (event) => this.handleImageClick(event, i));
    });
  }

  handleImageClick(event, i) {
    event.preventDefault();

    this.fullscreenOpen(i);
  }

  handleFullscreenClick(event) {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      this.fullscreenClose();
    }
  }

  handleFullscreenNavigationClick(event, direction) {
    event.preventDefault();

    this.fullscreenNavigateBy(direction);
  }

  handleKeyDown(event) {
    if (!this.state.fullscreenOpen) {
      return;
    }

    if (event.keyCode == 27) {
      event.preventDefault();
      this.fullscreenClose();
    }

    if (event.keyCode == 37) {
      event.preventDefault();
      this.fullscreenNavigateBy(-1);
    }

    if (event.keyCode == 39) {
      event.preventDefault();
      this.fullscreenNavigateBy(1);
    }
  }

  fullscreenOpen(index) {
    this.state.fullscreenOpen = true;
    this.state.fullscreenImageIndex = index;
    this.render();
  }

  fullscreenClose() {
    this.state.fullscreenOpen = false;
    this.render();
  }

  fullscreenNavigateBy(direction) {
    let newIndex = this.state.fullscreenImageIndex + direction;
    const maxIndex = this.images.length - 1;
    if (newIndex < 0) {
      newIndex = maxIndex;
    }
    if (newIndex > maxIndex) {
      newIndex = 0;
    }
    this.state.fullscreenImageIndex = newIndex;
    this.render();
  }

  render() {
    if (this.previousState.fullscreenOpen !== this.state.fullscreenOpen) {
      if (this.state.fullscreenOpen) {
        this.$html.classList.add('-cannot-scroll');
        this.$fullscreen.removeAttribute('hidden');
      } else {
        this.$html.classList.remove('-cannot-scroll');
        this.$fullscreen.setAttribute('hidden', '');
      }
      this.previousState.fullscreenOpen = this.state.fullscreenOpen;
    }

    if (this.previousState.fullscreenImageIndex !== this.state.fullscreenImageIndex) {
      this.$fullscreenImage.setAttribute('src', this.images[this.state.fullscreenImageIndex]);
      this.previousState.fullscreenImageIndex = this.state.fullscreenImageIndex;
    }
  }
}

module.exports = Gallery;

},{}],3:[function(require,module,exports){
class KiCalculator {
  constructor({ element }) {
    this.el = element;

    this.state = {};
    this.previousState = {};

    this.$form = element.querySelector('[data-ref="KiCalculator-form"]');
    this.$reset = element.querySelector('[data-ref="KiCalculator-reset"]');
    this.$result = element.querySelector('[data-ref="KiCalculator-result"]');
    this.$resultKi = element.querySelector('[data-ref="KiCalculator-result-ki"]');

    this.$form.addEventListener('submit', (event) => this.handleFormSubmit(event));
    this.$reset.addEventListener('click', (event) => this.handleResetClick(event));
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const age = this.$form.querySelector('[name="age"]').value;
    const weight = this.$form.querySelector('[name="weight"]').value;
    const height = this.$form.querySelector('[name="height"]').value;
    const strenght = this.$form.querySelector('[name="strenght"]').value;
    const fitness = this.$form.querySelector('[name="fitness"]').value;

    this.state.ki = this.calculate({ age, weight, height, strenght, fitness });
    this.render();
  }

  handleResetClick(event) {
    event.preventDefault();

    this.state.ki = undefined;
    this.render();
  }

  calculate({ age, weight, height, strenght, fitness }) {
    let f1 = 1, f2 = 1, f3 = 1, f4 = 1, f5 = 1;

    age = parseInt(age);
    weight = parseInt(weight);
    height = parseInt(height);
    strenght = parseInt(strenght);
    fitness = parseInt(fitness);

    if (age < 12) { f1 = 1.5; }
    else if (age < 16) { f1 = 2; }
    else if (age < 25) { f1 = 3; }
    else { f1 = 1.1; }

    if (weight < 40) { f2 = 0.7; }
    else if (weight < 60) { f2 = 1.1; }
    else if (weight < 80) { f2 = 2; }
    else if (weight < 100) { f2 = 2.5; }
    else if (weight < 140) { f2 = 1.2; }
    else { f2 = 0.3; }

    if (height < 100) { f3 = 0.8; }
    else if (height < 140) { f3 = 1; }
    else if (height < 160) { f3 = 1.5; }
    else if (height < 170) { f3 = 2; }
    else if (height < 190) { f3 = 3; }
    else { f3 = 1.2; }

    if (!strenght) { strenght = 5; }

    if (strenght < 10) { f4 = 0.5; }
    else if (strenght < 20) { f4 = 1; }
    else if (strenght < 40) { f4 = 1.3; }
    else if (strenght < 60) { f4 = 1.7; }
    else if (strenght < 120) { f4 = 2.5; }
    else if (strenght < 240) { f4 = 3.8; }
    else if (strenght < 480) { f4 = 6.2; }
    else { f4 = 8; }

    if (fitness < 1) { f5 = 1; }
    else if (fitness < 2) { f5 = 2; }
    else if (fitness < 4) { f5 = 3; }
    else if (fitness < 6) { f5 = 4; }
    else if (fitness < 8) { f5 = 8; }
    else { f5 = 10; }

    return f1 * f2 * f3 * f4 * f5;
  }

  render() {
    if (this.previousState.ki !== this.state.ki) {
      if (this.state.ki && !isNaN(this.state.ki)) {
        this.$resultKi.innerText = this.state.ki.toFixed(2).replace('.', ',');
        this.$form.setAttribute('hidden', '');
        this.$result.removeAttribute('hidden');
        this.$form.reset();
      } else {
        this.$form.removeAttribute('hidden');
        this.$result.setAttribute('hidden', '');
      }
      this.previousState.ki = this.state.ki;
    }
  }
}

module.exports = KiCalculator;

},{}],4:[function(require,module,exports){
class MainNav {
  constructor({ element }) {
    this.el = element;
    this.isScrollOnTop = true;
    this.isMenuOpen = false;

    this.$html = document.querySelector('html');
    this.$body = document.querySelector('body');
    this.$toggle = element.querySelector('[data-ref="MainNav-toggle"]');
    this.$open = element.querySelector('[data-ref="MainNav-open"]');
    this.$close = element.querySelector('[data-ref="MainNav-close"]');

    this.$toggle.addEventListener('click', (event) => this.handleToggleClick(event));
    window.addEventListener('scroll', () => this.handleScroll());
    setTimeout(() => this.handleScroll(), 100);
  }

  handleToggleClick(event) {
    event.preventDefault();

    if (!this.isMenuOpen) {
      this.$html.classList.add('-has-nav-open');
      this.$open.setAttribute('hidden', '');
      this.$close.removeAttribute('hidden');
      this.isMenuOpen = true;
    } else {
      this.$html.classList.remove('-has-nav-open');
      this.$open.removeAttribute('hidden');
      this.$close.setAttribute('hidden', '');
      this.isMenuOpen = false;
    }
  }

  handleScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (!this.isScrollOnTop && scrollTop <= 0) {
      this.$body.classList.add('-has-scroll-on-top');
      this.isScrollOnTop = true;
    } else if (this.isScrollOnTop && scrollTop > 0) {
      this.$body.classList.remove('-has-scroll-on-top');
      this.isScrollOnTop = false;
    }
  }
}

module.exports = MainNav;

},{}],5:[function(require,module,exports){
const Body = require('./Body');
const Gallery = require('./Gallery');
const KiCalculator = require('./KiCalculator');
const MainNav = require('./MainNav');

module.exports = {
  Body,
  Gallery,
  KiCalculator,
  MainNav,
};

},{"./Body":1,"./Gallery":2,"./KiCalculator":3,"./MainNav":4}],6:[function(require,module,exports){
const ComponentLoader = require('./lib/component-loader');

const components = require('./components');

const loader = new ComponentLoader({ components });
loader.loadComponents(document);

},{"./components":5,"./lib/component-loader":7}],7:[function(require,module,exports){
class ComponentLoader {
  constructor({ components }) {
    this.components = components;
  }

  loadComponent(element, componentName) {
    if (!element || !element.getAttribute) {
      throw new Error('Invalid element');
    }

    if (!componentName || !this.components[componentName]) {
      throw new Error(`Missing component ${componentName}`);
    }

    if (!element._component) {
      const component = new this.components[componentName]({ element });
      element._component = component;
    }

    return element._component;
  }

  loadComponentAsync(element, componentName) {
    setTimeout(() => this.loadComponent(element, componentName));
  }

  loadComponents(element) {
    if (!element || !element.querySelectorAll) {
      throw new Error('Invalid element');
    }

    Array.prototype.forEach.call(element.querySelectorAll('[data-component]'), (element) => {
      const componentName = element.getAttribute('data-component');
      this.loadComponentAsync(element, componentName);
    });
  }
}

module.exports = ComponentLoader;

},{}]},{},[6])