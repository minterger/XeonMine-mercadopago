const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // buscar usuario
    const user = await User.findOne({email});
    
    // ver si el usuario existe
    if (!user) {
        return done(null, false, { message: 'Usuario No Registrado' });
    } else {
        // comparar contraseñas
        const match = await user.comparePassword(password);

        if (match) {
            // devolver usuario si las contraseña es correcta
            return done(null, user);
        } else {
            return done(null, false, { message: 'Password Incorrecta' });
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean();
        done(null, user);
    } catch (error) {
        done(error, false);
    }
})