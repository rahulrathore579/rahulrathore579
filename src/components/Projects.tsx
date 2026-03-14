import { useState } from 'react';
import { ExternalLink, Github, X, ImageIcon } from 'lucide-react';
import fluenzyaiImg from '../assets/projects/fluenzyai.png';
import zapkartImg from '../assets/projects/zapkart.png';

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    images: string[];
    github: string;
    demo: string;
    tech: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-6xl w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        {/* Left Side: Image Gallery */}
        <div className="md:w-3/5 bg-gray-50 dark:bg-gray-800/50 p-6 overflow-y-auto scrollbar-hidden border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-6">
            {project.images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`${project.title} UI ${i + 1}`} 
                className="rounded-2xl w-full h-auto object-contain shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-[1.01] transition-transform duration-500" 
              />
            ))}
          </div>
        </div>

        {/* Right Side: Project Info */}
        <div className="md:w-2/5 p-8 flex flex-col h-full bg-white dark:bg-gray-900">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {project.title}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 scrollbar-hidden">
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">About the Project</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            {project.demo !== '#' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    
    {
      title: 'FluenzyAI',
      description:
        'An AI-powered English learning platform designed to help users improve their communication skills and placement readiness. Proven to increase placement rates through personalized AI tutoring, mock interviews, and real-time feedback.',
      tech: ['Next.js', 'TypeScript', 'TailwindCSS', 'OpenAI', 'PostgreSQL', 'Cloud'],
      gradient: 'from-purple-600 to-indigo-600',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://fluenzyai.app/',
      bgImage: fluenzyaiImg,
      projectPictures: [
        fluenzyaiImg
      ]
    },
    {
      title: 'AI Smart Classroom',
      description:
        'A comprehensive virtual classroom solution featuring live screen sharing, AI-driven attendance tracking, and interactive learning tools for teachers and students.',
      tech: ['React', 'WebRTC', 'Flask', 'OpenCV', 'AI/ML', 'IoT'],
      gradient: 'from-blue-600 to-indigo-600',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://smart-classroom-demo.vercel.app/',
      bgImage: 'src/assets/projects/image1copy.png',
      projectPictures: [
        'src/assets/projects/image1copy.png'
      ]
    },
    {
      title: 'Connect.Too',
      description:
        'A comprehensive local service provider platform built with Flask and SQLite, featuring secure user authentication, real-time messaging, and integrated payment processing via Razorpay API.',
      tech: ['Flask', 'SQLite', 'Razorpay API', 'Python', 'JavaScript','cloud'],
      gradient: 'from-blue-500 to-cyan-500',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://connect-too-demo.vercel.app/',
      bgImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop',
      projectPictures: [
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop'
      ]
    },
    {
      title: 'Smart Shopping Cart',
      description:
        'IoT-enabled intelligent shopping cart system using OpenCV for product recognition, weight sensors for automatic billing, and real-time inventory management.',
      tech: ['IoT', 'OpenCV', 'Python', 'Arduino', 'Computer Vision', 'AI/ML', 'Barcode Scan', 'React'],
      gradient: 'from-green-500 to-teal-500',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://zapkart-demo.onrender.com/',
      bgImage: zapkartImg,
      projectPictures: [
        zapkartImg
      ]
    },
    {
      title: 'Healthcare Monitoring System',
      description:
        'IoT-based patient monitoring solution integrating multiple sensors for vital signs tracking, AI-powered anomaly detection, and real-time alert systems for medical staff.',
      tech: ['IoT', 'AI/ML', 'Sensors', 'Python', 'Flask'],
      gradient: 'from-red-500 to-orange-500',
      github: 'https://github.com/rahulrathore579',
      demo: '#/',
      bgImage: 'src/assets/projects/image3copy.png',
      projectPictures: [
        'src/assets/projects/image3copy.png'
      ]
    },
    {
      title: 'Product Recognition System',
      description:
        'Deep learning-based computer vision system for accurate product identification and classification using convolutional neural networks and advanced image processing techniques.',
      tech: ['Deep Learning', 'Computer Vision', 'TensorFlow', 'Python', 'OpenCV'],
      gradient: 'from-indigo-500 to-blue-500',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://product-recognition-demo.vercel.app/',
      bgImage: 'src/assets/projects/imagecopy2.png',
      projectPictures: [
        'src/assets/projects/imagecopy2.png'
      ]
    },
    {
      title: 'Data Analytics Dashboard',
      description:
        'Interactive business intelligence dashboard built with Power BI and Python for comprehensive data visualization, trend analysis, and actionable insights.',
      tech: ['Power BI', 'Python', 'SQL', 'Data Analysis', 'DAX'],
      gradient: 'from-yellow-500 to-orange-500',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://data-dashboard-demo.vercel.app/',
      bgImage: 'src/assets/projects/imagecopy3.png',
      projectPictures: [
        'src/assets/projects/imagecopy3.png'
      ]
    }
  ];

  return (
    <section
      id="projects"
      className="py-20 px-4 bg-white dark:bg-gray-900 scroll-reveal"
    >
      <ProjectModal 
        isOpen={!!selectedProject} 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
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
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 h-[380px] sm:h-[420px] flex flex-col justify-end"
              onClick={() => setSelectedProject({ 
                title: project.title, 
                description: project.description, 
                images: project.projectPictures, 
                github: project.github, 
                demo: project.demo, 
                tech: project.tech 
              })}
            >
              {/* Full Background Image */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${project.bgImage})` }}
              />
              
              {/* Gradient overlays to ensure text is readable */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`absolute inset-0 z-10 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay`} />

              {/* Card Content - positioned at bottom */}
              <div className="p-6 relative z-20 flex flex-col justify-end h-full">
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {project.title}
                </h3>
                  
                {/* Expandable content area */}
                <div className="max-h-0 group-hover:max-h-[500px] transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 overflow-hidden">
                  <div className="pt-2">
                    <p className="text-gray-300 mb-4 line-clamp-3 text-sm">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 4).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white rounded-md border border-white/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-2 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white rounded-md border border-white/20">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                          <span className="text-sm font-medium">Code</span>
                        </a>
                        {project.demo !== '#' && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium">Demo</span>
                          </a>
                        )}
                      </div>
                      <div className="text-white/50">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom decorative bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-30"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
