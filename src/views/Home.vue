<template>
  <div class="home">
    <the-welcome-modal class="modal" @modalVals="fetchQuiz" v-if="showModal" />
    <div
      class="quiz-wrapper"
      v-if="totalQuestions === 0 && showQuiz"
    >
      Loading Quiz...
    </div>

    <div
      class="quiz-wrapper"
      v-if="totalQuestions > 0 && showQuiz"
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
          @click="startAfresh"
          @keydown.enter="startAfresh"
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
          @click="noPreview = !noPreview"
          @keydown.enter="noPreview = !noPreview"
        >
          Preview Responses
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

    <the-quiz-preview
      class="quiz"
      :correctAnswers="correctAnswers"
      :questions="all_questions"
      :questionCount="totalQuestions"
      :selectedAnswers="selectedAnswers"
      :noResult="noResult"
      @newUpdate="newUpdate"
      v-if="!noPreview"
    />

    <the-scores
      class="score-wrapper"
      :answered="answered"
      :score="score"
      :scorePercent="scorePercent"
      :totalQuestions="totalQuestions"
      @replay="startAfresh"
      v-if="!noResult"
    />
  </div>
</template>

<script>
import x from "@/utils/services/RequestHelpers.js";
import _ from "lodash";
import TheWelcomeModal from "../components/TheWelcomeModal.vue";
import TheQuizPreview from "@/components/TheQuizPreview.vue";
import TheScores from "../components/TheScores.vue";

export default {
  name: "Home",
  components: { TheWelcomeModal, TheQuizPreview, TheScores },

  data() {
    return {
      presentIndex: 0,
      quizzes: [],
      all_questions: [],
      correctOption: null,
      correctAnswers: [],
      incorrectOptions: [],
      allOptions: [],
      selectedOption: null,
      selectedAnswers: [],
      score: 0,
      selectedIndex: null,
      isSelected: false,
      answered: 0,
      correctIndex: null,
      noResult: true,
      showModal: true,
      noPreview: true,
    };
  },

  watch: {
    presentIndex() {
      this.isSelected = false;
      this.selectedIndex = null;
      this.shuffleOptions();
      this.answerClass();
      this.all_questions.push(this.quizzes[this.presentIndex].question);
    },
  },

  methods: {
    startAfresh() {
      this.showModal = true;
      this.noResult = true;
    },

    async fetchQuiz(amount, category, difficulty, options_type) {
      this.showModal = false;
      console.log(amount, category, difficulty, options_type);
      try {
        this.presentIndex = 0;
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
      this.correctAnswers.push(this.allOptions[this.correctIndex]);
    },

    previousQuestion() {
      this.presentIndex--;
    },

    nextQuestion() {
      this.presentIndex++;
    },

    getVal(index) {
      this.selectedIndex = index;
      this.selectedAnswers.push(this.allOptions[this.selectedIndex]);
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

    newUpdate() {
      this.noPreview = !this.noPreview;
      this.noResult = !this.noResult;
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

    showQuiz() {
      return !this.showModal && this.noPreview && this.noResult
    }
  },
};
</script>

<style scoped>
.home {
  position: relative;
  min-height: 97vh;
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

.quiz {
  margin: 50px;
}

.score-card {
  font-size: 40px;
  font-weight: 700;
}

@media only screen and (max-width: 768px) {
  .modal,
  .quiz-wrapper,
  .score-wrapper {
    width: 600px;
  }

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

  .score-card {
    font-size: 20px;
  }

  button:first-child {
    margin-right: 20px;
  }
}
</style>
