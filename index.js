// [x]: Criação do personagem (quadrado)

// [x]: Movimentação do personagem

// [x]: Programar os projéteis

// [ ]: Programar as colisões

// [ ]: Programar o score

// [x]: Programar os inimigos

// [x]: Adicionar um segundo personagem

// [ ]: Programar menu/UI do jogo

// [ ]: Colisão dos players com o canvas

// [ ]: Trocar os sprites

// [ ]: Adicionar músicas

// [ ]: Adicionar efeitos sonoros

let canvas, c, player1, player2, keys1, keys2, projectiles1, projectiles2, enemies, estadoAtual, 
startGameBtn = document.getElementById("startGameBtn"),
menu = document.getElementById("menu");

let estados = {
        jogar: 0,
        jogando: 1,
        perdeu: 2
}

class Player {
    constructor(color, positionX, positionY) {
        this.position = {
            x: positionX,
            y: positionY,
        };

        this.velocity = {
            x: 0,
            y: 0,
        };

        this.width = 75;
        this.height = 80;

        this.sides = {
            isUp: false,
            isDown: false,
            isLeft: false,
            isRight: true,
        };

        const down1 = new Image();
        down1.src = "./Sprites/Baixo1.png";
        this.down1 = down1;

        const right1 = new Image();
        right1.src = "./Sprites/Direita1.png";
        this.right1 = right1;

        const up1 = new Image();
        up1.src = "./Sprites/Cima1.png";
        this.up1 = up1;

        const left1 = new Image();
        left1.src = "./Sprites/Esquerda1.png";
        this.left1 = left1;

        this.color = color;
    }

    draw() {
        if (this.sides.isDown == true) {
            c.drawImage(this.down1, this.position.x, this.position.y, 80, 80);
        } else if (this.sides.isRight == true) {
            c.drawImage(this.right1, this.position.x, this.position.y, 80, 80);
        } else if (this.sides.isUp == true) {
            c.drawImage(this.up1, this.position.x, this.position.y, 80, 80);
        } else if (this.sides.isLeft == true) {
            c.drawImage(this.left1, this.position.x, this.position.y, 80, 80);
        }
    }

    update() {
        this.draw();

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.width = 75;
        this.height = 80;
        const zombie1 = new Image();
        zombie1.src = "./Sprites/Zumbi1.png";
        this.zombie1 = zombie1;
    }

    draw() {
        /* c.fillStyle = this.color;
        c.fillRect(this.x, this.y, 30, 30); */
        c.drawImage(this.zombie1, this.x, this.y, 80, 80)
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        //c.strokeRect(this.x, this.y, this.width, this.height) debug
    }
}

