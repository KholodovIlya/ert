class FinishButton extends Button {
  constructor(img) { super(1920 - 240, 1080 - 75, 480, 150); this.img = img; this.render(); }

  render() { renderImage(this.img, this.transform, 3); }
  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x *= value; this.transform.size.y *= value;
    this.render();
  }

  onInterrupt() { this.animate(1.25); }
  onRelease() { this.animate(1.25); this.active(); }
  onPress() { this.animate(0.8); }

  active() { for (let i = 3; i < 9; i++) objects[i].changedUpdate(); }
}

class GameToggle extends Toggle {
  constructor(x, y, max_people, resource, workerWeigth, img1, img2) { super(x, y, 300, 70); this.img1 = img1; this.img2 = img2; this.resource = resource; this.workerWeigth = workerWeigth; this.size = 90; this.max_count = max_people; this.render(); }

  animate(value) { this.clear();
    // this.size += value;
    this.render(); }
  render() {
    renderImage(this.img1, this.transform, 3);

    layers[3].context.beginPath(); layers[3].context.globalAlpha = 0.1; layers[3].context.fillStyle = "blue";
    layers[3].context.rect(this.transform.position.x - this.transform.size.x/2, this.transform.position.y - this.transform.size.y / 4, this.transform.size.x * this.value, this.transform.size.y / 2);
    layers[3].context.fill(); layers[3].context.beginPath(); layers[3].context.globalAlpha = 1;

    renderImage(this.img2, new Vector4(this.transform.position.x - this.transform.size.x / 2 + this.drag_x, this.transform.position.y, this.size, this.size), 3);
  }
  clear() {
    clearTransform(this.transform, 3);
    clearTransform(new Vector4(this.transform.position.x - this.transform.size.x / 2 + this.drag_x, this.transform.position.y, this.size, this.size), 3);
  }

  change() {
    this.clear(); objects[3].setWorkers(objects[3].getWorkers() - float2int(this.value * this.max_count));
    this.changeWorkers(float2int(this.value * this.max_count) * -1);
    super.change(); this.drag_x -= float2int(this.drag_x % (this.transform.size.x / this.max_count));
    this.drag_x = this.value * this.max_count > (objects[3].getCount() - objects[3].getWorkers()) ? (objects[3].getCount() - objects[3].getWorkers()) * (this.transform.size.x / this.max_count) : this.drag_x;
    this.value = this.drag_x / this.transform.size.x; this.drag_x = float2int(this.drag_x); this.changeWorkers(float2int(this.value * this.max_count));
    this.render(); objects[3].setWorkers(objects[3].getWorkers() + float2int(this.value * this.max_count));
  }

  onRelease() { super.onRelease(); this.animate(20); }
  onPress() { super.onPress(); this.animate(-20); }

  changeWorkers(count) { objects[this.resource].setChange(objects[this.resource].getChange() + count * this.workerWeigth); }

  setMaxCount(count) {
    this.clear();
    this.value = float2int(this.value * this.max_count) / count;
    this.max_count = count; this.drag_x = float2int(this.value * this.transform.size.x);
    this.render();
  }
}

class Resource extends GameObject {
  constructor(x, y, start_count, img1, img2) { super(x, y, 280, 125); this.count = start_count; this.img1 = img1; this.img2 = img2; this.change = 0; this.render(this.count); }
  render(value) {
    clearTransform(this.transform, 3);
    renderImage(this.img1, this.transform, 3);
    renderImage(this.img2, new Vector4(this.transform.position.x - 170, this.transform.position.y, 150, 150), 3);
    layers[3].context.fillStyle = "black";
    layers[3].context.fillText(value, this.transform.position.x - 95, this.transform.position.y - 5);
    layers[3].context.fillStyle = this.change >= 0 ? "green" : "DarkRed";
    layers[3].context.fillText((this.change >= 0 ? "+" : "") + this.change, this.transform.position.x - 95, this.transform.position.y + 30);
  }
  setCount(count) { this.count = count; this.render(this.count); }
  getCount() { return this.count; }
  setChange(change) { this.change = change; this.render(this.count); }
  getChange() { return this.change; }
  changedUpdate() { this.setCount(this.count + this.change); this.render(this.count); }
}

class LimitedResource extends Resource {
  constructor(x, y, start_count, img1, img2, max_count, color) { super(x, y, start_count, img1, img2); this.max_count = max_count; this.color = color; this.render(this.count); }
  render(value) {
    clearTransform(this.transform, 3);
    renderImage(this.img1, this.transform, 3);

    layers[3].context.beginPath(); layers[3].context.globalAlpha = 0.5; layers[3].context.fillStyle = this.color;
    layers[3].context.rect(this.transform.position.x - this.transform.size.x/2, this.transform.position.y - (this.transform.size.y * 0.73)/2, 20 + (this.transform.size.x * 0.84) * (value / this.max_count), this.transform.size.y * 0.73);
    layers[3].context.fill(); layers[1].context.beginPath(); layers[3].context.globalAlpha = 1;

    renderImage(this.img2, new Vector4(this.transform.position.x - 170, this.transform.position.y, 150, 150), 3);
    layers[3].context.fillStyle = "black";
    layers[3].context.fillText(value + "/" + this.max_count, this.transform.position.x - 95, this.transform.position.y - 5);
    layers[3].context.fillStyle = this.change >= 0 ? "DarkGreen" : "DarkRed";
    layers[3].context.fillText((this.change >= 0 ? "+" : "") + this.change, this.transform.position.x - 95, this.transform.position.y + 30);
  }
  setCount(count) { this.count = count; if(this.count > this.max_count) this.count = this.max_count; this.render(this.count); }
}

