(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Body {
  constructor({ element }) {
    this.el = element;
    setTimeout(() => element.classList.add('-has-transitions-enabled'), 100);
  }
}

module.exports = Body;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
const Body = require('./Body');
const MainNav = require('./MainNav');

module.exports = {
  Body,
  MainNav,
};

},{"./Body":1,"./MainNav":2}],4:[function(require,module,exports){
const ComponentLoader = require('./lib/component-loader');

const components = require('./components');

const loader = new ComponentLoader({ components });
loader.loadComponents(document);

},{"./components":3,"./lib/component-loader":5}],5:[function(require,module,exports){
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

},{}]},{},[4])