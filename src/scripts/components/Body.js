class Body {
  constructor({ element }) {
    this.el = element;
    setTimeout(() => element.classList.add('-has-transitions-enabled'), 100);
  }
}

module.exports = Body;
