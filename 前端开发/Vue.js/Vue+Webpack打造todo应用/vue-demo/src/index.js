import Vue from 'vue'
import App from './app.vue'
// import './assets/styles/test.css'
// import './assets/images/0.jpg'
// import './assets/styles/test-stylus.styl'
import './assets/styles/global.styl'
const root = document.createElement('div');
document.body.appendChild(root);

new Vue({
    render: (h) => h(App)
}).$mount(root)