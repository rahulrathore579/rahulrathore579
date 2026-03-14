import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const SkillCategoryCard = ({ category, index }: { category: any, index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div
      ref={ref}
      className={`relative bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 p-8 rounded-2xl hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all duration-700 transform group shadow-sm hover:shadow-lg hover:shadow-blue-500/10 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3 relative z-10">
        <span className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full flex-shrink-0"></span>
        {category.category}
      </h3>
      <div className="space-y-5 relative z-10">
        {category.skills.map((skill: any, skillIndex: number) => (
          <div
            key={skillIndex}
            onMouseEnter={() => setHoveredSkill(`${index}-${skillIndex}`)}
            onMouseLeave={() => setHoveredSkill(null)}
            className="group/skill"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-600 dark:text-gray-300 group-hover/skill:text-gray-900 dark:group-hover/skill:text-white transition-colors text-sm">
                {skill.name}
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {skill.level}%
              </span>
            </div>
            <div className="h-2 bg-gray-200/80 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative ${
                  hoveredSkill === `${index}-${skillIndex}` ? 'shadow-[0_0_12px_rgba(99,102,241,0.5)]' : ''
                }`}
                style={{ width: isInView ? `${skill.level}%` : '0%' }}
              >
                {hoveredSkill === `${index}-${skillIndex}` && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TechBadge = ({ tech, index }: { tech: any, index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 p-5 rounded-xl text-center hover:border-blue-400/50 dark:hover:border-blue-500/40 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-md group transform ${
        isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
        {tech.icon}
      </div>
      <p className="font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white text-sm transition-colors">
        {tech.name}
      </p>
    </div>
  );
};

export default function Skills() {
  const skillCategories = [
    {
      category: 'Languages',
      skills: [
        { name: 'Python', level: 90 },
        { name: 'SQL', level: 85 },
        { name: 'Java', level: 80 },
        { name: 'JavaScript', level: 85 }
      ]
    },
    {
      category: 'Frameworks & Libraries',
      skills: [
        { name: 'Gen AI', level: 85 },
        { name: 'LangChain', level: 80 },
        { name: 'Flask', level: 85 },
        { name: 'React', level: 80 },
        { name: 'TensorFlow', level: 85 }
      ]
    },
    {
      category: 'Tools & Technologies',
      skills: [
        { name: 'Power BI', level: 90 },
        { name: 'Tableau', level: 85 },
        { name: 'MySQL', level: 85 },
        { name: 'Excel', level: 88 }
      ]
    },
    {
      category: 'Soft Skills',
      skills: [
        { name: 'Teamwork', level: 95 },
        { name: 'Communication', level: 90 },
        { name: 'Leadership', level: 88 },
        { name: 'Problem Solving', level: 92 }
      ]
    }
  ];

  return (
    <section
      id="skills"
      className="py-24 px-4 scroll-reveal relative overflow-hidden bg-gray-50 dark:bg-gray-950"
    >
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-2 tracking-tight">
            Skills & Expertise
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]"></div>
          <p className="mt-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
            A comprehensive toolkit for building modern,{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">intelligent</span> applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <SkillCategoryCard key={index} category={category} index={index} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Gen AI', icon: '🤖' },
            { name: 'LLMs', icon: '🧠' },
            { name: 'NLP', icon: '🗣️' },
            { name: 'IoT', icon: '🔌' },
            { name: 'Computer Vision', icon: '👁️' },
            { name: 'Deep Learning', icon: '🧠' },
            { name: 'Data Analytics', icon: '📊' },
            { name: 'Web Apps', icon: '🌐' },
            { name: 'APIs', icon: '🔗' },
            { name: 'Cloud', icon: '☁️' },
            { name: 'Git', icon: '📦' }
          ].map((tech, index) => (
            <TechBadge key={index} tech={tech} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
