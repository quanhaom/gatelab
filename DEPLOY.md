# Deploy LabGate

## 1. Test local

```bash
npm install
npm run dev
```

Mở http://localhost:3000 và test các màn hình.

## 2. Production build

```bash
npm run build
npm start
```

## 3. Push GitHub

```bash
git init
git add .
git commit -m "feat: package LabGate MVP"
git branch -M main
git remote add origin https://github.com/<username>/labgate-platform.git
git push -u origin main
```

## 4. Deploy Vercel

- Vercel > Add New > Project
- Import repository `labgate-platform`
- Framework preset: Next.js
- Build command: `npm run build`
- Output: để Vercel tự nhận diện
- Deploy

Sau mỗi lần push `main`, Vercel sẽ tự build/deploy lại.

## 5. Thay logo

Thay `public/branding/logo.svg` bằng logo thật và giữ nguyên tên file.
Nếu dùng PNG, xem `public/branding/README.md`.
