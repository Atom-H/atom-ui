<template>
    <main class="fill">
        <a-cell>
            <a-loading :type="theme" name="android"/>
        </a-cell>

        <a-cell>
            <a-loading :type="theme" name="ripple"/>
        </a-cell>

        <a-cell>
            <a-loading :type="theme" name="three-dots"/>
        </a-cell>
        <section class="fill-top fill-bottom">
            <a-radio inline v-model="theme" value="primary" class="fill-sm">primary</a-radio>
            <a-radio inline v-model="theme" value="success" class="fill-sm">success</a-radio>
            <a-radio inline v-model="theme" value="info" class="fill-sm">info</a-radio>
            <a-radio inline v-model="theme" value="warning" class="fill-sm">warning</a-radio>
        </section>
        <a-button @click="open">this.$loading(), 3秒后自动关闭</a-button>
    </main>
</template>
<script>
import ALoading from '@/packages/Loading';
export default {
    name: 'LoadingDemo',

    components: { ALoading },

    data() {
        return { theme: 'primary' };
    },

    methods: {
        open() {
            this.$loading('加载中');
            setTimeout(() => {
                this.$loading.close();
            }, 3000);
        },
    },
};
</script>
<style scoped lang="scss">
</style>
