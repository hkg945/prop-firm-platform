import Link from 'next/link'

interface FooterProps {
  translations: Record<string, string>
}

export function Footer({ translations }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: translations['footer.about'], href: '/about' },
      { label: translations['footer.careers'], href: '/careers' },
      { label: translations['footer.press'], href: '/press' },
    ],
    product: [
      { label: translations['footer.challenges'], href: '/challenges' },
      { label: translations['footer.pricing'], href: '/pricing' },
      { label: translations['footer.rules'], href: '/rules' },
    ],
    support: [
      { label: translations['footer.faq'], href: '/faq' },
      { label: translations['footer.contact'], href: '/contact' },
      { label: translations['footer.help'], href: '/help' },
    ],
    legal: [
      { label: translations['footer.terms'], href: '/terms' },
      { label: translations['footer.privacy'], href: '/privacy' },
      { label: translations['footer.refund'], href: '/refund' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PT</span>
              </div>
              <span className="text-xl font-bold text-white">PropTrade Pro</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {translations['home.hero.subtitle']}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {translations['footer.company']}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {translations['footer.product']}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {translations['footer.support']}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {translations['footer.legal']}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              {translations['footer.copyright']}
            </p>
            <p className="text-sm text-gray-400">
              {translations['footer.disclaimer']}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
