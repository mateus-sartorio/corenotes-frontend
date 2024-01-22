import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Todo } from "../../models/todo";
import { RootState } from "../store";
import { todoResponseDTO } from "@/app/DTOs/response/todoResponseDTO";
import { todoRequestDTO } from "@/app/DTOs/request/todoResponseDTO";

const API_ENDPOINT = "http://localhost:4000/api/v1/todos";

export const fetchTodos = createAsyncThunk("todos/fetch", async (thunkAPI) => {
  const response = await fetch(API_ENDPOINT, {
    method: "GET",
  });
  const data = await response.json();
  return data;
});

export const saveTodo = createAsyncThunk("todos/save", async (todo: todoRequestDTO, thunkAPI) => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: todo.title,
      body: todo.body,
      isFavorited: todo.isFavorited,
      color: todo.color,
    }),
  });

  const data = await response.json();

  return data;
});

export const updateTodo = createAsyncThunk("todos/update", async (todo: Todo, thunkAPI) => {
  const response = await fetch(`${API_ENDPOINT}/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: todo.title,
      body: todo.body,
      isFavorited: todo.isFavorited,
      color: todo.color,
    }),
  });

  const data = await response.json();
  return data;
});

export const deleteTodo = createAsyncThunk("todos/delete", async (id: string, thunkAPI) => {
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  return data;
});

export const todosSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [] as Todo[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload.map((todo: todoResponseDTO) => {
        const { _id, title, body, isFavorited, color } = todo;
        return {
          id: _id,
          title,
          body,
          isFavorited,
          color,
        };
      });
    });

    builder.addCase(saveTodo.fulfilled, (state, action) => {
      const { _id, title, body, isFavorited, color } = action.payload;
      const newTodo = {
        id: _id,
        title,
        body,
        isFavorited,
        color,
      };

      state.todos.push(newTodo);
    });

    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.todos = state.todos.map((todo) => {
        if (todo.id === action.payload._id) {
          const { _id, title, body, isFavorited, color } = action.payload;
          const newTodo = {
            id: _id,
            title,
            body,
            isFavorited,
            color,
          };

          return newTodo;
        } else {
          return todo;
        }
      });
    });

    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload._id);
    });
  },
});

export const selectAllTodos = (state: RootState) => state.todosState.todos;
export const selectFavoritedTodos = (state: RootState) => state.todosState.todos.filter((todo) => todo.isFavorited);
export const selectNonFavoritedTodos = (state: RootState) => state.todosState.todos.filter((todo) => !todo.isFavorited);

export default todosSlice.reducer;
