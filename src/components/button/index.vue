<template lang="pug">
  x-button.s-btn(v-bind="$props", @click.native="clickHandler")
    slot
</template>

<script>
import {XButton} from 'vux'
export default {
    props: {
        ...XButton.props
    },
    methods: {
        clickHandler(e) {
            this.$emit('click', e)
        }
    },
    components: {XButton}
}
</script>

<style lang="less" rel="stylesheet/less">
@import "../../assets/less/fn.less";
.weui-btn.s-btn{
    height: @button-height;
    border-radius: @global-border-raidus;
    &:after{
        content: none;
    }
    &.weui-btn_mini{
        height: auto;
        .font-dpr(13px);
    }
    &[class*="weui-btn_plain"] {
        & + &{
            margin-left: 10/@base;
        }
        margin-top: 0;
    }
    &.weui-btn_plain-primary{
        color: @primary-color;
        border-color: @primary-color;
        &:active{
            @active-color: fadeout(@primary-color, 40%);
            background: fadeout(@active-color, 50%);
            color: @active-color;
            border-color: @active-color;
        }
    }
    &.round{
        border-radius: 100px;
    }
    &.weui-btn_disabled.weui-btn_primary{
        background: @button-primary-disable-color;
    }
    &.weui-btn_gray{
        background-color: #f8f8f8;
        color:#333333;
        border:1px solid #dfdfdf;
    }
    &.weui-btn_white{
        background-color: #fff;
        color:#333333;
        border:1px solid #dfdfdf;
    }
    .font-dpr(16px);
}
</style>
