var cloudinaryHelper = {
    uploadImage: function(filePath, callback) {
        global.library.CLOUDINARY.uploader.upload(filePath, function(result) {
            callback(result);
        });
    }
};
module.exports = cloudinaryHelper;
