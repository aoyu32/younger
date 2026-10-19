import { ref } from 'vue';

const isLogin = ref(true);

const login = () => {
  isLogin.value = true;
};

const logout = () => {
  isLogin.value = false;
};

export const useUser = () => ({
  isLogin,
  login,
  logout,
});
