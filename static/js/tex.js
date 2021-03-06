const submit = document.getElementById('submit');
const math_mode = document.getElementById('math-mode');
const code = document.getElementById('code');
const error_code = document.getElementById('error');
const result = document.getElementById('result');
const math_mode_form = document.getElementById('math-mode-form');

const editor = CodeMirror.fromTextArea(code, {
  lineNumbers: true,
  mode: 'stex',
  theme: 'the-matrix',
});

submit.addEventListener('click', async function() {
  editor.save();
  const type = document.querySelector('input[name=type]:checked').value;
  const plain = type === 'png' ? !math_mode.checked : null;

  submit.disabled = true;
  result.innerHTML = '';
  error_code.innerText = '';
  await fetch('api/tex', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "type": type,
      "plain": plain,
      "code": code.value,
    }),
  })
    .then(async function(res) {
      const data = await res.json();
      switch (data.status) {
        case 0:
          if (type === 'png') {
            result.innerHTML = `<img src="data:image/png;base64,${data.result}">`;
          } else {
            const nwin = window.open('', 'Newwindow');
            nwin.document.open();
            nwin.document.write('<html>');
            nwin.document.write(`<embed style="position:absolute; left: 0; top: 0;" width="100%" height="100%" type="application/pdf" src="data:application/pdf;base64,${data.result}" />`);
            nwin.document.write('</html>');
          }
          break;
        case 1:
          error_code.innerText = data.error;
          break;
        case 2:
          error_code.innerText = 'タイムアウトしました';
          break;
      }
    })
    .catch(function(data) {
      console.log(data);
      error_code.innerText = '不明なエラー（よければがーとに知らせてください）';
    });
  submit.disabled = false;
})

document.getElementById('png').addEventListener('click', function() {
  math_mode.disabled = false;
  math_mode_form.classList.remove('disabled');
  const doc = editor.getDoc();
  doc.setValue('');
})

document.getElementById('pdf').addEventListener('click', function() {
  math_mode.disabled = true;
  math_mode_form.classList.add('disabled');
  const doc = editor.getDoc();
  doc.setValue(
`\\documentclass[uplatex,dvipdfmx]{jsarticle}
\\usepackage{amsmath,amssymb}
\\begin{document}

\\end{document}`
  );
})
