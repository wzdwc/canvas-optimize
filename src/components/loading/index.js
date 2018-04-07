import LoadingComponent from './loading'
import Vue from 'vue'
const LoadingConstructor = Vue.extend(LoadingComponent)

const $vm = new LoadingConstructor({
    el  : document.createElement('div'),
    data: {show: false}
})
document.body.appendChild($vm.$el)
let currentTimer
const Loading = (options) => {
    window.clearTimeout(currentTimer)
    let timeout = 200
    if (options instanceof Promise) {
        return options.then(data => {
            Loading.close()
            return data
        }, reason => {
            Loading.close()
            return reason
        })
    } else if (typeof options === 'string') {
        $vm.text = options
    } else if (typeof options === 'object') {
        $vm.text = options.text
        timeout = options.timeout || timeout
    }
    currentTimer = setTimeout(() => {
        $vm.show = true
    }, timeout)
    return Loading
}

Loading.close = () => {
    window.clearTimeout(currentTimer)
    $vm.show = false
    $vm.text = ''
    return Loading
}

export default Loading
