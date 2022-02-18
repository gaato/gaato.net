const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  mode: 'stex',
  theme: 'monokai',
});

$('#submit').on('click', function () {
  editor.save();
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
    beforeSend: function (xhr, settings) {
      $button.attr('disabled', true);
      $('#result').html('');
      $('#error').text('');
    },
  })
    .done(function (data) {
      switch (data.status) {
        case 0:
          if (type === 'png') {
            $('#result').html(`<img src="data:image/png;base64,${data.result}">`);
          } else {
            const nwin = window.open('', 'Newwindow');
            nwin.document.open();
            nwin.document.write('<html>');
            nwin.document.write(`<embed style="position:absolute; left: 0; top: 0;" width="100%" height="100%" type="application/pdf" src="data:application/pdf;base64,${data.result}" />`);
            nwin.document.write('</html>');
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
    .fail(function (data) {
      console.log(data);
      $('#error').text('不明なエラー（よければがーとに知らせてください）');
    })
    .always(function (data) {
      $button.attr('disabled', false);
    })
})

$('#png').on('click', function () {
  $('#math-mode').attr('disabled', false);
  $('#math-mode-form').removeClass('disabled');
  const doc = editor.getDoc();
  doc.setValue('');
})

$('#pdf').on('click', function () {
  $('#math-mode').attr('disabled', true);
  $('#math-mode-form').addClass('disabled');
  const doc = editor.getDoc();
  doc.setValue(
`\\documentclass[uplatex,dvipdfmx]{jsarticle}
\\begin{document}

\\end{document}`
  );
})
