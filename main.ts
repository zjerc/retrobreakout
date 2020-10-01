namespace SpriteKind {
    export const Balls = SpriteKind.create()
    export const Blocks = SpriteKind.create()
}
sprites.onCreated(SpriteKind.Blocks, function (sprite) {
	
})
function decreaseBlockLife (blk: Sprite) {
    sprites.changeDataNumberBy(blk, "life", -1)
    return sprites.readDataNumber(blk, "life")
}
function initBlocks () {
    rowOfBlock(img`
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        `, 0, 2)
    rowOfBlock(img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        `, 2, 1)
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
function rowOfBlock (blkImage: Image, yOffset: number, bLife: number) {
    lstBlockPosX = [
    0,
    1,
    2,
    3,
    4,
    0,
    1,
    2,
    3,
    4
    ]
    lstBlockPosY = [
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1
    ]
    for (let index = 0; index <= lstBlockPosX.length - 1; index++) {
        block = sprites.create(blkImage, SpriteKind.Blocks)
        block.setPosition(40 + lstBlockPosX[index] * 20, 20 + (lstBlockPosY[index] + yOffset) * 10)
        sprites.setDataNumber(block, "life", bLife)
    }
    numberOfBlocks += lstBlockPosX.length
}
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
    if (locRemainLife == 0) {
        otherSprite.destroy()
    }
    bounceTheBall(sprite, otherSprite)
    if (locRemainLife >= 1) {
        music.playTone(262, music.beat(BeatFraction.Half))
    } else {
        music.playTone(440, music.beat(BeatFraction.Half))
    }
})
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
    } else {
        if (ball.bottom > obj.bottom && ball.left < obj.right) {
            ball.vy = Math.abs(ball.vy)
        } else {
            if (ball.left < obj.left && ball.bottom > obj.top) {
                ball.vx = 0 - Math.abs(ball.vx)
            } else {
                if (ball.right > obj.right && ball.top < obj.bottom) {
                    ball.vx = Math.abs(ball.vx)
                } else {
                    game.splash("error 1")
                }
            }
        }
    }
}
function initBoard () {
    initPaddle()
    numberOfBlocks = 0
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
let locRemainLife = 0
let Paddle: Sprite = null
let numberOfBlocks = 0
let block: Sprite = null
let lstBlockPosY: number[] = []
let lstBlockPosX: number[] = []
let Ball: Sprite = null
let isBallOnPad = false
info.setLife(3)
initBoard()
initBlocks()
game.onUpdate(function () {
    checkBallReachBottom()
})
