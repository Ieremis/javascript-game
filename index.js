// [x]: Criação do personagem (quadrado)

// [x]: Movimentação do personagem

// [x]: Programar os projéteis

// [ ]: Programar as colisões

// [ ]: Programar os inimigos

// [ ]: Adicionar um segundo personagem

// [ ]: Colisão do player1 com o canvas

// [ ]: Trocar os sprites

// [ ]: Adicionar músicas

const canvas = document.querySelector("canvas"); // acessando o canvas do html
const c = canvas.getContext("2d"); // pegando o context 2d do canvas

canvas.width = 800;
canvas.height = 600;

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

        this.width = 30;
        this.height = 30;

        this.sides = {
            isUp: false,
            isDown: false,
            isLeft: false,
            isRight: true,
        };

        this.color = color;
        this.score = 0;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

}}


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

const player1 = new Player("blue", canvas.width / 2 - 40, canvas.height / 2);

const player2 = new Player("green", canvas.width / 2 + 40, canvas.height / 2);

const keys1 = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
    up: {
        pressed: false,
    },
    down: {
        pressed: false,
    }
};

const keys2 = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

const projectiles1 = [];
const projectiles2 = [];

let animationId
function animate() {
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();
    c.font = "20px Arial"
    c.fillText("Score do player 1: " + player1.score, 10, 30);
    c.fillText("Score do player 2: " + player2.score, 610, 30);
    projectiles1.forEach((proj) => {
        proj.update();
    });
    projectiles2.forEach((proj) => {
        proj.update();
    });

    projectiles1.forEach((proj) => {
        const dist1 = Math.hypot(proj.x - (player2.position.x + 15), proj.y - (player2.position.y + 15))
        //console.log(dist1)
        if(dist1 - proj.radius < 1){
            //cancelAnimationFrame(animationId)
            player1.score++;
        }
    })

    projectiles2.forEach((proj) => {
        const dist2 = Math.hypot(proj.x - (player1.position.x + 15), proj.y - (player1.position.y + 15))
        //console.log(dist1)
        if(dist2 - proj.radius < 5){
            //cancelAnimationFrame(animationId)
            player2.score++;
        }
        
    })

    //BUG

    if (keys1.right.pressed && player1.position.x + player1.width <= 800) {
        player1.velocity.x = 5;
    } else if (keys1.left.pressed && player1.position.x >= 0) {
        player1.velocity.x = -5;
    } 

    if (keys2.right.pressed && player2.position.x + player2.width <= 800) {
        player2.velocity.x = 5;
    } else if (keys2.left.pressed && player2.position.x >= 0) {
        player2.velocity.x = -5;
    } else {
        player2.velocity.x = 0;
    }
}

// BUG

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
            keys1.up.pressed = false;
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
            break;
        case 38:
            console.log("cima");
            player2.velocity.y = 0;
            break;
        case 39:
            console.log("direita");
            keys2.right.pressed = false;
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
                player1.position.x + 15,
                player1.position.y + 15,
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
                player1.position.x + 15,
                player1.position.y + 15,
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
                player1.position.x + 15,
                player1.position.y + 15,
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
                player1.position.x + 15,
                player1.position.y + 15,
                10,
                "red",
                {
                    x: 0,
                    y: 15,
                }
            )
        );
    }
    if (player2.sides.isLeft == true && ev.key == 'o') {
        projectiles2.push(
            new Projectile(
                player2.position.x + 15,
                player2.position.y + 15,
                10,
                "black",
                {
                    x: -15,
                    y: 0,
                }
            )
        );
    } else if (player2.sides.isRight == true && ev.key == 'o') {
        projectiles2.push(
            new Projectile(
                player2.position.x + 15,
                player2.position.y + 15,
                10,
                "black",
                {
                    x: 15,
                    y: 0,
                }
            )
        );
    } else if (player2.sides.isUp == true && ev.key == 'o') {
        projectiles2.push(
            new Projectile(
                player2.position.x + 15,
                player2.position.y + 15,
                10,
                "black",
                {
                    x: 0,
                    y: -15,
                }
            )
        );
    } else if (player2.sides.isDown == true && ev.key == 'o') {
        projectiles2.push(
            new Projectile(
                player2.position.x + 15,
                player2.position.y + 15,
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

animate();

