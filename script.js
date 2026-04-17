(function () {
    const EVENTS_KEY = 'userCreatedEvents';

    function loadEvents() {
        try { return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); }
        catch { return []; }
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    function makePriceLabel(event) {
        if (event.ticketType === 'Miễn phí') return 'Miễn phí';
        const n = Number(event.ticketPrice);
        return n ? n.toLocaleString('vi-VN') + ' VNĐ' : 'Miễn phí';
    }

    function buildCard(event) {
        const dateLabel = formatDate(event.startDay) || '—';
        const price     = makePriceLabel(event);
        const isOnline  = (event.format || '').toLowerCase().includes('online');
        const formatBadge = isOnline
            ? '<span class="ue-badge ue-badge--online">Online</span>'
            : '<span class="ue-badge ue-badge--offline">Offline</span>';

        return `
        <article class="ue-card">
            <a href="event-detail.html" class="ue-card__img-wrap">
                <img src="${event.image}" alt="${event.name}" loading="lazy">
                <div class="ue-card__overlay">
                    <span class="ue-price">${price}</span>
                    ${formatBadge}
                </div>
            </a>
            <div class="ue-card__body">
                <span class="ue-category">${event.category || ''}</span>
                <h3 class="ue-card__title">
                    <a href="event-detail.html">${event.name}</a>
                </h3>
                <p class="ue-card__meta">
                    <span>📅 ${dateLabel}</span>
                    ${event.location ? `<span>📍 ${event.location}</span>` : ''}
                </p>
                ${event.shortDesc
                    ? `<p class="ue-card__desc">${event.shortDesc}</p>`
                    : ''}
            </div>
        </article>`;
    }

    function injectStyles() {
        if (document.getElementById('ue-styles')) return;
        const style = document.createElement('style');
        style.id = 'ue-styles';
        style.textContent = `
/* ── User Events Section ── */
.ue-section {
    background: linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%);
    padding: 36px 0 40px;
    border-bottom: 1px solid #f0d0da;
}
.ue-section .section-title {
    color: #c94070;
}
.ue-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}
.ue-header h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
    color: #c94070;
    display: flex;
    align-items: center;
    gap: 8px;
}
.ue-header h2::before {
    content: '✨';
}
.ue-new-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .6px;
    color: #fff;
    background: #e9728d;
    border-radius: 20px;
    padding: 2px 9px;
    vertical-align: middle;
}
.ue-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 20px;
}
.ue-card {
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(233,114,141,.13);
    transition: transform .22s, box-shadow .22s;
}
.ue-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(233,114,141,.22);
}
.ue-card__img-wrap {
    display: block;
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
}
.ue-card__img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform .35s;
}
.ue-card:hover .ue-card__img-wrap img {
    transform: scale(1.06);
}
.ue-card__overlay {
    position: absolute;
    bottom: 8px;
    left: 8px;
    display: flex;
    gap: 6px;
    align-items: center;
}
.ue-price {
    background: rgba(0,0,0,.55);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
}
.ue-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 20px;
}
.ue-badge--online  { background: #d0f0e8; color: #1a7a58; }
.ue-badge--offline { background: #fde8c8; color: #8a4d0f; }
.ue-card__body {
    padding: 14px 16px 16px;
}
.ue-category {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: #e9728d;
    background: #ffeef2;
    padding: 2px 8px;
    border-radius: 20px;
}
.ue-card__title {
    margin: 8px 0 6px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
}
.ue-card__title a {
    color: #1a1a1a;
    text-decoration: none;
}
.ue-card__title a:hover { color: #e9728d; }
.ue-card__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 11.5px;
    color: #777;
    margin: 0 0 6px;
}
.ue-card__desc {
    font-size: 12px;
    color: #555;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.ue-empty {
    text-align: center;
    color: #aaa;
    font-size: 13px;
    padding: 20px 0;
}
        `;
        document.head.appendChild(style);
    }

    function render() {
        const events = loadEvents();
        if (!events.length) return;

        injectStyles();

        const section = document.createElement('section');
        section.className = 'ue-section section-block';
        section.innerHTML = `
        <div class="container">
            <div class="ue-header">
                <h2>Sự kiện bạn đã tạo <span class="ue-new-badge">${events.length} mới</span></h2>
            </div>
            <div class="ue-grid">
                ${events.map(buildCard).join('')}
            </div>
        </div>`;

        const main = document.querySelector('main');
        const featured = document.querySelector('.featured-section');
        if (main && featured) {
            main.insertBefore(section, featured);
        } else if (main) {
            main.prepend(section);
        }
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();