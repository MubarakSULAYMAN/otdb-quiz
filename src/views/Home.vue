<template>
  <div class="home">
    <div class="quiz-wrapper" v-if="totalQuestions < 0">Loading Quiz...</div>

    <div class="quiz-wrapper" v-if="totalQuestions > 0 && noResult">
      <div class="span-group">
        <span>Score</span>
        <span>Answered</span>
        <span>Difficulty</span>
      </div>
      <div class="span-group">
        <span>{{ score }} / {{ totalQuestions }}</span>
        <span>{{ answered }} / {{ totalQuestions }}</span>
        <span class="tag" :style="{ color: difficultyGrade }">{{
          questionDifficulty
        }}</span>
      </div>
      <p class="title">Question {{ currentNum }} of {{ totalQuestions }}</p>
      <p class="question" v-html="currentQuestion"></p>
      <!-- :class="answerClass(index)" -->
      <!-- :class="answerClass(index)" -->
      <div
        class="options"
        v-for="(option, index) in allOptions"
        :key="option.index"
      >
        <p
          tabindex="0"
          v-html="option"
          @click="getVal(index)"
          :class="[{ inactive: isSelected }]"
          :style="[{ 'background-color': answerClass(index) }]"
        ></p>
        <!-- :style="{ width: scorePercent + '%' }" -->
      </div>

      <div class="paginate">
        <button
          v-if="presentIndex === 0"
          @click="fetchQuiz"
          @keydown.enter="fetchQuiz"
        >
          Refresh
        </button>
        <!-- <button
          v-if="presentIndex > 0"
          @click="previousQuestion"
          @keydown.enter="previousQuestion"
        >
          Previous
        </button> -->
        <button
          v-if="presentIndex < totalQuestions - 1"
          @click="nextQuestion"
          @keydown.enter="nextQuestion"
        >
          Next
        </button>
        <button
          v-if="presentIndex === totalQuestions - 1"
          @click="noResult = !noResult"
          @keydown.enter="noResult = !noResult"
        >
          View Results
        </button>
      </div>
    </div>
    <div class="score-wrapper" v-if="!noResult">
      <p class="score-remark" v-if="scorePercent < 25">
        So unfortunate this time!!! <br />
        You scored too low.
      </p>
      <p class="score-remark" v-if="scorePercent >= 25 && scorePercent < 50">
        So sad!!! <br />
        You couldn't make the top 50%.
      </p>
      <p class="score-remark" v-if="scorePercent >= 50 && scorePercent < 75">
        So good of you!!! <br />
        You scored above average.
      </p>
      <p class="score-remark" v-if="scorePercent >= 75 && scorePercent < 99">
        What a wonderful performance!!! <br />
        You are in the top 25 percentile.
      </p>
      <p class="score-remark" v-if="scorePercent > 98">
        Fantastic!!! <br />
        So great of you to be in the top 1%.
      </p>
      <div class="score-container">
        <p class="score">
          You answered: {{ answered }} / {{ totalQuestions }} <br />
          Scored: {{ score }} / {{ totalQuestions }} <br />
          (Score in percentage: {{ scorePercent }}%)
        </p>
      </div>
      <div class="score-container">
        <div class="progress">
          <div
            class="progress-value"
            :style="{ width: scorePercent + '%' }"
          ></div>
        </div>
      </div>
      <button class="play-again" @click="fetchQuiz" @keydown.enter="fetchQuiz">
        Play Again
      </button>
    </div>
  </div>
</template>

<script>
import x from "@/utils/services/RequestHelpers.js";
import _ from "lodash";

