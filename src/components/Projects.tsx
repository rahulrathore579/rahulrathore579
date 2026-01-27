import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: 'Connect.Too',
      description:
        'A comprehensive local service provider platform built with Flask and SQLite, featuring secure user authentication, real-time messaging, and integrated payment processing via Razorpay API.',
      tech: ['Flask', 'SQLite', 'Razorpay API', 'Python', 'JavaScript','cloud'],
      gradient: 'from-blue-500 to-cyan-500',
      github: 'https://github.com/rahulrathore579',
      demo: '#'
    },
      {
      title: 'Smart Shopping Cart',
      description:
        'IoT-enabled intelligent shopping cart system using OpenCV for product recognition, weight sensors for automatic billing, and real-time inventory management.',
      tech: ['IoT', 'OpenCV', 'Python', 'Arduino', 'Computer Vision', 'AI/ML', 'Barcode Scan', 'React'],
      gradient: 'from-green-500 to-teal-500',
      github: 'https://github.com/rahulrathore579',
      demo: '#'
    },
    {
      title: 'Healthcare Monitoring System',
      description:
        'IoT-based patient monitoring solution integrating multiple sensors for vital signs tracking, AI-powered anomaly detection, and real-time alert systems for medical staff.',
      tech: ['IoT', 'AI/ML', 'Sensors', 'Python', 'Flask'],
      gradient: 'from-red-500 to-orange-500',
      github: 'https://github.com/rahulrathore579',
      demo: '#'
    },
    {
      title: 'Product Recognition System',
      description:
        'Deep learning-based computer vision system for accurate product identification and classification using convolutional neural networks and advanced image processing techniques.',
      tech: ['Deep Learning', 'Computer Vision', 'TensorFlow', 'Python', 'OpenCV'],
      gradient: 'from-indigo-500 to-blue-500',
      github: 'https://github.com/rahulrathore579',
      demo: '#'
    },
    {
      title: 'Data Analytics Dashboard',
      description:
        'Interactive business intelligence dashboard built with Power BI and Python for comprehensive data visualization, trend analysis, and actionable insights.',
      tech: ['Power BI', 'Python', 'SQL', 'Data Analysis', 'DAX'],
      gradient: 'from-yellow-500 to-orange-500',
      github: 'https://github.com/rahulrathore579',
      demo: '#'
    }
  ];

  return (
    <section
      id="projects"
      className="py-20 px-4 bg-white dark:bg-gray-900 scroll-reveal"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Innovative solutions combining AI, IoT, and modern web technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              <div className="p-6 relative z-10">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500`}
                >
                  <span className="text-2xl text-white font-bold">
                    {project.title.charAt(0)}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm font-medium">Code</span>
                  </a>
                  <a
                    href={project.demo}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span className="text-sm font-medium">Demo</span>
                  </a>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
