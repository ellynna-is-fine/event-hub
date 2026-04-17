function validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const ho = document.getElementById('ho').value.trim();
    const ten = document.getElementById('ten').value.trim();
    const sdt = document.getElementById('sdt').value.trim();
    
    clearErrors();
    
    let isValid = true;

    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sdtRegex = /^[0-9]{10}$/;
    
    if (!ho) {
        showError('ho', 'Họ không được để trống');
        isValid = false;
    } else if (!nameRegex.test(ho)) {
        showError('ho', 'Họ không được chứa số hoặc ký tự đặc biệt');
        isValid = false;
    }

    if (!ten) {
        showError('ten', 'Tên không được để trống');
        isValid = false;
    } else if (!nameRegex.test(ten)) {
        showError('ten', 'Tên không được chứa số hoặc ký tự đặc biệt');
        isValid = false;
    }
    
    if (!sdt) {
        showError('sdt', 'Số điện thoại không được để trống');
        isValid = false;
    } else if (isNaN(sdt)) {
        showError('sdt', 'Số điện thoại không được chứa chữ cái');
        isValid = false;
    } else if (!sdtRegex.test(sdt)) {
        showError('sdt', 'Số điện thoại phải có đúng 10 chữ số');
        isValid = false;
    }
    
    if (!email) {
        showError('email', 'Email không được để trống');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Email không hợp lệ');
        isValid = false;
    }

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

