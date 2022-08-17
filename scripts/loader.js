class Loader extends GameObject {
  constructor(images_count) { super(0, 0, 0, 0); this.images = []; this.images_count = images_count; this.load_progress = 0; this.load(); }

  load() {
    for (let i = 0; i < this.images_count; i++) {
      this.images.push(new Image()); this.images[i].src = "resources/images/"+i+".png";
      this.images[i].onload = () => this.setLoadProgress(this.load_progress+1);
    }
  }

  menu() {}

  game() {
    for (let i = 0; i < 6; i++) layers.push(new Layer()); layers[3].context.font = "bold 37px Arial";

    renderImage(this.images[10], new Vector4(960, 540, 1920, 1080), 0);

    objects.push(new FinishButton(this.images[0]));

    objects.push(new People(this.images[3], this.images[4], "DarkBlue"));
    objects.push(new Resource(630, 75, 0, this.images[3], this.images[5]));
    objects.push(new LimitedResource(1015, 75, 0, this.images[3], this.images[6], 5, "Aquamarine"));
    objects.push(new LimitedResource(1400, 75, 0, this.images[3], this.images[7], 0, "Red"));
    objects.push(new Resource(1785, 75, 0, this.images[3], this.images[8]));
    objects.push(new LimitedResource(250, 225, 75, this.images[3], this.images[9], 100, "DeepPink"));

    let slidingRender = [9, 10, 11, 12, 13, 14]

    objects.push(new SlidingPanel([9, 10], slidingRender, this.images[12]));
    objects.push(new SlideButton(240, 1005, 480, 150, 9, this.images[0]));
    objects.push(new SlidingPanel([11, 12], slidingRender, this.images[12]));
    objects.push(new SlideButton(720, 1005, 480, 150, 11, this.images[0]));
    objects.push(new SlidingPanel([13, 14], slidingRender, this.images[12]));
    objects.push(new SlideButton(1200, 1005, 480, 150, 13, this.images[0]));

    objects.push(new PostProcessing(this.images[11]));

    objects.push(new GameToggle(1005, 700, 6, 3, 2, this.images[1], this.images[2])); // 16
    objects.push(new GameToggle(670, 890, 0, 4, 1, this.images[1], this.images[2]));  // 17
    objects.push(new GameToggle(1690, 480, 1, 5, 1, this.images[1], this.images[2])); // 18
    objects.push(new GameToggle(1400, 890, 0, 6, 1, this.images[1], this.images[2])); // 19
    objects.push(new GameToggle(200, 650, 5, 7, 1, this.images[1], this.images[2]));  // 20
  }

  setLoadProgress(load_progress) {
    this.load_progress = load_progress;
    console.log("load: "+float2int(this.load_progress/this.images_count*100)+"%");
    if(load_progress == this.images_count) this.game();
  }
}
objects.push(new Loader(15));
