// 常规组件
import * as components from './components.js';

// 对话框类组件
import {
    Alert,
    Confirm,
    Prompt
} from './Dialog/index.js';

import ActionSheet from './ActionSheet/index.js'


// 轻提示
import Toast from './Toast/index.js';
import {
    Loading
} from './Loading/index.js';

// 水波纹特效
import ripple from '../directives/ripple/index.js';
// 手势
import finger from '../directives/touch/index.js';
// 移动dom指令
import DomPortal from 'vue-dom-portal';

// 挂载语言包
import locale from '@/locale';
let Atom = {
    Alert,
    Confirm,
    Prompt,
    Toast,
    Loading,
    ActionSheet,
    locale
};
import {
    mergeConfigs
} from './config/index.js';

Atom.install = function(Vue, opts = {}) {
    // 使用指定语言
    locale.use(opts.locale);

    // 存储config
    mergeConfigs(opts);

    // 水波纹特效
    Vue.use(ripple);

    // v-touch指令
    Vue.use(finger);

    // 移动dom指令
    Vue.use(DomPortal);

    // ==================== 全局注册组件 ====================
    for (let k in components) {
        let component = components[k];
        Vue.component(`${component.name.replace('Atom', 'A')}`, component);
    }
};

export default Atom;