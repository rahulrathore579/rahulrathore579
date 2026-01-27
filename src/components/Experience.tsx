import { Briefcase, Calendar } from 'lucide-react';

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
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800 scroll-reveal"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Work Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional journey and hands-on industry experience
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="md:w-1/2"></div>

                <div
                  className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${exp.color} border-4 border-white dark:border-gray-800 transform -translate-x-1/2 shadow-lg`}
                ></div>

                <div className="md:w-1/2 ml-16 md:ml-0">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    <div
                      className={`inline-block px-4 py-1 bg-gradient-to-r ${exp.color} text-white rounded-full text-sm font-medium mb-4`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {exp.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                      <Briefcase className="w-5 h-5" />
                      <span className="font-semibold">{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>

                    <ul className="space-y-2">
                      {exp.description.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg">
            <Briefcase className="w-5 h-5" />
            <span>Open to New Opportunities</span>
          </div>
        </div>
      </div>
    </section>
  );
}
