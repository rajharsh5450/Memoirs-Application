import * as actionType from "../constants/actionTypes";
import * as api from "../api/index.js";

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING });

    const { data } = await api.fetchPost(id);

    dispatch({ type: actionType.FETCH_POST, payload: { post: data } });
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING });
    const {
      data: { data, currentPage, numberOfPages },
    } = await api.fetchPosts(page);

    dispatch({
      type: actionType.FETCH_ALL,
      payload: { data, currentPage, numberOfPages },
    });
    dispatch({ type: actionType.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING });
    const {
      data: { data },
    } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: actionType.FETCH_BY_SEARCH, payload: { data } });
    dispatch({ type: actionType.END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING });
    const { data } = await api.createPost(post);

    dispatch({ type: actionType.CREATE, payload: data });

    navigate(`/posts/${data._id}`);
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: actionType.UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (id) => async (dispatch) => {
  const user = JSON.parse(localStorage.getItem("profile"));

  try {
    const { data } = await api.likePost(id, user?.token);

    dispatch({ type: actionType.LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);

    dispatch({ type: actionType.COMMENT, payload: data });

    return data.comments;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await await api.deletePost(id);

    dispatch({ type: actionType.DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};
