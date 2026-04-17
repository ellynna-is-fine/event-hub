function validateForm() {
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const sdt = document.getElementById('sdt').value.trim();
    const company = document.getElementById('company').value.trim();
    
    clearErrors();
    
    let isValid = true;

    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sdtRegex = /^[0-9]{10}$/;
    
    if (!name) {
        showError('name', 'Tên không được để trống');
        isValid = false;
    } else if (!nameRegex.test(name)) {
        showError('name', 'Tên không được chứa số hoặc ký tự đặc biệt');
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

    if (!company) {
        showError('company', 'Đơn vị / Trường học không được để trống');
        isValid = false;
    } 

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.style.outline = '1.5px solid #e9728d';

    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.cssText = `
        color: #fafafa;
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
    document.querySelectorAll('.ed-form input').forEach(el => el.style.border = '');
}

