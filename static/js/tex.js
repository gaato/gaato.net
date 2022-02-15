$('#submit').on('click', function() {
    const $button = $('#submit');
    const type = $('input[name=type]:checked').val();
    const plain = type === 'png' ? !$('#math-mode').prop('checked') : null;
    const code = $('#code').val();
    $.ajax({
        url: '/api/tex',
        type: 'post',
        data: {
            "type": type,
            "plain": plain,
            "code": code,
        },
        dataType: 'json',
        beforeSend: function(xhr, settings) {
            $button.attr('disabled', true);
            $('#result').html('');
            $('#error').text('');
        },
    })
    .done(function(data) {
        console.log(data);
        switch (data.status) {
            case 0:
                if (type === 'png') {
                    $('#result').html(`<img src="data:image/png;base64,${data.result}">`);
                } else {
                    $('#result').html(`<embed style="position:absolute; left: 0; top: 0;" width="100%" height="100%" type="application/pdf" src="data:application/pdf;base64,${data.result}" />`);
                }
                break;
            case 1:
                $('#error').text(data.error);
                break;
            case 2:
                $('#error').text('タイムアウトしました');
                break;
        }
    })
    .fail(function(data) {
        console.log(data);
        $('#error').text('不明なエラー（よければがーとに知らせてください）');
    })
    .always(function(data) {
        $button.attr('disabled', false);
    })
})
