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



const placementTilesData2D = []

for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20))
}
// console.log(placementTilesData2D)

const placementTiles = []

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 14) {
      // add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64
          }
        })
      )
    }
  })
})

// console.log(placementTiles)


// let x = 200

// Fixed Enemy spawn
// const enemy = new Enemy({
//     position: {
//         x: waypoints[0].x,
//         y: waypoints[0].y
//     },
//     width: 100,
//     height: 100
// })


// Multiple enemies

const enemies = []
for ( let i =1; i<10; i++ ){
    const xOffset = i * 150
    enemies.push(new Enemy({
        position: {
            x: waypoints[0].x - xOffset,
            y: waypoints[0].y
        },
        width: 100,
        height: 100
    }))
}


//Select location for buildings and Spawn
const buildings = []
let activeTile = undefined

function animate(){
    window.requestAnimationFrame(animate)
    c.drawImage(image, 0, 0)

    enemies.forEach(enemy => enemy.update())


    placementTiles.forEach(tile => tile.update(mouse))

    buildings.forEach(building => building.draw())

    // c.fillStyle='red'
    // c.fillRect(x, 400, 100, 100)
    // x++
    // console.log('go')

    
}

// animate()

const mouse = {
    x: undefined,
    y: undefined
}


canvas.addEventListener('click', (event)=>{
    console.log(buildings)

    if(activeTile && !activeTile.isOccupied){
        buildings.push(new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        }))
        activeTile.isOccupied = true
    }
})


window.addEventListener('mousemove', (event)=>{
    mouse.x = event.clientX,
    mouse.y = event.clientY
    // console.log(mouse.x)

    for( let i = 0; i < placementTiles.length; i++ ){
        const tile = placementTiles[i]
        if(
            mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y &&
            mouse.y < tile.position.y + tile.size
        ){
            activeTile = tile
            break
        }
    }
})