import { useState } from 'react';

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

  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section
      id="skills"
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800 scroll-reveal"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, intelligent applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                {category.category}
              </h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    onMouseEnter={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out relative ${
                          hoveredSkill === `${categoryIndex}-${skillIndex}` ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''
                        }`}
                        style={{
                          width: `${skill.level}%`
                        }}
                      >
                        {hoveredSkill === `${categoryIndex}-${skillIndex}` && (
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
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
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {tech.icon}
              </div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                {tech.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
