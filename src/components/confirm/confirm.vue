<template lang="pug">
    .s-confirm-transition(v-if='showValue')
        .s-mask(@click="maskClickHandler")
        .s-confirm-box
            .s-confirm-msg
                .title(v-if="title || $slots.title")
                    slot(name="title")
                        .font-size-36 {{title}}
                .content.scroll-able
                    slot
                        .text-left(v-if="multiline")
                            p(v-for="line in content") {{line}}
                        .full-width(v-if="!multiline" v-html="content",:class='{center:center}')
                        .input-container(v-if="showInput")
                            input(type="input", :placeholder="placeholder" v-model="inputValue", v-if="showInput && !inputType")
                            textarea(rows="3",:placeholder="placeholder" v-model="inputValue" v-if="showInput && inputType === 'textarea'")
            .s-confirm-btn.font-size-32
                .btn.cancel(@click='_onCancel', :class="cancelStyle", v-if="!hideCancel") {{cancelText || '取消'}}
                .btn.confirm(@click='_onConfirm', :class="confirmStyle" v-if="!hideConfirm") {{confirmText || '确认'}}
</template>

<script>
export default {
    props: ['showInput', 'inputType', 'placeholder',
        'title', 'center',
        'value', 'content', 'confirmText',
        'cancelText', 'cancelStyle',
        'confirmStyle', 'hideCancel',
        'hideConfirm',
        'hide-on-blur', 'notAutoClose'],
    data() {
        return {
            showValue : false,
            inputValue: '',
        }
    },
    created() {
        this.showValue = this.value
    },
    computed: {
        multiline() {
            return Array.isArray(this.content)
        }
    },
    watch: {
        showValue(val, old) {
            if (val !== old) {
                this.$emit('input', val)
            }
        },
        value(val, old) {
            if (val !== old) {
                this.showValue = val
            }
        }
    },
    methods: {
        maskClickHandler() {
            if (this.hideOnBlur) {
                this.close()
            }
        },
        show() {
            this.showValue = true
        },
        close() {
            this.showValue = false
        },
        _onConfirm() {
            if (!this.notAutoClose) {
                this.showValue = false
            }
            this.$emit('on-confirm')
        },
        _onCancel() {
            this.showValue = false
            this.$emit('on-cancel')
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@border-radius:15/@base;
.s-confirm-transition{
    transition: opacity 350ms ease;
}
.center{
    display: flex;
    align-items: center;
    justify-content: center;
}
.s-confirm-box {
    background: #fff;
    border-radius: @border-radius;
    position: fixed;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 2000;
    .s-confirm-msg{
        border-radius: @border-radius @border-radius 0 0;
        overflow: hidden;
        width: 100%;
        background-color: @body-background;
    }
    .title{
        padding-top: @global-padding;
        text-align: center;
    }
    .input-container{
        width: 100%;
        &>*{
            width: 100%;
            border: 1px solid #d3d3d3;
            padding: @padding;
            resize: none;
        }
    }
    .content{
        min-height: 180/@base;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        color: @gray-color;
        word-wrap:break-word;
        padding: @global-padding;
        max-height: 700/@base;
    }
    .s-confirm-btn {
        border-radius: 0 0 15/@base 15/@base;
        border-top: @cell-border;
        width: 100%;
        display: flex;
        text-align: center;
        &>.btn {
            padding: @global-padding*.7 .5em;
            color: @primary-color;
            flex: 1;
            box-sizing: border-box;
            white-space: nowrap;
            &.cancel{
                color:@mark-color;
            }
            &.confirm{
                color: @primary-color;
                border-left:@cell-border;
            }
        }
    }
}
</style>
