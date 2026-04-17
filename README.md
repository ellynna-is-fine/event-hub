# EventHub

EventHub là một website tĩnh (static web) cho phép người dùng khám phá, đăng ký và tổ chức sự kiện. Dự án được xây dựng thuần bằng HTML, CSS và JavaScript, không sử dụng framework hay thư viện ngoài (trừ Font Awesome cho icon).

---

## Cấu trúc dự án

```
eventhub/
│
├── index.html                  # Trang chủ
├── events.html                 # Danh sách & lọc sự kiện
├── event-detail.html           # Chi tiết sự kiện & đăng ký tham dự
├── login.html                  # Đăng nhập
├── register.html               # Tạo tài khoản
│
├── organizer-create.html       # Tạo sự kiện — Bước 1: Thông tin cơ bản
├── organizer2-create.html      # Tạo sự kiện — Bước 2: Ảnh & Mô tả
├── organizer3-create.html      # Tạo sự kiện — Bước 3: Thông tin vé
├── organizer4-create.html      # Tạo sự kiện — Bước 4: Xác nhận & Gửi duyệt
│
├── style.css                   # CSS dùng chung toàn site (header, footer, layout)
├── events.css                  # CSS riêng cho trang danh sách sự kiện
├── event-detail.css            # CSS riêng cho trang chi tiết sự kiện
│
├── script.js                   # JS trang chủ — hiển thị sự kiện người dùng đã tạo
├── events.js                   # JS trang events — lọc, phân trang, tìm kiếm
├── event-detail.js             # JS trang chi tiết — validate form đăng ký tham dự
├── login.js                    # JS trang đăng nhập — validate form
├── register.js                 # JS trang đăng ký tài khoản — validate form
└── organizer.js                # JS luồng tạo sự kiện — lưu/khôi phục form, submit
```

---

## Tính năng chính

### Trang chủ (`index.html`)
- Banner hero với ảnh sự kiện nổi bật.
- Hiển thị các sự kiện theo danh mục (tab).
- Tự động render các sự kiện người dùng đã tạo (lấy từ `localStorage`) thông qua `script.js`.

### Danh sách sự kiện (`events.html` + `events.js`)
- Lưới thẻ sự kiện với ảnh, tên, ngày, địa điểm và thanh tiến trình đăng ký.
- Bộ lọc theo **danh mục**, **thành phố**, **hình thức** (online/offline) và **giá** (miễn phí).
- Tìm kiếm theo từ khóa qua URL query parameter `?keyword=...`.
- Phân trang động: hiển thị 6 thẻ/trang, tự tính số trang.
- Thông báo "Không tìm thấy sự kiện" nếu kết quả rỗng.

### Chi tiết sự kiện (`event-detail.html` + `event-detail.js`)
- Thông tin đầy đủ: banner, danh mục, ngày giờ, địa điểm, sức chứa.
- Thanh tiến trình đăng ký (số chỗ đã đặt / tổng chỗ).
- Lịch trình sự kiện theo từng khung giờ.
- Form đăng ký tham dự với validate phía client (họ tên, email, số điện thoại, đơn vị).
- Sidebar booking cố định (sticky) khi cuộn trang.
- Nút chia sẻ lên Facebook, Google và sao chép link.

### Đăng nhập & Đăng ký (`login.html`, `register.html`)
- Giao diện hai cột: bảng giới thiệu bên trái, form bên phải.
- Đăng nhập nhanh qua Facebook / Google (liên kết ngoài).
- Validate đầy đủ: email, mật khẩu (≥ 6 ký tự), họ tên, số điện thoại (10 chữ số).
- Hiển thị thông báo lỗi inline dưới từng trường.

### Tạo sự kiện — 4 bước (`organizer-create.html` → `organizer4-create.html` + `organizer.js`)

| Bước | Trang | Nội dung |
|------|-------|----------|
| 1 | `organizer-create.html` | Tên, danh mục, hình thức, ngày giờ, địa điểm, sức chứa |
| 2 | `organizer2-create.html` | Upload ảnh banner, mô tả ngắn, mô tả đầy đủ, tags |
| 3 | `organizer3-create.html` | Loại vé, giá vé, hạn đăng ký, điều kiện tham dự |
| 4 | `organizer4-create.html` | Tóm tắt thông tin, xác nhận gửi duyệt |

- Dữ liệu form tự động lưu vào `localStorage` khi người dùng nhập (`input`/`change`).
- Dữ liệu được khôi phục khi quay lại bước trước.
- Upload ảnh hỗ trợ click chọn file và kéo-thả (drag & drop).
- Khi xác nhận, sự kiện được lưu vào `localStorage` (key: `userCreatedEvents`) và hiển thị ngay trên trang chủ.

---

## Công nghệ sử dụng

| Thành phần | Chi tiết |
|------------|----------|
| Ngôn ngữ | HTML5, CSS3, JavaScript (ES6+) |
| Icon | [Font Awesome 6.5.2](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css) |
| Font chữ | UTM Loko (trang login/register), Arial/Helvetica Neue |
| Lưu trữ | `localStorage` (không có backend) |
| Responsive | CSS Grid + Flexbox, media queries tại 480px / 640px / 768px / 900px / 1100px |

---

## Cách chạy

Vì đây là website tĩnh, chỉ cần mở file trong trình duyệt:

```bash
# Mở trực tiếp
open index.html

# Hoặc dùng Live Server (VS Code extension) để tránh lỗi CORS với file local
```

> **Lưu ý:** Một số ảnh (logo, banner, icon chuông) được tham chiếu bằng tên file cục bộ (ví dụ: `LOGO Web thiết kế sự kiện2.png`, `Chuông.png`). Cần đặt các file ảnh này cùng thư mục với các file HTML để hiển thị đúng.

---

## Luồng dữ liệu `localStorage`

```
organizer.js
  └─► STORAGE_KEY = 'eventFormData'     ← dữ liệu form đang soạn (tạm thời)
  └─► EVENTS_KEY  = 'userCreatedEvents' ← danh sách sự kiện đã tạo (vĩnh viễn)

script.js (trang chủ)
  └─► đọc EVENTS_KEY → render thẻ sự kiện người dùng đã tạo
```

---

## Thư mục ảnh cần có

| File | Dùng ở |
|------|--------|
| `LOGO Web thiết kế sự kiện2.png` | Header toàn site |
| `Chuông.png` | Nút thông báo header |
| `Demo_Thiết_Kế_Web-removebg-preview.png` | Nền trang login/register |
| `UTM-Loko.ttf` | Font chữ trang login/register |
| `images_event-detail-banner.png` | Banner trang chi tiết sự kiện |
| `images_hero-decor-left.png` / `images_hero-decor-right.png` | Trang trí hero trang chủ |
| `anh10.jpg`, `anh13.jpg`, ... | Ảnh sự kiện trang chủ |

---

## Tác giả

Được xây dựng với 💚 tại Việt Nam — **EventHub © 2026**
