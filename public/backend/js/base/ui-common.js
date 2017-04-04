+ function($) {
    $(function() {
        $('.alert').fadeTo(5000, 500).slideUp(500, function() {
            $('.alert').slideUp(500);
        });
    });
}(jQuery);
