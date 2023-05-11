let canvas, c, player1, player2, keys1, keys2, projectiles1, projectiles2, background, enemies, estadoAtual, 
startGameBtn = document.getElementById("startGameBtn"),
menu = document.getElementById("menu"),
gameOver = document.getElementById("gameOverMenu"),
tutorial = document.getElementById("tutorial"),
credits = document.getElementById("credits"),
backToMenuBtn = document.getElementById("backToMenuBtn"),
backToMenuBtn2 = document.getElementById("backToMenuBtn2"),
backToMenuBtn3 = document.getElementById("backToMenuBtn3"),
tutoBtn = document.getElementById("tutoBtn"),
musicBtn = document.getElementById("musicBtn"),
creditsBtn = document.getElementById("creditsBtn"),
nextSlide1 = document.getElementById("nextSlide1"),
nextSlide2 = document.getElementById("nextSlide2"),
nextSlide3 = document.getElementById("nextSlide3"),
resetCount = 0,
scorePointsHtml1 = document.getElementById("scorePoints1"),
scorePointsHtml2 = document.getElementById("scorePoints2"),
vidas = 4, hearts, heartPos = [20, 90, 160, 230], click, 
gun1 = new Audio('./Audio/sfx_weapon_shotgun3.mp3'), 
gun2 = new Audio('./Audio/sfx_weapon_shotgun1.mp3'),
damage = new Audio('./Audio/damage.mp3'),
zombie1FX= new Audio('./Audio/zombie-11.mp3'),
zombie2FX = new Audio('./Audio/zombie-6.mp3'),
menuMusic,
recordP1, recordP2,
record1Html = document.getElementById('record1Html'),
record2Html = document.getElementById('record2Html'),
musicPlaying = true;

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
            isDown: true,
            isLeft: false,
            isRight: false,
        };

        const down1 = new Image();
        down1.src = "./Sprites/Baixo1.png";
        const down2 = new Image();
        down2.src = "./Sprites/Baixo2.png";
        this.downSprites = [down1, down2]
        //this.down1 = down1;

        const right1 = new Image();
        right1.src = "./Sprites/Direita1.png";
        const right2 = new Image();
        right2.src = "./Sprites/Direita2.png";
        this.rightSprites = [right1, right2]
        //this.right1 = right1;

        const up1 = new Image();
        up1.src = "./Sprites/Cima1.png";
        const up2 = new Image();
        up2.src = "./Sprites/Cima2.png";
        this.upSprites = [up1, up2]
        //this.up1 = up1;

        const left1 = new Image();
        left1.src = "./Sprites/Esquerda1.png";
        const left2 = new Image();
        left2.src = "./Sprites/Esquerda2.png";
        this.leftSprites = [left1, left2]
        //this.left1 = left1;

        this.color = color;
        this.score = 0;
        this.countSprite = 0
    }

    draw() {
        if (this.sides.isDown == true) {
            
            if(this.countSprite < 25){
                c.drawImage(this.downSprites[0], this.position.x, this.position.y, 80, 80);
                this.countSprite++
            } else if(this.countSprite >= 25 || this.countSprite < 50){
                c.drawImage(this.downSprites[1], this.position.x, this.position.y, 80, 80);
                this.countSprite++;
                if(this.countSprite === 50){
                    this.countSprite = 0;
                }
            }
            //c.drawImage(this.down1, this.position.x, this.position.y, 80, 80);
        } else if (this.sides.isRight == true) {
            if(this.countSprite < 25){
                c.drawImage(this.rightSprites[0], this.position.x, this.position.y, 80, 80);
                this.countSprite++
            } else if(this.countSprite >= 25 || this.countSprite < 50){
                c.drawImage(this.rightSprites[1], this.position.x, this.position.y, 80, 80);
                this.countSprite++;
                if(this.countSprite === 50){
                    this.countSprite = 0;
                }
            }
        } else if (this.sides.isUp == true) {
            if(this.countSprite < 25){
                c.drawImage(this.upSprites[0], this.position.x, this.position.y, 80, 80);
                this.countSprite++
            } else if(this.countSprite >= 25 || this.countSprite < 50){
                c.drawImage(this.upSprites[1], this.position.x, this.position.y, 80, 80);
                this.countSprite++;
                if(this.countSprite === 50){
                    this.countSprite = 0;
                }
            }
        } else if (this.sides.isLeft == true) {
            if(this.countSprite < 25){
                c.drawImage(this.leftSprites[0], this.position.x, this.position.y, 80, 80);
                this.countSprite++
            } else if(this.countSprite >= 25 || this.countSprite < 50){
                c.drawImage(this.leftSprites[1], this.position.x, this.position.y, 80, 80);
                this.countSprite++;
                if(this.countSprite === 50){
                    this.countSprite = 0;
                }
            }
        }
    }

    update() {
        if(estadoAtual == estados.jogando){
            this.draw();
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity, projSprite) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.projSprite = projSprite
    }

    draw() {
        c.drawImage(this.projSprite, this.x, this.y, 20, 20);
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
        const zombie2 = new Image();
        zombie2.src = "./Sprites/Zumbi2.png";
        this.zombieSprites = [zombie1, zombie2];
        this.countSprite = 0
    }

    draw() {
        if(this.countSprite < 50){
            c.drawImage(this.zombieSprites[0], this.x, this.y, 80, 80);
            this.countSprite++
        } else if(this.countSprite >= 50 || this.countSprite < 100){
            c.drawImage(this.zombieSprites[1], this.x, this.y, 80, 80);
            this.countSprite++;
            if(this.countSprite === 100){
                this.countSprite = 0;
            }
        }
        //c.drawImage(this.zombie1, this.x, this.y, 80, 80)
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
            if(estadoAtual == estados.jogando){
            let x;
            let y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - 20 : canvas.width + 20;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - 40 : canvas.height + 40;
            }
            const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle),
            };
                enemies.push(new Enemy(x, y, "red", velocity));
            }
        }, 1200);
    }

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(background, 0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();
    c.fillStyle = "#ffffff"
    c.globalAlpha = 0.6;
    c.fillRect(5, 2, 235, 40)
    c.fillStyle = "#ffffff"
    c.globalAlpha = 0.6;
    c.fillRect(555, 2, 235, 40)
    c.globalAlpha = 1.0;
    c.fillStyle = "#c53fab"
    c.fillText("SCORE PLAYER 1: " + player1.score, 10, 30);
    c.fillText("SCORE PLAYER 2: " + player2.score, 560, 30);

    heartPos.forEach((x) => {
        c.drawImage(hearts, x, 520, 60, 60)
    })

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
            enemy.y <= -50 ||
            enemy.y >= canvas.height + 50
        ) {
            enemies.splice(enemyIndex, 1);
        }
        projectiles1.forEach((projectile, projIndex) => {
            const dist1 = Math.hypot(projectile.x - enemy.x - enemy.width / 2, projectile.y - enemy.y - enemy.height / 2);
            if (dist1 < 30) {
                zombie1FX.load()
                zombie1FX.volume = 0.2
                zombie1FX.play()
                projectiles1.splice(projIndex, 1);
                enemies.splice(enemyIndex, 1);
                player1.score += 10
            }
        });

        projectiles2.forEach((projectile, projIndex) => {
            const dist2 = Math.hypot(projectile.x - enemy.x - enemy.width / 2, projectile.y - enemy.y - enemy.height / 2);
            if (dist2 < 30) {
                zombie2FX.load()
                zombie2FX.volume = 0.2
                zombie2FX.play()
                projectiles2.splice(projIndex, 1);
                enemies.splice(enemyIndex, 1);
                player2.score += 10
            }
        });

        const dist1 = Math.hypot(enemy.x - player1.position.x, enemy.y - player1.position.y + 10);
        if (dist1 < 60) {
            enemies.splice(enemyIndex, 1);
            damage.load()
            damage.volume = 0.3
            damage.play()
            vidas--;
            heartPos.pop();
            if(vidas == 0){
                estadoAtual = estados.perdeu;
                enemies.splice(enemyIndex);
                gameOver.style.display = "flex"
                vidas = 4;
                heartPos = [20, 90, 160, 230]
            }
        }

        const dist2 = Math.hypot(enemy.x - player2.position.x, enemy.y - player2.position.y + 10);
        if (dist2 < 60) {
            enemies.splice(enemyIndex, 1);
            damage.load()
            damage.volume = 0.3
            damage.play()
            vidas--;
            heartPos.pop();
            if(vidas == 0){
                estadoAtual = estados.perdeu;
                enemies.splice(enemyIndex);
                gameOver.style.display = "flex"
                vidas = 4;
                heartPos = [20, 90, 160, 230]
            }
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
    if(estadoAtual == estados.perdeu){
        scorePointsHtml1.innerHTML = player1.score;
        if (player1.score > recordP1) {// calculo do score
            localStorage.setItem("recordP1", player1.score);
            recordP1 = player1.score;
        }
        record1Html.innerHTML = recordP1;
        scorePointsHtml2.innerHTML = player2.score;
        if (player2.score > recordP2) {// calculo do score
            localStorage.setItem("recordP2", player2.score);
            recordP2 = player2.score;
        }
        record2Html.innerHTML = recordP2;
    }
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
        gun1.load();
        gun1.volume = 0.1;
        gun1.play();
        projectiles1.push(
            new Projectile(
                player1.position.x + 25,
                player1.position.y + 55,
                10,
                "red",
                {
                    x: -15,
                    y: 0,
                },
                proj1
            )
        );
    } else if (player1.sides.isRight == true && ev.key == " ") {
        gun1.load();
        gun1.volume = 0.1;
        gun1.play();
        projectiles1.push(
            new Projectile(
                player1.position.x + 50,
                player1.position.y + 50,
                10,
                "red",
                {
                    x: 15,
                    y: 0,
                },
                proj1
            )
        );
    } else if (player1.sides.isUp == true && ev.key == " ") {
        gun1.load();
        gun1.volume = 0.1;
        gun1.play();
        projectiles1.push(
            new Projectile(
                player1.position.x + 40,
                player1.position.y - 10,
                10,
                "red",
                {
                    x: 0,
                    y: -15,
                },
                proj1
            )
        );
    } else if (player1.sides.isDown == true && ev.key == " ") {
        gun1.load();
        gun1.volume = 0.1;
        gun1.play();
        projectiles1.push(
            new Projectile(
                player1.position.x + 45,
                player1.position.y + 70,
                10,
                "red",
                {
                    x: 0,
                    y: 15,
                },
                proj1
            )
        );
    }
    if (player2.sides.isLeft == true && ev.key == "p") {
        gun2.load();
        gun2.volume = 0.1;
        gun2.play();
        projectiles2.push(
            new Projectile(
                player2.position.x + 25,
                player2.position.y + 55,
                10,
                "black",
                {
                    x: -15,
                    y: 0,
                },
                proj2
            )
        );
    } else if (player2.sides.isRight == true && ev.key == "p") {
        gun2.load();
        gun2.volume = 0.1;
        gun2.play();
        projectiles2.push(
            new Projectile(
                player2.position.x + 50,
                player2.position.y + 50,
                10,
                "black",
                {
                    x: 15,
                    y: 0,
                },
                proj2
            )
        );
    } else if (player2.sides.isUp == true && ev.key == "p") {
        gun2.load();
        gun2.volume = 0.1;
        gun2.play();
        projectiles2.push(
            new Projectile(
                player2.position.x + 40,
                player2.position.y - 10,
                10,
                "black",
                {
                    x: 0,
                    y: -15,
                },
                proj2
            )
        );
    } else if (player2.sides.isDown == true && ev.key == "p") {
        gun2.load();
        gun2.volume = 0.1;
        gun2.play();
        projectiles2.push(
            new Projectile(
                player2.position.x + 45,
                player2.position.y + 70,
                10,
                "black",
                {
                    x: 0,
                    y: 15,
                },
                proj2
            )
        );
    }
});

