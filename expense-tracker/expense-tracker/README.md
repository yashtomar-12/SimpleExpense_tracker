# 💰 एक्सपेंस ट्रैकर

HTML + CSS + JavaScript (फ्रंटएंड) | Node.js + Express (बैकएंड) | MySQL (डेटाबेस)

## चलाने के स्टेप

1. MySQL में डेटाबेस बनाएं:
   ```
   mysql -u root -p < schema.sql
   ```
2. `.env.example` को कॉपी करके `.env` बनाएं और अपना MySQL पासवर्ड डालें:
   ```
   cp .env.example .env
   ```
3. पैकेज इंस्टॉल करें:
   ```
   npm install
   ```
4. सर्वर चलाएं:
   ```
   npm start
   ```
5. ब्राउज़र में खोलें: http://localhost:5000

## फीचर्स
- खर्चा जोड़ना, एडिट करना, हटाना
- कुल खर्चे का हिसाब
- कैटेगरी और तारीख
