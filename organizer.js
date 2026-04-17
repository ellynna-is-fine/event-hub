const STORAGE_KEY = 'eventFormData';
const EVENTS_KEY  = 'userCreatedEvents';

const PAGE_FIELDS = {
    'organizer-create.html': [
        { id: 'event-name',      key: 'event_name' },
        { id: 'event-category1', key: 'event_category1' },
        { id: 'event-category2', key: 'event_category2' },
        { id: 'event-startday',  key: 'event_startday' },
        { id: 'event-endday',    key: 'event_endday' },
        { id: 'event-starttime', key: 'event_starttime' },
        { id: 'event-endtime',   key: 'event_endtime' },
        { id: 'event-location',  key: 'event_location' },
        { id: 'event-capicity',  key: 'event_capicity' },
    ],
    'organizer2-create.html': [
        { id: 'event-short-desc', key: 'event_short_desc' },
        { id: 'event-full-desc',  key: 'event_full_desc' },
        { id: 'event-tags',       key: 'event_tags' },
    ],
    'organizer3-create.html': [
        { id: 'event-ticket-type',       key: 'event_ticket_type' },
        { id: 'event-ticket-price',      key: 'event_ticket_price' },
        { id: 'event-register-deadline', key: 'event_register_deadline' },
        { id: 'event-conditions',        key: 'event_conditions' },
    ],
};



function loadData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadEvents() {
    try { return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); }
    catch { return []; }
}

function saveEvents(events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'organizer-create.html';
}



function setupImageUpload() {
    const fileInput = document.getElementById('fileInput');
    const dropZone  = document.querySelector('.file');
    if (!fileInput) return;

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;


        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;


            const data = loadData();
            data.event_image = base64;
            saveData(data);


            if (dropZone) {
                dropZone.style.backgroundImage = `url('${base64}')`;
                dropZone.style.backgroundSize  = 'cover';
                dropZone.style.backgroundPosition = 'center';
                dropZone.querySelector('div:first-child').textContent = '✅ Ảnh đã được tải lên';
                dropZone.querySelector('div:last-child').textContent  = file.name;
            }
        };
        reader.readAsDataURL(file);
    }

    fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));


    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#c94070';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = '#e9728d';
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#e9728d';
            handleFile(e.dataTransfer.files[0]);
        });
    }


    const saved = loadData().event_image;
    if (saved && dropZone) {
        dropZone.style.backgroundImage = `url('${saved}')`;
        dropZone.style.backgroundSize  = 'cover';
        dropZone.style.backgroundPosition = 'center';
        dropZone.querySelector('div:first-child').textContent = '✅ Ảnh đã được tải lên';
        dropZone.querySelector('div:last-child').textContent  = 'Ảnh đã lưu';
    }
}



function saveCurrentPage() {
    const fields = PAGE_FIELDS[getCurrentPage()];
    if (!fields) return;
    const data = loadData();
    fields.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (el) data[key] = el.value;
    });
    saveData(data);
}

function restoreCurrentPage() {
    const fields = PAGE_FIELDS[getCurrentPage()];
    if (!fields) return;
    const data = loadData();
    fields.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (el && data[key] !== undefined && data[key] !== '') el.value = data[key];
    });
}

function setupAutoSave() {
    const fields = PAGE_FIELDS[getCurrentPage()];
    if (!fields) return;
    fields.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input',  saveCurrentPage);
            el.addEventListener('change', saveCurrentPage);
        }
    });
}

function setupNavButtons() {
    document.querySelectorAll('.next, .back').forEach(btn => {
        btn.addEventListener('click', saveCurrentPage);
    });
}



function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function renderSummary() {
    const data = loadData();

    const priceText = (() => {
        if (data.event_ticket_type === 'Miễn phí') return 'Miễn phí';
        return data.event_ticket_price
            ? Number(data.event_ticket_price).toLocaleString('vi-VN') + ' VNĐ'
            : '—';
    })();

    const dateText = (() => {
        const start  = formatDate(data.event_startday);
        const end    = formatDate(data.event_endday);
        const tStart = data.event_starttime || '';
        const tEnd   = data.event_endtime   || '';
        let str = start;
        if (end && end !== start) str += ` – ${end}`;
        if (tStart || tEnd) str += ` · ${tStart}${tEnd ? ' – ' + tEnd : ''}`;
        return str;
    })();

    const map = {
        'summary-name':     data.event_name,
        'summary-category': data.event_category1,
        'summary-format':   data.event_category2,
        'summary-date':     dateText,
        'summary-location': data.event_location,
        'summary-capicity': data.event_capicity ? data.event_capicity + ' người' : '—',
        'summary-desc':     data.event_short_desc,
        'summary-tags':     data.event_tags,
        'summary-ticket':   data.event_ticket_type,
        'summary-price':    priceText,
        'summary-deadline': formatDate(data.event_register_deadline),
    };

    Object.entries(map).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '—';
    });
}



function setupSubmitClear() {
    const submitBtn = document.querySelector('.dangnhap');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const data = loadData();

        const newEvent = {
            id:          Date.now(),
            name:        data.event_name        || 'Sự kiện không tên',
            category:    data.event_category1   || '',
            format:      data.event_category2   || '',
            startDay:    data.event_startday     || '',
            endDay:      data.event_endday       || '',
            startTime:   data.event_starttime    || '',
            endTime:     data.event_endtime      || '',
            location:    data.event_location     || '',
            capacity:    data.event_capicity     || '',
            shortDesc:   data.event_short_desc   || '',
            fullDesc:    data.event_full_desc    || '',
            tags:        data.event_tags         || '',
            ticketType:  data.event_ticket_type  || 'Miễn phí',
            ticketPrice: data.event_ticket_price || '0',
            deadline:    data.event_register_deadline || '',
            conditions:  data.event_conditions  || '',
            image: data.event_image || 'https://i.pinimg.com/736x/42/5c/c6/425cc62e534c6b65ef48a7eee013817b.jpg',
            createdAt: new Date().toISOString(),
        };

        const events = loadEvents();
        events.unshift(newEvent); 
        saveEvents(events);


        localStorage.removeItem(STORAGE_KEY);


        window.location.href = 'index.html';
    });
}



const page = getCurrentPage();

if (page === 'organizer4-create.html') {
    renderSummary();
    setupSubmitClear();
} else {
    restoreCurrentPage();
    setupAutoSave();
    setupNavButtons();

    if (page === 'organizer2-create.html') {
        setupImageUpload();
    }
}