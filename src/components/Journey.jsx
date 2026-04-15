import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────  DATA  ───────────────────────── */
const experienceData = [
  {
    id: 1,
    title: 'Web Development Intern',
    organization: 'Zidio Development',
    duration: 'Mar 2026 – Present',
    description: 'Developing and maintaining modern web applications with a focus on performance, responsiveness, and clean user experience. Contributing to real-world projects using current web technologies.',
    isCurrent: true,
  },
  {
    id: 2,
    title: 'Full Stack Python Developer Intern',
    organization: 'Code Infinite Technology, Coimbatore',
    duration: 'Jun 2025',
    description: 'Worked on end-to-end web application development using Python, Django, SQL, and modern frontend technologies. Gained hands-on experience in building scalable and user-focused applications.',
  },
  {
    id: 3,
    title: 'Machine Learning Intern',
    organization: 'EMGLITZ Technologies, Coimbatore',
    duration: 'Dec 2024 – Jan 2025',
    description: 'Applied machine learning techniques on real-world datasets using Python and data visualization tools. Built models to identify patterns and improve prediction accuracy.',
  },
];

const educationData = [
  {
    id: 1,
    title: 'B.E Computer Science and Technology',
    organization: 'SNS College of Engineering',
    duration: '2022 – 2026',
    description: 'Built a strong foundation in software engineering, data structures, and AI/ML. Focused on developing real-world projects in full-stack development and intelligent systems.',
  },
  {
    id: 2,
    title: 'HSC',
    organization: 'Annai Violet Matric Hr. Sec. School',
    duration: '2021 – 2022',
    description: 'Completed higher secondary education with a focus on mathematics and computer science, developing analytical thinking and problem-solving skills.',
  },
  {
    id: 3,
    title: 'SSLC',
    organization: 'Brilliant Matric Hr. Sec. School',
    duration: '2019 – 2020',
    description: 'Established core academic fundamentals with a strong interest in technology and logical reasoning, laying the groundwork for future studies in computer science.',
  },
];

