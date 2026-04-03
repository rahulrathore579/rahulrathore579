import { Code2, Database, Brain, Globe } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import aboutBg from '../assets/about.png';

const HighlightCard = ({ item, index }: { item: any, index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const Icon = item.icon;

  return (
    <div
      ref={ref}
      className={`p-6 bg-transparent backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-700 hover:scale-105 group transform ${
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
      <p className="text-sm text-gray-700 dark:text-gray-300">
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
      description: 'Deep learning, computer vision, NLP & intelligent systems'
    },
    {
      icon: Code2,
      title: 'Fluenzy AI',
      description: 'Co-Founder — AI-powered language learning & communication platform'
    },
    {
      icon: Globe,
      title: 'Full-Stack Dev',
      description: 'React, Python, Node.js — end-to-end product development'
    },
    {
      icon: Database,
      title: 'IoT & Data',
      description: 'Smart devices, sensor systems & data analytics'
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
      <div className="absolute inset-0 bg-white/20 dark:bg-gray-950/40 z-0 transition-colors duration-500"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full shadow-lg"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div 
            ref={textRef}
            className={`space-y-6 transition-all duration-1000 transform ${
              isTextInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <p className="text-lg text-gray-800 dark:text-gray-100 font-medium leading-relaxed drop-shadow-sm">
              I'm an <strong>AI & ML Developer</strong> and Co-Founder of <strong>Fluenzy AI</strong> — an AI-powered platform
              redefining how people learn and communicate languages. I specialize in building intelligent systems
              using deep learning, computer vision, and NLP.
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-100 font-medium leading-relaxed drop-shadow-sm">
              My expertise spans Python, TensorFlow, PyTorch, OpenCV, and modern web stacks — applied to
              real-world products like Zapkart Smart Cart and AI-driven web applications used by real users.
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-100 font-medium leading-relaxed drop-shadow-sm">
              As a CS student at GLA University (AI, ML & IoT specialization), I focus on shipping production-ready
              AI solutions that create measurable impact, not just proof-of-concepts.
            </p>

            <div className="pt-4">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm">
                Education
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 shadow-lg"></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white drop-shadow-sm">
                      Bachelor of Technology in Computer Science
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-sm drop-shadow-sm">
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
