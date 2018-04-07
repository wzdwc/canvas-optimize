<template lang="pug">
transition(name='s-fade')
    .s-toast(v-show="show")
        .s-toast-content(:class="position") {{text}}
            slot
</template>

<script>
export default {
    data() {
        return {
            show    : true,
            text    : '',
            position: 'bottom',
        }
    },
    methods: {
        close() {
            this.show = false
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
.s-toast-content{
    position: fixed;
    left: 50%;
    color: #fff;
    width: 7rem;
    background: hsla(0,0%,7%,.7);
    padding: @global-padding / 2;
    text-align: center;
    transform: translateX(-50%);
    border-radius: @global-border-raidus;
    z-index: 6999;
    &.bottom {
        bottom: 120/@base;
    }
    &.top {
        top: 120/@base;
    }
}
</style>
