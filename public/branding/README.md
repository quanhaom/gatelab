# Thay logo LabGate

Cách nhanh nhất:

1. Chuẩn bị logo của bạn dạng SVG hoặc PNG nền trong suốt.
2. Nếu dùng SVG: thay trực tiếp file `public/branding/logo.svg` nhưng giữ nguyên tên file.
3. Nếu dùng PNG: lưu thành `public/branding/logo.png`, sau đó sửa `logoPath` trong `lib/branding.ts` thành `/branding/logo.png`.
4. Kích thước khuyến nghị: logo vuông 512x512 px hoặc SVG viewBox vuông.

Tên sản phẩm, tagline, tên công ty và vai trò cũng có thể đổi trong `lib/branding.ts`.
