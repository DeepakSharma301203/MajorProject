const User = require("../models/user");

module.exports.signupForm =  (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        // auto-login
        req.login(registeredUser , (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Logged in Successfully");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success","Successfully Log In");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logout Successfully");
        res.redirect("/login");
    })
};