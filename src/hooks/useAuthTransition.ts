import { ref } from 'vue';

const overlayVisible = ref(false);
const overlayText = ref('');

export function useAuthTransition() {
  function showOverlay(text: string) {
    overlayText.value = text;
    overlayVisible.value = true;
  }

  function hideOverlay() {
    overlayVisible.value = false;
    overlayText.value = '';
  }

  return { overlayVisible, overlayText, showOverlay, hideOverlay };
}
