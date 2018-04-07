<template lang="pug">
    .canvas-test
        .canvas-container
            canvas(id='cas' class='cas' width="800" height="600")
            canvas(id='cas2' class='cas2' width="800" height="600")
        .btns
            .btn(@click="add(100)") add 100
            .btn(@click="optimize") optimize
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .canvas-test{
        .canvas-container{
            position: relative;
            .cas1{
                top:0;
                left: 0;
                position: absolute;
            }
            .cas2{
                top:0;
                left: 0;
                position: absolute;
            }
        }

        .btns{
            display: flex;
            justify-content: center;
            align-items: center;
            .btn{
                flex: 1;
                margin: 10px;
                line-height: 90px;
                background: #1ab499;
                color: #fff;
                text-align: center;
            }
        }
    }
</style>
<script>
    import Game from '../../utils/Game'
    export default {
        data() {
            return {
                game : {},
                game2: {},
            }
        },
        methods: {
            initCanvas(useCache = true) {
                this.game = new Game(document.getElementById('cas'), useCache)
                this.game.start()
            },
            add(size) {
                this.game.add(size)
            },
            optimize() {
                this.game.stop()
                this.game = null
                this.initCanvas()
                this.game.start()
            }
        },
        mounted() {
            this.initCanvas(false)
        },
        components: {},
    }
</script>
