# ระบบเช่าอุปกรณ์เครื่องเสียง - BNSound

ระบบจัดการการเช่าอุปกรณ์เครื่องเสียงแบบ Progressive Web App (PWA) ที่พัฒนาด้วย React และ TypeScript

## คุณสมบัติหลัก

### 🎯 แดชบอร์ด
- แสดงสถิติงานรายเดือน
- กราฟแท่งแสดงจำนวนงานและงานที่เสร็จสิ้น
- การ์ดสรุปข้อมูลสำคัญ:
  - จำนวนอุปกรณ์ทั้งหมด
  - อุปกรณ์ที่ว่าง
  - งานเดือนปัจจุบัน
  - รายได้เดือนปัจจุบัน
- ตารางแสดงการจองล่าสุด

### 📋 ระบบจองคิวงาน
- สร้างการจองใหม่
- แก้ไขการจองที่มีอยู่
- ลบการจอง
- แสดงสถานะการจอง (รอยืนยัน, ยืนยันแล้ว, เสร็จสิ้น, ยกเลิก)
- คำนวณราคาอัตโนมัติตามจำนวนวัน

## เทคโนโลยีที่ใช้

- **Frontend**: React 19, TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **Charts**: Chart.js with react-chartjs-2
- **Date Picker**: MUI X Date Pickers
- **Routing**: React Router DOM
- **PWA**: Service Worker, Web App Manifest

## การติดตั้ง

1. Clone repository:
```bash
git clone <repository-url>
cd bnsound
```

2. ติดตั้ง dependencies:
```bash
npm install --legacy-peer-deps
```

3. รันแอปพลิเคชัน:
```bash
npm start
```

4. สร้าง production build:
```bash
npm run build
```

## โครงสร้างโปรเจค

```
src/
├── components/          # React components
│   └── Layout.tsx      # Layout component with navigation
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard page
│   └── BookingQueue.tsx # Booking queue page
├── types/              # TypeScript type definitions
│   └── index.ts        # Interface definitions
├── utils/              # Utility functions
└── App.tsx             # Main App component
```

## คุณสมบัติ PWA

- ✅ สามารถติดตั้งบนอุปกรณ์มือถือและเดสก์ท็อป
- ✅ ทำงานแบบ Offline (ด้วย Service Worker)
- ✅ UI ที่เหมาะสมสำหรับมือถือ
- ✅ การแจ้งเตือนแบบ Push (พร้อมใช้งาน)

## การใช้งาน

### แดชบอร์ด
- ดูสถิติงานรายเดือนผ่านกราฟ
- ตรวจสอบข้อมูลสรุปในรูปแบบการ์ด
- ดูรายการการจองล่าสุด

### ระบบจองคิว
- กดปุ่ม "จองใหม่" เพื่อสร้างการจอง
- กรอกข้อมูลลูกค้าและเลือกอุปกรณ์
- เลือกวันที่เริ่มและสิ้นสุด
- ระบบจะคำนวณราคาอัตโนมัติ
- แก้ไขหรือลบการจองที่มีอยู่

## การพัฒนาต่อ

### ฟีเจอร์ที่แนะนำสำหรับอนาคต:
- ระบบ Authentication
- การเชื่อมต่อกับ Backend API
- ระบบแจ้งเตือน
- การจัดการอุปกรณ์
- ระบบรายงาน
- การชำระเงินออนไลน์

## การ Deploy

### Netlify
1. สร้างไฟล์ `netlify.toml`:
```toml
[build]
  publish = "build"
  command = "npm run build"
```

2. Deploy ผ่าน Netlify CLI หรือ GitHub integration

### Vercel
1. ติดตั้ง Vercel CLI
2. รัน `vercel` ในโฟลเดอร์โปรเจค

## License

MIT License 