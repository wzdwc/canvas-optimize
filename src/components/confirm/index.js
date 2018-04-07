import VueConfirm from './confirm.vue'
import Vue from 'vue'
const ConfirmConstructor = Vue.extend(VueConfirm)

const Confirm = (options, onConfirm, onCancel) => {
    const $vm = new ConfirmConstructor({
        el: document.createElement('div'),
    })
    document.body.appendChild($vm.$el)
    $vm.showValue = true
    if (typeof options === 'string') {
        options = {
            content: options
        }
    }
    Object.keys({...options}).forEach(k => {
        if (typeof k !== 'function') {
            $vm[k] = options[k]
        }
    })
    return new Promise(function(resolve, reject) {
        $vm.$off('on-cancel') // 移除监听器
        $vm.$on('on-cancel', () => {
            onCancel && onCancel()
            reject()
            $vm.$nextTick(() => {
                $vm.$destroy()
            })
        })
        $vm.$off('on-confirm')
        $vm.$on('on-confirm', () => {
            onConfirm && onConfirm()
            resolve($vm)
        })
    })
}

Confirm.alert = (options) => {
    if (typeof options === 'string') {
        options = {
            content: options,
        }
    }
    let defaultOptions = {
        hideCancel: true,
    }
    return Confirm({...defaultOptions, ...options})
}

Confirm.prompt = (options) => {
    if (typeof options === 'string') {
        options = {
            content: options,
        }
    }
    let defaultOptions = {
        showInput: true
    }
    return Confirm({...defaultOptions, ...options})
}

export default Confirm
