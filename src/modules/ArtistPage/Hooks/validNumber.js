export const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

export const validateMinLength = (e, minLength) => {
    if (e.target.value.length < minLength) {
      alert(`Minimum length is ${minLength} characters.`);
    }
  };

  export const validateMinLength2 = (e, minLength) => {
    let value = e.target.value;
    // Allow only numeric digits and limit to 11 digits
    value = value.replace(/[^0-9]/g, "").slice(0, 11);
    e.target.value = value; // Update the input value to reflect the change
  
  };