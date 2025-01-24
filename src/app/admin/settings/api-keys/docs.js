export const API_SERVICES = {
  gemini: {
    name: 'Gemini AI',
    description: 'Used for AI-powered content generation and analysis.',
    format: 'sk_gemini_xxxxxxxxxxxxxxxx',
    docs: 'https://ai.google.dev/docs',
    useCases: [
      'Generate AI-powered content for blog posts',
      'Analyze and process user queries',
      'Create dynamic responses for chatbots',
      'Enhance content with AI suggestions',
      'Automate content moderation'
    ],
    setup: {
      steps: [
        'Visit Google AI Studio',
        'Create a new project',
        'Generate an API key',
        'Copy the key and paste it here'
      ],
      requirements: [
        'Google Cloud account',
        'Billing enabled',
        'API access enabled'
      ]
    }
  },
  cloudinary: {
    name: 'Cloudinary',
    description: 'Image and video management service for media uploads.',
    format: 'cloudinary://xxxxxx:xxxxxxx@xxxxx',
    docs: 'https://cloudinary.com/documentation',
    useCases: [
      'Upload and store portfolio images',
      'Optimize images for better performance',
      'Transform and resize images on-the-fly',
      'Deliver media through CDN',
      'Handle video content'
    ],
    setup: {
      steps: [
        'Create a Cloudinary account',
        'Navigate to Dashboard',
        'Find your API Environment variable',
        'Copy the entire cloudinary:// URL'
      ],
      requirements: [
        'Cloudinary account',
        'API access enabled'
      ]
    }
  },
  analytics: {
    name: 'Google Analytics',
    description: 'Website traffic and user behavior analytics.',
    format: 'G-XXXXXXXXXX or UA-XXXXXX-X',
    docs: 'https://developers.google.com/analytics',
    useCases: [
      'Track website visitors and pageviews',
      'Monitor user engagement metrics',
      'Analyze traffic sources',
      'Track conversion goals',
      'Generate traffic reports'
    ],
    setup: {
      steps: [
        'Create Google Analytics 4 property',
        'Set up data stream',
        'Get Measurement ID (G-XXXXXXXXXX)',
        'Configure data collection'
      ],
      requirements: [
        'Google Analytics account',
        'Website domain verified'
      ]
    }
  },
  stripe: {
    name: 'Stripe',
    description: 'Payment processing and subscription management.',
    format: 'sk_test/live_xxxxxxxxxxxxxxxx',
    docs: 'https://stripe.com/docs',
    useCases: [
      'Process secure payments',
      'Manage recurring subscriptions',
      'Handle payment methods',
      'Process refunds',
      'Generate payment reports'
    ],
    setup: {
      steps: [
        'Create Stripe account',
        'Verify business details',
        'Get API keys from Dashboard',
        'Start with test mode key',
        'Switch to live mode after testing'
      ],
      requirements: [
        'Stripe account',
        'Business verification',
        'Valid bank account'
      ]
    },
    security: {
      warnings: [
        'Never expose secret keys in client-side code',
        'Use test mode keys for development',
        'Rotate keys if compromised',
        'Store keys securely'
      ]
    }
  }
}; 