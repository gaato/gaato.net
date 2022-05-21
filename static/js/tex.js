const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  mode: 'stex',
  theme: 'the-matrix',
});

$('#submit').on('click', async function() {
  editor.save();
  const $button = $('#submit');
  const type = $('input[name=type]:checked').val();
  const plain = type === 'png' ? !$('#math-mode').prop('checked') : null;
  const code = $('#code').val();

  $button.attr('disabled', true);
  $('#result').html('');
  $('#error').text('');
  await fetch('api/tex', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "type": type,
      "plain": plain,
      "code": code,
    }),
  })
    .then(async function(res) {
      const data = await res.json();
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
    .catch(function(data) {
      console.log(data);
      $('#error').text('不明なエラー（よければがーとに知らせてください）');
    });
  $button.attr('disabled', false);
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
\\usepackage{amsmath,amssymb}
\\begin{document}

\\end{document}`
  );
})
