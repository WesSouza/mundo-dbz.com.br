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
