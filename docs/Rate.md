## Rate
比例, 常用于作为评分功能, 支持v-model

### 基本使用
``` javascript
{
    data(){
        return {
            value1: 1,
            value2: 5,
        }
    },
}
```

``` html
    <div class="fill border-bottom">
        <h4>默认为宽度/高度为24px</h4>
        <a-rate  v-model="value1" :count="5" class="gutter-top-sm"/>
    </div>

    <div class="fill">
        <h4>当前value: {{value2}} | size: 16</h4>
        <a-rate v-model="value2" :size="16" :count="10" class="gutter-top-sm"/>
    </div>

    <div class="fill">
        <h4>readonly</h4>
        <a-rate :value="3" :count="10" :size="16" :is-read-only="true" class="gutter-top-sm"/>
    </div>
```

### API

##### props
| 参数 | 说明 | 类型 | 默认值 | 可选值 |是否必选
|-----------|-----------|-----------|-------------|-------------|-------------|
| value | 当前值 | `Number` | - |-|是|
| count | 总数 | `Number` | 5 |-|否|
| size | 尺寸(同时应用到宽度和高度) | `Number` | 24 |-|否|
| isReadOnly | 是否只读 | `Boolean` | `false` |-|否|

##### events

| 名称 | 说明 | 参数 | 参数类型|
|-----------|-----------|-----------|-----------|
| input | 返回当前值 |  当前值 |`Number`|