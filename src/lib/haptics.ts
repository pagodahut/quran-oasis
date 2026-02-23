export const haptic = (ms: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(ms);
  }
};
export const hapticSuccess = () => haptic(15);
export const hapticLight = () => haptic(5);
export const hapticError = () => haptic([10, 50, 10]);
