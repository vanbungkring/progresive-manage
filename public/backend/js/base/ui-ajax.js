+ function($) {
    $(function() {
        if ($('#youtubeVideoUrl')) {
            $('#youtubeVideoUrl').on('input', function() {
                var url = $('#youtubeVideoUrl').val();
                if (validateYouTubeUrl(url) != null) {
                    $('#videoObject').parent().show();
                } else {
                    console.log('err');
                }
                // if($(this).parsley().isValid()){
                // 	alert(validateYouTubeUrl(url));
                // }
            });

        }
        if ($('#merchantSelect').length > 0) {
            $.ajax({
                url: '/api/v1/submerchant',
                dataType: 'json',
                type: 'post',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                processData: false,
                success: function(result) {
                    $.each(result.data, function(index, value) {
                        var selectMe = (result.data[index]._id == selectedMerchant)
                            ? 'selected'
                            : '';
                        $('#merchantSelect').append('<option ' + selectMe + ' value="' + result.data[index]._id + '">' + result.data[index].name + '</option>');
                    });
                },
                error: function(jqXhr) {}
            });
        }
        if ($('#merchantRow').length > 0) {
            $('#merchantRow').hide();
            $.ajax({
                url: '/api/v1/submerchant',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                type: 'post',
                processData: false,
                success: function(result, textStatus, jQxhr) {
                    $.each(result.data, function(index, value) {
                        $('#merchantSelect').append('<option value="' + result.data[index]._id + '">' + result.data[index].name + '</option>');
                    });
                    if (user_active.level > 3) {
                        $('#merchantRow').hide();
                    } else {
                        $('#merchantRow').show();
                    }
                },
                error: function(jqXhr, textStatus, errorThrown) {}
            });
        }
        /**
         * selet user role
         */
        if ($('#userRoleSelect').length > 0) {
            $.getJSON('/backend/static/role.json', function(result) {
                $.each(result, function(index, value) {
                    var selectMe = (result[index].id == selectedRole)
                        ? 'selected'
                        : '';
                    $('#userRoleSelect').append('<option ' + selectMe + ' value="' + result[index].id + '">' + result[index].name + '</option>');
                });
            });
        }
        if ($('#bankSelect').length > 0) {
            $.getJSON('/backend/static/bank.json', function(result) {
                $.each(result, function(index, value) {
                    var selectMe = (result[index].short_name == selectedBank)
                        ? 'selected'
                        : '';
                    $('#bankSelect').append('<option ' + selectMe + ' value="' + result[index].short_name + '">' + result[index].name + '</option>');
                });
            });
        }

        if ($('#availBank').length > 0) {
            $.ajax({
                url: '/api/v1/payment/account',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                type: 'post',
                processData: false,
                success: function(result, textStatus, jQxhr) {

                    $.each(result.data, function(index, value) {
                        $('#availBank').append('<option value="' + result.data[index]._id + '">' + result.data[index].bank.name + ' / ' + result.data[index].bank.accNumber + '</option>');
                    });
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(jqXhr);
                }
            });
        }
        if ($('#bankAvail').length > 0) {
            $.ajax({
                url: '/api/v1/payment/account',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                type: 'post',
                processData: false,
                success: function(result, textStatus, jQxhr) {

                    $.each(result.data, function(index, value) {
                        var selectMe = (selectedBankArray.indexOf(result.data[index]._id) >= 0)
                            ? 'checked'
                            : '';
                        var str = '';
                        str = "<div class='col-md-6 form-group'> <label class='checkbox-inline i-checks'>";
                        str = str + "<input " + selectMe + " type='checkbox' name='bank' value=" + result.data[index]._id + "><i></i>" + result.data[index].bank.name + "</label> </div>";
                        str = str + "</div>";
                        $('#bankAvail').append(str);
                    });
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(jqXhr);
                }
            });
        }
        if ($('#merchantAvail').length > 0) {
            $.ajax({
                url: '/api/v1/submerchant',
                dataType: 'json',
                type: 'post',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                processData: false,
                success: function(result, textStatus, jQxhr) {

                    $.each(result.data, function(index, value) {
                        // console.log(result.data[index].name);
                        var str = '';
                        str = "<div class='col-md-6 form-group'> <label class='checkbox-inline i-checks'>";
                        str = str + "<input type='checkbox' name='merchant' value=" + result.data[index]._id + "><i></i>" + result.data[index].name + "</label> </div>";
                        str = str + "</div>";
                        $('#merchantAvail').append(str);
                    });
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(jqXhr);
                }
            });
        }
        // if ($('#paymentAvail').length > 0) {
        //     $.ajax({
        //         url: '/api/v1/payment/category',
        //         dataType: 'json',
        //         data: {
        //             'status': true
        //         },
        //         type: 'post',
        //         processData: false,
        //         success: function(result, textStatus, jQxhr) {
        //             $.each(result.data, function(index, value) {
        //                 var str = "";
        //                 str = "<div class='col-md-6 form-group'> <label class='checkbox-inline i-checks'>";
        //                 str = str + "<input type='checkbox' name='paymentCategory' value=" + result.data[index]._id + "><i></i>" + result.data[index].name + "</label> </div>";
        //                 str = str + "</div>";
        //                 $('#paymentAvail').append(str);
        //             });
        //         },
        //         error: function(jqXhr, textStatus, errorThrown) {}
        //     });
        // }
        if ($('#categorySelect').length > 0) {
            $.ajax({
                url: '/api/v1/categories',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                type: 'post',
                cache: false,
                processData: true,
                success: function(result, textStatus, jQxhr) {
                    // console.log(result);
                    $.each(result.data, function(index, value) {
                        var selectMe = (result.data[index]._id == selectedCat)
                            ? 'selected'
                            : '';
                        // console.log(selectMe);
                        $('#categorySelect').append('<option ' + selectMe + ' value="' + result.data[index]._id + '">' + result.data[index].name + '</option>');
                    });
                },
                error: function(jqXhr, textStatus, errorThrown) {}
            });
        }
        if ($('#authorSelect').length > 0) {
            $.ajax({
                url: '/api/v1/author',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                type: 'post',
                cache: false,
                processData: true,
                success: function(result, textStatus, jQxhr) {
                    // console.log(result);
                    $.each(result.data, function(index, value) {
                        var selectMe = (result.data[index]._id == selectedCat)
                            ? 'selected'
                            : '';
                        // console.log(selectMe);
                        $('#authorSelect').append('<option ' + selectMe + ' value="' + result.data[index]._id + '">' + result.data[index].name + '</option>');
                    });
                },
                error: function(jqXhr, textStatus, errorThrown) {}
            });
        }
        if ($('#donationCategory').length > 0) {
            $.ajax({
                url: '/api/v1/payment/category',
                dataType: 'json',
                data: {
                    'status': true
                },
                type: 'post',
                processData: false,
                success: function(result, textStatus, jQxhr) {
                    $.each(result.data, function(index, value) {
                        $('#donationCategory').append('<option value="' + result.data[index]._id + '">' + result.data[index].name + '</option>');
                    });
                },
                error: function(jqXhr, textStatus, errorThrown) {}
            });
        }
        // init remove for edit post
        $('.deleteImage').on("click", function() {
            $(this).closest('.upload-image-thumb').remove();
        });
    });
}(jQuery);
