import useUserStore from './module/user/index';

const useStore = () => ({
  user: useUserStore(),
});

export default useStore;
