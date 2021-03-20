import RequestService from "@/utils/services/RequestServices.js";

export default {
  getQuestions(amount) {
    return RequestService.get(`/api.php?amount=${amount}`);
  },

  getCustomQuestions(amount, category, difficulty, type) {
    return RequestService.get(
      `/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
    );
  },
};
