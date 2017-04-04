+ function($) {
    $(function() {
        if ($('#donorCount').length > 0) {
            $.ajax({
                url: '/api/v1/dashboard/report/usercount',
                dataType: 'json',
                type: 'post',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                processData: false,
                success: function(result) {
                    $('#donorCount').append('' + result.data + '');
                },
                error: function(jqXhr) {}
            });
        }
        if ($('#unpaidPayment').length > 0) {
            var data = 0;
            $.ajax({
                url: '/api/v1/dashboard/report/payment',
                data: {
                    status: 1
                },
                type: 'post',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                processData: true,
                success: function(result) {
                    $('#unpaidPayment').append('Rp' + result.data.total != undefined
                        ? currencyFormatterRupiah(parseInt(result.data.total))
                        : 0 + '');
                },
                error: function(jqXhr) {}
            });
        }
        if ($('#paidPayment').length > 0) {
            $.ajax({
                url: '/api/v1/dashboard/report/payment',
                data: {
                    status: 2
                },
                type: 'post',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                processData: true,
                success: function(result) {
                    $('#paidPayment').append('Rp' + result.data.total != undefined
                        ? currencyFormatterRupiah(parseInt(result.data.total))
                        : 0 + '');
                },
                error: function(jqXhr) {}
            });
        }
        if ($('#campaignActiveReport').length > 0) {
            $.ajax({
                url: '/api/v1/campaign',
                dataType: 'json',
                type: 'post',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(public_access.user + ":" + public_access.secret));
                },
                processData: false,
                success: function(result, textStatus) {
                    console.log(result.countTotal);
                    $('#campaignActiveReport').append('' + result.countTotal != undefined
                        ? result.countTotal
                        : 0 + '');
                },
                error: function(jqXhr, textStatus) {}
            });
        }
    });
}(jQuery);
