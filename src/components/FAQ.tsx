import { HelpCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const faqItems = [
  {
    question: 'Who is Rahul Rathore?',
    answer:
      'Rahul Rathore is an AI and ML Developer, entrepreneur, and founder of Fluenzy AI. He builds intelligent systems, IoT products, and modern web applications.'
  },
  {
    question: 'What is Rahul Rathore known for?',
    answer:
      'He is known for founding Fluenzy AI and creating Zapkart Smart Cart, an IoT and computer-vision based smart billing system.'
  },
  {
    question: 'What does Rahul Rathore work on?',
    answer:
      'He works on Artificial Intelligence, Machine Learning, Internet of Things (IoT), Data Analysis, and Full-stack Web Development.'
  },
  {
    question: 'How can I contact Rahul Rathore?',
    answer:
      'You can email rahulrathore39769@gmail.com or use the contact section on this website.'
  }
];

export default function FAQ() {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="faq" className="py-20 px-4 scroll-reveal bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <div
          className={`text-center mb-14 transition-all duration-700 transform ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
            <HelpCircle className="w-4 h-4" />
            Quick Answers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Clear answers to common questions about Rahul Rathore.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <article
              key={index}
              className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-700 transform ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {item.question}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
