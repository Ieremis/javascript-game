//DEFINIÇÃO DAS VARIÁVEIS
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
musicGameBtn = document.getElementById("musicGameBtn"),
creditsBtn = document.getElementById("creditsBtn"),
nextSlide1 = document.getElementById("nextSlide1"),
nextSlide2 = document.getElementById("nextSlide2"),
nextSlide3 = document.getElementById("nextSlide3"),
resetCount = 0,
scorePointsHtml1 = document.getElementById("scorePoints1"),
scorePointsHtml2 = document.getElementById("scorePoints2"),
vidas = 4, hearts, heartPos = [20, 90, 160, 230], click, gameMusic, 
gun1 = new Audio('./Audio/sfx_weapon_shotgun3.mp3'), 
gun2 = new Audio('./Audio/sfx_weapon_shotgun1.mp3'),
damage = new Audio('./Audio/damage.mp3'),
zombie1FX= new Audio('./Audio/zombie-11.mp3'),
zombie2FX = new Audio('./Audio/zombie-6.mp3'),
menuMusic,
recordP1, recordP2,
record1Html = document.getElementById('record1Html'),
record2Html = document.getElementById('record2Html'),
musicPlaying = true, musicGamePlaying = true;
//DEFINIÇÃO DOS ESTADOS
let estados = {
        jogar: 0,
        jogando: 1,
        perdeu: 2
}
//criação da classe do player com um constructor
class Player {
    constructor(positionX, positionY) {
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
        //definição dos lados para trocar os sprites e fazer animação
        this.sides = {
            isUp: false,
            isDown: true,
            isLeft: false,
            isRight: false,
        };
        //definição dos sprites para cada lado e colocando num array para poder animar
        const down1 = new Image();
        down1.src = "./Sprites/Baixo1.png";
        const down2 = new Image();
        down2.src = "./Sprites/Baixo2.png";
        this.downSprites = [down1, down2]

        const right1 = new Image();
        right1.src = "./Sprites/Direita1.png";
        const right2 = new Image();
        right2.src = "./Sprites/Direita2.png";
        this.rightSprites = [right1, right2]

        const up1 = new Image();
        up1.src = "./Sprites/Cima1.png";
        const up2 = new Image();
        up2.src = "./Sprites/Cima2.png";
        this.upSprites = [up1, up2]

        const left1 = new Image();
        left1.src = "./Sprites/Esquerda1.png";
        const left2 = new Image();
        left2.src = "./Sprites/Esquerda2.png";
        this.leftSprites = [left1, left2]

        this.score = 0; // zera o score assim que o personagem é criado
        this.countSprite = 0 // zera o contador dos sprites para criar a animação
    }

