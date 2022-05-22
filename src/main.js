import Vue from 'vue';
import Vuesax from 'vuesax';
import AOS from 'aos';
import App from './App.vue';
import router from './router';
import { store } from '@/store';
import vuetify from './plugins/vuetify';
import './plugins';

// Styles amd Animations
import 'aos/dist/aos.css';
import 'vuesax/dist/vuesax.css';
import './assets/css/style.css';

Vue.config.productionTip = false;

// Vuesax styles
Vue.use(Vuesax, {
  colors: {
    primary: '#26A69A',
    success: '#00897B',
    danger: 'rgb(242, 19, 93)',
    warning: 'rgb(255, 130, 0)',
    background: '#23272d',
  },
});

Vue.config.productionTip = false;

// Remember to disable when not needed.
// This shows Vue dev tools in production
// Vue.config.devtools = false;

Vue.directive('animation', {
  bind(el, binding) {
    const validAnimations = ['shrink'];
    const { link, longPress } = binding.value || {};

    if (validAnimations.includes(binding.arg) && link) {
      const timeout = '0.3s';

      el.onmousedown = () => {
        // if (binding.value === 'shrink') {
        el.style.transform = 'scale(0.95)';
        el.style.transition = timeout;

        if (!longPress) {
          setTimeout(() => {
            el.style.transform = 'scale(1)';
          }, 300);
        }
      };

      if (longPress) {
        const lpTimeout = '0.6s';

        el.onmouseout = () => {
          el.style.transform = 'scale(1)';
          el.style.transition = lpTimeout;
        };
        el.onmouseup = () => {
          el.style.transform = 'scale(1)';
          el.style.transition = lpTimeout;
        };
      }
    }
  },
});

new Vue({
  created() {
    AOS.init();
  },
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
