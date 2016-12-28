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
