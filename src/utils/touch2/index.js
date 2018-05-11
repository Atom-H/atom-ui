/**
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * rotate 旋转
 * pinch 捏合
 * tap 单机
 * doubleTap 双击
 * press 按压
 * pan 拖拽
 * swipe 快速划过
 * touchStart
 * touchMove
 * touchEnd
 */
import {
    getVLength,
    getDotProduct,
    getRadian,
    getCross,
    getAngle
} from './vector.js'


// *** 注意: touch-action未兼容

export default class Touch2 {
    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el, {
        isPreventDefault = true,
        isStopPropagation = false
    } = {}) {
        this.el = el;
        this.$fingerInput = {}; // 手势产生的数据
        this.action = '';
        this.isPreventDefault = isPreventDefault;
        this.isStopPropagation = isStopPropagation;

        // timeout
        this.pressTimeout = null;
        this.swipeTimeout = null;
        this.rotateTimeout = null;
        this.pinchTimeout = null;

        // this.disablePanTimeout = null;
        // this.disableSwipeTimeout = null;

        // disabled
        this.isPanDisabled = false;
        this.isSwipeDisabled = false;

        // 各个手势对应的handle集合
        this.handleMap = {};

        // 替换事件中的this(元素)为class
        this.touchstart = this.touchStartHandle.bind(this);
        this.touchmove = this.touchMoveHandle.bind(this);
        this.touchend = this.touchEndHandle.bind(this);
        this.touchcancel = this.touchEndHandle.bind(this);

        // 绑定事件
        el.addEventListener('touchstart', this.touchstart);
        el.addEventListener('touchmove', this.touchmove);
        el.addEventListener('touchend', this.touchend);
        el.addEventListener('touchcancel', this.touchcancel);


        // el.addEventListener('mousedown', this.touchstart);
        // el.addEventListener('mouseup', this.touchend);
    }

    /**
     * start阶段, 主要记录初始位置信息
     * @param {Event} e 
     */
    touchStartHandle(e) {
        if (this.isPreventDefault) e.preventDefault();
        if (this.isStopPropagation) e.stopPropagation();
        const points = e.touches;
        const pointCount = points.length;

        // 整合手势数据
        this.$fingerInput.timestamp = Date.now();
        this.$fingerInput.startTimestamp = this.$fingerInput.timestamp;
        this.$fingerInput.points = points;
        this.$fingerInput.pointCount = pointCount;
        this.$fingerInput.startPoints = points; // 存储起始点
        this.$fingerInput.prevPoints = undefined;
        
        // 单/多点触碰
        if (1 === this.$fingerInput.pointCount) {
            this.isPanDisabled = false;
            this.isSwipeDisabled = false;
            // 单点
            // 识别[press]
            this.pressTimeout = setTimeout(() => {
                this.emit('press', {
                    type: 'press',
                    nativeEvent: e
                }, e);
            }, 251);
        } else {
            // 多点
            this.$fingerInput.startV = {
                x: this.$fingerInput.startPoints[1].pageX - this.$fingerInput.startPoints[0].pageX,
                y: this.$fingerInput.startPoints[1].pageY - this.$fingerInput.startPoints[0].pageY
            }; // 起始向量
            this.$fingerInput.startVModule = getVLength(this.$fingerInput.startV); // 起始向量模

            // 每次单点触摸开始, 解除pan和swipe的禁用
            this.isPanDisabled = true;
            this.isSwipeDisabled = true;
        }
    }

    /**
     * touchmove事件触发
     * @param {Event} e 
     */
    touchMoveHandle(e) {
        if (this.isPreventDefault) e.preventDefault();
        if (this.isStopPropagation) e.stopPropagation();
        const points = e.touches;
        const pointCount = points.length;

        // 整合手势数据
        this.$fingerInput.timestamp = Date.now();
        this.$fingerInput.prevPoints = this.$fingerInput.points;
        this.$fingerInput.points = points; // 当前点
        this.$fingerInput.pointCount = pointCount;
        this.$fingerInput.deltaX = Math.ceil(points[0].pageX - this.$fingerInput.startPoints[0].pageX);
        this.$fingerInput.deltaY = Math.ceil(points[0].pageY - this.$fingerInput.startPoints[0].pageY);
        this.$fingerInput.absDeltaX = Math.abs(this.$fingerInput.deltaX);
        this.$fingerInput.absDeltaY = Math.abs(this.$fingerInput.deltaY);

        // 单/多点触碰
        if (1 === pointCount) {
            // 单点
            // 识别[pan]
            if (!this.isPanDisabled && (10 < this.$fingerInput.absDeltaX || 10 < this.$fingerInput.absDeltaY)) {
                this.emit('pan', {
                    type: 'pan',
                    deltaX: Math.ceil(this.$fingerInput.points[0].pageX - this.$fingerInput.prevPoints[0].pageX),
                    deltaY: Math.ceil(this.$fingerInput.points[0].pageY - this.$fingerInput.prevPoints[0].pageY),
                    nativeEvent: e
                }, e);
            }
        } else {
            // 多点
            this.isPanDisabled = true;
            this.isSwipeDisabled = true;

            let v = {
                x: points[1].pageX - points[0].pageX,
                y: points[1].pageY - points[0].pageY
            }; // 当前向量
            let vModule = getVLength(v); // 当前向量摸

            // 识别[rotate]
            let angle = getAngle(v, this.$fingerInput.startV); // 
            this.emit('rotate', {
                type: 'rotate',
                angle,
                nativeEvent: e
            }, e);

            // 识别[pinch]
            this.emit('pinch', {
                type: 'pinch',
                scale: vModule / this.$fingerInput.startVModule,
                nativeEvent: e
            }, e);

            this.$fingerInput.startV = v;
            this.$fingerInput.startVModule = vModule;
        }

        // 取消[press]
        if (9 < this.$fingerInput.absDeltaX || 9 < this.$fingerInput.absDeltaY) {
            this.cancelPress();
        }
    }

    touchEndHandle(e) {
        if (this.isPreventDefault) e.preventDefault();
        if (this.isStopPropagation) e.stopPropagation();
        const points = e.changedTouches;
        const pointCount = points.length;
        const now = Date.now();

        // 整合输入数据
        this.$fingerInput.prevPoints = points;
        this.$fingerInput.endPoints = points;
        this.$fingerInput.offsetX = this.$fingerInput.endPoints[0].pageX - this.$fingerInput.startPoints[0].pageX; // 距离起点的偏移
        this.$fingerInput.offsetY = this.$fingerInput.endPoints[0].pageY - this.$fingerInput.startPoints[0].pageY;
        this.$fingerInput.absOffsetX = Math.abs(this.$fingerInput.offsetX);
        this.$fingerInput.absOffsetY = Math.abs(this.$fingerInput.offsetY);
        this.$fingerInput.offsetTime = now - this.$fingerInput.startTimestamp;
        this.$fingerInput.timestamp = now;
        this.$fingerInput.velocityX = this.$fingerInput.offsetX / this.$fingerInput.offsetTime;
        this.$fingerInput.velocityY = this.$fingerInput.offsetY / this.$fingerInput.offsetTime;
        this.$fingerInput.absVelocityX = Math.abs(this.$fingerInput.velocityX);
        this.$fingerInput.absVelocityY = Math.abs(this.$fingerInput.velocityY);


        // 当有手指移开的时候, 接触swipe/pan禁用
        setTimeout(() => {
            this.isPanDisabled = false;
            this.isSwipeDisabled = false;
        }, 100);

        // 判断是否[panend]
        if (['panstart', 'panmove'].includes(this.action)) {
            this.action = 'panend'
            this.emit('panend', {
                type: 'panend',
                naiveEvent: e
            }, e)
        }
        // 判断是否[tap](单击)
        if (250 > this.$fingerInput.offsetTime && 2 > this.$fingerInput.absOffsetX && 2 > this.$fingerInput.absOffsetY) {
            this.cancelPress();
            // 如果没有这个setTimeout, 那么当短促点击的时候, click事件就不触发了
            this.emit('tap', {
                type: 'tap'
            }, e);
        }

log(this.$fingerInput.offsetTime ,this.$fingerInput.absVelocityX , this.$fingerInput.absVelocityY)
        // 判断是否[swipe]
        if (!this.isSwipeDisabled && 250 > this.$fingerInput.offsetTime && (0.3 < this.$fingerInput.absVelocityX || 0.3 < this.$fingerInput.absVelocityY)) {
            this.emit('swipe', {
                type: 'swipe',
                velocityX: this.$fingerInput.absVelocityX,
                velocityY: this.$fingerInput.absVelocityY,
                deltaX: this.$fingerInput.offsetX,
                deltaY: this.$fingerInput.offsetY,
                nativeEvent: e
            }, e);
        }
    }

    touchCancelHandle(e) {
        this.cancelAll();
    }

    /**
     * "-"格式转成驼峰格式
     * @param {String} string 
     */
    camelize(string) {
        var camelizeRE = /-(\w)/g;
        return string.replace(camelizeRE, word => {
            return word.toLocaleUpperCase().slice(1)
        });
    }

    /**
     * 绑定事件
     * @param {String} 事件名 
     * @param {Function} handle 
     */
    on(eventName, handle) {
        this.handleMap[this.camelize(eventName)] = handle
        // this[`${this.camelize(eventName)}Handle`] = handle;
    }

    /**
     * 解除绑定事件
     * @param {String} 事件名 
     * @param {Function} handle 
     */
    off(eventName, handle) {
        this[`${eventName}Handle`] = () => {};
    }

    destory() {
        this.el.removeEventListener('touchstart', this.touchstart);
        this.el.removeEventListener('touchmove', this.touchmove);
        this.el.removeEventListener('touchend', this.touchend);
        this.el.removeEventListener('touchcancel', this.touchcancel);
        this.cancelAll();
    }

    cancelPress() {
        clearTimeout(this.pressTimeout);
        this.pressTimeout = null;
    }


    cancelAll() {
        this.cancelPress();
    }

    emit(eventName, payload, e) {
        if (undefined !== this.handleMap[eventName]) {
            this.handleMap[eventName](payload, e);
        }
    }

    clonePoints(points){
        let clonePoints = [];
        for(let point of points) {
            clonePoints.push({
                pageX: point.pageX,
                pageY: point.pageY,
            });
        }
        return clonePoints
    }
}