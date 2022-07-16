const User = require('./../models/user');

module.exports.renderNewForm = (req, res) => {
    res.render('users/register')
};

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash('success', 'Welcome To Swapna Lodges !!!');
            res.redirect('/lodges');
        });
       
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    
    req.flash('success', 'Welcome Back !!!');
    const redirectUrl = req.session.returnTo || '/lodges';
    // console.log(req.session);
    // delete req.session.returnTo; 

    res.redirect(redirectUrl);
};

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash('success', 'Good Bye !!!');
        res.redirect('/lodges');
    });
};