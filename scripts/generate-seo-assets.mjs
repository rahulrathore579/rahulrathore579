import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');

const baseUrl = 'https://rahulrathore579.vercel.app';
const routes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/faq', priority: '0.9', changefreq: 'monthly' },
  { path: '/projects', priority: '0.9', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/press', priority: '0.9', changefreq: 'monthly' }
];

const today = new Date().toISOString().slice(0, 10);

function generateSitemapXml() {
  const urls = routes
    .map(
      (route) => `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function generateMentionsJson() {
  return {
    profile: {
      name: 'Rahul Rathore',
      handle: 'rahulrathore579',
      url: `${baseUrl}/`,
      description:
        'AI and ML Developer, founder of Fluenzy AI, and creator of Zapkart Smart Cart.',
      sameAs: [
        'https://github.com/rahulrathore579',
        'https://linkedin.com/in/rahulrathore39769',
        'https://instagram.com/rahulrathore579',
        'https://twitter.com/rahulrathore579',
        'https://www.freelancer.com/u/rahulrathore579'
      ]
    },
    mentions: [
      {
        title: 'AI Nirman 2026 Winner',
        summary: 'Recognized for practical AI innovation and implementation.'
      },
      {
        title: 'Fluenzy AI',
        summary: 'Founder role in AI-powered communication learning platform.'
      },
      {
        title: 'Zapkart Smart Cart',
        summary: 'IoT and computer-vision based smart shopping and billing project.'
      }
    ],
    canonicalSources: [
      `${baseUrl}/`,
      `${baseUrl}/about`,
      `${baseUrl}/faq`,
      `${baseUrl}/projects`,
      `${baseUrl}/contact`,
      `${baseUrl}/press`,
      `${baseUrl}/structured-data.json`,
      `${baseUrl}/llms.txt`
    ],
    updatedAt: today
  };
}

async function run() {
  await mkdir(publicDir, { recursive: true });

  const sitemapXml = generateSitemapXml();
  await writeFile(join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');

  const mentionsJson = JSON.stringify(generateMentionsJson(), null, 2) + '\n';
  await writeFile(join(publicDir, 'mentions.json'), mentionsJson, 'utf8');

  console.log('Generated public/sitemap.xml and public/mentions.json');
}

run().catch((error) => {
  console.error('Failed to generate SEO assets:', error);
  process.exitCode = 1;
});
