namespace SpriteKind {
    export const Balls = SpriteKind.create()
    export const Blocks = SpriteKind.create()
}
function decreaseBlockLife (blk: Sprite) {
    sprites.changeDataNumberBy(blk, "life", -1)
    return sprites.readDataNumber(blk, "life")
}
function initBlocks () {
    numberOfBlocks = 0
    createBlockRow(img`
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        `, 40, 20, 5, 5, 2)
    createBlockRow(img`
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        `, 40, 30, 5, 5, 2)
    createBlockRow(img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        `, 40, 40, 5, 5, 1)
    createBlockRow(img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        `, 40, 50, 5, 5, 1)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isBallOnPad) {
        controller.moveSprite(Ball, 0, 0)
        if (Math.percentChance(50)) {
            Ball.setVelocity(randint(15, 50), randint(-110, -80))
        } else {
            Ball.setVelocity(randint(-50, -15), randint(-110, -80))
        }
    }
})
sprites.onDestroyed(SpriteKind.Blocks, function (sprite) {
    numberOfBlocks += -1
    if (numberOfBlocks <= 0) {
        game.over(true)
    }
})
function initPaddle () {
    Paddle = sprites.create(img`
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        `, SpriteKind.Player)
    Paddle.setPosition(80, 113)
    controller.moveSprite(Paddle, 100, 0)
    Paddle.setFlag(SpriteFlag.StayInScreen, true)
}
info.onCountdownEnd(function () {
    initBoard()
})
sprites.onOverlap(SpriteKind.Balls, SpriteKind.Blocks, function (sprite, otherSprite) {
    locRemainLife = decreaseBlockLife(otherSprite)
    bounceTheBall(sprite, otherSprite)
    if (locRemainLife <= 0) {
        otherSprite.destroy()
    }
    if (locRemainLife >= 1) {
        music.playTone(262, music.beat(BeatFraction.Half))
    } else {
        music.playTone(440, music.beat(BeatFraction.Half))
    }
})
function createBlockRow (blkImage: Image, startX: number, startY: number, num: number, spacing: number, bLife: number) {
    for (let index = 0; index <= num - 1; index++) {
        block = sprites.create(blkImage, SpriteKind.Blocks)
        block.setPosition(startX + index * (block.width + spacing), startY)
        sprites.setDataNumber(block, "life", bLife)
    }
    numberOfBlocks += num
}
function checkBallReachBottom () {
    if (Ball.y > 115 && !(inDeadTime)) {
        inDeadTime = true
        Paddle.destroy(effects.disintegrate, 500)
        Ball.destroy()
        info.changeLifeBy(-1)
        info.startCountdown(1)
    }
}
function bounceTheBall (ball: Sprite, obj: Sprite) {
    if (ball.top < obj.top && ball.right > obj.left) {
        ball.vy = 0 - Math.abs(ball.vy)
    } else if (ball.bottom > obj.bottom && ball.left < obj.right) {
        ball.vy = Math.abs(ball.vy)
    } else if (ball.left < obj.left && ball.bottom > obj.top) {
        ball.vx = 0 - Math.abs(ball.vx)
    } else if (ball.right > obj.right && ball.top < obj.bottom) {
        ball.vx = Math.abs(ball.vx)
    } else {
        game.splash("error 1")
    }
}
function initBoard () {
    initPaddle()
    Ball = sprites.create(img`
        . . 1 1 . . 
        . 1 1 1 1 . 
        1 1 1 1 1 1 
        1 1 1 1 1 1 
        . 1 1 1 1 . 
        . . 1 1 . . 
        `, SpriteKind.Balls)
    Ball.setPosition(80, 106)
    controller.moveSprite(Ball, 100, 0)
    Ball.setFlag(SpriteFlag.StayInScreen, true)
    Ball.setFlag(SpriteFlag.BounceOnWall, true)
    padSpeed = 120
    padAcceleration = 80
    isBallOnPad = true
    inDeadTime = false
}
info.onLifeZero(function () {
    game.over(false, effects.dissolve)
})
sprites.onOverlap(SpriteKind.Balls, SpriteKind.Player, function (sprite, otherSprite) {
    bounceTheBall(sprite, otherSprite)
    if (sprite.x < otherSprite.x) {
        sprite.vx += randint(-20, 0)
    } else {
        sprite.vx += randint(0, 20)
    }
})
let padAcceleration = 0
let padSpeed = 0
let inDeadTime = false
let block: Sprite = null
let locRemainLife = 0
let Paddle: Sprite = null
let Ball: Sprite = null
let isBallOnPad = false
let numberOfBlocks = 0
info.setLife(3)
initBoard()
initBlocks()
game.onUpdate(function () {
    checkBallReachBottom()
})
