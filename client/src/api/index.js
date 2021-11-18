import axios from "axios";

const API = axios.create({
  baseURL: "https://memoirs-backend-deployment.herokuapp.com",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

//Post related routing
export const fetchPost = (id) => API.get(`/posts/${id}`);

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );

export const createPost = (newPost) => API.post("/posts", newPost);

export const likePost = (id) => API.patch(`/posts/${id}/like`);

export const comment = (value, id) =>
  API.post(`/posts/${id}/comment`, { value });

export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`/posts/${id}`);

// Authentication related routing
export const signIn = (formData) => API.post("/auth/signin", formData);

export const signUp = (formData) => API.post("/auth/signup", formData);
