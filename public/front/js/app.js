+ function($) {
    $(function() {
        if ($("#navbar-menu").length > 0) {
          $.ajax({
              url: '/api/v1/categories',
              dataType: 'json',
              type: 'post',
              processData: false,
              success: function(result) {
                console.log(result);
                $.each(result.data.slice(0,11), function(index, value) {
                    $('#navbar-menu ul').append('<li class="propClone"><a href="/channel/categories/'+value._id+'"><i class="fa fa-film"></i>'+value.name+'</a></li>');
                    return index<11;
                });
              },
              error: function(jqXhr) {}
          });
        }
    });
}(jQuery);