/* ───────────────────  BOOK PAGE COMPONENT  ───────────────── */
const BookPage = ({ title, items, isLeft, currentPage }) => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  return (
    <motion.div
      className={`relative h-full w-full bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border-r border-primary/20 ${
        isLeft ? 'rounded-l-2xl' : 'rounded-r-2xl'
      }`}
      initial={{ rotateY: isLeft ? -90 : 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: isLeft ? -90 : 90, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Page texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-30" />

      {/* Page content */}
      <div className="relative h-full p-8 flex flex-col">
        {/* Chapter header */}
        <div className="mb-8">
          <h3 className="font-serif italic text-2xl md:text-3xl text-primary mb-2 tracking-wide">
            {romanNumerals[currentPage - 1]} · {title}
          </h3>
          <div className="h-px bg-gradient-to-r from-primary/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-lg leading-tight">
                  {item.title}
                </h4>
                <span className="font-serif italic text-primary/80 text-sm ml-4 shrink-0">
                  {item.duration}
                </span>
              </div>
              <p className="text-primary/90 font-medium text-sm">
                {item.organization}
              </p>
              <p className="text-platinum/70 leading-relaxed text-sm">
                {item.description}
              </p>
              {item.isCurrent && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs font-medium tracking-wider text-emerald-400/80">CURRENT</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Page number */}
        <div className="mt-auto pt-4 text-center">
          <span className="font-serif italic text-primary/60 text-sm">
            {romanNumerals[currentPage - 1]}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ───────────────────  SPINE COMPONENT  ──────────────────── */
const BookSpine = () => (
  <div className="relative w-4 h-full bg-gradient-to-b from-primary/30 via-primary/20 to-primary/30 border-x border-primary/40 shadow-inner">
    {/* Spine texture */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    {/* Decorative lines */}
    <div className="absolute top-8 left-1/2 w-px h-3/4 bg-primary/40 transform -translate-x-1/2" />
    <div className="absolute top-12 left-1/2 w-2 h-px bg-primary/60 transform -translate-x-1/2" />
    <div className="absolute bottom-12 left-1/2 w-2 h-px bg-primary/60 transform -translate-x-1/2" />
  </div>
);

/* ───────────────────  NAVIGATION BUTTONS  ───────────────── */
const NavigationButtons = ({ currentChapter, totalChapters, onPrev, onNext }) => (
  <div className="flex items-center justify-center gap-8 mt-8">
    <motion.button
      onClick={onPrev}
      disabled={currentChapter === 1}
      className="group relative px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="font-serif italic text-sm">Previous Chapter</span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>

    <div className="flex items-center gap-2">
      {Array.from({ length: totalChapters }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i + 1 === currentChapter ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-primary/30'
          }`}
        />
      ))}
    </div>

    <motion.button
      onClick={onNext}
      disabled={currentChapter === totalChapters}
      className="group relative px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="font-serif italic text-sm">Next Chapter</span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  </div>
);

/* ───────────────────  DOWNLOAD RESUME BUTTON  ───────────── */
const DownloadResumeButton = () => (
  <motion.button
    className="group relative px-8 py-4 bg-gradient-to-r from-primary to-warm border border-primary/50 rounded-lg text-background font-semibold hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all duration-500 overflow-hidden"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="font-serif italic relative z-10">Download Resume</span>
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-warm to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-warm/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  </motion.button>
);

/* ═══════════════════  MAIN JOURNEY SECTION  ═════════════════ */
const Journey = () => {
  const [currentChapter, setCurrentChapter] = useState(1);

  // Calculate total chapters based on data length (assuming 2-3 items per chapter)
  const itemsPerChapter = 2;
  const totalExperienceChapters = Math.ceil(experienceData.length / itemsPerChapter);
  const totalEducationChapters = Math.ceil(educationData.length / itemsPerChapter);
  const totalChapters = Math.max(totalExperienceChapters, totalEducationChapters);

  const getCurrentItems = (data, chapter) => {
    const startIndex = (chapter - 1) * itemsPerChapter;
    return data.slice(startIndex, startIndex + itemsPerChapter);
  };

  const handlePrev = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNext = () => {
    if (currentChapter < totalChapters) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  return (
    <section id="journey" className="relative z-10 py-24 px-6">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      <div className="absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-primary/[0.04] blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-warm/[0.04] blur-[100px]" />

      <div className="w-full max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-30"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            My{' '}
            <span className="font-serif italic text-primary text-glow">
               Journey
            </span>
          </h2>
          <div className="mx-auto h-[1px] w-32 bg-primary mb-4" />
          <p className="mx-auto max-w-lg text-sm text-platinum/50 leading-relaxed">
            An open book of experiences and education — each page a chapter in the story of growth and discovery.
          </p>
        </motion.div>

        {/* Book container */}
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="relative z-10 shadow-2xl shadow-primary/20 rounded-2xl overflow-hidden md:flex md:shadow-2xl md:shadow-primary/20 md:rounded-2xl md:overflow-hidden"
            style={{ height: 'auto', minHeight: '600px' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Mobile: Experience section first */}
            <div className="block md:hidden">
              <div className="p-6 border-b border-primary/20">
                <h3 className="font-serif italic text-2xl text-primary mb-4 tracking-wide">
                  I · Experience
                </h3>
                <div className="space-y-6">
                  {experienceData.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-lg leading-tight">
                          {item.title}
                        </h4>
                        <span className="font-serif italic text-primary/80 text-sm ml-4 shrink-0">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-primary/90 font-medium text-sm">
                        {item.organization}
                      </p>
                      <p className="text-platinum/70 leading-relaxed text-sm">
                        {item.description}
                      </p>
                      {item.isCurrent && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                          </span>
                          <span className="text-xs font-medium tracking-wider text-emerald-400/80">CURRENT</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif italic text-2xl text-primary mb-4 tracking-wide">
                  II · Education
                </h3>
                <div className="space-y-6">
                  {educationData.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-lg leading-tight">
                          {item.title}
                        </h4>
                        <span className="font-serif italic text-primary/80 text-sm ml-4 shrink-0">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-primary/90 font-medium text-sm">
                        {item.organization}
                      </p>
                      <p className="text-platinum/70 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Download Resume button - mobile */}
                <div className="mt-8 flex justify-center">
                  <DownloadResumeButton />
                </div>
              </div>
            </div>

            {/* Desktop: Book layout */}
            <div className="hidden md:flex" style={{ height: '600px' }}>
              {/* Left page - Experience */}
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  <BookPage
                    key={`experience-${currentChapter}`}
                    title="Experience"
                    items={getCurrentItems(experienceData, currentChapter)}
                    isLeft={true}
                    currentPage={currentChapter}
                  />
                </AnimatePresence>
              </div>

              {/* Spine */}
              <BookSpine />

              {/* Right page - Education */}
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  <BookPage
                    key={`education-${currentChapter}`}
                    title="Education"
                    items={getCurrentItems(educationData, currentChapter)}
                    isLeft={false}
                    currentPage={currentChapter}
                  />
                </AnimatePresence>

                {/* Download Resume button - positioned at bottom right of right page */}
                <div className="absolute bottom-8 right-8">
                  <DownloadResumeButton />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation - only show on desktop */}
          <div className="hidden md:block">
            <NavigationButtons
              currentChapter={currentChapter}
              totalChapters={totalChapters}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