export default {
  name: "Home",
  components: {},

  data() {
    return {
      presentIndex: 0,
      quizzes: [],
      correctOption: null,
      incorrectOptions: [],
      allOptions: [],
      selectedOption: null,
      score: 0,
      selectedIndex: null,
      isSelected: false,
      answered: 0,
      // isAnswered: false,
      correctIndex: null,
      // correctAnswer: false,
      // wrongAnswer: false,
      noResult: true,
    };
  },

  watch: {
    presentIndex() {
      this.isSelected = false;
      // this.isAnswered = false;
      this.selectedIndex = null;
      this.shuffleOptions();
      this.answerClass();
    },
  },

  methods: {
    async fetchQuiz() {
      try {
        this.presentIndex = 0;
        this.noResult = true;
        this.answered = 0;
        this.score = 0;
        // let response = await x.getQuestions(10);
        const { data } = await x.getQuestions(10);
        // console.log(response.data.results);
        this.quizzes = data.results;
        this.shuffleOptions();

        // this.quizzes = response.data.results;

        // this.correctOption =
        //   response.data.results[this.presentIndex].correct_answer;
        // this.incorrectOptions =
        //   response.data.results[this.presentIndex].incorrect_answers;
        // console.log(this.incorrectOptions);
        // let combinedOptions = [...this.incorrectOptions, this.correctOption];
        // this.allOptions = _.shuffle(combinedOptions);
        // console.log(this.allOptions);
        // console.log(combinedOptions);
        // this.correctIndex = combinedOptions.indexOf(this.correctOption);
        // console.log(this.correctIndex);

        // if ([200, 201].includes()) {}
      } catch (e) {
        console.log(e);
      }
    },

    shuffleOptions() {
      this.correctOption = this.quizzes[this.presentIndex].correct_answer;
      const combinedOptions = [
        ...this.quizzes[this.presentIndex].incorrect_answers,
        this.correctOption,
      ];
      console.log(combinedOptions);
      this.allOptions = _.shuffle(combinedOptions);
      console.log(this.allOptions);
      this.correctIndex = this.allOptions.indexOf(this.correctOption);
      console.log("Correct index: ", this.correctIndex);
    },

    previousQuestion() {
      this.presentIndex--;
    },

    nextQuestion() {
      this.presentIndex++;
      // this.presentIndex = this.presentIndex + 1;
    },

    getVal(index) {
      this.selectedIndex = index;
      console.log(index);
      this.isSelected = true;
      this.answered++;

      if (this.selectedIndex === this.correctIndex) {
        this.score++;
      }
    },

    answerClass(index) {
      let k = "";
      if (!this.isSelected && this.selectedIndex === index) {
        k = "selected";
      } else if (this.isSelected && this.correctIndex === index) {
        // k = "is-right";
        k = "var(--github-green-light)";
      } else if (
        this.isSelected &&
        this.selectedIndex === index &&
        this.correctIndex !== index
      ) {
        // k = "is-wrong";
        k = "red";
      } else if (
        this.isSelected &&
        this.correctIndex !== index
      ) {
        // k = "is-wrong";
        k = "var(--github-red)";
      }
      return k;
    },

    gradeCheck() {
      let colour = '';

      if (this.questionDifficulty.includes("hard")) {
        colour = "red";
      }

      if (this.questionDifficulty.includes("medium")) {
        colour = "green";
      }

      if (this.questionDifficulty.includes("easy")) {
        colour = "gray";
      }

      return colour;
      // let colour = '';
      // switch (this.questionDifficulty.toLowercase()) {
      //   case x:
      //     colour = 'var(--github-green'
      //     break;
      //   case y:
      //     // code block
      //     break;
      //   default:
      //   colour = 'var(--github-green'
      // }
    },
  },

  computed: {
    currentQuestion() {
      return this.quizzes[this.presentIndex].question;
    },

    questionDifficulty() {
      return this.quizzes[this.presentIndex].difficulty;
    },

    difficultyGrade() {
      return this.gradeCheck();
    },

    currentNum() {
      return this.presentIndex + 1;
    },

    totalQuestions() {
      return this.quizzes.length;
    },

    scorePercent() {
      // return parseInt(parseInt(this.score) / parseInt(this.totalQuestions)).floor * 100;
      return Math.floor((this.score / this.totalQuestions) * 100);
    },
  },

  created() {
    return this.fetchQuiz();
  },
};
</script>

<style scoped>
.home {
  position: relative;
  height: 97vh;
}

.quiz-wrapper,
.score-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: fit-content;
  height: -moz-fit-content;
  height: max-content;
  padding: 10px;
  border: 5px solid var(--github-lighter-blue-fade);
  border-radius: 10px;
}

.score-wrapper {
  border-color: var(--github-purple);
}

.span-group {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 600;
}

.tag {
  text-transform: uppercase;
}

.title {
  color: var(--github-blue);
  font-weight: 900;
  font-size: 16px;
}

.question {
  font-weight: 500;
  font-size: 14px;
}

p {
  margin-bottom: 10px;
}

.options p {
  width: fit-content;
  width: -moz-fit-content;
  width: max-content;
  padding: 5px 15px;
  border-radius: 15px;
  background-color: var(--github-gray-light);
}

.options p:hover {
  background-color: var(--github-gray-dark);
}

.options p:hover,
.selected {
  color: var(--github-white);
  cursor: default;
}

/* .selected {
  border-color: var(--github-blue);
  background-color: var(--github-blue);
  box-shadow: 0 0 0 3px var(--github-lighter-blue);
  outline: none;
} */

/* .is-right {
  background-color: var(--github-green);
}

.is-wrong {
  background-color: var(--github-red);
} */

.inactive {
  cursor: none;
  pointer-events: none;
}

.paginate {
  display: flex;
  justify-content: space-evenly;
}

button {
  padding: 7px 15px;
  border-radius: 15px;
  color: var(--github-white);
  background-color: var(--github-pink);
  font-weight: 500;
  border: none;
}

button:hover,
button:focus {
  background-color: var(--github-orange);
}

.score-remark,
.score-card {
  font-size: 40px;
  font-weight: 700;
}

.score-container {
  display: flex;
  justify-content: center;
  /* font-size: 40px;
  font-weight: 700; */
}

.progress {
  background: var(--github-black);
  justify-content: flex-start;
  border-radius: 100px;
  align-items: center;
  position: relative;
  padding: 0 5px;
  display: flex;
  height: 40px;
  width: 500px;
}

.progress-value {
  /* animation: load 3s normal forwards; */
  box-shadow: 0 10px 40px -10px var(--github-yellow);
  border-radius: 100px;
  background: var(--github-yellow);
  height: 30px;
  width: 0;
}

/* @keyframes load {
  0% {
    width: 0;
  }
  100% {
    width: 68%;
  }
} */

.play-again {
  margin-top: 20px;
}

@media only screen and (max-width: 768px) {
  .quiz-wrapper,
  .score-wrapper {
    width: 600px;
  }

  .score-remark,
  .score-card {
    font-size: 30px;
  }
}

@media only screen and (max-width: 425px) {
  .quiz-wrapper,
  .score-wrapper {
    width: 300px;
  }

  .score-remark,
  .score-card {
    font-size: 20px;
  }
}
</style>
