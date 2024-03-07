const Listing = require("./models/listing");
const {listingSchema}= require("./schema.js");    
const ExpressError= require("./utils/ExpressError.js");
const {reviewSchema}= require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //redirected url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Log in First");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are'nt owner of Listing");
        return res.redirect(`/listings/${id}`);
    };
    next();
}

//Validate Listing 
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else{
        next();
    }
}

//Validate Review
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else{
        next();
    }
  }

  //isAuthor
module.exports.isAuthor = async(req,res,next) => {
    const { id,reviewId } = req.params;    
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are'nt owner of Review");
        return res.redirect(`/listings/${id}`);
    };
    next();
}