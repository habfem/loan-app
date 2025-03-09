export const generateRandomNumber = () => {
    let result = '';
    for (let i = 0; i < 4; i++) {
      const digit = Math.floor(Math.random() * 10);
      result += digit;
    }
    return parseInt(result, 10);
};