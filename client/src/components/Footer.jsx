import { motion } from 'framer-motion'
import { 
  Brain, 
  Github, 
  Twitter, 
  Globe, 
  Zap,
  Shield,
  Code,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { name: 'Services', href: '/services' },
      { name: 'Analytics', href: '/analytics' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/docs/api' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'x402 Protocol', href: 'https://x402.org' },
      { name: 'Base Network', href: 'https://base.org' },
      { name: 'Coinbase', href: 'https://coinbase.com' },
      { name: 'GitHub', href: 'https://github.com' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Licenses', href: '/licenses' },
    ]
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Website', icon: Globe, href: 'https://example.com' },
  ]

  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="px-6 py-6">
        {/* Main Footer Content */}
        <div className="text-center">
          {/* Brand Section */}
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Brain className="h-6 w-6 text-primary-400" />
                <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-lg"></div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-base font-bold gradient-text">
                  0xDecodex x402
                </span>
                <span className="text-xs text-slate-400 -mt-1">
                  Powered by x402
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs mb-4 px-4">
              Service platform for AI agents with automatic payments 
              using the x402 protocol on Base Network.
            </p>

            {/* Features */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Zap className="h-3 w-3 text-green-400" />
                <span>Instant</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Shield className="h-3 w-3 text-primary-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Code className="h-3 w-3 text-secondary-400" />
                <span>Open Source</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4 mb-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-4">
          <div className="text-center space-y-2">
            <div className="text-xs text-slate-400">
              <span>© {currentYear} 0xDecodex x402. All rights reserved.</span>
            </div>

            <div className="flex justify-center items-center space-x-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span>Base Mainnet</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer