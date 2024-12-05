
export const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

export const validateMinLength = (e, minLength) => {
    if (e.target.value.length < minLength) {
      alert(`Minimum length is ${minLength} characters.`);
    }
  };

