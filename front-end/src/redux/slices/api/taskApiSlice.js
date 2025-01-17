import { apiSlice } from "../apiSlice";

const TASK_URL = "/tasks";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASK_URL}/dashboard`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `${TASK_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASK_URL}/create`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASK_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    updateTask: builder.mutation({
      query: ({ _id, formData }) => ({
        url: `${TASK_URL}/update/${_id}`,
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASK_URL}/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASK_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASK_URL}/activity/${id}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),

    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${TASK_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllTaskQuery,

  useCreateTaskMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useTrashTaskMutation,

  useCreateSubTaskMutation,

  useGetSingleTaskQuery,
  usePostTaskActivityMutation,

  useDeleteRestoreTaskMutation,
} = taskApiSlice;
