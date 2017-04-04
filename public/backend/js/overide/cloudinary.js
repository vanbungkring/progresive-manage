var imageURL = [];
if (document.getElementById("uploadCloudinary")) {
    document.getElementById("uploadCloudinary").addEventListener("click", function() {
        cloudinary.openUploadWidget({
                cloud_name: 'djftvyf87',
                upload_preset: 'dev-zispro-backend',
                stylesheet: 'minimal',
                theme: 'minimal',
                client_allowed_formats: ["png", "gif", "jpeg", "jpg", "bmp"],
                max_file_size: 10000000 // 10MB
            },
            function(error, result) {
                if (!error) {
                    //var blkstr = [];
                    $.each(result, function(index, file) {
                        var imgDiv = '';
                        imgDiv += '<div class="col-lg-3 col-sm-4 col-xs-6 upload-image-thumb">';
                        imgDiv += '    <div class="div-img-del">';
                        imgDiv += '      <a class="btn btn-default btn-sm btn-danger deleteImage">';
                        imgDiv += '        <i class="glyphicon glyphicon-remove icon "></i>';
                        imgDiv += '      </a>';
                        imgDiv += '    </div>';
                        imgDiv += '    <img class="thumbnail img-responsive" src="' + imgTransform(file.url) + '">';
                        imgDiv += '    <input required name="images[]" type="hidden" value="' + file.url + '">';
                        imgDiv += '</div>';

                        $(imgDiv).appendTo('#result');

                        $(".upload-image-thumb").find(".deleteImage").on("click", function() {
                            $(this).closest(".upload-image-thumb").remove();
                        });
                        // init sortable js
                        // HP: conflict with summernote
                        // $(".sortable").sortable();

                    });
                }
            });

    }, false);
}

function deleteConfirmation() {

}
if (document.getElementById("uploadMerchantLogo")) {
    document.getElementById("uploadMerchantLogo").addEventListener("click", function() {
        cloudinary.openUploadWidget({
                cloud_name: 'djftvyf87',
                cropping: 'server',
                upload_preset: 'dev-zispro-backend',
                stylesheet: 'minimal',
                theme: 'minimal',
                client_allowed_formats: ["png", "gif", "jpeg", "jpg", "bmp"],
                max_file_size: 10000000 // 10MB
            },
            function(error, result) {
                if (!error) {
                    //var blkstr = [];
                    $.each(result, function(index, file) {
                        var imgDiv = '';
                        imgDiv += '<div class="col-lg-3 col-sm-4 col-xs-6 upload-image-thumb">';
                        imgDiv += '    <div class="div-img-del">';
                        imgDiv += '      <a class="btn btn-default btn-sm btn-danger deleteImage">';
                        imgDiv += '        <i class="glyphicon glyphicon-remove icon "></i>';
                        imgDiv += '      </a>';
                        imgDiv += '    </div>';
                        imgDiv += '    <img class="thumbnail img-responsive" src="' + imgTransform(file.url) + '">';
                        imgDiv += '    <input required name="images[]" type="hidden" value="' + file.url + '">';
                        imgDiv += '</div>';

                        $(imgDiv).appendTo('#result');

                        $(".upload-image-thumb").find(".deleteImage").on("click", function() {
                            $(this).closest(".upload-image-thumb").remove();
                        });
                        // init sortable js
                        // HP: conflict with summernote
                        // $(".sortable").sortable();

                    });
                }
            });

    }, false);
}

function imgTransform(url, transform) {
    transform = transform == null ? 'h_100,w_100,q_60,c_fit' : transform;
    var pattern = /upload/i;
    var newPattern = 'upload/' + transform;
    if (url !== '') url = url.replace(pattern, newPattern);
    return url.replace("http", "https");
}
