const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: 'No user with that email' });
    }
  
    try {
      const correctPassword = await bcrypt.compare(password, user.password);
      if (correctPassword) {
        return done(null, user);
      }
      return done(null, false, { message: 'Password incorrect' });
    } catch (error) {
      return done(error);
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize;