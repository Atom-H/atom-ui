import DialogRoot from "./Dialog/DialogRoot";
import Toast from "@/packages/Toast/Toast";
import Loading from "@/packages/Loading/Loading";
import Icon from "./Icon/Icon";
import Spinner from "./Spinner/Spinner";
import ScrollView from "./ScrollView/ScrollView";
import Flexbox from "./Flexbox/FlexBox";
import FlexItem from "./Flexbox/FlexItem";
import Badge from "./Badge/Badge";

var Atom = {};

Atom.install = function(Vue) {
    Vue.component(Flexbox.name, Flexbox);
    Vue.component(FlexItem.name, FlexItem);
    Vue.component(ScrollView.name, ScrollView);
    Vue.component(Icon.name, Icon);
    Vue.component(Spinner.name, Spinner);
    Vue.component(Badge.name, Badge);

    var createVueChild = component => {
        // 创建一个挂载点
        const node = document.createElement("div");
        // 起个不重复的名字
        node.id = `_app-${component.name}-${Math.random()
            .toString(36)
            .substr(2, 10)}`;
        // 插入到文档最后
        document.body.appendChild(node);
        // 挂载
        const VueChild = Vue.extend(component);
        return new VueChild().$mount("#" + node.id);
    };

    // Vue.component('VPrompt', Prompt);
    // document.createDocumentFragment()
    var DialogRootComponent = Vue.extend(DialogRoot);
    // 创建一个挂载点
    var node = document.createElement("div");
    // 起个不重复的名字
    node.id = "_app-dialog-" + Math.ceil(Math.random());
    document.body.appendChild(node);
    // 挂载
    var vm = new DialogRootComponent().$mount("#" + node.id);
    // =================================================
    // ==============组件内调用: this.$alert==============
    // =================================================
    Vue.prototype.$alert = (text = "", options = {}) => {
        return new Promise((resolve, reject) => {
            vm.mask.show = true;
            vm.alert = {
                ...vm.alert,
                ...options,
                ok: () => {
                    vm.mask.show = false;
                    resolve();
                },
                show: true,
                text
            };
        });
    };
    // =================================================
    // ==============组件内调用: this.$confirm============
    // =================================================
    Vue.prototype.$confirm = (text = "", options = {}) => {
        return new Promise((resolve, reject) => {
            vm.mask.show = true;
            vm.confirm = {
                ...vm.confirm,
                ...options,
                ok: () => {
                    vm.mask.show = false;
                    resolve(true);
                },
                cancel: () => {
                    vm.mask.show = false;
                    reject(false);
                },
                show: true,
                text
            };
        });
    };

    // =================================================
    // ==============组件内调用: this.$prompt============
    // =================================================
    Vue.prototype.$prompt = Vue.prototype.$input = (
        text = "",
        options = {}
    ) => {
        return new Promise((resolve, reject) => {
            vm.mask.show = true;
            vm.prompt = {
                ...vm.prompt,
                ...options,
                ok: () => {
                    vm.mask.show = false;
                    resolve(vm.prompt.value);
                },
                cancel: () => {
                    vm.mask.show = false;
                    reject();
                },
                show: true,
                text
            };
        });
    };
    // ========================================== mask ==================================
    Vue.prototype.$mask = (options = {}) => {
        vm.mask.show = true;
    };

    // ========================================== loading ==================================
    Vue.prototype.$loading = () => {
        const LoadingVM = createVueChild(Loading);
        LoadingVM.isShow = true;
        return LoadingVM;
    };
    // ==========================================toast==================================
    Vue.prototype.$toast = (text = "", options = {}) => {
        const toastVM = createVueChild(Toast);
        toastVM.type = options.type || "default";
        toastVM.position = options.position || "center";

        toastVM.isShow = true;
        toastVM.text = text;
        toastVM.delay = options.delay || toastVM.delay;
        return toastVM;
    };
};

export default Atom;
