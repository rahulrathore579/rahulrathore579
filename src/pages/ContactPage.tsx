import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import useJsonLd from '../hooks/useJsonLd';

const contactLinks = [
  { label: 'Email', value: 'rahulrathore39769@gmail.com', href: 'mailto:rahulrathore39769@gmail.com' },
  { label: 'Phone', value: '+91 7505238914', href: 'tel:+917505238914' },
  { label: 'LinkedIn', value: 'linkedin.com/in/rahulrathore39769', href: 'https://linkedin.com/in/rahulrathore39769' },
  { label: 'GitHub', value: 'github.com/rahulrathore579', href: 'https://github.com/rahulrathore579' },
  { label: 'X (Twitter)', value: 'twitter.com/rahulrathore579', href: 'https://twitter.com/rahulrathore579' }
];

export default function ContactPage() {
  useSeo({
    title: 'Contact Rahul Rathore | AI & ML Developer',
    description:
      'Contact Rahul Rathore for AI, ML, IoT, and web development opportunities, collaborations, and projects.',
    canonicalPath: '/contact'
  });

  useJsonLd('contact-page-schema', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        url: 'https://rahulrathore579.vercel.app/contact',
        name: 'Contact Rahul Rathore',
        mainEntity: {
          '@type': 'Person',
          '@id': 'https://rahulrathore579.vercel.app/#person',
          name: 'Rahul Rathore',
          email: 'rahulrathore39769@gmail.com',
          telephone: '+91 7505238914',
          sameAs: [
            'https://github.com/rahulrathore579',
            'https://linkedin.com/in/rahulrathore39769',
            'https://twitter.com/rahulrathore579'
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://rahulrathore579.vercel.app/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contact',
            item: 'https://rahulrathore579.vercel.app/contact'
          }
        ]
      }
    ]
  });

  return (
    <main className="min-h-screen px-4 py-16 bg-white dark:bg-gray-900">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-5">
          Contact Rahul Rathore
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
          For collaboration, freelance work, and project opportunities, use any verified channel below.
        </p>

        <div className="space-y-3 mb-10">
          {contactLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{item.value}</p>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Back to Portfolio</Link>
          <Link to="/projects" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">View Projects</Link>
        </div>
      </section>
    </main>
  );
}
