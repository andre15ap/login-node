const bcrypt = require('bcrypt');

const users = [];

async function register({ name, password, email }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function getUserByEmail(email) {
  return users.find(user => user.email === email);
}

function getUserById(id) {
  return users.find(user => user.id === id);
}

module.exports = {
  register,
  getUserByEmail,
  getUserById,
}