startGameBtn.addEventListener("click", () => {
    click.load();
    click.play();
    menuMusic.pause();
    menu.style.display = "none"
    estadoAtual = estados.jogando
    player1.position.x = canvas.width / 2 - 100;
    player1.position.y = canvas.height / 2;
    player2.position.x = canvas.width / 2 + 40;
    player2.position.y = canvas.height / 2;
    player1.score = 0;
    player2.score = 0;
    if(resetCount < 1){
        spawnEnemies()
    }
})

backToMenuBtn.addEventListener("click", () => {
    click.load();
    click.play();
    menuMusic.load();
    menuMusic.play();
    gameOver.style.display = "none"
    credits.style.display = "none"
    menu.style.display = "flex"
    estadoAtual = estados.jogar
    resetCount = 1;
})

backToMenuBtn2.addEventListener("click", () => {
    click.load();
    click.play();
    credits.style.display = "none"
    menu.style.display = "flex"
    estadoAtual = estados.jogar
})

musicBtn.addEventListener("click", () => {
    click.load();
    click.play();
    if(musicPlaying == true){
        musicPlaying = false;
        menuMusic.pause();
    } else {
        musicPlaying = true;
        menuMusic.load();
        menuMusic.play();
    }
})

backToMenuBtn3.addEventListener("click", () => {
    click.load();
    click.play();
    tutorial.style.display = "none"
    menu.style.display = "flex"
    estadoAtual = estados.jogar
})

