import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import useJsonLd from '../hooks/useJsonLd';

export default function AboutPage() {
  useSeo({
    title: 'About Rahul Rathore | AI & ML Developer',
    description:
      'About Rahul Rathore: AI and ML Developer, founder of Fluenzy AI, and creator of Zapkart Smart Cart.',
    canonicalPath: '/about'
  });

  useJsonLd('about-page-schema', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        url: 'https://rahulrathore579.vercel.app/about',
        name: 'About Rahul Rathore',
        mainEntity: {
          '@type': 'Person',
          '@id': 'https://rahulrathore579.vercel.app/#person',
          name: 'Rahul Rathore',
          sameAs: [
            'https://github.com/rahulrathore579',
            'https://linkedin.com/in/rahulrathore39769',
            'https://twitter.com/rahulrathore579',
            'https://www.freelancer.com/u/rahulrathore579'
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
            name: 'About',
            item: 'https://rahulrathore579.vercel.app/about'
          }
        ]
      }
    ]
  });

  return (
    <main className="min-h-screen px-4 py-16 bg-white dark:bg-gray-900">
      <article className="max-w-4xl mx-auto bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          About Rahul Rathore
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
          Rahul Rathore is an AI and ML Developer, entrepreneur, and founder of Fluenzy AI. He builds intelligent systems,
          IoT products, and web applications focused on real-world outcomes.
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
          His key work includes Fluenzy AI and Zapkart Smart Cart. His technical focus includes AI, machine learning,
          IoT, data analysis, and full-stack web development.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Official Profiles</h2>
        <ul className="space-y-2 text-blue-700 dark:text-blue-300 mb-8">
          <li><a href="https://linkedin.com/in/rahulrathore39769" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="https://github.com/rahulrathore579" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://twitter.com/rahulrathore579" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
          <li><a href="https://www.freelancer.com/u/rahulrathore579" target="_blank" rel="noopener noreferrer">Freelancer</a></li>
        </ul>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Back to Portfolio</Link>
          <Link to="/faq" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Read FAQ</Link>
        </div>
      </article>
    </main>
  );
}
