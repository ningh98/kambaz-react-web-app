/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

export const fetchAllCourses = async () => {
    const { data } = await axios.get(COURSES_API);
    return data
}

export const deleteCourse = async (id: string) => {
    const { data } = await axios.delete(`${COURSES_API}/${id}`);
    return data;
  };
  
export const updateCourse = async (course: any) => {
    const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
    return data;
};

export const findModulesForCourse = async (courseId: string) => {
    const response = await axios
      .get(`${COURSES_API}/${courseId}/modules`);
    return response.data;
};

export const createModuleForCourse = async (courseId: string, module: any) => {
    const response = await axios.post(
        `${COURSES_API}/${courseId}/modules`,
        module
    );
    return response.data;
};

export const deleteModule = async (moduleId: string) => {
    const response = await axios.delete(`${MODULES_API}/${moduleId}`);
    return response.data;
};
   
export const updateModule = async (module: any) => {
    const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
    return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
    return response.data;
}

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
    const response = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
    return response.data;
}

export const updateAssignment = async (assignment: any) => {
    const response = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
    return response.data;
}

export const deleteAssignment = async (assignmentId: string) => {
    const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
    return response.data;
}

export const findPeopleForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/people`);
    return response.data;
}