function spawnEnemies() {
    setInterval(() => {
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - 20 : canvas.width + 20;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - 20 : canvas.height + 20;
        }
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        if(estadoAtual == estados.jogando){
            enemies.push(new Enemy(x, y, "red", velocity));
        }
    }, 1500);
}

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(background, 0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();
    projectiles1.forEach((proj, projIndex) => {
        proj.update();
        //removendo dos cantos do canvas
        if (
            proj.x < 0 ||
            proj.x > canvas.width ||
            proj.y < 0 ||
            proj.y > canvas.height
        ) {
            projectiles1.splice(projIndex, 1);
        }
    });
    projectiles2.forEach((proj, projIndex) => {
        proj.update();
        //removendo dos cantos do canvas
        if (
            proj.x < 0 ||
            proj.x > canvas.width ||
            proj.y < 0 ||
            proj.y > canvas.height
        ) {
            projectiles2.splice(projIndex, 1);
        }
    });

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        if (
            enemy.x <= -20 ||
            enemy.x >= canvas.width + 20 ||
            enemy.y <= -20 ||
            enemy.y >= canvas.height + 20
        ) {
            enemies.splice(enemyIndex, 1);
        }
        projectiles1.forEach((projectile, projIndex) => {
            const dist1 = Math.hypot(projectile.x - enemy.x - enemy.width / 2, projectile.y - enemy.y - enemy.height / 2);
            if (dist1 < 30) {
                projectiles1.splice(projIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });

        projectiles2.forEach((projectile, projIndex) => {
            const dist2 = Math.hypot(projectile.x - enemy.x - enemy.width / 2, projectile.y - enemy.y - enemy.height / 2);
            if (dist2 < 30) {
                projectiles2.splice(projIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });

        const dist1 = Math.hypot(enemy.x - player1.position.x, enemy.y - player1.position.y + 10);
        if (dist1 < 60) {
            enemies.splice(enemyIndex, 1);
        }

        const dist2 = Math.hypot(enemy.x - player2.position.x, enemy.y - player2.position.y + 10);
        if (dist2 < 60) {
            enemies.splice(enemyIndex, 1);
        }
    });

    if (keys1.right.pressed && player1.position.x + player1.width <= 800) {
        player1.velocity.x = 5;
    } else if (keys1.left.pressed && player1.position.x >= 0) {
        player1.velocity.x = -5;
    }

    if (keys2.right.pressed && player2.position.x + player2.width <= 800) {
        player2.velocity.x = 5;
    } else if (keys2.left.pressed && player2.position.x >= 0) {
        player2.velocity.x = -5;
    }
    //c.strokeRect(player1.position.x, player1.position.y, player1.width, player1.height); //-> debug do tamanho do player
}

addEventListener("keydown", (ev) => {
    switch (ev.keyCode) {
        case 65:
            console.log("esquerda");
            keys1.left.pressed = true;
            player1.sides.isDown = false;
            player1.sides.isRight = false;
            player1.sides.isUp = false;
            player1.sides.isLeft = true;
            break;
        case 87:
            console.log("cima");
            player1.velocity.y = -5;
            player1.sides.isDown = false;
            player1.sides.isRight = false;
            player1.sides.isUp = true;
            player1.sides.isLeft = false;
            break;
        case 68:
            console.log("direita");
            keys1.right.pressed = true;
            player1.sides.isDown = false;
            player1.sides.isRight = true;
            player1.sides.isUp = false;
            player1.sides.isLeft = false;
            break;
        case 83:
            console.log("baixo");

            player1.velocity.y = 5;
            player1.sides.isDown = true;
            player1.sides.isRight = false;
            player1.sides.isUp = false;
            player1.sides.isLeft = false;
            break;
        case 37:
            console.log("esquerda");
            keys2.left.pressed = true;
            player2.sides.isDown = false;
            player2.sides.isRight = false;
            player2.sides.isUp = false;
            player2.sides.isLeft = true;
            break;
        case 38:
            console.log("cima");
            player2.velocity.y = -5;
            player2.sides.isDown = false;
            player2.sides.isRight = false;
            player2.sides.isUp = true;
            player2.sides.isLeft = false;
            break;
        case 39:
            console.log("direita");
            keys2.right.pressed = true;
            player2.sides.isDown = false;
            player2.sides.isRight = true;
            player2.sides.isUp = false;
            player2.sides.isLeft = false;
            break;
        case 40:
            console.log("baixo");
            player2.velocity.y = 5;
            player2.sides.isDown = true;
            player2.sides.isRight = false;
            player2.sides.isUp = false;
            player2.sides.isLeft = false;
            break;
        default:
            break;
    }
});

addEventListener("keyup", (ev) => {
    switch (ev.keyCode) {
        case 65:
            console.log("esquerda");
            keys1.left.pressed = false;
            player1.velocity.x = 0;
            break;
        case 87:
            console.log("cima");
            player1.velocity.y = 0;
            break;
        case 68:
            console.log("direita");
            keys1.right.pressed = false;
            player1.velocity.x = 0;
            break;
        case 83:
            console.log("baixo");
            player1.velocity.y = 0;
            break;
        case 37:
            console.log("esquerda");
            keys2.left.pressed = false;
            player2.velocity.x = 0;
            break;
        case 38:
            console.log("cima");
            player2.velocity.y = 0;
            break;
        case 39:
            console.log("direita");
            keys2.right.pressed = false;
            player2.velocity.x = 0;
            break;
        case 40:
            console.log("baixo");
            player2.velocity.y = 0;
            break;
        default:
            break;
    }
});

addEventListener("keyup", (ev) => {
    if (player1.sides.isLeft == true && ev.key == " ") {
        projectiles1.push(
            new Projectile(
                player1.position.x + 25,
                player1.position.y + 55,
                10,
                "red",
                {
                    x: -15,
                    y: 0,
                }
            )
        );
    } else if (player1.sides.isRight == true && ev.key == " ") {
        projectiles1.push(
            new Projectile(
                player1.position.x + 50,
                player1.position.y + 50,
                10,
                "red",
                {
                    x: 15,
                    y: 0,
                }
            )
        );
    } else if (player1.sides.isUp == true && ev.key == " ") {
        projectiles1.push(
            new Projectile(
                player1.position.x + 40,
                player1.position.y - 10,
                10,
                "red",
                {
                    x: 0,
                    y: -15,
                }
            )
        );
    } else if (player1.sides.isDown == true && ev.key == " ") {
        projectiles1.push(
            new Projectile(
                player1.position.x + 45,
                player1.position.y + 70,
                10,
                "red",
                {
                    x: 0,
                    y: 15,
                }
            )
        );
    }
    if (player2.sides.isLeft == true && ev.key == "p") {
        projectiles2.push(
            new Projectile(
                player2.position.x + 25,
                player2.position.y + 55,
                10,
                "black",
                {
                    x: -15,
                    y: 0,
                }
            )
        );
    } else if (player2.sides.isRight == true && ev.key == "p") {
        projectiles2.push(
            new Projectile(
                player2.position.x + 50,
                player2.position.y + 50,
                10,
                "black",
                {
                    x: 15,
                    y: 0,
                }
            )
        );
    } else if (player2.sides.isUp == true && ev.key == "p") {
        projectiles2.push(
            new Projectile(
                player2.position.x + 40,
                player2.position.y - 10,
                10,
                "black",
                {
                    x: 0,
                    y: -15,
                }
            )
        );
    } else if (player2.sides.isDown == true && ev.key == "p") {
        projectiles2.push(
            new Projectile(
                player2.position.x + 45,
                player2.position.y + 70,
                10,
                "black",
                {
                    x: 0,
                    y: 15,
                }
            )
        );
    }
});

startGameBtn.addEventListener("click", () => {
    menu.style.display = "none"
    estadoAtual = estados.jogando
})

function main(){
    canvas = document.querySelector("canvas"); // acessando o canvas do html
    c = canvas.getContext("2d"); // pegando o context 2d do canvas
    canvas.width = 800;
    canvas.height = 600;

    player1 = new Player("blue", canvas.width / 2 - 100, canvas.height / 2);

    player2 = new Player("green", canvas.width / 2 + 40, canvas.height / 2);

    keys1 = {
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        },
    };
    
    keys2 = {
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        },
    };
    
    projectiles1 = [];
    projectiles2 = [];
    enemies = [];
    estadoAtual = estados.jogar
    animate();
    spawnEnemies();

    
}

main()
