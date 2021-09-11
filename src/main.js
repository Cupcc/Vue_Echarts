import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
// 引入字体的文件
import './assets/font/iconfont.css';
// 引入全局样式
import './assets/css/global.less';
// 服务端对WebSocket的连接
import SocketService from '@/utils/socket_service';
SocketService.Instance().connect();
// 其他组件使用socket方法
Vue.prototype.$socket = SocketService.Instance;

// 请求基准路径配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/';
// 挂载axios
Vue.prototype.$http = axios;

// 全局echarts对象的挂载
Vue.prototype.$echarts = window.echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
