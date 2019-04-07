<template>
<div>
  <h1>{{ pageTitle }}</h1>
  <b-container class="mul-condition">
    <b-row align-v="center">
      <b-col sm="3">
        掛けられる数:
      </b-col>
      <b-col sm="9">
        <b-form-select v-model="multiplicand_digits" :options="multiplicand_options" v-on:change="clear"></b-form-select>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col sm="3">
        掛ける数:
      </b-col>
      <b-col sm="9">
        <b-form-select v-model="multiplier_digits" :options="multiplier_options"></b-form-select>
      </b-col>
    </b-row>
    <b-row class="mul-commands" align-v="center">
      <b-col>
        <b-button variant="primary" @click="createPractice">問題をつくる</b-button>
      </b-col>
      <b-col>
        <b-button variant="danger" @click="createAnswer" :disabled="answer_disabled">答えあわせ</b-button>
      </b-col>
    </b-row>
  </b-container>
  <b-container sm="6" class="mul-practice" v-if="multiplier !== 0">
    <b-row><b-col class="text-right">
      <span class="multiplicand">{{ toFullWidth_multiplicand }}</span>
    </b-col></b-row>
    <b-row><b-col class="text-right">
      <span class="multiplier">×&emsp;{{ toFullWidth_multiplier }}</span>
    </b-col></b-row>
    <b-row v-for="(item, key) in multiplier_array" v-if="product > 0" ><b-col class="text-right">
      <b-row><b-col class="text-right">
        <span>{{ toFullWidth_tochu(key) }}</span>
      </b-col></b-row>
    </b-col></b-row>
    <b-row v-if="product > 0"><b-col class="text-right">
      <span class="product">{{ toFullWidth_product }}</span>
    </b-col></b-row>
  </b-container>
</div>
</template>

<style>
.mul-condition {
  margin: 20px;
}
.mul-practice {
  border: solid 1px #CCCCCC;
  border-radius: 5px;
}
.mul-commands {
  margin-top: 20px;
}
.multiplier {
  border-bottom: solid 1px #000000;
}
.product {
  border-top: solid 1px #000000;
}
</style>

<script>
const WHITES_PACE = '　'

export default {
  name: 'Kakezan',
  data () {
    return {
      pageTitle: '掛け算ドリル',
      multiplicand: 0,
      multiplicand_digits: 3,
      multiplicand_options: [
        { value: 4, text: '４ケタ' },
        { value: 3, text: '３ケタ' },
        { value: 2, text: '２ケタ' }
      ],
      multiplier: 0,
      multiplier_digits: 2,
      multiplier_options: [
        { value: 3, text: '３ケタ' },
        { value: 2, text: '２ケタ' },
        { value: 1, text: '１ケタ' }
      ],
      multiplier_array: [],
      multiplicand_array: [],
      product: 0,
      answer_disabled: false
    }
  },
  mounted: function () {
    this.clear()
  },
  methods: {
    clear: function () {
      this.product = 0
      this.multiplicand = 0
      this.multiplier = 0
      this.multiplier_array = []
      this.multiplicand_array = []
      this.answer_disabled = true
    },
    createPractice: function () {
      this.clear()
      do {
        this.multiplicand = Math.round(Math.random() * 10 ** this.multiplicand_digits)
      } while (checkLength(this.multiplicand) !== this.multiplicand_digits)
      do {
        this.multiplier = Math.round(Math.random() * 10 ** this.multiplier_digits)
      } while (checkLength(this.multiplier) !== this.multiplier_digits || this.multiplier === 0)
      this.answer_disabled = false
    },
    createAnswer: function () {
      this.product = this.multiplicand * this.multiplier
      this.multiplier_array = this.multiplier.toString().split('')
      this.answer_disabled = true
      // 積の配列を作ってしまう
      for(let i = 0; i < this.multiplier_array.length; i++) {
        this.multiplicand_array[i] = this.multiplicand * this.multiplier_array[i] * 10 ** (this.multiplier_array.length - 1 - i)
      }
    },
    toFullWidth_tochu: function (position) {
      const ret = this.multiplicand_array[this.multiplicand_array.length - 1 - position].toString()
      console.log(ret)
      if (position > 0) {
        return toFullWidth(ret).slice(0, -position) + WHITES_PACE.repeat(position)
      } else {
        return toFullWidth(ret)
      }
    }
  },
  computed: {
    toFullWidth_multiplicand: function () {
      return toFullWidth(this.multiplicand)
    },
    toFullWidth_multiplier: function () {
      return toFullWidth(this.multiplier)
    },
    toFullWidth_product: function () {
      return toFullWidth(this.product)
    }
  }
}

// 半角数字を全角に変換
function toFullWidth (value) {
  return value.toString().replace(/./g, s => {
    return String.fromCharCode(s.charCodeAt(0) + 0xFee0)
  })
}
// 桁数をチェック
function checkLength (num) {
  return getDigits(Math.abs(num))
}
// 数値の桁数取得
function getDigits (value) {
  return value.toString().length
}
</script>
