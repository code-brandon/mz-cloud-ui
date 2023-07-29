<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="captchaVisible" width="375px" center>
    <div ref="slider" class="slider">
      <div class="content">
        <div ref="bgImgDiv" class="bg-img-div">
          <img id="bg-img" ref="bgImg" src="" alt />
        </div>
        <div class="slider-img-div" ref="sliderImgDiv" id="slider-img-div">
          <img id="slider-img" ref="sliderImg" src="" alt />
        </div>
      </div>
      <div class="slider-move">
        <div class="slider-move-track">拖动滑块完成拼图</div>
        <div class="slider-move-btn" ref="sliderMoveBtn" @mousedown.prevent="down" id="slider-move-btn"></div>
      </div>
      <div class="bottom">
        <div class="refresh-btn" @click="refreshCaptcha" id="slider-refresh-btn"></div>
        <div class="close-btn" @click="captchaVisible = false" id="slider-refresh-btn"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {check, gen} from '@/api/common/captcha.js'

export default {
  name: 'CaptchaDialog',
  data() {
    return {
      captchaVisible: false,
      currentCaptchaConfig: Object,
      isPrintLog: false,
      slider: Object,
      sliderMoveBtn: Object,
      sliderImgDiv: Object,
      bgImgDiv: Object,
      bgImg: Object,
      sliderImg: Object,
    }
  },
  methods: {
    printLog(...params) {
      if (this.isPrintLog) {
        console.log(JSON.stringify(params))
      }
    },

    initConfig(bgImageWidth, bgImageHeight, sliderImageWidth, sliderImageHeight, end) {
      this.currentCaptchaConfig = {
        startTime: new Date(),
        trackArr: [],
        movePercent: 0,
        bgImageWidth,
        bgImageHeight,
        sliderImageWidth,
        sliderImageHeight,
        end,
      }
      this.printLog('init', this.currentCaptchaConfig)
    },

    down(event) {
      let targetTouches = event.originalEvent ? event.originalEvent.targetTouches : event.targetTouches
      let startX = event.pageX
      let startY = event.pageY
      if (startX === undefined) {
        startX = Math.round(targetTouches[0].pageX)
        startY = Math.round(targetTouches[0].pageY)
      }
      this.currentCaptchaConfig.startX = startX
      this.currentCaptchaConfig.startY = startY

      const pageX = this.currentCaptchaConfig.startX
      const pageY = this.currentCaptchaConfig.startY
      const startTime = this.currentCaptchaConfig.startTime
      const trackArr = this.currentCaptchaConfig.trackArr
      trackArr.push({
        x: pageX - startX,
        y: pageY - startY,
        type: 'down',
        t: new Date().getTime() - startTime.getTime(),
      })
      this.printLog('start', startX, startY)
      // pc
      window.addEventListener('mousemove', this.move)
      window.addEventListener('mouseup', this.up)
      // 手机端
      window.addEventListener('touchmove', this.move, false)
      window.addEventListener('touchend', this.up, false)
      this.doDown(this.currentCaptchaConfig)
    },

    move(event) {
      if (event instanceof TouchEvent) {
        event = event.touches[0]
      }
      let pageX = Math.round(event.pageX)
      let pageY = Math.round(event.pageY)
      const startX = this.currentCaptchaConfig.startX
      const startY = this.currentCaptchaConfig.startY
      const startTime = this.currentCaptchaConfig.startTime
      const end = this.currentCaptchaConfig.end
      const bgImageWidth = this.currentCaptchaConfig.bgImageWidth
      const trackArr = this.currentCaptchaConfig.trackArr
      let moveX = pageX - startX
      const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: 'move',
        t: new Date().getTime() - startTime.getTime(),
      }
      trackArr.push(track)
      if (moveX < 0) {
        moveX = 0
      } else if (moveX > end) {
        moveX = end
      }
      this.currentCaptchaConfig.moveX = moveX
      this.currentCaptchaConfig.movePercent = moveX / bgImageWidth
      this.doMove(this.currentCaptchaConfig)
      this.printLog('move', track)
    },

    up(event) {
      window.removeEventListener('mousemove', this.move)
      window.removeEventListener('mouseup', this.up)
      window.removeEventListener('touchmove', this.move)
      window.removeEventListener('touchend', this.up)
      if (event instanceof TouchEvent) {
        event = event.changedTouches[0]
      }
      this.currentCaptchaConfig.stopTime = new Date()
      let pageX = Math.round(event.pageX)
      let pageY = Math.round(event.pageY)
      const startX = this.currentCaptchaConfig.startX
      const startY = this.currentCaptchaConfig.startY
      const startTime = this.currentCaptchaConfig.startTime
      const trackArr = this.currentCaptchaConfig.trackArr
      const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: 'up',
        t: new Date().getTime() - startTime.getTime(),
      }
      trackArr.push(track)
      this.printLog('up', track)
      this.valid(this.currentCaptchaConfig)
    },

    valid(captchaConfig) {
      let data = {
        bgImageWidth: captchaConfig.bgImageWidth,
        bgImageHeight: captchaConfig.bgImageHeight,
        sliderImageWidth: captchaConfig.sliderImageWidth,
        sliderImageHeight: captchaConfig.sliderImageHeight,
        startSlidingTime: captchaConfig.startTime,
        entSlidingTime: captchaConfig.stopTime,
        trackList: captchaConfig.trackArr,
      }
      check(this.currentCaptchaId, data).then(({ data }) => {
        if (data) {
          alert('验证成功!!!')
        }
        this.refreshCaptcha()
      })
    },
    refreshCaptcha() {
      gen()
        .then(({ data }) => {
          this.reset()
          this.currentCaptchaId = data.id

          const bgImg = this.bgImg
          const sliderImg = this.sliderImg
          bgImg.src = data.captcha.backgroundImage
          sliderImg.src = data.captcha.sliderImage

          this.initConfig(bgImg.width, bgImg.height, sliderImg.width, sliderImg.height, bgImg.width - 66)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    doDown() {
      this.sliderMoveBtn.style.backgroundPosition = '-5px 31.0092%'
    },
    doMove(currentCaptchaConfig) {
      const moveX = currentCaptchaConfig.moveX
      this.sliderMoveBtn.style.transform = 'translate(' + moveX + 'px, 0px)'
      this.sliderImgDiv.style.transform = 'translate(' + moveX + 'px, 0px)'
    },
    reset() {
      this.sliderMoveBtn.style.backgroundPosition = '-5px 11.79625%'
      this.sliderMoveBtn.style.transform = 'translate(0px, 0px)'
      this.sliderImgDiv.style.transform = 'translate(0px, 0px)'
      this.currentCaptchaId = null
    },
    init() {
      this.captchaVisible = true
      this.$nextTick(() => {
        this.slider = this.$refs.slider
        this.sliderMoveBtn = this.$refs.sliderMoveBtn
        this.sliderImgDiv = this.$refs.sliderImgDiv
        this.bgImgDiv = this.$refs.bgImgDiv
        this.bgImg = this.$refs.bgImg
        this.sliderImg = this.$refs.sliderImg
        // this.clearAllPreventDefault(this.slider);
        this.refreshCaptcha()
      })
    },
  },
  mounted() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slider {
  background-color: #fff;
  width: 375px;
  /*height: 285px;*/
  z-index: 999;
  box-sizing: border-box;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
}

.slider .content {
  width: 100%;
  height: 218px;
  position: relative;
}

.bg-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.slider-img-div {
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.bg-img-div img {
  width: 100%;
}

.slider-img-div img {
  height: 100%;
}

.slider .slider-move {
  height: 38px;
  width: 100%;
  margin: 11px 0;
  position: relative;
}

.slider .bottom {
  height: 19px;
  width: 100%;
}
.slider-move-track {
  background: blanchedalmond;
  border-radius: 12px;
  /*text-align: center;*/
  /*line-height: 38px;*/
}

.refresh-btn,
.close-btn,
.slider-move-btn {
  background: url(@/assets/images/captcha-slider.png) no-repeat;
}

.refresh-btn,
.close-btn {
  display: inline-block;
}

.slider-move .slider-move-track {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.slider {
  user-select: none;
}

.slider-move .slider-move-btn {
  transform: translate(0px, 0px);
  background-position: -5px 11.79625%;
  position: absolute;
  top: -12px;
  left: 0;
  width: 66px;
  height: 66px;
}

.slider-move-btn:hover,
.close-btn:hover,
.refresh-btn:hover {
  cursor: pointer;
}
.bottom {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.bottom .close-btn {
  width: 20px;
  height: 20px;
  background-position: 0 44.86874%;
}

.bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-position: 0 81.38425%;
}
/deep/ .el-dialog__header,
/deep/ .el-dialog__body {
  padding: 0 !important;
}
</style>