class People extends LimitedResource {
  constructor(img1, img2, color) { super(250, 75, 8, img1, img2, 10, color); this.change = -this.count; this.workers_count = 0; this.render(); }
  render() {
    super.render(this.count - this.workers_count);
    layers[3].context.beginPath(); layers[3].context.globalAlpha = 0.2; layers[3].context.fillStyle = "DarkMagenta";
    layers[3].context.rect(this.transform.position.x - this.transform.size.x/2 + 20 + (this.transform.size.x * 0.84) * ((this.count - this.workers_count) / this.max_count), this.transform.position.y - (this.transform.size.y * 0.73)/2, (this.transform.size.x * 0.84) * (this.workers_count / this.max_count), this.transform.size.y * 0.73);
    layers[3].context.fill(); layers[1].context.beginPath(); layers[3].context.globalAlpha = 1;
    renderImage(this.img2, new Vector4(this.transform.position.x - 170, this.transform.position.y, 150, 150), 1);
  }
  setWorkers(workers_count) { this.workers_count = workers_count; this.render(); }
  getWorkers() { return this.workers_count; }
  changedUpdate() {
    let oldCount = this.count;
    if((this.count - this.workers_count) + this.change < 0) death((this.count - this.workers_count) + this.change);
    this.setCount(this.count + this.change);
    this.setChange(this.getChange() + (oldCount - this.count));
    this.render();
  }
}

class PostProcessing extends GameObject {
  constructor(img) { super(960, 540, 1920, 1080); this.x = 0; this.img = img; }

  update() {
    clearTransform(this.transform, 2); this.x+=0.3; if(this.x > 1920) this.x = 0;
    this.render(0.8);
  }

  render(alpfa) {
    layers[2].context.globalAlpha = alpfa;
    renderImage(this.img, new Vector4(this.transform.position.x - this.transform.size.x + this.x, this.transform.position.y, this.transform.size.x, this.transform.size.y), 2);
    renderImage(this.img, new Vector4(this.transform.position.x + this.x, this.transform.position.y, this.transform.size.x, this.transform.size.y), 2);
  }

  clearCircle(x, y, radius) {
    layers[2].context.save();
    layers[2].context.beginPath();
    layers[2].context.arc(x, y, radius, 0, 2 * Math.PI, false);
    layers[2].context.clip();
    layers[2].context.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
    layers[2].context.restore();
  }
}

class SlidingPanel extends GameObject {
  constructor(slidingObjects, slidingRender, img) {
    super(960, 1080 + 360, 1920, 1080 - 375);
    this.img = img;
    this.sliding = -80;
    this.frames = 1;
    this.slidingObjects = slidingObjects;
    this.slidingRender = slidingRender;
  }

  update() {
    if(this.sliding != 0 & this.frames < 1) {
      for (let i = 0; i < this.slidingRender.length; i++) objects[this.slidingRender[i]].clear();

      for (let i = 0; i < this.slidingObjects.length; i++) objects[this.slidingObjects[i]].transform.position.y -= this.sliding;
      this.frames += abs(this.sliding) / (1080 - 200);

      for (let i = 0; i < this.slidingRender.length; i++) objects[this.slidingRender[i]].render();
    }
  }

  render() { renderImage(this.img, this.transform, 4); }
  clear() { clearTransform(this.transform, 4); }

  slide() { if(this.frames >= 1) { this.sliding = this.sliding * -1; this.frames = 0; } }
}

class SlideButton extends Button {
  constructor(x, y, width, height, id, img) { super(x, y, width, height); this.id = id; this.img = img; this.render(); }

  clear() { clearTransform(this.transform, 4); }
  render() { renderImage(this.img, this.transform, 4); }
  animate(value) {
    this.clear();
    this.transform.size.x *= value; this.transform.size.y *= value;
    this.render();
  }

  onInterrupt() { this.animate(1.25); }
  onRelease() {
    this.animate(1.25);
    objects[this.id].slide();
  }
  onPress() { this.animate(0.8); }
}

class SlidingButton extends Button {
  constructor(use, cost, res, x, y, img1, img2) { super(x, y, 100, 100); this.use = use; this.cost = cost; this.res = res; this.img1 = img1; this.img2 = img2; }

  clear() { clearTransform(this.transform, 4); }
  render() { renderImage(this.img1, this.transform, 4); renderImage(this.img2, this.transform, 4); }
  animate(value) {
    this.transform.size.x *= value; this.transform.size.y *= value;
    this.render();
  }

  onInterrupt() { this.animate(1.25); }
  onRelease() {
    this.animate(1.25);
    if(objects[3 + this.res].getCount() >= this.cost) { this.use(); objects[3 + this.res].setCount(objects[3 + this.res].getCount() - this.cost); }
  }
  onPress() { this.animate(0.8); }
}

function death(count) {
  let i = 4;
  while (count < 0) {
    if(objects[18 + i].drag_x > 0) {
      objects[3].setWorkers(objects[3].getWorkers() - float2int(objects[18 + i].value * objects[18 + i].max_count));
      objects[18 + i].clear(); objects[18 + i].changeWorkers(-1);
      console.log((18 + i) + ": " + (objects[18 + i].value));
      objects[18 + i].value = (float2int(objects[18 + i].value * objects[18 + i].max_count) - 1) / objects[18 + i].max_count;
      objects[18 + i].drag_x = float2int(objects[18 + i].value * objects[18 + i].transform.size.x);
      objects[3].setWorkers(objects[3].getWorkers() + float2int(objects[18 + i].value * objects[18 + i].max_count));
      objects[18 + i].render();
      count++;
    }
    i--; if(i < 1) i = 4;
  }
}
