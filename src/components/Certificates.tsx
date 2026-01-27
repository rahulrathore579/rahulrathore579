import { Award, ExternalLink } from 'lucide-react';

export default function Certificates() {
  const certificates = [
    {
      title: 'Smart India Hackathon',
      issuer: 'GLA University',
      date: '2025',
      description:
        'Participated in Smart India Hackathon 2024, gaining hands-on experience in innovation, teamwork, and rapid solution development.',
      color: 'from-blue-500 to-cyan-500',
      icon: '🐍',
      link: 'https://www.linkedin.com/posts/varun-gupta-3a1315289_smartindiahackathon-sih2025-innovation-ugcPost-7389542807629291521-x_SG?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEPIK78BIkLspWBpwRyHI3r1wu_5uG8lfKo' // <-- Add your real link here
    },
    {
      title: 'Python Programming',
      issuer: 'Infosys',
      date: '2024',
      description:
        'Comprehensive Python programming certification covering core concepts, data structures, and application development',
      color: 'from-blue-500 to-cyan-500',
      icon: '🐍',
      link: 'https://www.linkedin.com/posts/rahulrathore39769_pythonprogramming-activity-7157801199692312576-ruyX?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEPIK78BIkLspWBpwRyHI3r1wu_5uG8lfKo' // <-- Add your real link here
    },
    {
      title: 'Data Analytics Cohort Experience',
      issuer: 'Professional Training',
      date: '2024',
      description:
        'Intensive data analytics program focusing on statistical analysis, data visualization, and business intelligence',
      color: 'from-purple-500 to-pink-500',
      icon: '📊',
      link: 'https://example.com/data-analytics'
    },
    {
      title: 'Power BI using DAX & AI',
      issuer: 'Business Intelligence',
      date: '2025',
      description:
        'Advanced Power BI certification with expertise in DAX formulas and AI-powered analytics for data-driven insights',
      color: 'from-green-500 to-teal-500',
      icon: '📈',
      link: 'https://www.linkedin.com/posts/rahulrathore39769_innovation-iot-healthcarerevolution-activity-7154817006557437952-p4nD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEPIK78BIkLspWBpwRyHI3r1wu_5uG8lfKo'
    },
    {
      title: 'Machine Learning Foundations',
      issuer: 'Online Platform',
      date: '2024',
      description:
        'Foundational machine learning concepts including supervised and unsupervised learning algorithms',
      color: 'from-orange-500 to-red-500',
      icon: '🤖',
      link: 'https://example.com/machine-learning'
    }
  ];

  return (
    <section
      id="certificates"
      className="py-20 px-4 bg-white dark:bg-gray-900 scroll-reveal"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Certificates & Achievements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Continuous learning and professional development milestones
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              <div className="relative p-8">
                {/* Icon & Date */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${cert.color} rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                  >
                    {cert.icon}
                  </div>
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${cert.color} text-white rounded-full text-sm font-medium`}
                  >
                    {cert.date}
                  </div>
                </div>

                {/* Certificate Title & Issuer */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">{cert.issuer}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                  {cert.description}
                </p>

                {/* Link Button */}
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:gap-3 transition-all duration-300"
                >
                  <span>View Certificate</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="inline-block">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Python', count: '4+' },
                { name: 'Data Analysis', count: '2+' },
                { name: 'Web Dev', count: '4+' },
                { name: 'AI/ML', count: '3+' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="px-6 py-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
