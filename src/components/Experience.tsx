import { Briefcase, Calendar } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const ExperienceCard = ({ exp, index }: { exp: any, index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row gap-8 transition-all duration-700 transform ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="md:w-1/2"></div>

      <div
        className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${exp.color} border-4 border-gray-50 dark:border-gray-950 transform -translate-x-1/2 shadow-lg transition-transform duration-500 delay-300 ${
          isInView ? 'scale-100' : 'scale-0'
        }`}
      ></div>

      <div className="md:w-1/2 ml-16 md:ml-0">
        <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl p-7 hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 group overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/3 to-purple-600/3 dark:from-blue-600/5 dark:to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r ${exp.color} text-white rounded-full text-sm font-semibold mb-5 shadow-md`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {exp.period}
          </div>

          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
            {exp.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium mb-5">
            <Briefcase className="w-4 h-4" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{exp.company}</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>{exp.location}</span>
          </div>

          <ul className="space-y-2.5">
            {exp.description.map((item: string, itemIndex: number) => (
              <li
                key={itemIndex}
                className="flex items-start gap-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors text-sm"
              >
                <span className="w-1.5 h-1.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function Experience() {
  const experiences = [
    {
      title: 'Web Development Intern',
      company: 'CodeSoft',
      period: 'July 2024 - August 2024',
      location: 'Remote',
      description: [
        'Developed responsive web applications using modern frameworks and technologies',
        'Collaborated with cross-functional teams to deliver high-quality projects',
        'Implemented best practices for code quality, testing, and documentation',
        'Enhanced user experience through intuitive interface design and optimization'
      ],
      color: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Data Analyst Intern',
      company: 'Mahesh Edible Oil Industries',
      period: 'May 2025',
      location: 'On-site',
      description: [
        'Analyzed large datasets to extract meaningful insights for business decisions',
        'Created interactive dashboards and visualizations using Power BI and Tableau',
        'Performed statistical analysis and trend identification for process optimization',
        'Collaborated with stakeholders to understand requirements and deliver actionable reports'
      ],
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <section
      id="experience"
      className="py-24 px-4 scroll-reveal relative overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-2 tracking-tight">
            Work Experience
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]"></div>
          <p className="mt-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Professional journey and{' '}
            <span className="text-purple-600 dark:text-purple-400 font-medium">hands-on industry experience</span>
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-pink-500/30 dark:from-blue-500/50 dark:via-purple-500/50 dark:to-pink-500/50"></div>
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} index={index} />
            ))}
          </div>
        </div>

        {/* Open to Opportunities Section */}
        <div className="mt-20">
          <div className="relative rounded-3xl overflow-hidden bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl p-10 group hover:border-blue-400/40 dark:hover:border-blue-500/30 transition-all duration-500">

            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/8 dark:to-pink-500/5 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left: Status & info */}
              <div className="text-center md:text-left">
                {/* Live status badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-500/15 border border-green-300/60 dark:border-green-500/30 rounded-full text-green-700 dark:text-green-400 text-xs font-bold mb-5 uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Available for Work
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">
                  Open to New Opportunities
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                  Looking for full-time roles, internships, or freelance projects in AI/ML, Full Stack, and Data Analytics.
                </p>

                {/* Role tags */}
                <div className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start">
                  {['AI / ML Engineer', 'Full Stack Dev', 'Data Analyst', 'IoT Developer'].map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-500/20"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: CTA buttons */}
              <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Hire Me</span>
                </a>
                <a
                  href="https://linkedin.com/in/rahulrathore39769"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:border-blue-400 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>View LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
