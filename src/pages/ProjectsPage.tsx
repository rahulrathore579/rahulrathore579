import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import useJsonLd from '../hooks/useJsonLd';

const projectItems = [
  {
    title: 'FluenzyAI',
    description: 'AI-powered English learning platform with personalized tutoring and real-time feedback.',
    link: 'https://fluenzyai.app/'
  },
  {
    title: 'Smart Shopping Cart (Zapkart)',
    description: 'IoT and computer vision based smart billing system for automated shopping.',
    link: 'https://zapkart-demo.onrender.com/'
  },
  {
    title: 'AI Smart Classroom',
    description: 'Virtual classroom with attendance intelligence and interactive tools.',
    link: 'https://smart-classroom-demo.vercel.app/'
  }
];

export default function ProjectsPage() {
  useSeo({
    title: 'Projects by Rahul Rathore | AI, IoT, Web Development',
    description:
      'Explore major projects by Rahul Rathore including FluenzyAI, Zapkart Smart Cart, and AI Smart Classroom.',
    canonicalPath: '/projects'
  });

  useJsonLd('projects-page-schema', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Projects by Rahul Rathore',
        itemListElement: projectItems.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            url: project.link
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
            name: 'Projects',
            item: 'https://rahulrathore579.vercel.app/projects'
          }
        ]
      }
    ]
  });

  return (
    <main className="min-h-screen px-4 py-16 bg-white dark:bg-gray-900">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-5">
          Projects by Rahul Rathore
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-10">
          Selected AI, IoT, and full-stack projects focused on practical outcomes.
        </p>

        <div className="grid gap-5 mb-10">
          {projectItems.map((project, index) => (
            <article key={index} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{project.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-300 font-medium hover:underline"
              >
                View project
              </a>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Back to Portfolio</Link>
          <Link to="/contact" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Go to Contact</Link>
        </div>
      </section>
    </main>
  );
}
