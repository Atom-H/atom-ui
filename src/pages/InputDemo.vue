<template>
    <main>
        <a-cell>
            <template slot="prepend">学 校 *</template>
            <input 
                
                class="padding-left" 
                ref="inputSchool" 
                required 
                :rules="rules" 
                placeholder="请输入学校" 
                v-model="text1"/>
                <a-icon  class="gutter-left-sm" slot="append" @click="$alert('我在append插槽中')" name="star-o" size="16" />
        </a-cell>

        <a-button >确定</a-button>

        <a-cell >
            <template slot="prepend">姓名 *</template>
            <a-input 
                class="padding-left" 
                ref="inputName" 
                required 
                :rules="rules2" 
                placeholder="请输入姓名" 
                v-model="text11">
            </a-input>
        </a-cell>

        <a-cell>
            <template slot="prepend">银行卡流水</template>
            <a-input class="padding-left" max="19" v-model="text2" type="bankCode" />
        </a-cell>

        <a-cell>
            <template slot="prepend">手 机</template>
            <a-input class="padding-left" :is-select-all="true" maxlength="13" v-model="text3" type="phone" />
        </a-cell>

        <a-cell>
            <template slot="prepend">流 水 号</template>
            <a-input class="padding-left" maxlength="13" v-model="text4" type="number">
                <template></template>
            </a-input>
        </a-cell>
        
        <a-cell>
            <template slot="prepend">仅能输入字母</template>
            <a-input class="padding-left" maxlength="13" v-model="text5" type="letter" />
        </a-cell>
        
        <a-cell>
            <template slot="prepend">自定义过滤规则(只能输入x/y/z)</template>
            <a-input class="padding-left" :filter="/[^x-z]/g" v-model="text6"/>
        </a-cell>

        <section class="fill">
            <a-button class="gutter-top" @click="validateBoth">验证学校和姓名</a-button>
            
            <a-button type="dark" class="gutter-top gutter-bottom" @click="clearValidate">重置验证</a-button>
        </section>
    </main>
</template>
<script>
export default {
    name: 'InputDemo',

    data() {
        const RULE_1 = { required: true, message: '学校不能为空!' };
        const RULE_2 = { trigger: 'keyup', minLength: 2, message: '至少2个字符!' };
        const RULE_3 = { trigger: 'keyup', maxLength: 3, message: '最多3个字符!' };
        const RULE_4 = { trigger: 'keyup', message: '值不能等于100', validator: this.isSame };
        const RULE_5 = { test: /a/, message: '必须包含a!' };
        const RULE_6 = { test: /b/, message: '必须包含b!' };
        const RULE_7 = { asyncValidator: this.asyncValidator };

        return {
            text1: '',
            text11: '',
            text2: '0000 0000 0000 0000',
            text3: '133123456789',
            text4: '01234567',
            text5: 'abc',
            text6: '',
            isShowWarning: true,
            rules: [RULE_1, RULE_2, RULE_3, RULE_4, RULE_5, RULE_6, RULE_7],
            rules2: [{ required: true, message: '姓名不能为空!' }],
        };
    },

    methods: {
        showD(){
            alert(this.text1);
        },
        /**
         * 验证学校和姓名
         */
        async validateBoth() {
            const _$refs = [this.$refs.inputSchool, this.$refs.inputName];
            for ([key, $input] of _$refs.entries()) {
                try {
                    await $input.validate();
                    this.$toast(`验证通过!`, { type: 'success' });
                } catch (error) {
                    this.$toast(`验证结果: ${error}`, { type: 'error' });
                    break;
                }
            }
        },

        clearValidate() {
            this.$refs.inputSchool.clearValidate();
            this.$refs.inputName.clearValidate();
        },

        isSame() {
            return 100 != this.text1;
        },

        /**
         * 异步验证
         */
        asyncValidator(callback) {
            setTimeout(() => {
                callback({ isPass: 'nba' != this.text1, message: '服务端不通过nba!' });
            }, 1000);
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../scss/variables.scss';
</style>
