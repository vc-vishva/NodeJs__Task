const generateUniqueUsername = async (name) => {
    try {
      const lowercasedName = name.toLowerCase().replace(/\s/g, "");
      const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      const username = lowercasedName + randomNumber;
      return username;
    } catch (error) {
      // Handle the error if needed
      throw error;
    }
  };
  
  export { generateUniqueUsername };
  