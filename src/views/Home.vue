<template>
  <div class="home">
    <!-- <TheWelcomeModal /> -->
    <div class="quiz-wrapper">
      <p class="tag">{{ quizCollection[[presentIndex]].difficulty }}</p>
      <p class="title">Question {{ presentIndex + 1 }}</p>
      <!-- <p class="question">
        {{ quizCollection[`${presentIndex}`].question }}
      </p> -->
      <p class="question" v-html="quizCollection[[presentIndex]].question"></p>
      <div
        class="options"
        v-for="option in allOptions"
        :key="option.presentIndex"
      >
        <p
          class="option"
          tabindex="0"
          :class="{ '': !isAnswer, right: isAnswer, wrong: isWrong }"
          @click="getVal(option)"
        >
          {{ option }}
        </p>
      </div>

      <div class="paginate">
        <button v-if="presentIndex === 0" @click="fetchQuiz">Refresh</button>
        <button v-if="presentIndex > 0" @click="previousQuestion">
          Previous
        </button>
        <button
          v-if="presentIndex < quizCollection.length - 1"
          @click="nextQuestion"
        >
          Next
        </button>
        <button
          v-if="presentIndex === quizCollection.length - 1"
          @click="showResults"
        >
          View Results
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import TheWelcomeModal from "@/components/TheWelcomeModal.vue";
import x from "@/utils/services/RequestHelpers.js";
import _ from "lodash";

export default {
  name: "Home",
  components: {
    // TheWelcomeModal,
  },

  data() {
    return {
      presentIndex: 0,
      quizCollection: [],
      correctOption: null,
      incorrectOptions: [],
      allOptions: [],
      selectedOption: null,
    };
  },

  methods: {
    async fetchQuiz() {
      try {
        let response = await x.getQuestions(10);
        // console.log(response);
        console.log(response.data.results);

        this.quizCollection = response.data.results;
        this.correctOption =
          response.data.results[this.presentIndex].correct_answer;
        this.incorrectOptions =
          response.data.results[this.presentIndex].incorrect_answers;
        console.log(this.incorrectOptions);
        let combinedOptions = [...this.incorrectOptions, this.correctOption];
        this.allOptions = _.shuffle(combinedOptions);
        console.log(this.allOptions);
        console.log(combinedOptions);

        // if ([200, 201].includes(rootState.request_status)) {
        //   commit("UPDATE_USER_INFO", response.data);
        // }
      } catch (e) {
        // dispatch("showWarning");
        // commit(
        //   "UPDATE_ERROR_MESSAGE",
        //   "Error occured while fetching user details."
        // );
      }
    },

    previousQuestion() {
      this.presentIndex--;
    },

    nextQuestion() {
      this.presentIndex++;
      // this.presentIndex = this.presentIndex + 1;
    },

    getVal(option) {
      console.log(option);
      this.selectedOption = option;
      console.log(this.correctOption === option);
      this.isAnswer;
      // if (option) {
      // if (option === this.correctOption) {
      //   return this.newBackgrounColor;
      // }
      // }
    },
  },

  computed: {
    isAnswer() {
      return this.selectedOption === this.correctOption;
      // return this.extractRepos().filter((repo) => {
      //   return `${repo.full_name}`
      //     .toLowerCase()
      //     .includes(this.filter_term.toLowerCase());
      // });
    },

    // newBackgrounColor() {
    //   if (this.isAnswer) {
    //     return `background-color: var(--github-green)`;
    //   } else if (!this.isAnswer) {
    //     return `background-color: var(--github-red)`;
    //   } else {
    //     return "";
    //   }
    // },
  },

  created() {
    return this.fetchQuiz();
  },
};
</script>

<style scoped>
.home {
  position: relative;
  /* width: 100vw; */
  height: 97vh;
  /* background-color: red; */
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
  /* background-color: var(--github-lighter-blue-fade); */
}

.tag {
  color: var(--github-green);
  /* color: var(--github-purple); */
  /* color: var(--github-red); */
  font-size: 10px;
  font-weight: 600;
  text-align: right;
  text-transform: uppercase;
}

.title {
  color: var(--github-blue);
  font-weight: 900;
  font-size: 16px;
}

.question {
  /* color: var(--github-purple); */
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

.options p:hover,
.options p:focus {
  color: var(--github-white);
  background-color: var(--github-gray-dark);
  cursor: default;
}

.options p:focus {
  border-color: var(--github-blue);
  background-color: var(--github-blue);
  box-shadow: 0 0 0 3px var(--github-lighter-blue);
  outline: none;
}

.right {
  background-color: var(--github-green);
}

.wrong {
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
