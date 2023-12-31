const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2D = [];

for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20));
}
// console.log(placementTilesData2D)

const placementTiles = [];

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 14) {
      // add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64,
          },
        })
      );
    }
  });
});

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

const image = new Image();

image.onload = () => {
  animate();
};
image.src = "../img/gameMap.png";

// Multiple enemies

const enemies = [];

function spawnEnemies(spawnCount){
  for (let i = 1; i < spawnCount + 1; i++) {
    const xOffset = i * 150;
    enemies.push(
      new Enemy({
        position: {
          x: waypoints[0].x - xOffset,
          y: waypoints[0].y,
        },
        width: 100,
        height: 100,
      })
    );
  }
}



//Select location for buildings and Spawn
const buildings = [];
let activeTile = undefined;
let enemyCount = 3
let hearts = 10
let coins = 100
const explosions = []

spawnEnemies(enemyCount)


function animate() {
  const animationId = window.requestAnimationFrame(animate);
  c.drawImage(image, 0, 0);

  for (let i = enemies.length - 1 ; i >= 0; i--){
    const enemy = enemies[i]
    enemy.update()

    if (enemy.position.x > canvas.width) {
      // console.log('Decrease hearts')
      hearts -= 1
      // console.log(hearts)
      document.querySelector('#hearts').innerHTML = hearts
      enemies.splice(i, 1)
      // console.log('Enemies survived')

      if (hearts === 0){
        // console.log('Game Over')
        document.querySelector('#gameOver').style.display = 'flex'
        window.cancelAnimationFrame(animationId)
      }
    }
  }

  for (let i = explosions.length - 1 ; i >= 0; i--){
    const explosion = explosions[i]
    explosion.draw()
    explosion.update()

    if (explosion.frames.current >= explosion.frames.max - 1) {
      explosions.splice(i, 1)
    }

    // console.log(explosions)
  }

//Enemy re-spawning
  if(enemies.length === 0) {
    // console.log(enemyCount)
    enemyCount += 3
    spawnEnemies(enemyCount)
  }


  
  // enemies.forEach((enemy) => enemy.update());

  placementTiles.forEach((tile) => tile.update(mouse));

  // Using forEach loop
  buildings.forEach((building) => {
    //   building.draw()
    //   building.projectiles.forEach((projectile, i) => {
    //     projectile.update()

    //     const xDifference = projectile.enemy.center.x - projectile.position.x
    //     const yDifference = projectile.enemy.center.y - projectile.position.y
    //     const distance = Math.hypot(xDifference, yDifference)
    //     if(distance < projectile.enemy.radius + projectile.radius){
    //       building.projectiles.splice(i, 1)
    //     }
    //   });
    // });

    // Using For loop
    // building.draw();
    building.update()

    building.target = null
    const validEnemies = enemies.filter(enemy => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);
      return distance < enemy.radius + building.radius
    })
    building.target = validEnemies[0]
    // console.log(validEnemies)


    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];
      projectile.update();

      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);


      //This is when a projectile hits an enemy
      if (distance < projectile.enemy.radius + projectile.radius) {
        projectile.enemy.health -= 20
        // console.log(projectile.enemy.health)
        if(projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy
          })

          //If multiple projectiles shoot the enemy, enemy might be dead before some projectiles hit the enemy
          // In this case, enemy index will show negative 1
          if (enemyIndex > -1) {
            coins += 25
            document.querySelector('#coins').innerHTML = coins
            enemies.splice(enemyIndex, 1)
          }
        }

        explosions.push( new Sprite({
          position: {x: projectile.position.x, y: projectile.position.y},
          imgSrc: './img/explosion.png',
          frames: {max: 4},
          offset: {x:0, y:0}
        }))
        building.projectiles.splice(i, 1);
      }
    }

    // c.fillStyle='red'
    // c.fillRect(x, 400, 100, 100)
    // x++
    // console.log('go')
  });
}

// animate()

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", (event) => {
  // console.log(buildings);

  if (activeTile && !activeTile.isOccupied && coins - 30 >= 0) {
    coins -= 30
    document.querySelector('#coins').innerHTML = coins
    buildings.push(
      new Building({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y,
        },
      })
    );
    activeTile.isOccupied = true;
    buildings.sort((a, b)=>{
      return a.position.y - b.position.y
    })
  }
});

window.addEventListener("mousemove", (event) => {
  (mouse.x = event.clientX), (mouse.y = event.clientY);
  // console.log(mouse.x)

  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
});
