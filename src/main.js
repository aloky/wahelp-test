import { createApp } from 'vue';
import { createStore } from 'vuex';

const moveElement = (array, { element, newIndex, oldIndex }) => {
  let arrayCopy = [...array];

  if (oldIndex !== undefined) {
    arrayCopy.splice(oldIndex, 1);
  }

  arrayCopy.splice(newIndex, 0, element);
  return arrayCopy;
};

const store = createStore({
  state() {
    return {
      users: [],
      posts: {}
    };
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setPosts(state, { userId, posts }) {
      state.posts[userId] = posts;
    },
    addPost(state, { userId, post }) {
      state.posts[userId].push(post);
    },
    movePost(state, { userId, post }) {
      state.posts[userId] = moveElement(state.posts[userId], post);
    },
    removePost(state, { userId, postId }) {
      state.posts[userId] = state.posts[userId].filter((el) => el.id !== postId);
    }
  }
});

import './assets/main.scss';

import App from './App.vue';

createApp(App)
  .use(store)
  .mount('#app');
