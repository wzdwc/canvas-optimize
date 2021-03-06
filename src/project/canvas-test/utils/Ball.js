/**
 * Created by jorky on 2018/4/5.
 */

// 随机
function getRandom(a, b) {
    return Math.random() * (b - a) + a
}

// 取整
function getInt(num) {
    return (0.5 + num) << 0
}

export default class Ball {
    /**
     * Create a ball.
     * @param {number} x - x坐标值
     * @param {number} y - y坐标值
     * @param {number} vy - 移动速度y坐标增量
     * @param {number} vx - 移动速度x坐标增量
     * @param {number} useCache - 是否使用缓存.
     * @param {number} borderWidth - 每个环的宽度.
     * @param {object} canvas - canvas对象.
     */
    constructor(x, y, vx, vy, useCache, borderWidth, canvas) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.r = getInt(getRandom(20, 40))
        this.color = []
        this.cacheCanvas = document.createElement('canvas')
        this.cacheCtx = this.cacheCanvas.getContext('2d')
        this.cacheCanvas.width = 2 * this.r
        this.cacheCanvas.height = 2 * this.r
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.borderWidth = borderWidth
        this.useCache = useCache
        for (let j = 0; j < getInt(this.r / this.borderWidth); j++) {
            this.color.push('rgba(' + getInt(getRandom(0, 255)) + ',' +
                getInt(getRandom(0, 255)) + ',' + getInt(getRandom(0, 255)) +
                ',1)')
        }
        if (useCache) {
            this.cache()
        }
    }
    /**
     * 绘制
     * @param {object} ctx - canvas上下文
     */
    paint(ctx) {
        if (!this.useCache) {
            ctx.save()
            let j = 0
            ctx.lineWidth = this.borderWidth
            for (let i = 1; i < this.r; i += this.borderWidth) {
                ctx.beginPath()
                ctx.strokeStyle = this.color[j]
                ctx.arc(this.x, this.y, i, 0, 2 * Math.PI)
                ctx.stroke()
                j++
            }
            ctx.restore()
        } else {
            ctx.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r)
        }
    }
    /**
     * 缓存
     */
    cache() {
        this.cacheCtx.save()
        let j = 0
        this.cacheCtx.lineWidth = this.borderWidth
        for (let i = 1; i < this.r; i += this.borderWidth) {
            this.cacheCtx.beginPath()
            this.cacheCtx.strokeStyle = this.color[j]
            this.cacheCtx.arc(this.r, this.r, i, 0, 2 * Math.PI)
            this.cacheCtx.stroke()
            j++
        }
        this.cacheCtx.restore()
    }
    /**
     * 移动
     */
    move() {
        this.x += this.vx
        this.y += this.vy
        if (this.x > (this.canvas.width - this.r) || this.x < this.r) {
            this.x = this.x < this.r ? this.r : (this.canvas.width - this.r)
            this.vx = -this.vx
        }
        if (this.y > (this.canvas.height - this.r) || this.y < this.r) {
            this.y = this.y < this.r ? this.r : (this.canvas.height - this.r)
            this.vy = -this.vy
        }
        this.paint(this.ctx)
    }
}
