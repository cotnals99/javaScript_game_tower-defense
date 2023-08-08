//Building
class Building extends Sprite {
    constructor({ position = { x: 0, y: 0 }}) {
      super({
        position,
        imgSrc: 'img/tower.png',
        frames: {max: 19},
        offset: {x: 0, y: -80}
      })
      this.position = position;
      this.width = 64 * 2;
      this.height = 64;
      this.center = {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      };
      this.projectiles = [];
      this.radius = 250;
      this.target;
      // this.elapsedSpawnTime = 0;
    }
    draw() {
      super.draw()
      // c.fillStyle = "blue";
      // c.fillRect(this.position.x, this.position.y, this.width, this.height);
  
      c.beginPath();
      c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = "rgba(0, 0, 255, 0.1)";
      c.fill();
    }
  
    update() {
      this.draw();

      if(this.target || !this.target && this.frames.current !==0 ) super.update()

      if (
        this.target &&
        this.frames.current === 6 &&
        this.frames.elapsed % this.frames.hold === 0
        )
        this.shoot()
    }

    shoot(){
        this.projectiles.push(
          new Projectile({
            position: {
              x: this.center.x - 20,
              y: this.center.y - 110,
            },
            enemy: this.target,
          })
        );
    }


      // if (this.elapsedSpawnTime % 100 === 0 && this.target) {
      //   this.projectiles.push(
      //     new Projectile({
      //       position: {
      //         x: this.center.x,
      //         y: this.center.y,
      //       },
      //       enemy: this.target,
      //     })
      //   );
      // }
      // this.elapsedSpawnTime++;
    }
  