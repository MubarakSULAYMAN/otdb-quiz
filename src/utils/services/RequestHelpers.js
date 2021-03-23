import RequestService from "@/utils/services/RequestServices.js";

export default {
  getQuestions(amount, category, difficulty, options_type) {
    return RequestService.get(
      `/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${options_type}`
    );
  },
};