    draw() { //desenha o sprite dependendo do lado que o personagem está apontando e passa pelo array pra criar animação
        if (this.sides.isDown == true) {
            if(this.countSprite < 25){ //CRIA UM CONTADOR ATUALIZADO A CADA FRAME, USADO PARA PRODUZIR O EFEITO DE ANIMAÇÃO
                c.drawImage(this.downSprites[0], this.position.x, this.position.y, 80, 80);
                this.countSprite++
            } else if(this.countSprite >= 25 || this.countSprite < 50){
                c.drawImage(this.downSprites[1], this.position.x, this.position.y, 80, 80);
                this.countSprite++;
                if(this.countSprite === 50){
                    this.countSprite = 0;
                }
            }
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

    update() { //chamado todo frame, atualiza a velocidade e chama a função de desenhar o personagem
        if(estadoAtual == estados.jogando){
            this.draw();
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
        }
    }
}

class Projectile { // construção da classe do projétil
    constructor(x, y, radius, velocity, projSprite) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.projSprite = projSprite
    }

    draw() {
        c.drawImage(this.projSprite, this.x, this.y, 20, 20); //desenha o projétil com o sprite que foi passado no constructor
    }

    update() { // chamado a cada frame e realiza a função de sempre desenhar o projétil
        this.draw(); 
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy { // criação do constructor da classe dos inimigos
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.width = 75;
        this.height = 80;
        //define os sprites dos zumbis e coloca num array para criar a animação
        const zombie1 = new Image();
        zombie1.src = "./Sprites/Zumbi1.png";
        const zombie2 = new Image();
        zombie2.src = "./Sprites/Zumbi2.png";
        this.zombieSprites = [zombie1, zombie2];
        this.countSprite = 0
    }

    draw() { // desenha o sprite do zumbi e cria a animação
        if(this.countSprite < 50){ //CRIA UM CONTADOR ATUALIZADO A CADA FRAME, USADO PARA PRODUZIR O EFEITO DE ANIMAÇÃO
            c.drawImage(this.zombieSprites[0], this.x, this.y, 80, 80);
            this.countSprite++
        } else if(this.countSprite >= 50 || this.countSprite < 100){
            c.drawImage(this.zombieSprites[1], this.x, this.y, 80, 80);
            this.countSprite++;
            if(this.countSprite === 100){
                this.countSprite = 0;
            }
        }
    }

    update() { // chamado todo frame, e chama a função de desenhar
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

function spawnEnemies() { //spawna os inimigos
        setInterval(() => {
            if(estadoAtual == estados.jogando){
            let x;
            let y; //define o x e o y de onde o zumbi nascerá realizando um cálculo através do Math.random()
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - 20 : canvas.width + 20;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - 40 : canvas.height + 40;
            }
            const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    
            const velocity = { //define o angulo da velocidade e a velocidade em si
                x: Math.cos(angle),
                y: Math.sin(angle),
            };
                enemies.push(new Enemy(x, y, velocity)); //insere o zumbi no array dos inimigos com os valores calculados
            }
        }, 500);
    }

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate); // cria uma função que atualiza o jogo frame a frame
    c.clearRect(0, 0, canvas.width, canvas.height); // limpa o canvas para não deixar rastros
    c.drawImage(background, 0, 0, canvas.width, canvas.height); // desenha o fundo
    player1.update(); // chama a função update
    player2.update(); // chama a função update
    c.fillStyle = "#ffffff" // criação dos scores dos personagens
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
        c.drawImage(hearts, x, 520, 60, 60) // desenha os corações com o x e o y dos valores dos arrays
    })

    projectiles1.forEach((proj, projIndex) => {
        proj.update();
        //removendo dos cantos do canvas os projéteis
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
        proj.update(); // chama a função update para todos os projéteis do array
        //removendo dos cantos do canvas os projéteis
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
        enemy.update(); // chama a função update para todos os inimigos do array
        if (
            enemy.x <= -20 ||
            enemy.x >= canvas.width + 20 ||
            enemy.y <= -50 ||
            enemy.y >= canvas.height + 50
        ) {
            enemies.splice(enemyIndex, 1);
        }
        //COLISÃO DO INIMIGO COM OS PROJÉTEIS
        projectiles1.forEach((projectile, projIndex) => { // calcula a colisão do inimigo com o projétil
            const dist1 = Math.hypot(projectile.x - enemy.x - enemy.width / 2, projectile.y - enemy.y - enemy.height / 2);
            if (dist1 < 30) {
                zombie1FX.load() // toca o som do zumbi morrendo
                zombie1FX.volume = 0.2
                zombie1FX.play()
                projectiles1.splice(projIndex, 1); // limpa o projétil colidido
                enemies.splice(enemyIndex, 1); // limpa o inimigo colidido
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
        // COLISÃO DO INIMIGO COM O PLAYER
        const dist1 = Math.hypot(enemy.x - player1.position.x, enemy.y - player1.position.y + 10);
        if (dist1 < 60) { // calcula a distancia entre o inimigo e o player
            enemies.splice(enemyIndex, 1); // limpa o inimigo colidido da cena
            damage.load() // toca o som de dano
            damage.volume = 0.3
            damage.play()
            vidas--; //diminui a vida
            heartPos.pop(); //limpa a vida do array para nao ser mais desenhada
            if(vidas == 0){ //caso as vidas acabem
                estadoAtual = estados.perdeu;//troca o estado para perdeu
                enemies.splice(0, 20);//limpa os zumbis da tela
                gameOver.style.display = "flex"//mostra o menu
                vidas = 4;//reseta as vidas
                heartPos = [20, 90, 160, 230]//reseta as posições dos corações na tela
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
                enemies.splice(0, 20);
                gameOver.style.display = "flex"
                vidas = 4;
                heartPos = [20, 90, 160, 230]
            }
        }
    });
        //ATUALIZAÇÃO DA VELOCIDADE, TESTANDO A POSIÇÃO DO PERSONAGEM (SE ELE ESTÁ DENTRO DO CANVAS) E PRA QUAL DIREÇÃO ELE ESTA SE MOVIMENTANDO
    if (keys1.right.pressed && player1.position.x + player1.width <= 800) {
        player1.velocity.x = 5;
    } else if (keys1.left.pressed && player1.position.x >= 0) {
        player1.velocity.x = -5;
    } else player1.velocity.x = 0

    if (keys2.right.pressed && player2.position.x + player2.width <= 800) {
        player2.velocity.x = 5;
    } else if (keys2.left.pressed && player2.position.x >= 0) {
        player2.velocity.x = -5;
    } else player2.velocity.x = 0
        //TESTA CONTINUAMENTE QUAL É O ESTADO ATUAL
    if(estadoAtual == estados.perdeu){
        scorePointsHtml1.innerHTML = player1.score; // ATUALIZA O SCORE DO MENU DO GAME OVER
        if (player1.score > recordP1) {// CALCULO DO RECORD
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

addEventListener("keydown", (ev) => { //ADICIONA O EVENT LISTENER PARA UMA TECLA PRESSIONADA
    switch (ev.keyCode) {
        case 65: //A
            keys1.left.pressed = true; // VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            player1.sides.isDown = false;
            player1.sides.isRight = false;
            player1.sides.isUp = false;
            player1.sides.isLeft = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            break;
        case 87: //W
            keys1.up.pressed = true // VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            if(keys1.up.pressed && player1.position.y >= 10){ //TESTA A POSIÇÃO DO PERSONAGEM PARA ELE SE MOVIMENTAR APENAS DENTRO DO CANVAS NO EIXO Y
                player1.velocity.y = -5
            }
            else player1.velocity.y = 0;
            player1.sides.isDown = false;
            player1.sides.isRight = false;
            player1.sides.isUp = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            player1.sides.isLeft = false;
            break;
        case 68: //D
            keys1.right.pressed = true;// VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            player1.sides.isDown = false;
            player1.sides.isRight = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            player1.sides.isUp = false;
            player1.sides.isLeft = false;
            break;
        case 83: //S
            keys1.down.pressed = true; // VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            if(keys1.down.pressed && player1.position.y <= 510){
                player1.velocity.y = 5
            }
            else player1.velocity.y = 0;
            player1.sides.isDown = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            player1.sides.isRight = false;
            player1.sides.isUp = false;
            player1.sides.isLeft = false;
            break;
        case 37: //SETINHA ESQ
            keys2.left.pressed = true; // VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            player2.sides.isDown = false;
            player2.sides.isRight = false;
            player2.sides.isUp = false;
            player2.sides.isLeft = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            break;
        case 38: //SETINHA CIMA
            keys2.up.pressed = true; // VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            if(keys2.up.pressed && player2.position.y >= 10){
                player2.velocity.y = -5  
            }
            else player2.velocity.y = 0;
            player2.sides.isDown = false;
            player2.sides.isRight = false;
            player2.sides.isUp = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            player2.sides.isLeft = false;
            break;
        case 39: //SETINHA DIR
            keys2.right.pressed = true; // VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            player2.sides.isDown = false;
            player2.sides.isRight = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            player2.sides.isUp = false;
            player2.sides.isLeft = false;
            break;
        case 40: //SETINHA BAIXO
            keys2.down.pressed = true; // VARIÁVEIS USADAS PARA CALCULAR A POSIÇÃO
            if(keys2.down.pressed && player2.position.y <= 510){
                player2.velocity.y = 5 
            }
            else player2.velocity.y = 0;
            player2.sides.isDown = true; // VARIÁVEIS USADAS PARA TROCAR O SPRITE
            player2.sides.isRight = false;
            player2.sides.isUp = false;
            player2.sides.isLeft = false;
            break;
        default:
            break;
    }
});

addEventListener("keyup", (ev) => { // ZERA AS VARIAVEIS DE POSIÇÃO E A VELOCIDADE QUANDO A TECLA DEIXA DE SER APERTADA
    switch (ev.keyCode) {
        case 65:
            console.log("esquerda");
            keys1.left.pressed = false;
            player1.velocity.x = 0;
            break;
        case 87:
            console.log("cima");
            keys1.up.pressed = false
            player1.velocity.y = 0;
            break;
        case 68:
            console.log("direita");
            keys1.right.pressed = false;
            player1.velocity.x = 0;
            break;
        case 83:
            console.log("baixo");
            keys1.down.pressed = false
            player1.velocity.y = 0;
            break;
        case 37:
            console.log("esquerda");
            keys2.left.pressed = false;
            player2.velocity.x = 0;
            break;
        case 38:
            console.log("cima");
            keys2.up.pressed = false
            player2.velocity.y = 0;
            break;
        case 39:
            console.log("direita");
            keys2.right.pressed = false;
            player2.velocity.x = 0;
            break;
        case 40:
            console.log("baixo");
            keys2.down.pressed = false;
            player2.velocity.y = 0;
            break;
        default:
            break;
    }
});
//EVENT LISTENERS PARA OS TIROS, NA TECLA ESPAÇO " " E NA TECLA P
addEventListener("keyup", (ev) => {
    if (player1.sides.isLeft == true && ev.key == " ") { //TESTA O LADO QUE O PERSONAGEM ESTÁ MIRANDO
        gun1.load(); // TOCA O SOM DO DISPARO
        gun1.volume = 0.1;
        gun1.play();
        projectiles1.push( //INSERE O PROJÉTIL COM VALORES DIFERENTES DEPENDENDO DA POSIÇÃO
            new Projectile(
                player1.position.x + 25, //DISPARADO DO X E DO Y DO PERSONAGEM
                player1.position.y + 55,
                10,
                {
                    x: -15, //DEPENDENDO DO LADO, IRÁ DISPARAR COM UMA VELOCIDADE X E Y
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
                {
                    x: 0,
                    y: 15,
                },
                proj2
            )
        );
    }
});

startGameBtn.addEventListener("click", () => { //ADICIONA UM EVENTO CLICK NO BOTAO JOGAR
    click.load();
    click.play(); // TOCA O CLICK DO MENU AO APERTAR
    menuMusic.pause(); // PARA A MUSICA DO MENU
    gameMusic.volume = 0.8 //TOCA A MUSICA DO JOGO
    gameMusic.load();
    gameMusic.play();
    gameMusic.loop = true;
    menu.style.display = "none" // APAGA OS MENUS
    musicBtn.style.display = "none" // APAGA O BOTAO DE MUSICA DO MENU
    musicGameBtn.style.display = "block" // MOSTRA O BOTAO DE MUSICA DO JOGO
    musicPlaying = false //DIZ QUE A MUSICA DO MENU NAO ESTA TOCANDO
    estadoAtual = estados.jogando //TROCA O ESTADO
    player1.position.x = canvas.width / 2 - 100; // DEFINE AS POSIÇÕES DOS 2 PLAYERS
    player1.position.y = canvas.height / 2;
    player2.position.x = canvas.width / 2 + 40;
    player2.position.y = canvas.height / 2;
    player1.score = 0; //RESETA O SCORE
    player2.score = 0;
    if(resetCount < 1){ //USADO PARA APENAS CHAMAR A FUNÇÃO DE SPAWN UMA VEZ
        spawnEnemies()
    }
})

backToMenuBtn.addEventListener("click", () => { //ADICIONA UM EVENTO AO CLICAR NO BOTAO DE VOLTAR AO MENU NO GAME OVER
    click.load(); //TOCA O CLICK DO MENU
    click.play();
    menuMusic.load(); //TOCA A MUSICA DO MENU
    menuMusic.play();
    menuMusic.loop = true;
    musicPlaying = true
    gameMusic.pause(); // PAUSA A MUSICA DO JOGO
    gameOver.style.display = "none"
    credits.style.display = "none"
    menu.style.display = "flex" // MOSTRA O MENU PRINCIPAL E ESCONDE OS  OUTROS
    musicBtn.style.display = "block" // MOSTRA O BOTAO DE MUSICA DO MENU E ESCONDE OS OUTROS
    musicGameBtn.style.display = "none"
    estadoAtual = estados.jogar // TROCA O ESTADO PARA JOGAR
    resetCount = 1;
})

backToMenuBtn2.addEventListener("click", () => { //FUNÇAO PARA VOLTAR AO MENU APÓS CRÉDITOS
    click.load();
    click.play();
    credits.style.display = "none"
    menu.style.display = "flex"
    estadoAtual = estados.jogar
})

musicBtn.addEventListener("click", () => { //ON E OFF DA MUSICA DO MENU
    click.load();
    click.play();
    if(musicPlaying == true){
        musicPlaying = false;
        menuMusic.pause();
    } else {
        musicPlaying = true;
        menuMusic.load();
        menuMusic.play();
        menuMusic.loop = true;
    }
})

musicGameBtn.addEventListener("click", () => { //ON E OFF DA MUSICA DO GAMEPLAY
    click.load();
    click.play();
    if(musicGamePlaying == true){
        musicGamePlaying = false;
        gameMusic.pause();
    } else {
        musicGamePlaying = true;
        gameMusic.load();
        gameMusic.play();
        gameMusic.loop = true;
    }
})

backToMenuBtn3.addEventListener("click", () => { //EVENTO PARA VOLTAR AO MENU APÓS O TUTORIAL
    click.load();
    click.play();
    tutorial.style.display = "none"
    menu.style.display = "flex"
    estadoAtual = estados.jogar
})

tutoBtn.addEventListener("click", () => { //BOTAO QUE LEVA AO TUTORIAL
    click.load();
    click.play();
    gameOver.style.display = "none"
    menu.style.display = "none"
    tutorial.style.display = "flex"
    nextSlide1.style.display = "block"
    nextSlide2.style.display = "none"
    tutorial.style.backgroundImage = "url('./Sprites/Slide1.png')"
})

creditsBtn.addEventListener("click", () => { // EVENTO QUE LEVA AO MENU DE CRÉDITOS
    click.load();
    click.play();
    gameOver.style.display = "none"
    menu.style.display = "none"
    tutorial.style.display = "none"
    credits.style.display = "flex"
})

nextSlide1.addEventListener("click", () => { // PASSA O SLIDE E ESCONDE O ANTERIOR NO TUTORIAL
    click.load();
    click.play();
    tutorial.style.backgroundImage = "url('./Sprites/Slide2.png')"
    nextSlide2.style.display = "block"
    nextSlide1.style.display = "none"
})

nextSlide2.addEventListener("click", () => { // PASSA O SLIDE E ESCONDE O ANTERIOR NO TUTORIAL
    click.load();
    click.play();
    tutorial.style.backgroundImage = "url('./Sprites/Slide3.png')"
    nextSlide2.style.display = "none"
    nextSlide1.style.display = "none"
})

function main(){
    menuMusic = new Audio('./Audio/menuMusic.mp3') //SELECIONA O AUDIO DA MUSICA DO MENU
    menuMusic.load(); //TOCA A MUSICA DO MENU
    menuMusic.play();
    menuMusic.loop = true;
    canvas = document.querySelector("canvas"); // acessando o canvas do html
    c = canvas.getContext("2d"); // pegando o context 2d do canvas
    canvas.width = 800;
    canvas.height = 600; //DEFININDO O TAMANHO DO CANVAS
    c.font = "20px Sigmar";//DEFININDO A FONTE
    background = new Image();
    background.src = "./Sprites/background.jpeg" //DEFININDO A SOURCE DO BACKGROUND

    click = new Audio('./Audio/click3.mp3') //DEFINE O SOM DO CLICK
    gameMusic = new Audio('./Audio/gameMusic.mp3')// DEFINE A MUSICA DA GAMEPLAY

    hearts = new Image();
    hearts.src = "./Sprites/heart.png" //DEFINE O SPRITE DO CORAÇÃO

    player1 = new Player(canvas.width / 2 - 100, canvas.height / 2); //CRIAÇÃO DO PLAYER 1

    player2 = new Player(canvas.width / 2 + 40, canvas.height / 2); // CRIAÇÃO DO PLAYER 2
    recordP1 = localStorage.getItem("recordP1")
    if (recordP1 == null)
				recordP1 = 0; //ZERA O RECORD CASO NAO TENHA NO LOCAL STORAGE

    recordP2 = localStorage.getItem("recordP2")
    if (recordP2 == null)
                recordP2 = 0;
    keys1 = { // ESTADOS DAS TECLAS APERTADAS DE CADA PLAYER PARA CALCULOS DE VELOCIDADE
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        },
        up :{
            pressed: false,
        },
        down: {
            pressed: false
        }
    };
    
    keys2 = {
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        },
        up :{
            pressed: false,
        },
        down: {
            pressed: false
        }
    };
    
    projectiles1 = []; //DEFINIÇÃO DOS ARRAYS DE PROJETEIS E INIMIGOS VAZIOS
    projectiles2 = [];
    enemies = [];
    estadoAtual = estados.jogar //TROCA DE ESTADOS
    animate(); // CHAMA A FUNÇÃO ANIMATE
}
    let proj1 = new Image(); // DEFINE OS SPRITES DOS PROJÉTEIS
    proj1.src = "./Sprites/TIROAZUL.png";
    let proj2 = new Image();
    proj2.src = "./Sprites/TIROVERMELHO.png";
    main() // CHAMA O MAIN
    

