<template>
  <div class="home">
    <div class="quiz-wrapper" v-if="totalQuestions > 0">
      <div class="span-group">
        <span>Score</span>
        <span>Answered</span>
        <span>Difficulty</span>
      </div>
      <div class="span-group">
        <span>{{ score }} / {{ totalQuestions }}</span>
        <span>{{ answered }} / {{ totalQuestions }}</span>
        <span class="tag">{{ questionDifficulty }}</span>
      </div>
      <p class="title">Question {{ currentNum }} of {{ totalQuestions }}</p>
      <p class="question" v-html="currentQuestion"></p>
      <div
        class="options"
        v-for="(option, index) in allOptions"
        :key="option.index"
      >
        <p
          :class="{ selected: isSelected && selectedIndex === index }"
          tabindex="0"
          v-html="option"
          @click="getVal(index)"
        ></p>

        <!-- :class="{
            selected: 'selected === true',
            isRight: 'correctAnswer === true',
            isWrong: 'wrongAnswer === true',
          }" -->
      </div>

      <div class="paginate">
        <button v-if="presentIndex === 0" @click="fetchQuiz">Refresh</button>
        <button v-if="presentIndex > 0" @click="previousQuestion">
          Previous
        </button>
        <button v-if="presentIndex < totalQuestions - 1" @click="nextQuestion">
          Next
        </button>
        <button v-if="presentIndex === totalQuestions - 1" @click="showResults">
          View Results
        </button>
      </div>
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
      // allOptions: [],
      selectedOption: null,
      score: 0,
      selectedIndex: null,
      isSelected: false,
      answered: 0,
      correctIndex: null,
      correctAnswer: false,
      wrongAnswer: false,
    };
  },

  methods: {
    async fetchQuiz() {
      try {
        let response = await x.getQuestions(10);
        // console.log(response);
        console.log(response.data.results);

        this.quizzes = response.data.results;

        this.correctOption =
          response.data.results[this.presentIndex].correct_answer;
        this.incorrectOptions =
          response.data.results[this.presentIndex].incorrect_answers;
        console.log(this.incorrectOptions);
        let combinedOptions = [...this.incorrectOptions, this.correctOption];
        this.allOptions = _.shuffle(combinedOptions);
        console.log(this.allOptions);
        console.log(combinedOptions);
        this.correctIndex = combinedOptions.indexOf(this.correctOption);
        console.log(this.correctIndex);

        // if ([200, 201].includes()) {}
      } catch (e) {
        console.log(e);
      }
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
      console.log(this.answered);
      if (index === this.correctIndex) {
        this.score++;
        console.log(this.score);
        this.correctAnswer = true;
      }

      if (index !== this.correctIndex) {
        this.wrongAnswer = true;
      }
    },
  },

  computed: {
    currentQuestion() {
      return this.quizzes[this.presentIndex].question;
    },

    questionDifficulty() {
      return this.quizzes[this.presentIndex].difficulty;
    },

    // difficultyGrade() {
    //   if (this.questionDifficulty.lowercase === '') {
    //     return 'green';
    //   }
    // },

    currentNum() {
      return this.presentIndex + 1;
    },

    totalQuestions() {
      return this.quizzes.length;
    },

    // allOptions() {
    //     return
    // }
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

.quiz-wrapper {
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

.span-group {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 600;
}

.tag {
  color: var(--github-green);
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

.selected {
  border-color: var(--github-blue);
  background-color: var(--github-blue);
  box-shadow: 0 0 0 3px var(--github-lighter-blue);
  outline: none;
}

.isRight {
  background-color: var(--github-green);
}

.isWrong {
  background-color: var(--github-red);
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

@media only screen and (max-width: 768px) {
  .quiz-wrapper {
    width: 600px;
  }
}

@media only screen and (max-width: 425px) {
  .quiz-wrapper {
    width: 300px;
  }
}
</style>
