import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import ClientAnalytics from '@/components/ClientAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cherinet Afewerk | Ethiopian Developer',
  description: 'Top Ethiopian website developer and ethical hacker. Known as Cherean, Cheri in the tech community. Computer Science student at Dilla University specializing in AI solutions, web development, and cybersecurity.',
  keywords: 'Cherinet Afewerk, Cherean, Cheri, Ethiopian developer, Ethio hackers, Ethiopian programmer, Ethiopian web developer, Dilla University, cybersecurity Ethiopia, AI solutions Ethiopia, Next.js developer Ethiopia, React developer Ethiopia, Ethiopian tech talent, Ethiopian Computer Science, Ethiopian software engineer, Ethiopian ethical hacker',
  openGraph: {
    title: 'Cherinet Afewerk | Ethiopian Developer',
    description: 'Top Ethiopian website developer and ethical hacker. Known as Cherean, Cheri in the tech community. Computer Science student at Dilla University specializing in AI solutions, web development, and cybersecurity.',
    url: 'https://cherinetafewerk.vercel.app',
    siteName: 'Cherinet Afewerk Portfolio',
    images: [
      {
        url: 'https://cherinetafewerk.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cherinet Afewerk - Ethiopian Full Stack Developer'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cherinet Afewerk | Ethiopian Developer & Ethical Hacker',
    description: 'Top Ethiopian website developer and ethical hacker. Known as Cherean, Cheri in the tech community. Computer Science student at Dilla University specializing in AI solutions, web development, and cybersecurity.',
    images: ['https://cherinetafewerk.vercel.app/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googledc67705f444f6806',
  },
  authors: [{ name: 'Cherinet Afewerk', url: 'https://cherinetafewerk.vercel.app' }],
  creator: 'Cherinet Afewerk',
  publisher: 'Cherinet Afewerk',
  category: 'Technology',
  alternates: {
    canonical: 'https://cherinetafewerk.vercel.app'
  }
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/react-quill@2.0.0/dist/quill.snow.css" 
        />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Cherinet Afewerk',
              alternateName: ['Cherean', 'Cheri', 'Ethiopian Developer', 'Ethical Hacker', 'Cherinet Afewerk', '40 minch',' gamo lij'],
              birthDate: 'January 2nd',
              nationality: 'Ethiopian',
              url: 'https://cherinetafewerk.vercel.app',
              image: 'https://cherinetafewerk.vercel.app/og-image.jpg',
              sameAs: [
                'https://github.com/Chereanbot',
                'https://github.com/Developer-Cher'
              ],
              jobTitle: ['Full Stack Developer', 'Ethical Hacker', 'AI Developer'],
              description: 'Leading Ethiopian website developer and ethical hacker, known as Cherean/Cheri. Computer Science student at Dilla University specializing in modern web technologies, AI solutions, and cybersecurity.',
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance',
                description: 'Providing web development and cybersecurity services in Ethiopia'
              },
              alumniOf: [
                {
                  '@type': 'EducationalOrganization',
                  name: 'Dilla University',
                  department: 'Computer Science',
                  educationalLevel: 'Bachelor\'s Degree',
                  status: 'Current Student - 8th Semester',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Dilla',
                    addressRegion: 'SNNPR',
                    addressCountry: 'Ethiopia'
                  }
                }
              ],
              knowsAbout: [
                'Ethiopian Web Development',
                'Cybersecurity in Ethiopia',
                'Ethical Hacking',
                'Next.js 14',
                'React',
                'TypeScript',
                'MongoDB',
                'AI Solutions for Ethiopian Market',
                'Gym Management Systems',
                'Ethiopian Coffee Market Technology',
                'Teff Market Solutions',
                'Ethiopian Tech Industry',
                'SNNPR Tech Development',
                'Ethiopian Software Engineering'
              ],
              hasOccupation: {
                '@type': 'Occupation',
                name: 'Full Stack Developer',
                skills: [
                  'Ethiopian Website Development',
                  'AI Integration',
                  'Database Management',
                  'UI/UX Design',
                  'API Development',
                  'Ethical Hacking',
                  'Cybersecurity'
                ],
                responsibilities: [
                  'Creating gym management websites',
                  'Developing AI solutions for Ethiopian markets',
                  'Building waste material export systems',
                  'Implementing notification systems',
                  'Providing cybersecurity solutions'
                ]
              },
              award: [
                {
                  '@type': 'Award',
                  name: 'Top Website Developer in Ethiopia',
                  description: 'Recognized for excellence in Ethiopian web development'
                }
              ],
              memberOf: {
                '@type': 'Organization',
                name: 'Ethiopian Tech Community',
                description: 'Active member of Ethiopian developer community and incubation centers'
              }
            })
          }}
        />
        <meta name="geo.region" content="ET" />
        <meta name="geo.placename" content="Dilla, Ethiopia" />
        <link rel="author" href="https://cherinetafewerk.vercel.app" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-center" />
        <GoogleAnalytics />
        <ClientAnalytics />
        {children}
        <Analytics />
      </body>
    </html>
  )
} 