import ToastComponent from './toast'
import Vue from 'vue'
const ToastConstructor = Vue.extend(ToastComponent)

const $vm = new ToastConstructor({
    el  : document.createElement('div'),
    data: {show: false}
})
document.body.appendChild($vm.$el)

let timer
const Toast = (...args) => {
    let options
    if (args.length > 1) {
        options = args.join(' ')
    } else {
        options = args[0]
    }
    if (options === null || options === undefined) {
        console.warn(`Toast params is `, options, ' can\'t be show')
        return $vm
    }
    if (typeof options !== 'object') {
        options = {
            text: `${options}`
        }
    }
    options.show = true
    options.time = options.time || (options.text.length / 4 * 1000)
    if (options.time > 5000) {
        options.time = 5000
    }
    Object.keys(options).forEach(k => {
        $vm[k] = options[k]
    })
    return new Promise((resolve, reject) => {
        if (options.time) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                $vm.show = false
                resolve()
            }, options.time)
        } else if (!options.text) {
            $vm.show = false
            resolve()
        } else {
            resolve()
        }
    })
}

Toast.close = () => {
    $vm.show = false
    clearTimeout(timer)
    return $vm
}

export default Toast
