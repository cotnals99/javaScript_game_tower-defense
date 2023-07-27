const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()

image.onload = () => {
    animate()
}
image.src = '../img/gameMap.png'

class Enemy {
    constructor({position, width, height}){
        this.position = {
            x: position.x,
            y: position.y
        },
        this.width = width,
        this.height = height,
        this.waypointIndex = 0,
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()

        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angle = Math.atan2(yDistance, xDistance)
        // console.log(this.position.x)

        this.position.x += Math.cos(angle)
        this.position.y += Math.sin(angle)
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }


        if (Math.round(this.center.x) === Math.round(waypoint.x) && 
            Math.round(this.center.y) === Math.round(waypoint.y) && 
            this.waypointIndex < waypoints.length
            ){
            this.waypointIndex++
        }


    }
}

// let x = 200

const enemy = new Enemy({
    position: {
        x: waypoints[0].x,
        y: waypoints[0].y
    },
    width: 100,
    height: 100
})

function animate(){
    window.requestAnimationFrame(animate)
    c.drawImage(image, 0, 0)

    enemy.update()

    // c.fillStyle='red'
    // c.fillRect(x, 400, 100, 100)
    // x++
    // console.log('go')
}

animate()