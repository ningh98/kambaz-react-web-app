/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    quizzes: [],
}

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },
        addQuiz: (state, { payload: quiz }) => {
            const newQuiz: any = {
                _id: uuidv4(),
                title: quiz.title,
                course: quiz.course,
                instructions: quiz.instructions,
                publish: quiz.publish,
                points: quiz.points,
                score: quiz.score,
                numberOfQuestions: quiz.numberOfQuestions,
                quizType: quiz.quizType,
                assignmentsGroup: quiz.assignmentsGroup,
                shuffleAnswers: quiz.shuffleAnswers,
                timeLimit: quiz.timeLimit,
                multiplyAttempts: quiz.multiplyAttempts,
                numberOfAttempts: quiz.numberOfAttempts,
                showCorrectAnswers: quiz.showCorrectAnswers,
                accessCode: quiz.accessCode,
                oneQuestionAtATime: quiz.oneQuestionAtATime,
                webcamRequired: quiz.webcamRequired,
                lockQuestionAfterAnswer: quiz.lockQuestionAfterAnswer,
                dueDate: quiz.dueDate,
                availableDate: quiz.availableDate,
                untilDate: quiz.until,
            };
            state.quizzes = [...state.quizzes, newQuiz] as any;
        },
        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter(
                (q: any) => q._id !== quizId);
        },
        updateQuiz: (state, { payload: quiz }) => {
            state.quizzes = state.quizzes.map((q: any) => 
                q._id === quiz._id ? quiz : q
            ) as any;
        },
    },
});

export const { setQuizzes, addQuiz, deleteQuiz, updateQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;