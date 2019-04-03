<template>
<div>
  <h1>{{ pageTitle }}</h1>
  <b-container class="div-condition">
    <b-row align-v="center">
      <b-col sm="3">
        割られる数:
      </b-col>
      <b-col sm="9">
        <b-form-select v-model="warareru_keta" :options="warereru_options"></b-form-select>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col sm="3">
        割る数:
      </b-col>
      <b-col sm="9">
        <b-form-select v-model="waru_keta" :options="waru_options"></b-form-select>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col sm="3">
        <label>あまり</label>
      </b-col>
      <b-col sm="9">
        <b-form-group>
        <b-form-radio-group
          id="amari-radios"
          v-model="amari_selected"
          :options="amari_options"
          buttons
          button-variant="outline-primary"
          name="radio-btn-amari"
        ></b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col>
        <b-button variant="primary" @click="createPractice">問題をつくる</b-button>
      </b-col>
      <b-col>
        <b-button variant="danger" @click="createAnswer" :disabled="answer_disabled">答えあわせ</b-button>
      </b-col>
    </b-row>
  </b-container>
  <b-container sm="6" class="div-practice" v-if="warareru !== 0">
    <b-row><b-col class="text-left">
      <span v-if="sho > 0" class="calculated">{{ sho_prefix }}{{ toFullWidth_sho }}</span>
      <span v-else>&nbsp;</span>
      <span v-if="amari > 0">・・・{{ toFullWidth_amari }}</span>
    </b-col></b-row>
    <b-row><b-col class="text-left">
      <span class="divisor">{{ toFullWidth_waru }}</span>
      <span class="dividend">）{{ toFullWidth_warareru }}</span>
    </b-col></b-row>
    <b-row v-for="(item, key) in sho_array" v-if="sho > 0" ><b-col class="text-left">
      <b-row v-if="sho_array[key]!=='0'"><b-col class="text-left">
        <span>{{addWhiteSpace_tochu(item,key)}}</span><span class="sub-quotient calculated">{{ toFullWidth_tochu(item,key)}}</span>
      </b-col></b-row>
      <b-row v-if="sho_array[key + 1]!=='0'"><b-col class="text-left"><span class="sub-remainder calculated">{{ toFullWidth_tochu_subtract(item,key)}}</span></b-col></b-row>
    </b-col></b-row>
  </b-container>
</div>    
</template>

<style>
.div-condition {
  margin: 20px;
}
.div-practice {
  border: solid 1px #CCCCCC;
  border-radius: 5px;
}
.calculated {
  margin-left: 5px;
}
.dividend {
  border-top: solid 1px #000000;
}
.sub-quotient {
  border-bottom: solid 1px #000000;
}
</style>

<script>
export default {
  name: 'warizan',
  data () {
    return {
      pageTitle: '割り算ドリル',
      warareru: 0,
      warareru_keta: 4,
      warereru_options: [
          { value: 5, text: '５ケタ' },
          { value: 4, text: '４ケタ' },
          { value: 3, text: '３ケタ' },
          { value: 2, text: '２ケタ' }
      ],
      waru: 0,
      waru_keta: 2,
      waru_options: [
          { value: 3, text: '３ケタ' },
          { value: 2, text: '２ケタ' },
          { value: 1, text: '１ケタ' }
      ],
      amari_selected: false,
      amari_options: [
        { text: '余りあり', value: true },
        { text: '余りなし', value: false },
      ],
      sho: -1,
      amari: -1,
      sho_prefix: '',
      sho_array: [],
      tochu_array: [],
      tochu_seki_array: [],
      flagAmari: false,
      answer_disabled: false
    }
  },
  mounted: function() {
    this.clear()
  },
  methods: {
    clear: function () {
      this.sho = -1
      this.amari = -1
      this.sho_prefix = ''
      this.sho_array = []
      this.tochu_array = []
      this.tochu_seki_array = []
      this.answer_disabled = false
    },
    createPractice: function () {
      this.clear()
      do {
        this.warareru = Math.round(Math.random() * 10 ** this.warareru_keta)
      } while (checkLength(this.warareru) !== this.warareru_keta)
      do {
        this.waru = Math.round(Math.random() * 10 ** this.waru_keta)
      } while (checkLength(this.waru) !== this.waru_keta || this.waru <= 1)
      if (!this.amari_selected) {
          this.warareru -= this.warareru % this.waru 
      }
    },
    createAnswer: function () {
      this.sho = Math.floor(this.warareru / this.waru)
      this.amari = this.warareru % this.waru
      this.sho_prefix = addSpaceForAnswer(this.warareru, this.waru, this.sho)
      this.sho_array = this.sho.toString().split("")
      this.answer_disabled = true
      // 解答の配列を作ってしまう
      for (let i = 0; i < this.sho_array.length; i++) {
        this.tochu_seki_array[i] = this.waru * this.sho_array[i]
        let subtract = this.waru * this.sho_array[i] * 10 ** (this.sho.toString().length - i - 1)
        this.tochu_array[i] = subtract
      }
    },
    toFullWidth_tochu: function (value, position) {
      return toFullWidth(this.waru * value)
    },
    addWhiteSpace_tochu: function (value, position) {
      const prefix = '　'
      // 位置調整のための計算
      let subtract = this.waru * value * 10 ** (this.sho.toString().length - position - 1)
      let ws_pos = this.waru.toString().length 
        + 1
        + this.warareru.toString().length - subtract.toString().length
      return prefix.repeat(ws_pos)
    },
    toFullWidth_tochu_subtract: function (value, position) {
      let sub_total = this.warareru
      for(let i = 0; i < position + 1; i++) {
        sub_total -= this.tochu_array[i]
      }
      const prefix = '　'
      const ws = prefix.repeat(
        this.waru.toString().length 
        + 1
        + this.warareru.toString().length - sub_total.toString().length
      )
      // ケタがあまった場合に末尾を削る
      let checkValue = 0
      for (let pos = 1;pos <= sub_total.toString().length; pos++){
        checkValue = parseInt(sub_total.toString().slice(0,pos))
        console.log(checkValue)
        if (checkValue > this.waru) {
          break 
        }
      }
      return ws + toFullWidth(checkValue)
      // var numKetaAmari = sub_total.toString().length - (this.sho_array[position + 1] * this.waru).toString().length
      // var newValue = this.sho.toString().length - this.waru.toString().length
      // console.log('sub_total:' + sub_total)
      // console.log('numKetaAmari:' + numKetaAmari)
      // console.log('newValue:' + newValue)

      // if(numKetaAmari > 0){
      //   return ws + toFullWidth(sub_total).slice(0, -numKetaAmari)
      // } else {
      //   return ws + toFullWidth(sub_total)
      // }
    }
  },
  computed: {
      toFullWidth_warareru: function () {
          return toFullWidth(this.warareru)
      },
      toFullWidth_waru: function () {
          return toFullWidth(this.waru)
      },
      toFullWidth_sho: function () {
          return toFullWidth(this.sho)
      },
      toFullWidth_amari: function () {
          return toFullWidth(this.amari)
      }
  }
}

// 半角数字を全角に変換
function toFullWidth(value) {
  return value.toString().replace(/./g, s => {
    return String.fromCharCode(s.charCodeAt(0) + 0xFee0)
  })
}
// 桁数をチェック
function checkLength(num) {
    return Math.abs(num).toString().length;
}
// 桁あわせ（答え）
function addSpaceForAnswer(warareru, waru, sho) {
    const ws = '　'
    let length = warareru.toString().length
                 + waru.toString().length
                 - sho.toString().length
                 + 1
    return ws.repeat(length)
}

</script>
