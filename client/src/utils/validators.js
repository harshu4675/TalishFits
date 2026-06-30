export const isValidEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
};

export const isValidName = (name) => {
  return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name);
};

export const isValidWeight = (weight) => {
  const w = parseFloat(weight);
  return !isNaN(w) && w >= 20 && w <= 300;
};

export const isValidHeight = (height) => {
  const h = parseFloat(height);
  return !isNaN(h) && h >= 100 && h <= 250;
};

export const isValidAge = (age) => {
  const a = parseInt(age);
  return !isNaN(a) && a >= 13 && a <= 100;
};
