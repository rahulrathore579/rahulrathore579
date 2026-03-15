import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, Download, MessageCircle, Instagram } from 'lucide-react';
import profileImage from '../assets/rahul-rathore.png';
import heroBgImage from '../assets/image7copy.png';

export default function Hero() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const roles = [
    'Cofounder of FluenzyAI',
    'AI & ML Developer',
    'IoT Developer',
    'Web Developer',
    'Data Analyst'
  ];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100" style={{ backgroundImage: `url(${heroBgImage})` }}></div>
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/70"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Hi, I'm
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Rahul Rathore
            </h1>
          </div>

          <div className="h-12 flex items-center">
            <span className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              {text}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            Cofounder of FluenzyAI & Computer Science student passionate about building intelligent systems
            and innovative solutions using AI, ML, IoT, and modern web technologies.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToContact();
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Get in Touch
            </a>
            <a
              href="Resume.pdf"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              View Resume
            </a>
          </div>

          <div className="flex gap-4 pt-4">
            <a
              href="https://github.com/rahulrathore579"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/rahulrathore39769"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:rahulrathore39769@gmail.com"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/rahulrathore579"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="tel:+917505238914"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="Phone"
            >
              <Phone className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="flex justify-center items-center animate-fade-in delay-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <img
                  src={profileImage}
                  alt="Rahul Rathore - AI Developer, ML Developer & Founder of Fluenzy AI"
                  title="Rahul Rathore Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
