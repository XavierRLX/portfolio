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
  const previousFocus = document.activeElement;
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  try {
    textarea.select();
    if (!document.execCommand('copy')) throw new Error('Copy command failed');
  } finally {
    textarea.remove();
    previousFocus?.focus({ preventScroll: true });
  }
};

if (copyContactButton && copyStatus) {
  let resetTimer;
  let copying = false;
  const defaultLabel = copyContactButton.textContent;
  copyContactButton.addEventListener('click', async () => {
    if (copying) return;
    copying = true;
    clearTimeout(resetTimer);
    copyStatus.textContent = '';
    copyContactButton.removeAttribute('data-copy-state');
    copyContactButton.setAttribute('aria-busy', 'true');
    const value = copyContactButton.dataset.copyValue;

    try {
      await copyText(value);
      copyStatus.textContent = 'E-mail copiado.';
      copyContactButton.textContent = 'Copiado ✓';
      copyContactButton.dataset.copyState = 'success';
    } catch {
      copyStatus.textContent = 'Não foi possível copiar. Selecione o endereço acima ou use “Enviar e-mail”.';
      copyContactButton.textContent = defaultLabel;
      copyContactButton.dataset.copyState = 'error';
    } finally {
      copying = false;
      copyContactButton.removeAttribute('aria-busy');
    }

    // Keep errors available for reading; only a confirmed success expires.
    if (copyContactButton.dataset.copyState !== 'success') return;
    resetTimer = window.setTimeout(() => {
      copyStatus.textContent = '';
      copyContactButton.textContent = defaultLabel;
      copyContactButton.removeAttribute('data-copy-state');
    }, 4000);
  });
}
