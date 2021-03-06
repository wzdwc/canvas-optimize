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
    /**
     * Create a game.
     * @param {number} useCache - 是否使用缓存.
     * @param {object} canvas - canvas对象.
     */
    constructor(canvas, useCache) {
        this.canvas = canvas
        this.balls = []
        this.size = 100
        this.useCache = useCache
        this.ctx = this.canvas.getContext('2d')
        this.play = true
    }
    /**
     * 初始化
     */
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
    /**
     * 增加球的数量
     * @param {number} size - 数量.
     */
    add(size) {
        for (let i = 0; i < size; i++) {
            let b = new Ball(getRandom(0, this.canvas.width),
                getRandom(0, this.canvas.height), getRandom(-10, 10),
                getRandom(-10, 10), true, 2, this.canvas)
            this.balls.push(b)
        }
    }
    /**
     * 更新画布
     */
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].move()
        }
    }
    /**
     * 循环绘制
     */
    loop() {
        if (this.play) {
            let _this = this
            this.update()
            rafId = requestAnimationFrame(function() {
                _this.loop()
            })
        }
    }
    /**
     * 停止动画
     */
    stop() {
        this.play = false
    }
    /**
     * 开始动画
     */
    start() {
        this.init()
        this.loop()
    }
}
