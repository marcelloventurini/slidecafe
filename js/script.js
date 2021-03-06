class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
    this.activeClass = "active";
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .5s" : "";
  }

  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.wrapper.addEventListener("mousemove", this.onMove);
    this.transition(false);
  }

  updatePosition(clientX) {
    this.dist.movement = this.dist.startX - clientX;
    return this.dist.finalPosition - this.dist.movement;
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  onEnd() {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  // slides config

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element,
      };
    });
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass)
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    return this;
  }
}

const slide = new Slide(".slide", ".slide-wrapper");
slide.init();

console.log(slide);

slide.changeSlide(0);
slide.activeNextSlide();

// tabela

class Table {
  constructor() {
    this.arrayStore = [];
  }

  submit() {
    let stores = this.getData();
    if (this.validate(stores)) {
      this.add(stores);
    };

    this.list();
    this.clear();
  }

  list() {
    let tbody = document.getElementById("tbody");
    tbody.innerText = "";

    for(let i = 0; i < this.arrayStore.length; i++) {
      let tr = tbody.insertRow();

      let tdStore = tr.insertCell();
      let tdCity = tr.insertCell();

      tdStore.innerText = this.arrayStore[i].storeName;
      tdCity.innerText = this.arrayStore[i].storeCity;
    }
  }

  add(stores) {
    this.arrayStore.push(stores);
  }

  getData() {
    let store = {};
    store.storeName = document.getElementById("storename").value;
    store.storeCity = document.getElementById("city").value;
    return store;
  }

  validate(stores) {
    let msg = "";

    if (stores.storeName === "") {
      msg += "C'mon, let me know the name of the store! \n";
    }

    if (stores.storeCity === "") {
      msg += "Tell me the city, please!";
    }

    if (msg !== "") {
      alert(msg);
      return false;
    }
    return true;
  }

  clear() {
    document.getElementById("storename").value = "";
    document.getElementById("city").value = "";
  }
}

const table = new Table();
