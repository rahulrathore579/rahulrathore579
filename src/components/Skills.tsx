import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const SkillCategoryCard = ({ category, index }: { category: any, index: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div
      ref={ref}
      className={`relative bg-transparent backdrop-blur-sm border border-white/20 dark:border-white/10 p-8 rounded-2xl hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all duration-700 transform group shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3 relative z-10 drop-shadow-sm">
        <span className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full flex-shrink-0 shadow-lg"></span>
        {category.category}
      </h3>
      <div className="space-y-6 relative z-10">
        {category.skills.map((skill: any, skillIndex: number) => (
          <div
            key={skillIndex}
            onMouseEnter={() => setHoveredSkill(`${index}-${skillIndex}`)}
            onMouseLeave={() => setHoveredSkill(null)}
            className="group/skill"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-800 dark:text-gray-100 group-hover/skill:text-blue-600 dark:group-hover/skill:text-blue-400 transition-colors drop-shadow-sm">
                {skill.name}
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 drop-shadow-sm">
                {skill.level}%
              </span>
            </div>
            <div className="h-3 bg-gray-200/30 dark:bg-white/5 rounded-full overflow-hidden relative border border-gray-300/10 dark:border-white/5">
              <div
                className={`h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out relative ${
                  hoveredSkill === `${index}-${skillIndex}` ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)]' : ''
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
      className={`bg-transparent border border-white/20 dark:border-white/10 p-6 rounded-2xl hover:border-blue-400/50 dark:hover:border-blue-500/40 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-xl group transform ${
        isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-xl">
        {tech.icon}
      </div>
      <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors drop-shadow-sm">
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
      className="py-24 px-4 scroll-reveal relative overflow-hidden bg-transparent"
    >
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-2 tracking-tight drop-shadow-sm">
            Skills & Expertise
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full shadow-lg"></div>
          <p className="mt-8 text-gray-800 dark:text-gray-100 font-bold max-w-2xl mx-auto text-lg drop-shadow-sm leading-relaxed translate-y-0 opacity-90 hover:opacity-100 transition-opacity">
            A comprehensive toolkit for building modern,{' '}
            <span className="text-blue-700 dark:text-blue-400 border-b-2 border-blue-500/30">intelligent</span> applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {skillCategories.map((category, index) => (
            <SkillCategoryCard key={index} category={category} index={index} />
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
