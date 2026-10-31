# 🎂 Trang web chúc mừng sinh nhật phép thuật

Một trang web sinh nhật tương tác gồm 4 giai đoạn: hộp quà mở màn, bánh kem 3 tầng thổi nến, thư viện ảnh Polaroid 3D và bức thư niêm phong sáp. Toàn bộ nội dung hiển thị trên web là tiếng Anh, còn tài liệu này viết bằng tiếng Việt.

## 1. Lưu file

Tạo một thư mục mới (ví dụ `birthday`) và lưu **4 file vào cùng một thư mục**:

```
birthday/
├── index.html
├── style.css
├── script.js
└── README.md
```

Tên file phải đúng chính xác, vì `index.html` liên kết tới `style.css` và `script.js` theo tên.

## 2. Chạy thử bằng VS Code Live Server

1. Mở VS Code, chọn **File → Open Folder** và mở thư mục `birthday`.
2. Vào tab **Extensions**, tìm **Live Server** (tác giả Ritwick Dey) rồi bấm **Install**.
3. Chuột phải vào `index.html`, chọn **Open with Live Server**.
4. Trình duyệt sẽ mở địa chỉ dạng `http://127.0.0.1:5500`.

## 3. Thổi nến

Ở màn hình bánh kem, bấm nút **"Make a Wish & Tap to Blow 🎂"** để thổi tắt nến. Muốn thổi lại, dùng nút **"Relight Candle 🕯️"** ở thanh điều khiển cuối trang.

## 4. Chỗ cần sửa để cá nhân hóa

### Tên người nhận, tên bạn, ngày sinh nhật, nội dung thư (`script.js`)

Mở `script.js`, tìm khối `CONFIG` ở **đầu file (khoảng dòng 4 đến 14)**:

```js
const CONFIG = {
  recipient: 'My Princess',   // tên người nhận
  from: 'Your Name',          // tên của bạn (chữ ký cuối thư)
  date: 'October 31st',       // ngày sinh nhật
  letter: `...`               // nội dung bức thư (giữ nguyên {name} để tự chèn tên)
};
```

Tên người nhận và ngày được tự động điền vào mọi chỗ trên trang.

### Thay ảnh cá nhân (`index.html`)

Tìm 4 chỗ có comment `<!-- THAY LINK ẢNH CỦA BẠN Ở ĐÂY -->` trong phần `Stage 3` (khoảng **dòng 100 đến 130**). Dòng ngay bên dưới là thẻ `<img src="...">`. Thay phần trong `src` bằng:

- Đường dẫn ảnh trong máy: tạo thư mục `images` cạnh `index.html`, rồi dùng `src="images/anh1.jpg"`.
- Hoặc một link ảnh trực tuyến.

Ảnh vuông sẽ đẹp nhất, vì khung đã tự cắt về tỉ lệ 1:1.

### Sửa chú thích dưới ảnh (`index.html`)

Cũng trong 4 khung Polaroid đó, sửa nội dung thẻ `<figcaption>...</figcaption>` ngay dưới mỗi ảnh.

### Sửa các dòng chữ khác (`index.html`)

- Lời mời ở màn hình đầu: thẻ `<p class="gate-text">`.
- Phụ đề: thẻ `<p class="subtitle">`.
- Chữ trên các nút: tìm các thẻ `<button>`.
- Chữ trên thanh điều khiển ở cuối trang: thẻ `<nav id="controlBar">`.

### Đổi giai điệu nhạc hộp (`script.js`)

Tìm mảng `const song = [...]`. Mỗi phần tử có dạng `['G4', .75]`, gồm tên nốt và số phách.

## 5. Mẹo sử dụng

- Chạm hoặc click vào bóng bay để làm nổ bóng.
- Di chuột hoặc vuốt tay để rải bụi sao.
- Click đúp (hoặc chạm hai lần trên điện thoại) vào ảnh để bắn trái tim.
- Trình duyệt chỉ cho phép phát âm thanh sau khi người dùng bấm, nên nhạc sẽ bật khi bấm hộp quà.
- Thanh điều khiển ở cuối trang cho phép bắn pháo hoa, thả mưa trái tim, thắp lại nến và bật/tắt nhạc.

## 6. Đưa web lên mạng miễn phí

### Cách A: Netlify Drop (nhanh nhất, không cần tài khoản Git)

1. Vào <https://app.netlify.com/drop>.
2. Kéo cả thư mục `birthday` thả vào trang.
3. Chờ vài giây, Netlify trả về một đường link. Gửi link đó cho người nhận.
4. Muốn link ổn định lâu dài, đăng ký tài khoản Netlify miễn phí và nhận site.

### Cách B: GitHub Pages

1. Tạo tài khoản tại <https://github.com> và bấm **New repository** (ví dụ tên `birthday`, chọn **Public**).
2. Bấm **uploading an existing file**, kéo thả `index.html`, `style.css`, `script.js` (và thư mục `images` nếu có), rồi bấm **Commit changes**.
3. Vào **Settings → Pages**. Ở mục **Build and deployment**, chọn **Deploy from a branch**, branch `main`, thư mục `/ (root)`, rồi bấm **Save**.
4. Sau 1 đến 2 phút, web chạy tại `https://<ten-github-cua-ban>.github.io/birthday/`.

## 7. Tối ưu cho điện thoại

Trên điện thoại, trang tự giảm tải: ít sao, ít hạt pháo hoa, ít bóng bay hơn, bỏ nền gradient chuyển động, giảm hiệu ứng kính mờ và bóng đổ, canvas vẽ ở độ phân giải thấp hơn. Chạm hai lần vào ảnh chỉ bắn trái tim một lần và không bị zoom trang. Âm thanh tự tạm dừng khi bạn chuyển ứng dụng hoặc khóa màn hình.

- **iPhone:** gạt công tắc im lặng sang chế độ có chuông, nếu không sẽ không nghe thấy nhạc và hiệu ứng âm thanh.
- Nếu máy vẫn giật, mở `script.js` và giảm `MAXP` (số hạt tối đa) hoặc `PS` (hệ số hạt) ở gần đầu phần Canvas.

## 8. Lưu ý

- Cần internet để tải font Google, `canvas-confetti`, `vanilla-tilt` và ảnh mẫu từ Unsplash.
- Đã tôn trọng chế độ "giảm chuyển động" của hệ điều hành (ảnh hưởng một phần hiệu ứng).
- Trình duyệt khuyến nghị: Chrome, Edge, Safari và Firefox bản mới.

Chúc bạn có một món quà sinh nhật thật đáng nhớ! 💖
