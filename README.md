# Heart URL Show - Romantic Birthday Surprise For Your Loved One!

A beautiful, interactive web application designed to create memorable romantic birthday surprises with animated hearts and personalized messages.

<img width="1903" height="1091" alt="image" src="https://github.com/user-attachments/assets/e24a22cb-368d-4d47-980d-628745caecc0" />


## ✨ Features

- 🎨 **Animated Heart Effects** - Beautiful floating heart animations
- 💌 **Personalized Messages** - Custom birthday wishes and romantic notes
- 🎉 **Interactive UI** - Engaging user experience with smooth transitions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Fast Loading** - Optimized performance with Vercel deployment

## 🚀 Live Demo

Check out the live application: [heart-url-show.vercel.app](https://heart-url-show.vercel.app/)

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **Styling**: CSS3 / Tailwind CSS
- **Animations**: CSS Animations / Framer Motion
- **Deployment**: Vercel
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Atom9950/heart-url-show.git
cd heart-url-show
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

## 🎨 Customization

### Modify Messages
Edit the messages in the configuration file:
```javascript
// config/messages.js
export const messages = {
  title: "Happy Birthday! 🎂",
  subtitle: "To the most amazing person",
  wishes: [
    "Your custom wish here...",
    "Another heartfelt message..."
  ]
};
```

### Change Colors
Customize the color scheme in your CSS/Tailwind config:
```css
:root {
  --primary-color: #ff69b4;
  --secondary-color: #ff1493;
  --background: #ffe4e1;
}
```

### Adjust Animations
Modify animation timings and effects:
```css
.heart {
  animation: float 3s ease-in-out infinite;
}
```

## 🎯 Usage

1. **For Birthday Surprises**: Share the link with your loved one
2. **Customize**: Personalize messages, colors, and animations
3. **Deploy**: Host your own version with custom content

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with one click

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

⭐ If you found this project helpful, please give it a star!
