<template>
<div>
  <h1>{{ pageTitle }}</h1>
  <b-container class="frac-condition">
    <b-row align-v="center">
      <b-col>
        <b-form-group>
        <b-form-radio-group
          id="type-radios"
          v-model="type_selected"
          :options="type_options"
          buttons
          button-variant="outline-primary"
          name="radio-btn-type"
          @change="clear()"
        ></b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button variant="primary" @click="createPractice">問題をつくる</b-button>
      </b-col>
      <b-col>
        <b-button variant="danger" @click="createAnswer" :disabled="answer_disabled">答えあわせ</b-button>
      </b-col>
    </b-row>
  </b-container>
  <b-container class="frac-practice" v-if="denominator !== 0">
    <b-row><b-col></b-col></b-row>
    <b-row><b-col><vue-mathjax :formula="getFormula"></vue-mathjax></b-col></b-row>
  </b-container>
</div>
</template>

<style>
.frac-condition {
  margin: 20px;
}
.frac-practice {
  border: solid 1px #CCCCCC;
  border-radius: 5px;
  padding: 10px;
}
</style>

<script>
const WHITE_SPACE = '　'
const LT = '<'
const GT = '>'
const QUOT = '$$'
const EUQAL = '='

export default {
  name: 'Bunsu',
  data () {
    return {
      pageTitle: '分数ドリル',
      type_selected: 'compare',
      type_options: [
        { text: '大きさ比べ', value: 'compare' },
        { text: '足し算', value: 'add' },
        { text: '引き算', value: 'sub' }
      ],
      denominator: 0,
      numerator1: 0,
      mixed1: false,
      numerator2: 0,
      mixed2: false,
      operator: WHITE_SPACE,
      answer: 0,
      answer_disabled: true    }
  },
  monnted: function () {
    this.clear()
  },
  methods: {
    clear: function () {
      this.denominator = 0
      this.numerator1 = 0
      this.mixed1 = false
      this.numerator2 = 0
      this.mixed2 = false
      this.operator = WHITE_SPACE
      this.answer = 0
      this.equal = ''
      this.answer_disabled = true
    },
    createPractice: function () {
      this.clear()
      // 分母を決める
      do {
        this.denominator = Math.round(Math.random() * 10)
      } while (this.denominator < 2)
      // 分子を２つ決める
      let okFlag = false
      do {
        okFlag = false
        this.numerator1 = Math.round(Math.random() * 10 * this.denominator)
        this.mixed1 = Math.random() < 0.5 ? true : false
        this.numerator2 = Math.round(Math.random() * 10 * this.denominator)
        this.mixed2 = Math.random() < 0.5 ? true : false
        // 問題のタイプによって生成する分数に制約をかける
        switch (this.type_selected) {
          case 'compare':
            okFlag = true
            break
          case 'add':
            // 足したとき10を超えないように
            if ((this.numerator1 + this.numerator2) / this.denominator < 10) {
              okFlag = true
            }
            this.operator = '+'
            this.equal = EUQAL
            break
          case 'sub':
            // 結果がマイナスにならないように
            if (this.numerator1 - this.numerator2 > 0) {
              okFlag = true
            }
            this.operator = '-'
            this.equal = EUQAL
        }
      } while ((this.numerator1 % this.denominator === 0 && this.numerator2 % this.denominator === 0) || (this.numerator1 === 0 || this.numerator2 === 0) || !okFlag)
      this.answer_disabled = false
    },
    createAnswer: function () {
      switch (this.type_selected) {
        case 'compare':
          if (this.numerator1 === this.numerator2) {
            this.operator = EUQAL
          } else if (this.numerator1 < this.numerator2) {
            this.operator = LT
          } else {
            this.operator = GT
          }
          break
        case 'add':
          this.answer = this.numerator1 + this.numerator2
          break
        case 'sub':
          this.answer = this.numerator1 - this.numerator2
          break
      }
      this.answer_disabled = true
    },
    getFraction: function (value, bMixed) {
      // 仮分数/帯分数にして返す
      if (value % this.denominator === 0) {
        return value / this.denominator
      } else if (value < this.denominator || !bMixed) {
        return '\\frac{' + value + '}{' + this.denominator + '}'
      } else {
        return this.getMixedFraction(value)
      }
    },
    getMixedFraction: function (value) {
      return Math.floor(value / this.denominator) + '\\frac{' + value % this.denominator + '}{' + this.denominator + '}'
    }
  },
  computed: {
    getFormula: function () {
      if (this.answer !== 0) {
        return QUOT + 
          this.getFraction(this.numerator1, this.mixed1) +
          WHITE_SPACE +
          this.operator +
          WHITE_SPACE +
          this.getFraction(this.numerator2, this.mixed2) +
          WHITE_SPACE +
          this.equal +
          WHITE_SPACE +
          this.getFraction(this.answer, true) +
          QUOT  
      } else {
        return QUOT + 
          this.getFraction(this.numerator1, this.mixed1) +
          WHITE_SPACE +
          this.operator +
          WHITE_SPACE +
          this.getFraction(this.numerator2, this.mixed2) +
          WHITE_SPACE +
          this.equal +
          QUOT  
      }
    }
  }
}
</script>
