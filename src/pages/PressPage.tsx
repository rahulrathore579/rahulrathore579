import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import useJsonLd from '../hooks/useJsonLd';

const mentions = [
  {
    title: 'AI Nirman 2026 Winner',
    detail: 'Recognized for innovation and practical AI implementation.'
  },
  {
    title: 'Fluenzy AI',
    detail: 'Founder building AI-powered communication learning products.'
  },
  {
    title: 'Zapkart Smart Cart',
    detail: 'IoT and computer-vision based smart billing project.'
  }
];

export default function PressPage() {
  useSeo({
    title: 'Press & Achievements | Rahul Rathore',
    description:
      'Public mentions, achievements, and project highlights of Rahul Rathore for SEO and GEO authority signals.',
    canonicalPath: '/press'
  });

  useJsonLd('press-page-schema', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Press and Achievements of Rahul Rathore',
        url: 'https://rahulrathore579.vercel.app/press',
        about: {
          '@id': 'https://rahulrathore579.vercel.app/#person'
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
            name: 'Press',
            item: 'https://rahulrathore579.vercel.app/press'
          }
        ]
      }
    ]
  });

  return (
    <main className="min-h-screen px-4 py-16 bg-white dark:bg-gray-900">
      <section className="max-w-5xl mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Home / Press</p>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-5">
          Press & Achievements
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-10">
          Verified highlights and recognition points that improve discoverability of Rahul Rathore across search and AI answer engines.
        </p>

        <div className="grid gap-5 mb-10">
          {mentions.map((item, index) => (
            <article key={index} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h2>
              <p className="text-gray-700 dark:text-gray-300">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Back to Portfolio</Link>
          <Link to="/about" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">About</Link>
          <Link to="/projects" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Projects</Link>
        </div>
      </section>
    </main>
  );
}
