<template>
    <a-star :size="size" :status="0"/>
</template>

<script>
import AStar from './Star';
export default {
    name: 'AtomIconStarO',

    components: {AStar},

    props: {
        size: {
            default: 48
        }
    }
};
</script>