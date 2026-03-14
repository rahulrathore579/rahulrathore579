import { useState } from 'react';
import { ExternalLink, Github, X, ImageIcon } from 'lucide-react';
import fluenzyaiImg from '../assets/projects/fluenzyai.png';
import zapkartImg from '../assets/projects/zapkart.png';
import aiSmartClassroomImg from '../assets/projects/image1copy.png';
import healthcareImg from '../assets/projects/image3copy.png';
import productRecogImg from '../assets/projects/imagecopy2.png';
import dataDashboardImg from '../assets/projects/imagecopy3.png';
import { useInView } from '../hooks/useInView';

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
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-1/2 bg-gray-50/50 dark:bg-gray-800/20 p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-hidden border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
          <div className="w-full space-y-6">
            {project.images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`${project.title} UI ${i + 1}`} 
                className="w-full rounded-2xl object-cover shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02] transition-transform duration-500 bg-white dark:bg-gray-800" 
              />
            ))}
          </div>
        </div>

        {/* Right Side: Project Info */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col h-full bg-white dark:bg-gray-900/95 overflow-y-auto scrollbar-hidden">
          <div className="flex justify-between items-start mb-6 md:mb-8 shrink-0">
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 leading-tight">
                {project.title}
              </h3>
              <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex-grow space-y-8">
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">About the Project</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {project.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">Technologies</h4>
              <div className="flex flex-wrap gap-2.5">
                {project.tech.map((t, i) => (
                  <span key={i} className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-gray-800 dark:hover:border-gray-500 transition-all duration-300"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Source Code</span>
            </a>
            {project.demo !== '#' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold border-2 border-transparent hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform"
              >
                <ExternalLink className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Live Project</span>
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
      bgImage: aiSmartClassroomImg,
      projectPictures: [
        aiSmartClassroomImg
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
      bgImage: healthcareImg,
      projectPictures: [
        healthcareImg
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
      bgImage: productRecogImg,
      projectPictures: [
        productRecogImg
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
      bgImage: dataDashboardImg,
      projectPictures: [
        dataDashboardImg
      ]
    }
  ];

  // Wrapper component for individual project cards to handle their own intersection state
  const ProjectCard = ({ project, index, onClick }: { project: any, index: number, onClick: () => void }) => {
    const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
    const isActive = isInView; // It's active if hovering OR if in view (on mobile)

    return (
      <div
        ref={ref}
        className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 h-[380px] sm:h-[420px] flex flex-col justify-end transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 md:opacity-100 md:translate-y-0'} md:hover:-translate-y-2`}
        onClick={onClick}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        {/* Full Background Image */}
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ${isActive ? 'scale-110 md:scale-100 md:group-hover:scale-110' : 'scale-100'}`}
          style={{ backgroundImage: `url(${project.bgImage})` }}
        />
        
        {/* Gradient overlays to ensure text is readable */}
        <div className={`absolute inset-0 z-10 bg-gradient-to-t from-gray-900/95 md:from-gray-900 via-gray-900/80 md:via-gray-900/60 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100 md:opacity-90 md:group-hover:opacity-100' : 'opacity-60 md:opacity-90'}`} />
        <div className={`absolute inset-0 z-10 bg-gradient-to-br ${project.gradient} transition-opacity duration-700 mix-blend-overlay ${isActive ? 'opacity-40 md:opacity-20 md:group-hover:opacity-40' : 'opacity-0 md:opacity-20'}`} />

        {/* Card Content - positioned at bottom */}
        <div className="p-6 relative z-20 flex flex-col justify-end h-full">
          <h3 className={`text-2xl font-bold mb-2 transition-all duration-500 drop-shadow-lg md:drop-shadow-none ${isActive ? 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text md:text-white md:bg-none md:group-hover:text-transparent md:group-hover:bg-gradient-to-r md:group-hover:from-blue-400 md:group-hover:to-purple-400 md:group-hover:bg-clip-text' : 'text-white'}`}>
            {project.title}
          </h3>
            
          {/* Expandable content area */}
          <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isActive ? 'max-h-[500px] opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-[500px] md:group-hover:opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-2">
              <p className="text-gray-200 md:text-gray-300/80 md:group-hover:text-gray-300 mb-4 line-clamp-3 text-sm drop-shadow-md md:drop-shadow-none">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 4).map((tech: string, techIndex: number) => (
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
                    className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors"
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
                      className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors"
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
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 md:h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform origin-left transition-transform duration-700 z-30 ${isActive ? 'scale-x-100 md:scale-x-0 md:group-hover:scale-x-100' : 'scale-x-0'}`}></div>
      </div>
    );
  };

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
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-1">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Innovative solutions combining AI, IoT, and modern web technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              index={index} 
              onClick={() => setSelectedProject({ 
                title: project.title, 
                description: project.description, 
                images: project.projectPictures, 
                github: project.github, 
                demo: project.demo, 
                tech: project.tech 
              })} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
