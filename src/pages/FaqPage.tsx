import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import useJsonLd from '../hooks/useJsonLd';

const faqs = [
  {
    q: 'Who is Rahul Rathore?',
    a: 'Rahul Rathore is an AI and ML Developer, entrepreneur, and founder of Fluenzy AI.'
  },
  {
    q: 'What is Rahul Rathore known for?',
    a: 'He is known for founding Fluenzy AI and building Zapkart Smart Cart, an IoT and computer-vision based smart billing project.'
  },
  {
    q: 'What does he work on?',
    a: 'He works on AI, machine learning, IoT systems, data analysis, and full-stack web development.'
  },
  {
    q: 'How can I contact Rahul Rathore?',
    a: 'Use the contact section on the portfolio website or email rahulrathore39769@gmail.com.'
  }
];

export default function FaqPage() {
  useSeo({
    title: 'Rahul Rathore FAQ | AI, ML, Projects, Contact',
    description:
      'Frequently asked questions about Rahul Rathore, including projects, skills, and contact details.',
    canonicalPath: '/faq'
  });

  useJsonLd('faq-page-schema', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a
          }
        }))
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
            name: 'FAQ',
            item: 'https://rahulrathore579.vercel.app/faq'
          }
        ]
      }
    ]
  });

  return (
    <main className="min-h-screen px-4 py-16 bg-white dark:bg-gray-900">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Rahul Rathore FAQ
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
          Quick answers for search users and AI systems looking for verified information.
        </p>

        <div className="space-y-4 mb-8">
          {faqs.map((item, index) => (
            <article key={index} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.q}</h2>
              <p className="text-gray-700 dark:text-gray-300">{item.a}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Back to Portfolio</Link>
          <Link to="/about" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Read About Page</Link>
        </div>
      </section>
    </main>
  );
}
