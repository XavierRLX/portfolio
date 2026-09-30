const copyContactButton = document.querySelector('.copy-contact');
const copyStatus = document.getElementById('copy-status');

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fallback below for browsers/contexts that deny the Clipboard API.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Copy command failed');
  }
};

if (copyContactButton && copyStatus) {
  copyContactButton.addEventListener('click', async () => {
    const value = copyContactButton.dataset.copyValue;
    const defaultLabel = 'Copiar e-mail';

    try {
      await copyText(value);
      copyStatus.textContent = 'E-mail copiado.';
      copyContactButton.textContent = 'Copiado';
    } catch {
      copyStatus.textContent = 'Não foi possível copiar. Selecione o e-mail acima.';
      copyContactButton.textContent = defaultLabel;
    }

    window.setTimeout(() => {
      copyStatus.textContent = '';
      copyContactButton.textContent = defaultLabel;
    }, 2400);
  });
}
