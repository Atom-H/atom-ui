## Input
输入框, 支持v-model | 验证 | 格式化等功能

### 基本使用

``` html
    <main >
        <a-cell>
            <template slot="prepend">学 校 *</template>
            <a-input 
                class="padding-left" 
                ref="inputSchool" 
                required 
                :rules="rules" 
                placeholder="请输入学校" 
                v-model="text1">
                <a-icon  slot="append" @click="$alert('我在append插槽中')" name="menu" size="16" />
            </a-input>
        </a-cell>

        <a-cell >
            <template slot="prepend">姓名 *</template>
            <a-input 
                class="padding-left" 
                ref="inputName" 
                required 
                :rules="rules2" 
                placeholder="请输入姓名" 
                v-model="text11">
                <a-icon  slot="append" @click="$alert('我在append插槽中')" name="menu" size="16" />
            </a-input>
        </a-cell>

        <a-cell>
            <template slot="prepend">银行卡流水</template>
            <a-input class="padding-left" maxlength="19" v-model="text2" type="bankCode" />
        </a-cell>

        <a-cell>
            <template slot="prepend">手 机</template>
            <a-input class="padding-left" :is-select-all="true" maxlength="13" v-model="text3" type="phone" />
        </a-cell>

        <a-cell>
            <template slot="prepend">流 水 号</template>
            <a-input class="padding-left" maxlength="13" v-model="text4" type="number" />
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
            
            <a-button type="dark" class="gutter-top gutter-bottom" @click="clearVaildate">重置验证</a-button>
        </section>
    </main>
```

```javascript
{
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
            text6: 'abc',
            isShowWarning: true,
            rules: [RULE_1, RULE_2, RULE_3, RULE_4, RULE_5, RULE_6, RULE_7],
            rules2: [{ required: true, message: '姓名不能为空!' }],
        };
    },

    methods: {
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

        clearVaildate() {
            this.$refs.inputSchool.clearVaildate();
            this.$refs.inputName.clearVaildate();
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
}
```

### API

##### props
| 参数 | 说明 | 类型 | 默认值 | 可选值 |是否必选
|-----------|-----------|-----------|-------------|-------------|-------------|
| value | 输入值 | `String` | - |-|是|
| is-select-all | focus时候是否选中所有文字 | `Boolean` | false | - | 否 |
| type | 用来限制输入内容的格式 | `String` | - |bankCode letter phone number|否|
| clearable | 是否有清空按钮(x图标) | `Boolean` | true |-|否|
| vaildate-rules | blur触发时, 验证输入的规则 | `Array` | [] |-|否|
| has-warning-dialog | 验证不匹配的时候, 是否出现提示| `Boolean` | true |-|否|
| filter |过滤指定条件的输入| `RegExp` | - |-|否|
| rules |输入的校验规则| `Array` | - |-|否|
| has-feedback |对没通过rules验证的输入是否通过图标和文字提示| `Boolean` | false |-|否|


##### events
| 名称 | 说明 | 参数 |参数类型|
|-----------|-----------|-----------|-----------|
| input | 输入文字触发 | 输入内容 |`String`|
| focus | 聚焦 | event | `Event` |
| blur | 失去焦点 | event | `Event` |
| keyup | 按下键盘 | event | `Event` |
| keydown | 键盘弹起 | event | `Event` |
| warning | 验证不通过触发 | 提示语 | `String` |
| success | 验证通过时触发 | - | - |
| reset-vailidate | 重置验证触发 | - | - |

##### methods
| 名称 | 说明 | 参数 |参数类型|
|-----------|-----------|-----------|-----------|
| vailidate | 根据rules验证 | - |-|
| resetVailidate | 重置验证 | - | - |


##### slot
| 名称 | 说明 |
|-----------|-----------|
| prepend | 输入框前 |
| append | 输入框后 |

##### 验证规则(rules)
| 名称 | 说明  |参数类型|
|-----------|-----------|-----------|-----------|
| required | 是否必填  |`Boolean`|
| message | 不满足条件时的提示文案  | `String` |
| validator | 自定义验证函数(同步), 返回ture通过, 反之提示message信息  | `Function` |
| asyncValidator | 自定义验证函数(异步), 返回ture通过, 反之提示message信息  | `Function` |
| regular | 正则, 返回ture通过, 反之提示message信息  | `Regexp` |