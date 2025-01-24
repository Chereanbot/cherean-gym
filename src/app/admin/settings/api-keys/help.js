export const API_KEY_HELP = {
  gemini: {
    format: {
      pattern: 'sk_gemini_[random string]',
      example: 'sk_gemini_1a2b3c4d5e6f7g8h9i0j',
      length: '40 characters'
    },
    usage: {
      node: `const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('YOUR_API_KEY');`,
      python: `from google.generativeai import GenerativeAI
genai = GenerativeAI('YOUR_API_KEY')`,
      curl: `curl -X POST \\
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`
    },
    validation: {
      rules: [
        'Must start with "sk_gemini_"',
        'Contains only letters and numbers after prefix',
        'Total length should be 40 characters',
        'No special characters allowed'
      ]
    }
  },
  cloudinary: {
    format: {
      pattern: 'cloudinary://api_key:api_secret@cloud_name',
      example: 'cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz@demo',
      parts: [
        'api_key: 12 digits',
        'api_secret: 24-32 characters',
        'cloud_name: your cloud name'
      ]
    },
    usage: {
      node: `const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});`,
      react: `import { Image } from 'cloudinary-react';
<Image 
  cloudName="your_cloud_name" 
  publicId="sample" 
/>`
    },
    validation: {
      rules: [
        'Must follow cloudinary:// URL format',
        'API key must be numeric',
        'API secret must be alphanumeric',
        'Cloud name must be lowercase, no spaces'
      ]
    }
  },
  analytics: {
    format: {
      pattern: {
        ga4: 'G-XXXXXXXXXX',
        universal: 'UA-XXXXXXXX-X'
      },
      example: {
        ga4: 'G-ABC1234567',
        universal: 'UA-12345678-1'
      }
    },
    usage: {
      html: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_MEASUREMENT_ID');
</script>`,
      next: `// pages/_app.js
import { GoogleAnalytics } from 'nextjs-google-analytics';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics measurementId="YOUR_MEASUREMENT_ID" />
      <Component {...pageProps} />
    </>
  );
}`
    },
    validation: {
      rules: [
        'GA4: Must start with "G-"',
        'GA4: Followed by 10 characters',
        'UA: Must start with "UA-"',
        'UA: Format is UA-XXXXXXXX-X'
      ]
    }
  },
  stripe: {
    format: {
      pattern: {
        test: 'sk_test_[random string]',
        live: 'sk_live_[random string]'
      },
      example: {
        test: 'sk_test_51ABC123def456',
        live: 'sk_live_51ABC123def456'
      },
      length: '32-40 characters'
    },
    usage: {
      node: `const stripe = require('stripe')('YOUR_SECRET_KEY');
// Create a payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd'
});`,
      react: `import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');`,
      webhook: `stripe listen --forward-to localhost:3000/api/webhooks`
    },
    validation: {
      rules: [
        'Must start with "sk_test_" or "sk_live_"',
        'Contains version number (51)',
        'Followed by alphanumeric string',
        'Never expose in client-side code'
      ]
    },
    security: {
      warnings: [
        'Never use live keys in development',
        'Keep secret keys server-side only',
        'Use environment variables',
        'Rotate keys if compromised'
      ]
    }
  }
};

export const API_SERVICES = {
  gemini: {
    name: 'Gemini AI',
    description: 'Google\'s Generative AI model for text and chat applications',
    useCases: [
      'AI-powered content generation',
      'Natural language processing',
      'Chatbot functionality'
    ],
    setup: {
      steps: [
        'Visit Google AI Studio',
        'Create or select a project',
        'Generate an API key',
        'Add the key to your environment variables'
      ]
    }
  },
  cloudinary: {
    name: 'Cloudinary',
    description: 'Cloud-based image and video management service',
    useCases: [
      'Image and video uploads',
      'Media optimization',
      'Asset transformation'
    ],
    setup: {
      steps: [
        'Create a Cloudinary account',
        'Navigate to Dashboard',
        'Copy API key, secret and cloud name',
        'Configure upload presets if needed'
      ]
    }
  },
  sendgrid: {
    name: 'SendGrid',
    description: 'Email delivery and management service',
    useCases: [
      'Transactional emails',
      'Marketing campaigns',
      'Email templates'
    ],
    setup: {
      steps: [
        'Create a SendGrid account',
        'Go to API Keys section',
        'Create a new API key',
        'Set appropriate permissions'
      ]
    }
  },
  recaptcha: {
    name: 'Google reCAPTCHA',
    description: 'Anti-bot and form protection service',
    useCases: [
      'Form protection',
      'Bot prevention',
      'Security enhancement'
    ],
    setup: {
      steps: [
        'Visit Google reCAPTCHA Admin',
        'Register a new site',
        'Choose reCAPTCHA type',
        'Get site key and secret key'
      ]
    }
  },
  openai: {
    name: 'OpenAI',
    description: 'Advanced AI models for various applications',
    useCases: [
      'AI content generation',
      'Language processing',
      'Code assistance'
    ],
    setup: {
      steps: [
        'Create an OpenAI account',
        'Go to API section',
        'Create new API key',
        'Set usage limits if needed'
      ]
    }
  },
  stripe: {
    name: 'Stripe',
    description: 'Payment processing platform',
    useCases: [
      'Online payments',
      'Subscription management',
      'Payment gateway integration'
    ],
    setup: {
      steps: [
        'Create a Stripe account',
        'Go to Developers section',
        'Get API keys (test and live)',
        'Set up webhook endpoints'
      ]
    }
  },
  github: {
    name: 'GitHub OAuth',
    description: 'Social authentication with GitHub',
    useCases: [
      'User authentication',
      'Repository access',
      'OAuth integration'
    ],
    setup: {
      steps: [
        'Go to GitHub Developer Settings',
        'Create new OAuth App',
        'Configure callback URLs',
        'Get client ID and secret'
      ]
    }
  },
  google: {
    name: 'Google OAuth',
    description: 'Social authentication with Google',
    useCases: [
      'User authentication',
      'Google services access',
      'OAuth integration'
    ],
    setup: {
      steps: [
        'Visit Google Cloud Console',
        'Create new project or select existing',
        'Configure OAuth consent screen',
        'Create OAuth 2.0 credentials'
      ]
    }
  }
};