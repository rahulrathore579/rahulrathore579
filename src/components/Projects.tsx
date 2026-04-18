import { useState } from 'react';
import { ExternalLink, Github, X, ArrowUpRight, Layers } from 'lucide-react';
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
    gradient: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!isOpen || !project) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800/30 p-6 overflow-y-auto scrollbar-hidden border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/10 flex items-center justify-center min-h-[250px]">
          <div className="w-full space-y-5">
            {project.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full rounded-2xl object-cover shadow-xl border border-gray-200/60 dark:border-white/10 hover:scale-[1.02] transition-transform duration-500"
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col h-full bg-white dark:bg-gray-900 overflow-y-auto scrollbar-hidden">
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div>
              <h3 className={`text-3xl font-extrabold bg-gradient-to-r ${project.gradient.replace('/50', '')} bg-clip-text text-transparent mb-3 leading-tight`}>
                {project.title}
              </h3>
              <div className={`w-20 h-1.5 bg-gradient-to-r ${project.gradient.replace('/50', '')} rounded-full`} />
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 transform hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow space-y-7">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">About</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{project.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3 shrink-0">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500 transition-all duration-300 text-sm group"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Source Code</span>
            </a>
            {project.demo !== '#' && project.demo !== '#/' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r ${project.gradient.replace('/50', '')} text-white rounded-xl font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300 text-sm group`}
              >
                <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Project Card Component ----------
const ProjectCard = ({ project, index, onClick }: { project: any; index: number; onClick: () => void }) => {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-700 transform ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      } hover:-translate-y-2 hover:shadow-2xl`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Project Image background */}
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${project.bgImage})` }}
        />
        {/* Gradient overlay on image */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent" />

        {/* Top badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 bg-gradient-to-r ${project.gradient.replace('/50', '')} rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-sm`}>
            {project.tech[0]}
          </div>
        </div>

        {/* Quick action icons on image */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Github className="w-4 h-4" />
          </a>
          {project.demo !== '#' && project.demo !== '#/' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 border-t-0 p-6 group-hover:border-blue-400/40 dark:group-hover:border-blue-500/40 transition-colors duration-300">
        {/* Subtle inner glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-b-3xl pointer-events-none`} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
              {project.title}
            </h3>
            <div className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-5 leading-relaxed">
            {project.description}
          </p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200/80 dark:border-white/10 group-hover:border-blue-300 dark:group-hover:border-blue-500/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2.5 py-1 text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-500 rounded-full border border-gray-200 dark:border-white/10 flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" />
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Animated bottom bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${project.gradient.replace('/50', '')} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
      </div>
    </div>
  );
};

// ---------- Main Component ----------
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.1, triggerOnce: true });

  const projects = [
    {
      title: 'FluenzyAI',
      description: 'LLM-powered English learning platform with 10K+ users. Integrates GPT-4o for real-time feedback, Whisper for speech recognition, and custom RAG for contextual learning. AI Nirman 2026 winner.',
      tech: ['Next.js', 'GPT-4o', 'RAG', 'Whisper API', 'PostgreSQL', 'LangChain'],
      gradient: 'from-purple-600/50 to-indigo-600/50',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://fluenzyai.app/',
      bgImage: fluenzyaiImg,
      projectPictures: [fluenzyaiImg]
    },
    {
      title: 'AI Smart Classroom',
      description: 'Real-time virtual classroom with AI-powered attendance using facial recognition. WebRTC for live streaming, OpenCV for face detection, achieving 98%+ accuracy on attendance tracking.',
      tech: ['React', 'WebRTC', 'OpenCV', 'Face Recognition', 'FastAPI', 'AI/ML'],
      gradient: 'from-blue-600/50 to-indigo-600/50',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://smart-classroom-demo.vercel.app/',
      bgImage: aiSmartClassroomImg,
      projectPictures: [aiSmartClassroomImg]
    },
    {
      title: 'Connect.Too',
      description: 'Local service marketplace with secure authentication, real-time messaging, and Razorpay integration. Built with Flask backend and React frontend serving 500+ service providers.',
      tech: ['Flask', 'React', 'PostgreSQL', 'Razorpay API', 'WebSocket', 'Cloud'],
      gradient: 'from-blue-500/50 to-cyan-500/50',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://connect-too-demo.vercel.app/',
      bgImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop',
      projectPictures: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop']
    },
    {
      title: 'Zapkart Smart Shopping Cart',
      description: 'IoT+AI system using OpenCV for product recognition, weight sensors for auto-billing. Deployed in retail with 95%+ accuracy in product identification and 40% faster checkout times.',
      tech: ['IoT', 'OpenCV', 'Deep Learning', 'Computer Vision', 'Arduino', 'Python', 'React'],
      gradient: 'from-green-500/50 to-teal-500/50',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://zapkart-demo.onrender.com/',
      bgImage: zapkartImg,
      projectPictures: [zapkartImg]
    },
    {
      title: 'Healthcare IoT Monitor',
      description: 'Multi-sensor IoT device for real-time patient vitals. AI-powered anomaly detection using LSTMs with 94% sensitivity. Real-time alerts reduce response time by 60% for medical staff.',
      tech: ['IoT', 'LSTM', 'TensorFlow', 'Sensor Integration', 'Python', 'Real-time Analytics'],
      gradient: 'from-red-500/50 to-orange-500/50',
      github: 'https://github.com/rahulrathore579',
      demo: '#/',
      bgImage: healthcareImg,
      projectPictures: [healthcareImg]
    },
    {
      title: 'Product Recognition CNN',
      description: 'Deep learning model achieving 96% accuracy on product classification. Custom CNN with transfer learning. Processed 50K+ product images for retail automation and inventory management.',
      tech: ['Deep Learning', 'CNN', 'TensorFlow', 'Computer Vision', 'Transfer Learning', 'Python'],
      gradient: 'from-indigo-500/50 to-blue-500/50',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://product-recognition-demo.vercel.app/',
      bgImage: productRecogImg,
      projectPictures: [productRecogImg]
    },
    {
      title: 'Data Analytics Dashboard',
      description: 'Interactive BI dashboard analyzing 1M+ data points. Custom Python ETL pipeline with Power BI visualizations. Delivers actionable insights reducing analysis time from hours to seconds.',
      tech: ['Power BI', 'Python', 'SQL', 'ETL', 'Data Visualization', 'DAX'],
      gradient: 'from-yellow-500/50 to-orange-500/50',
      github: 'https://github.com/rahulrathore579',
      demo: 'https://data-dashboard-demo.vercel.app/',
      bgImage: dataDashboardImg,
      projectPictures: [dataDashboardImg]
    }
  ];

  return (
    <section
      id="projects"
      className="py-24 px-4 scroll-reveal relative overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.04),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.08),transparent_60%)]" />
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Portfolio Showcase
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-2 tracking-tight">
            Featured Projects
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
          <p className="mt-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            A collection of innovative solutions bridging{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">AI</span>,{' '}
            <span className="text-purple-600 dark:text-purple-400 font-medium">IoT</span>, and{' '}
            <span className="text-pink-600 dark:text-pink-400 font-medium">Modern Web</span> architectures.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              onClick={() =>
                setSelectedProject({
                  title: project.title,
                  description: project.description,
                  images: project.projectPictures,
                  github: project.github,
                  demo: project.demo,
                  tech: project.tech,
                  gradient: project.gradient
                })
              }
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="https://github.com/rahulrathore579"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:border-blue-400 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 group"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>View All Projects on GitHub</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
