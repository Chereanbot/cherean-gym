import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { type, instructions } = await request.json()

    // Enhanced prompts for each background type
    const prompts = {
      canvas3d: `As a world-class 3D artist and technical director, create an extraordinary Three.js background configuration that transforms a website into an immersive digital masterpiece.

Key requirements:
- Design a breathtaking, cinematic 3D environment
- Implement a sophisticated color harmony using modern design principles
- Create fluid, organic animations that respond to user interaction
- Balance visual impact with performance optimization
- Ensure the scene enhances the website's narrative

User's specific requirements: "${instructions}"

Generate a JSON configuration following this structure, with meticulously crafted values:
{
  "scene": {
    "background": "hex color (use rich, deep gradients like #1a1a2e, #2d3436)",
    "fog": {
      "color": "complementary hex color (ensure atmospheric depth)",
      "near": "number (5-15 for intimate scenes)",
      "far": "number (100-1000 for epic scale)"
    }
  },
  "camera": {
    "fov": "number (65-75 for cinematic feel)",
    "position": [x, y, z],
    "lookAt": [x, y, z]
  },
  "lights": [
    {
      "type": "ambient/point/directional/spot",
      "color": "hex (create dramatic atmosphere)",
      "intensity": "number (0.1-2.0 for mood)",
      "position": [x, y, z],
      "castShadow": true/false
    }
  ],
  "objects": [
    {
      "type": "cube/sphere/torus/icosahedron/custom",
      "material": {
        "type": "standard/physical/toon",
        "color": "hex (use brand-aligned aesthetics)",
        "emissive": "hex (for subtle glow)",
        "metalness": "number (0-1)",
        "roughness": "number (0-1)",
        "envMapIntensity": "number (0-3)"
      },
      "position": [x, y, z],
      "scale": [x, y, z],
      "animation": {
        "type": "rotate/float/pulse",
        "speed": "number (smooth, organic movement)",
        "amplitude": "number (0.1-2.0 for float/pulse)",
        "frequency": "number (0.1-1.0 for natural feel)"
      }
    }
  ]
}`,

      coding: `As a visionary digital artist, craft an enchanting code rain effect that transcends the traditional Matrix aesthetic, creating a mesmerizing digital atmosphere.

Key requirements:
- Design a sophisticated, avant-garde visual effect
- Implement an elegant color palette with subtle gradients
- Create an immersive, dynamic experience
- Optimize for both beauty and performance
- Ensure perfect harmony with overlaid content

User's specific requirements: "${instructions}"

Generate a JSON configuration following this structure, with artistically refined values:
{
  "characters": {
    "set": "curated character set (blend of Unicode symbols, numbers, and elegant characters)",
    "primarySet": "featured characters for emphasis",
    "secondarySet": "subtle background characters",
    "size": "number (14-24 for visual hierarchy)",
    "font": "sophisticated monospace font name",
    "colors": {
      "primary": "hex (vibrant feature color)",
      "secondary": "hex (complementary accent)",
      "highlight": "hex (occasional emphasis)"
    }
  },
  "rain": {
    "layers": "number (2-4 for depth)",
    "opacity": {
      "foreground": "number (0.4-0.8)",
      "background": "number (0.1-0.3)"
    },
    "density": "number (0.92-0.98 for optimal effect)",
    "speed": {
      "foreground": "number (1.0-2.0)",
      "background": "number (0.5-1.0)"
    },
    "variation": {
      "size": "number (0.1-0.3 for natural feel)",
      "speed": "number (0.1-0.3 for organic movement)"
    }
  },
  "effects": {
    "glow": {
      "enable": true/false,
      "color": "rgba (subtle bloom effect)",
      "intensity": "number (0.1-0.4)"
    },
    "fade": {
      "top": "number (0.1-0.3)",
      "bottom": "number (0.05-0.2)"
    }
  }
}`,

      particles: `As a particle system virtuoso, design an extraordinary interactive network that creates a sophisticated, living digital ecosystem.

Key requirements:
- Create an elegant, responsive particle choreography
- Implement advanced color theory and visual harmony
- Design smooth, natural movement patterns
- Optimize for immersive interactivity
- Balance complexity with performance

User's specific requirements: "${instructions}"

Generate a JSON configuration following this structure, with expertly crafted values:
{
  "particles": {
    "groups": [
      {
        "type": "primary/secondary/accent",
        "number": "number (30-150 per group)",
        "size": {
          "base": "number (2-4)",
          "variation": "number (0.5-1.5)"
        },
        "color": "hex (from cohesive palette)",
        "opacity": "number (0.6-1.0)"
      }
    ],
    "movement": {
      "pattern": "flow/swirl/drift",
      "speed": "number (0.3-1.5 for elegance)",
      "direction": "number (-1 to 1 for flow)",
      "turbulence": "number (0.1-0.5 for organic feel)"
    }
  },
  "connections": {
    "enable": true/false,
    "maxConnections": "number (3-6 per particle)",
    "distance": "number (100-200 for optimal spacing)",
    "style": {
      "color": "hex (complement particles)",
      "width": "number (0.5-1.5 for delicacy)",
      "opacity": "number (0.1-0.4 for subtlety)"
    }
  },
  "interactivity": {
    "hover": {
      "enable": true/false,
      "mode": "attract/repel/connect",
      "radius": "number (100-200)",
      "strength": "number (0.5-2.0)"
    },
    "click": {
      "enable": true/false,
      "mode": "pulse/explosion/vortex",
      "radius": "number (150-300)",
      "duration": "number (0.5-2.0)"
    }
  },
  "background": {
    "color": "rgba (sophisticated with depth)",
    "gradient": {
      "enable": true/false,
      "colors": ["hex", "hex"],
      "angle": "number (0-360)"
    }
  }
}`
    }

    // Get the appropriate prompt
    const prompt = prompts[type]
    if (!prompt) {
      return NextResponse.json({
        success: false,
        message: 'Invalid background type'
      })
    }

    // Generate configuration using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to generate valid configuration')
    }

    const config = JSON.parse(jsonMatch[0])

    // Enhanced validation and refinement
    if (type === 'canvas3d') {
      // Ensure sophisticated color palette
      if (!config.scene?.background || config.scene.background === '#000000') {
        config.scene.background = '#1a1a2e' // Rich deep blue
      }
      // Guarantee engaging animations
      config.objects = config.objects.map(obj => ({
        ...obj,
        animation: {
          type: obj.animation?.type || 'float',
          speed: obj.animation?.speed || 0.5,
          amplitude: obj.animation?.amplitude || 0.5,
          frequency: obj.animation?.frequency || 0.2
        }
      }))
    }

    if (type === 'coding') {
      // Ensure rich character variety
      if (!config.characters.set || config.characters.set.length < 10) {
        config.characters.set = '漢字ひらがなカタカナABCD1234†‡§¶'
      }
      // Guarantee sophisticated colors
      if (!config.characters.colors || config.characters.colors.primary === '#00ff00') {
        config.characters.colors = {
          primary: '#00ffa3',
          secondary: '#4a9eff',
          highlight: '#ff00ff'
        }
      }
    }

    if (type === 'particles') {
      // Ensure optimal particle distribution
      if (!config.particles.groups) {
        config.particles.groups = [{
          type: 'primary',
          number: 100,
          size: { base: 3, variation: 1 },
          color: '#4a9eff',
          opacity: 0.8
        }]
      }
      // Add sophisticated interactivity
      if (!config.interactivity) {
        config.interactivity = {
          hover: {
            enable: true,
            mode: 'connect',
            radius: 150,
            strength: 0.8
          },
          click: {
            enable: true,
            mode: 'pulse',
            radius: 200,
            duration: 1.5
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      config
    })

  } catch (error) {
    console.error('Error generating background:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to generate background configuration'
    })
  }
} 