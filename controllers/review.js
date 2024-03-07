const Reviews = require("../models/review");
const Listing = require("../models/listing");


module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    try {
      const { id, reviewId } = req.params;
      const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Reviews.findByIdAndDelete(reviewId);
  
      if (listing && reviewId) {
        req.flash("success","Review Deletd!!");
        res.redirect(`/listings/${listing._id}`);
        
      } else {
        console.error("Error deleting review:", error);
        res.status(500).send("An error occurred while deleting the review.");
      }
    } catch (error) {
      console.error("Error processing delete request:", error);
      res.status(500).send("An error occurred while deleting the review.");
    }
}