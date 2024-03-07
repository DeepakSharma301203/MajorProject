const Listing = require("../models/listing");


module.exports.index =  async (req,res) => {
    const all_listings = await Listing.find({});
    res.render("listings/index.ejs", {all_listings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path:"author"
            },
        })
        .populate("owner");    
    if(!listing){
        req.flash("error","Listing does not exit");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    await newListing.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res) => {
    let {id}= req.params;

    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exit");
        res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    let originalImageUrl = originalImage.replace("/upload", "/upload/h_200");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};


module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Review Updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listind is deleted!!");
    res.redirect("/listings");
};