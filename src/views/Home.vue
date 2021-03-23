<template>
  <div class="home">
    <the-welcome-modal
      class="modal"
      @modalVals="fetchQuiz"
      v-if="noResult && showModal"
    />
    <div
      class="quiz-wrapper"
      v-if="totalQuestions < 0 && noResult && !showModal"
    >
      Loading Quiz...
    </div>

    <div
      class="quiz-wrapper"
      v-if="totalQuestions > 0 && noResult && !showModal"
    >
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
          :style="[
            {
              'background-color': answerClass(index),
              color: isSelected ? 'white' : '',
            },
          ]"
        ></p>
      </div>

      <div class="paginate">
        <button
          v-if="presentIndex === 0"
          @click="restart"
          @keydown.enter="restart"
        >
          Restart
        </button>
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
      <button class="play-again" @click="restart" @keydown.enter="restart">
        Play Again
      </button>
    </div>
  </div>
</template>

<script>
import x from "@/utils/services/RequestHelpers.js";
import _ from "lodash";
import TheWelcomeModal from "../components/TheWelcomeModal.vue";

export default {
  name: "Home",
  components: { TheWelcomeModal },

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
      correctIndex: null,
      noResult: true,
      showModal: true,
    };
  },

  watch: {
    presentIndex() {
      this.isSelected = false;
      this.selectedIndex = null;
      this.shuffleOptions();
      this.answerClass();
    },
  },

  methods: {
    restart() {
      this.showModal = true;
      this.noResult = true;
    },

    async fetchQuiz(amount, category, difficulty, options_type) {
      this.showModal = false;
      console.log(amount, category, difficulty, options_type);
      try {
        this.presentIndex = 0;
        // this.noResult = true;
        this.answered = 0;
        this.score = 0;
        const { data } = await x.getQuestions(
          amount,
          category,
          difficulty,
          options_type
        );
        console.log(data);
        if ([0].includes(data.response_code)) {
          this.quizzes = data.results;
          this.shuffleOptions();
        }
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
        k = "var(--github-green-light)";
      } else if (
        this.isSelected &&
        this.selectedIndex === index &&
        this.correctIndex !== index
      ) {
        k = "red";
      } else if (this.isSelected && this.correctIndex !== index) {
        k = "var(--github-red)";
      }
      return k;
    },

    gradeCheck() {
      let colour = "";
      switch (this.questionDifficulty) {
        case "hard":
          colour = "red";
          break;
        case "medium":
          colour = "green";
          break;
        case "easy":
          colour = "gray";
          break;
        default:
      }
      return colour;
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
      return Math.floor((this.score / this.totalQuestions) * 100);
    },
  },
};
</script>

<style scoped>
.home {
  position: relative;
  height: 97vh;
}

.modal,
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
  box-shadow: 10px 10px 30px #bebebe, -10px -10px 30px #ffffff;
}

.modal,
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
  max-width: 100%;
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
}

.progress {
  background: black;
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
  .modal,
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
  .modal,
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
