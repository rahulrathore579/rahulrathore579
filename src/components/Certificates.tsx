import { useState } from 'react';
import { Award, ExternalLink, Image as ImageIcon, X } from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface ImageModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ images, isOpen, onClose }: ImageModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-5xl w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Event Highlights</h3>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-gray-200 dark:border-white/10 transition-all duration-300 transform hover:rotate-90"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 max-h-[75vh] overflow-y-auto px-4 w-full scrollbar-hidden">
          {images.map((img, i) => (
            <div key={i} className="flex flex-col items-center">
              <img
                src={img}
                alt={`Event ${i + 1}`}
                className="rounded-2xl w-full max-w-3xl h-auto object-contain shadow-2xl border border-gray-100 dark:border-white/10 hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CertificateCard = ({ cert, index, setModalData }: { cert: any, index: number, setModalData: (data: any) => void }) => {
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`group relative bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all duration-700 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 ${
        isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      ></div>

      <div className="relative p-8 z-10">
        <div className="flex items-start justify-between mb-6">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${cert.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg relative overflow-hidden`}
          >
            {/* Geometric Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)] blur-sm"></div>
            <span className="text-white text-2xl font-black italic tracking-tighter relative z-10 select-none">
              {(index + 1).toString().padStart(2, '0')}
            </span>
          </div>
          <div className={`px-4 py-2 bg-gradient-to-r ${cert.color} text-white rounded-full text-sm font-semibold shadow-md`}>
            {cert.date}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 bg-gradient-to-br ${cert.color} rounded-full`}></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
              {cert.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 mb-3 ml-4">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-gray-600 dark:text-gray-400">{cert.issuer}</span>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mb-6 line-clamp-3 text-sm leading-relaxed">
          {cert.description}
        </p>

        <div className="flex flex-wrap gap-4 relative z-20">
          <a
            href={cert.link}
            target={cert.link === '#' ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (cert.link === '#') {
                e.preventDefault();
                alert('Certificate image/link coming soon!');
              }
            }}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:gap-3 transition-all duration-300 cursor-pointer text-sm"
          >
            <span>View Certificate</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {cert.eventPictures && cert.eventPictures.length > 0 && (
            <button
              onClick={() => setModalData({ isOpen: true, images: cert.eventPictures! })}
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium hover:gap-3 transition-all duration-300 text-sm"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Event Pictures</span>
            </button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </div>
  );
};

export default function Certificates() {
  const [modalData, setModalData] = useState<{ isOpen: boolean; images: string[] }>({ isOpen: false, images: [] });

  const certificates = [
    {
      title: 'AI Nirman 2026 Winner',
      issuer: 'GLA University',
      date: '2026',
      description:
        "Winner of AI Nirman 2026 competition, showcasing FluenzyAI, Technavya'26 PROJ-E-X. Demonstrated innovation in AI-powered communication solutions.",
      color: 'from-yellow-500 to-orange-500',
      link: 'public/certificate/ainirman.jpeg',
      eventPictures: [
        'assets/certificate/ainirman/ainirman.jpeg',
        'assets/certificate/ainirman/WhatsApp Image 2026-03-12 at 10.33.06 AM (1).jpeg',
        'assets/certificate/ainirman/WhatsApp Image 2026-03-12 at 10.33.06 AM.jpeg',
        'assets/certificate/ainirman/WhatsApp Image 2026-03-12 at 10.33.07 AM.jpeg'
      ]
    },
    {
      title: 'Smart India Hackathon',
      issuer: 'GLA University',
      date: '2025',
      description:
        'Participated in Smart India Hackathon 2024, gaining hands-on experience in innovation, teamwork, and rapid solution development.',
      color: 'from-blue-500 to-cyan-500',
      link: 'https://www.linkedin.com/posts/varun-gupta-3a1315289_smartindiahackathon-sih2025-innovation-ugcPost-7389542807629291521-x_SG?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEPIK78BIkLspWBpwRyHI3r1wu_5uG8lfKo',
      eventPictures: [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    {
      title: 'Python Programming',
      issuer: 'Infosys',
      date: '2024',
      description:
        'Comprehensive Python programming certification covering core concepts, data structures, and application development',
      color: 'from-blue-500 to-cyan-500',
      link: 'https://www.linkedin.com/posts/rahulrathore39769_pythonprogramming-activity-7157801199692312576-ruyX?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEPIK78BIkLspWBpwRyHI3r1wu_5uG8lfKo',
      eventPictures: []
    },
    {
      title: 'Data Analytics Cohort Experience',
      issuer: 'Professional Training',
      date: '2024',
      description:
        'Intensive data analytics program focusing on statistical analysis, data visualization, and business intelligence',
      color: 'from-purple-500 to-pink-500',
      link: 'https://example.com/data-analytics',
      eventPictures: []
    },
    {
      title: 'Power BI using DAX & AI',
      issuer: 'Business Intelligence',
      date: '2025',
      description:
        'Advanced Power BI certification with expertise in DAX formulas and AI-powered analytics for data-driven insights',
      color: 'from-green-500 to-teal-500',
      link: 'https://www.linkedin.com/posts/rahulrathore39769_innovation-iot-healthcarerevolution-activity-7154817006557437952-p4nD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEPIK78BIkLspWBpwRyHI3r1wu_5uG8lfKo',
      eventPictures: []
    },
    {
      title: 'Machine Learning Foundations',
      issuer: 'Online Platform',
      date: '2024',
      description:
        'Foundational machine learning concepts including supervised and unsupervised learning algorithms',
      color: 'from-orange-500 to-red-500',
      link: 'https://example.com/machine-learning',
      eventPictures: []
    }
  ];

  return (
    <section
      id="certificates"
      className="py-24 px-4 scroll-reveal relative overflow-hidden bg-gray-50 dark:bg-gray-950"
    >
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <ImageModal
        isOpen={modalData.isOpen}
        images={modalData.images}
        onClose={() => setModalData({ isOpen: false, images: [] })}
      />
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-2 tracking-tight">
            Certificates & Achievements
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]"></div>
          <p className="mt-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Continuous learning and{' '}
            <span className="text-pink-600 dark:text-pink-400 font-medium">professional development</span> milestones
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <CertificateCard key={index} cert={cert} index={index} setModalData={setModalData} />
          ))}
        </div>

        <div className="mt-20 text-center">
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
                  className="px-6 py-4 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl hover:border-blue-400/50 dark:hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500 font-medium">
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
