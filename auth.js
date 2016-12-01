const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

const stategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },

    (email, password, done) => {
        console.log(email, password);
        User.getUserByEmail(email)
            .then((user) => {
                console.log(user);

                if (user && user.isPasswordValid(password)) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            })
            .catch((ex) => {
                done(ex);
            });
    });

passport.use(stategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id)
        .then((user) => done(null, user))
        .catch((ex) => done(ex));
});

