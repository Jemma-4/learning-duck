import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js'
import echarts from "echarts";
import { Button } from 'vant'
import { Popup } from 'vant'
import { Image as VanImage } from 'vant';
import { Tabbar, TabbarItem } from 'vant';
import { NavBar } from 'vant';
import { Sticky } from 'vant';
import { Col, Row } from 'vant';
import { Tab, Tabs } from 'vant';
import { Field } from 'vant';
import { Slider } from 'vant';
import { Switch } from 'vant';
import { Cell, CellGroup } from 'vant';
import { DatetimePicker } from 'vant';
import { PullRefresh } from 'vant';
import { List } from 'vant';
import { SwipeCell } from 'vant';
import { Circle } from 'vant';
import { CountDown } from 'vant';
import { Form } from 'vant'
import { Overlay } from 'vant'
import { Divider } from 'vant';
import { Tag } from 'vant';
import { Uploader } from 'vant';
import { Grid, GridItem } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import { Notify } from 'vant';
import {Search} from 'vant';
import { Icon } from 'vant';
import { Skeleton } from 'vant';
import VueCookies from 'vue-cookies'
import { Picker } from 'vant';
import { Collapse, CollapseItem } from 'vant';



Vue.use(VueCookies)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
Vue.use(Button);
Vue.use(Popup);
Vue.use(VanImage);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);
Vue.use(Sticky);
Vue.use(Col);
Vue.use(Row);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Field);
Vue.use(Slider);
Vue.use(Switch);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(DatetimePicker);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(SwipeCell);
Vue.use(Circle);
Vue.use(CountDown);
Vue.use(Form);
Vue.use(Overlay);
Vue.use(Divider);
Vue.use(Tag);
Vue.use(Uploader);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Notify);
Vue.use(Search);
Vue.use(Icon);
Vue.use(Skeleton);
Vue.use(Picker);
Vue.use(Collapse);
Vue.use(CollapseItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
