//Enemy
class Enemy extends Sprite {
    constructor({ position = {x: 0, y:0}, width, height }) {
      super({position, imgSrc: 'img/orc.png', frames: {max:7}})
      this.position = {
        x: position.x,
        y: position.y,
      }
      this.width = width
      this.height = height
      this.waypointIndex = 0
      this.center = {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      }
      this.radius = 50
      this.health = 100
      this.velocity = {
        x: 0,
        y: 0
      }
    }
  
    draw() {
      super.draw()
      // c.fillStyle = "red";
      // c.fillRect(this.position.x, this.position.y, this.width, this.height);
      // c.beginPath();
      // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
      // c.fill()
  
  
      //healthBar
      c.fillStyle = 'red'
      c.fillRect(this.position.x, this.position.y - 15, this.width, 10  )
  
      c.fillStyle = 'green'
      c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / 100, 10  )
    }
  
    update() {
      this.draw();
      super.update()
  
      const waypoint = waypoints[this.waypointIndex];
      const yDistance = waypoint.y - this.center.y;
      const xDistance = waypoint.x - this.center.x;
      const angle = Math.atan2(yDistance, xDistance);
      // console.log(this.position.x)
  
      this.position.x += Math.cos(angle);
      this.position.y += Math.sin(angle);
  
      const speed = 4
  
      this.velocity.x = Math.cos(angle) * speed
      this.velocity.y = Math.sin(angle) * speed
  
      this.position.x += this.velocity.x 
      this.position.y += this.velocity.y
  
  
      this.center = {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      };
  
      //Move to next waypoint - old
      // if (
      //   Math.round(this.center.x) === Math.round(waypoint.x) &&
      //   Math.round(this.center.y) === Math.round(waypoint.y) &&
      //   this.waypointIndex < waypoints.length
      // ) {
      //   this.waypointIndex++;
      // }
  
      //Move to next waypoint
      if (
        Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
        Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
        this.waypointIndex < waypoints.length
      ) {
        this.waypointIndex++;
      }
    }
  }