+ function($) {
    $(function() {
        if ($("#summernote_textarea").length > 0) {
            $('#summernote_textarea').summernote({
                toolbar: [
                    ['color', ['color']
                    ],
                    [
                        'para',
                        ['ul', 'ol', 'paragraph']
                    ],
                    ['height', ['height']
                    ]
                ],
                onpaste: function(e) {
                    var thisNote = $(this);
                    var updatePastedText = function(someNote) {
                        var original = someNote.code();
                        var cleaned = CleanPastedHTML(original); //this is where to call whatever clean function you want. I have mine in a different file, called CleanPastedHTML.
                        someNote.code('').html(cleaned); //this sets the displayed content editor to the cleaned pasted code.
                    };
                    setTimeout(function() {
                        //this kinda sucks, but if you don't do a setTimeout,
                        //the function is called before the text is really pasted.
                        updatePastedText(thisNote);
                    }, 10);

                }
            });

        }
        if ($("#summernote_textarea_cloudinary").length > 0) {

            var HelloButton = function(context) {
                var ui = $.summernote.ui;

                // create button
                var button = ui.button({
                    contents: '<i class="fa fa-picture-o"/> Upload gambar',
                    tooltip: 'Image',
                    click: function() {
                        // invoke insertText method with 'hello' on editor module.
                        // callCloudinary()
                        callCloudinary(function(result) {
                            console.log(result[0].url);
                            context.invoke('editor.insertImage', result[0].url);
                        });

                    }
                });

                return button.render(); // return button as jquery object
            }
            $('#summernote_textarea_cloudinary').summernote({
                toolbar: [
                    ['mybutton', ['hello']
                    ],
                    ['color', ['color']
                    ],
                    [
                        'para',
                        ['ul', 'ol', 'paragraph']
                    ],
                    ['height', ['height']
                    ]
                ],
                buttons: {
                    hello: HelloButton
                }
            });

        }
    });
}(jQuery);

function callCloudinary(callback) {
    cloudinary.openUploadWidget({
        cloud_name: 'djftvyf87',
        cropping: 'server',
        upload_preset: 'dev-zispro-backend',
        stylesheet: 'minimal',
        theme: 'minimal',
        client_allowed_formats: [
            "png", "gif", "jpeg", "jpg", "bmp"
        ],
        max_file_size: 10000000 // 10MB
    }, function(error, result) {
        if (!error) {
            callback(result);
        }
    });

}
