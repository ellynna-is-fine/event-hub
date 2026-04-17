function validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    clearErrors();
    
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('email', 'Email không được để trống');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Email không hợp lệ');
        isValid = false;
    }

    // Validate Password
    if (!password) {
        showError('password', 'Mật khẩu không được để trống');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.style.border = '1.5px solid #e9728d';

    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.cssText = `
        color: #e9728d;
        font-size: 11px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        margin-left: 5px;
        display: block;
    `;
    error.textContent = '⚠ ' + message;
    field.insertAdjacentElement('afterend', error);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input').forEach(el => el.style.border = '');
}