tutoBtn.addEventListener("click", () => {
    click.load();
    click.play();
    gameOver.style.display = "none"
    menu.style.display = "none"
    tutorial.style.display = "flex"
    nextSlide1.style.display = "block"
    nextSlide2.style.display = "none"
    tutorial.style.backgroundImage = "url('./Sprites/Slide1.png')"
})

creditsBtn.addEventListener("click", () => {
    click.load();
    click.play();
    gameOver.style.display = "none"
    menu.style.display = "none"
    tutorial.style.display = "none"
    credits.style.display = "flex"
})

nextSlide1.addEventListener("click", () => {
    click.load();
    click.play();
    tutorial.style.backgroundImage = "url('./Sprites/Slide2.png')"
    nextSlide2.style.display = "block"
    nextSlide1.style.display = "none"
})

nextSlide2.addEventListener("click", () => {
    click.load();
    click.play();
    tutorial.style.backgroundImage = "url('./Sprites/Slide3.png')"
    nextSlide2.style.display = "none"
    nextSlide1.style.display = "none"
})

function main(){
    menuMusic = new Audio('./Audio/menuMusic.mp3')
    menuMusic.load();
    menuMusic.play();
    menuMusic.loop = true;
    canvas = document.querySelector("canvas"); // acessando o canvas do html
    c = canvas.getContext("2d"); // pegando o context 2d do canvas
    canvas.width = 800;
    canvas.height = 600;
    c.font = "20px Sigmar";
    background = new Image();
    background.src = "./Sprites/background.jpeg"

    click = new Audio('./Audio/click3.mp3')
    

    hearts = new Image();
    hearts.src = "./Sprites/heart.png"

    player1 = new Player("blue", canvas.width / 2 - 100, canvas.height / 2);

    player2 = new Player("green", canvas.width / 2 + 40, canvas.height / 2);
    recordP1 = localStorage.getItem("recordP1")
    if (recordP1 == null)
				recordP1 = 0;

    recordP2 = localStorage.getItem("recordP2")
    if (recordP2 == null)
                recordP2 = 0;
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
}
    let proj1 = new Image();
    proj1.src = "./Sprites/TIROAZUL.png";
    let proj2 = new Image();
    proj2.src = "./Sprites/TIROVERMELHO.png";
    main()
    

