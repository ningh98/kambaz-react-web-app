/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { enrollments } from '../../Database';
import { v4 as uuidv4 } from 'uuid';
const initialState = {
    enrollments: enrollments,
}

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollCourse: (state, { payload }) => {
            const { user, course } = payload;
            const alreadyEnrolled = state.enrollments.some(
                (en: any) => en.user === user && en.course === course
              );
            if (!alreadyEnrolled) {
                const newEnrollment: any = {
                    _id: uuidv4(),
                    user,
                    course,
                };
                state.enrollments = [...state.enrollments, newEnrollment] as any;
            }
            
            
        },
        unenrollCourse: (state, { payload }) => {
            const { user, course } = payload;
            state.enrollments = state.enrollments.filter(
                (en: any) => !(en.user === user && en.course === course)
            );
        },
    }
})

export const { enrollCourse, unenrollCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;