import { Code2, Database, Brain, Globe } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import aboutBg from '../assets/about.png';

const HighlightCard = ({ item, index }: { item: any, index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const Icon = item.icon;

  return (
    <div
      ref={ref}
      className={`p-6 bg-transparent border border-gray-200/20 dark:border-white/10 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-700 hover:scale-105 group transform ${
        isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {item.description}
      </p>
    </div>
  );
};

export default function About() {
  const highlights = [
    {
      icon: Brain,
      title: 'AI & ML',
      description: 'Deep learning, computer vision, and intelligent systems'
    },
    {
      icon: Code2,
      title: 'IoT Solutions',
      description: 'Smart devices and sensor-based applications'
    },
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Modern, responsive full-stack applications'
    },
    {
      icon: Database,
      title: 'Data Analysis',
      description: 'Insights through Power BI and analytics'
    }
  ];

  const { ref: textRef, isInView: isTextInView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      id="about"
      className="py-20 px-4 relative bg-cover bg-center bg-fixed scroll-reveal"
      style={{ backgroundImage: `url(${aboutBg})` }}
    >
      {/* Overlay to ensure text visibility while keeping the background clear */}
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/70 z-0 transition-colors duration-500"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div 
            ref={textRef}
            className={`space-y-6 transition-all duration-1000 transform ${
              isTextInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I'm a passionate Computer Science student specializing in cutting-edge
              technologies including Artificial Intelligence, Machine Learning, Internet
              of Things, and modern Web Development.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              My expertise lies in developing intelligent systems that solve real-world
              problems. From building AI-powered applications to creating IoT solutions
              and analyzing complex datasets, I thrive on turning innovative ideas into
              practical implementations.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I believe in continuous learning and staying updated with the latest
              technological advancements. My goal is to leverage technology to create
              meaningful impact and drive digital transformation.
            </p>

            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Education
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Bachelor of Technology in Computer Science
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Specialization: AI, ML, IoT, and Data Science
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <HighlightCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
