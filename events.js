const CARDS_PER_PAGE = 6;
let currentPage = 1;


function normalize(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ')
        .trim();
}


const CATEGORY_MAP = {
    'cong-nghe':  normalize('Công nghệ'),
    'ca-nhac':    normalize('Ca nhạc'),
    'giao-duc':   normalize('Giáo dục'),
    'nghe-thuat': normalize('Nghệ thuật'),
    'the-thao':   normalize('Thể thao'),
    'am-thuc':    normalize('Ẩm thực'),
    'hai-kich':   normalize('Hài kịch'),
};

const CITY_MAP = {
    'ha-noi':      ['hn', 'ha noi', 'hanoi'],
    'ho-chi-minh': ['ho chi minh', 'hcm', 'sai gon', 'ben thanh'],
    'da-nang':     ['da nang'],
    'online':      ['online'],
};


function getCheckedValues(name) {
    return [...document.querySelectorAll(`.ev-filter-form input[name="${name}"]:checked`)]
        .map(el => el.value);
}

function getKeywordFromURL() {
    return new URLSearchParams(window.location.search).get('keyword') || '';
}


function getVisibleCards() {
    const keyword    = normalize(getKeywordFromURL());
    const categories = getCheckedValues('category');
    const cities     = getCheckedValues('city');
    const formats    = getCheckedValues('format');
    const prices     = getCheckedValues('price');

    const allCards = [...document.querySelectorAll('.ev-card')];

    return allCards.filter(card => {
        const title    = normalize(card.querySelector('.ev-card-title')?.textContent || '');
        const location = normalize(card.querySelector('.ev-card-location')?.textContent || '');
        const category = normalize(card.querySelector('.ev-card-category')?.textContent || '');
        const badge    = normalize(card.querySelector('.ev-card-badge-type')?.textContent || '');
   


        const matchKeyword = !keyword ||
            title.includes(keyword) ||
            location.includes(keyword);

        const matchCategory = categories.length === 0 ||
            categories.some(val => {
                const mapped = CATEGORY_MAP[val];
                return mapped && category === mapped;
            });

 
        const matchCity = cities.length === 0 ||
            cities.some(val => {
                const keywords = CITY_MAP[val] || [normalize(val)];
                return keywords.some(kw => location.includes(kw));
            });


        const matchPrice = prices.length === 0 ||
            (prices.includes('mien-phi') && badge === 'mien phi');


        const isOnline = location.includes('online') || badge.includes('online');
        const matchFormat = formats.length === 0 ||
            (formats.includes('online')  &&  isOnline) ||
            (formats.includes('offline') && !isOnline);

        return matchKeyword && matchCategory && matchCity && matchPrice && matchFormat;
    });
}


function renderPage(visibleCards, page) {
    const allCards = [...document.querySelectorAll('.ev-card')];
    const start = (page - 1) * CARDS_PER_PAGE;
    const end   = start + CARDS_PER_PAGE;
    const pageCards = visibleCards.slice(start, end);


    allCards.forEach(card => card.style.display = 'none');

    pageCards.forEach(card => card.style.display = '');


    document.getElementById('no-result-msg')?.remove();
    if (visibleCards.length === 0) {
        const grid = document.querySelector('.ev-grid');
        const msg = document.createElement('p');
        msg.id = 'no-result-msg';
        msg.style.cssText = `
            grid-column: 1/-1; text-align: center;
            color: #e9728d; font-weight: bold;
            padding: 40px 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        `;
        msg.textContent = '😕 Không tìm thấy sự kiện phù hợp. Hãy thử bộ lọc khác!';
        grid.appendChild(msg);
    }


    const resultText = document.querySelector('.ev-results-text');
    if (resultText) {
        const kw = getKeywordFromURL();
        resultText.textContent = kw
            ? `Tìm thấy ${visibleCards.length} sự kiện cho "${kw}"`
            : `Hiển thị ${visibleCards.length} sự kiện`;
    }
}


function renderPagination(visibleCards) {
    const pagination = document.querySelector('.ev-pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(visibleCards.length / CARDS_PER_PAGE);
    pagination.innerHTML = '';

    if (totalPages <= 1) return; 


    const prev = document.createElement('a');
    prev.href = '#';
    prev.className = 'ev-page-arrow';
    prev.setAttribute('aria-label', 'Trang trước');
    prev.innerHTML = '&#10094;';
    prev.addEventListener('click', e => {
        e.preventDefault();
        if (currentPage > 1) goToPage(currentPage - 1, visibleCards);
    });
    pagination.appendChild(prev);


    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'ev-page-number' + (i === currentPage ? ' active' : '');
            a.textContent = i;
            a.addEventListener('click', e => {
                e.preventDefault();
                goToPage(i, visibleCards);
            });
            pagination.appendChild(a);
        } else if (
            i === currentPage - 2 || i === currentPage + 2
        ) {
            const dots = document.createElement('span');
            dots.className = 'ev-page-dots';
            dots.textContent = '…';
            pagination.appendChild(dots);
        }
    }


    const next = document.createElement('a');
    next.href = '#';
    next.className = 'ev-page-arrow';
    next.setAttribute('aria-label', 'Trang sau');
    next.innerHTML = '&#10095;';
    next.addEventListener('click', e => {
        e.preventDefault();
        if (currentPage < totalPages) goToPage(currentPage + 1, visibleCards);
    });
    pagination.appendChild(next);
}


function goToPage(page, visibleCards) {
    currentPage = page;
    renderPage(visibleCards, currentPage);
    renderPagination(visibleCards);
    // Scroll lên đầu danh sách
    document.querySelector('.ev-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function applyFilters() {
    currentPage = 1;
    const visibleCards = getVisibleCards();
    renderPage(visibleCards, currentPage);
    renderPagination(visibleCards);
}


function setupFilterForm() {
    const form = document.querySelector('.ev-filter-form');
    if (!form) return;

    form.addEventListener('submit', e => { e.preventDefault(); applyFilters(); });
    form.addEventListener('reset',  () => setTimeout(applyFilters, 0));
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
}


function restoreKeyword() {
    const keyword = getKeywordFromURL();
    if (keyword) {
        const input = document.querySelector('.search-box input');
        if (input) input.value = keyword;
    }
}


if (document.querySelector('.events-page')) {
    restoreKeyword();
    setupFilterForm();
    applyFilters();
}