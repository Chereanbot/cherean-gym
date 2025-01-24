# Cherean Gym - Portfolio & Blog Platform

A modern, full-stack portfolio and blog platform built with Next.js 14, featuring AI-powered content generation, real-time analytics, and a comprehensive admin dashboard.

## 🌟 Features

- **Modern Tech Stack**: Built with Next.js 14, React, TailwindCSS, and MongoDB
- **AI Integration**: Gemini AI for content analysis and generation
- **Real-time Analytics**: Track visitor engagement and performance metrics
- **Admin Dashboard**: Comprehensive management interface for all content
- **Blog Platform**: Full-featured blog with AI-assisted content creation
- **Portfolio Management**: Showcase projects, skills, and experiences
- **Cloud Integration**: Cloudinary for media management
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **SEO Optimized**: Built-in SEO best practices and optimization tools

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Cloudinary account
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Chereanbot/cherean-gym.git
cd cherean-gym
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in your environment variables in the `.env` file.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB
- **AI Services**: Google Gemini AI
- **Cloud Services**: Cloudinary, Vercel
- **Analytics**: Custom analytics implementation
- **Authentication**: JWT, NextAuth.js
- **Database**: MongoDB with Mongoose
- **Testing**: Jest, React Testing Library
- **CI/CD**: Vercel CI/CD pipeline

## 📁 Project Structure

```
cherean-gym/
├── src/
│   ├── app/              # Next.js 14 app directory
│   ├── components/       # React components
│   ├── models/          # MongoDB models
│   ├── utils/           # Utility functions
│   └── lib/             # Shared libraries
├── public/              # Static assets
└── ...
```

## 🔑 Environment Variables

Required environment variables:

- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `GEMINI_API_KEY`: Google Gemini API key
- See `.env.example` for all required variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Google Gemini AI](https://deepmind.google/technologies/gemini/)

## 📧 Contact

For questions and support, please email [your-email@example.com](mailto:your-email@example.com)

---
Built with ❤️ by [Your Name]
