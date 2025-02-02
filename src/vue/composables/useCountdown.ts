import {defineComponent, ref, reactive, computed, inject, watch} from 'vue';

export default function() {
    let nextCountdown = ref(0);
    let timeleft = ref(0);
    let intervalRetry = null;

    watch(nextCountdown, () => {
      if (nextCountdown.value > Date.now()) {
        timeleft.value = nextCountdown.value - Date.now();
        clearInterval(intervalRetry);
        let interval = setInterval(() => {
          timeleft.value = nextCountdown.value - Date.now();
          if (timeleft.value < 0) {
            timeleft.value = 0;
            clearInterval(intervalRetry);
          }
        }, 1000);
      }
    });

    const countdown = computed(() => {
        const total = timeleft.value;
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        return (
          (days > 0 ? days + "::" : "") +
          (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
        );
      });

    return {
        nextCountdown,
        countdown,
        timeleft,
    }
}
