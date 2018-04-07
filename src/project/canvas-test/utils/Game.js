/**
 * Created by jorky on 2018/4/7.
 */
import Ball from './Ball'
import './requestAnimationFrame'
// 随机
function getRandom(a, b) {
    return Math.random() * (b - a) + a
}
let rafId = null
export default class Game {
    constructor(canvas, useCache) {
        this.canvas = canvas
        this.balls = []
        this.size = 100
        this.useCache = useCache
        this.ctx = this.canvas.getContext('2d')
        this.play = true
    }

    init() {
        this.balls = []
        cancelAnimationFrame(rafId)
        for (let i = 0; i < this.size; i++) {
            let b = new Ball(getRandom(0, this.canvas.width),
                getRandom(0, this.canvas.height), getRandom(-10, 10),
                getRandom(-10, 10), this.useCache, 2, this.canvas)
            this.balls.push(b)
        }
    }

    add(size) {
        for (let i = 0; i < size; i++) {
            let b = new Ball(getRandom(0, this.canvas.width),
                getRandom(0, this.canvas.height), getRandom(-10, 10),
                getRandom(-10, 10), true, 2, this.canvas)
            this.balls.push(b)
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].move()
        }
    }

    loop() {
        if (this.play) {
            let _this = this
            this.update()
            rafId = requestAnimationFrame(function() {
                _this.loop()
            })
        }
    }
    stop() {
        this.play = false
    }
    start() {
        this.init()
        this.loop()
    }
}
