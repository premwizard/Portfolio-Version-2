import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Sparkles, Terminal, AlertTriangle } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'MediSync360',
    description: 'An integrated healthcare ecosystem designed to manage patient records, provide intelligent health insights, and streamline communication between users and healthcare services.',
    tags: ['React.js', 'Flask', 'MongoDB', 'AI Integration'],
    category: 'Healthcare Platform'
  },
  {
    id: 2,
    title: 'AI-Based Multi Services Healthcare',
    description: 'Developed a healthcare platform offering personalized nutrition guidance, health record management, and multi-service integration for improved patient care.',
    tags: ['Python', 'Flask', 'React.js', 'Ollama', 'NLP'],
    category: 'AI Healthcare System'
  },
  {
    id: 3,
    title: 'AI Dietitian System',
    description: 'An AI-powered dietitian system that analyzes user inputs to generate personalized nutrition advice and meal plans for a healthier lifestyle.',
    tags: ['Python', 'Flask', 'React.js', 'Ollama'],
    category: 'AI Assistant'
  },
  {
    id: 4,
    title: 'Smart LMS  System',
    description: 'A full-stack management system designed for handling operations like user management, orders, and analytics (adaptable for LMS or restaurant management).',
    tags: ['React.js', 'Flask', 'MongoDB', 'Express'],
    category: 'Management System'
  }
];

const promptMap = {
ai: {
user: 'Show AI projects',
ai: 'Analyzing portfolio... AI-driven healthcare systems detected. Displaying the most impactful solution.',
pick: 1,
witty: 'AI + healthcare is where real impact happens. This system reflects that vision.'
},
healthcare: {
user: 'Show healthcare systems',
ai: 'Healthcare-focused architecture identified. Presenting a multi-service intelligent platform.',
pick: 2,
witty: 'Built to solve real-world healthcare problems with scalable AI systems.'
},
surprise: {
user: 'Show a random project',
ai: 'Selecting a project at random from the system repository.',
pick: null,
witty: 'Every system here is built with purpose. This one stands out in its own way.'
}
};

const Projects = () => {
  const [history, setHistory] = useState([
    { role: 'ai', text: 'Boot sequence complete. Rogue AI interface active.' }
  ]);
  const [typing, setTyping] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [witty, setWitty] = useState('');
  const [showAll, setShowAll] = useState(false);
  const typingInterval = useRef(null);

  const appendLine = (line) => setHistory((prev) => [...prev, line]);

  const typeLine = (text, callback) => {
    clearInterval(typingInterval.current);
    setTyping('');
    setIsTyping(true);
    let index = 0;

    typingInterval.current = window.setInterval(() => {
      index += 1;
      setTyping(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(typingInterval.current);
        setIsTyping(false);
        setTyping('');
        callback?.();
      }
    }, 20);
  };

  useEffect(() => {
    const intro = 'Welcome to the intelligent project terminal. Explore AI-powered healthcare and full-stack systems.';
    const timer = window.setTimeout(() => {
      typeLine(intro, () => appendLine({ role: 'ai', text: intro }));
    }, 120);

    return () => {
      clearTimeout(timer);
      clearInterval(typingInterval.current);
    };
  }, []);

  const handlePrompt = (key) => {
    if (isTyping) return;
    setShowAll(false);
    const prompt = promptMap[key];
    appendLine({ role: 'user', text: prompt.user });
    appendLine({ role: 'ai', text: '...' });
    const projectId = key === 'surprise' ? Math.floor(Math.random() * projects.length) + 1 : prompt.pick;
    const project = projects.find((item) => item.id === projectId) || projects[0];
    setSelectedProject(project);
    setWitty(prompt.witty);

    typeLine(prompt.ai, () => {
      setHistory((prev) => prev.slice(0, -1).concat({ role: 'ai', text: prompt.ai }));
      appendLine({ role: 'ai', text: prompt.witty });
    });
  };

  const handleOverride = () => {
    if (isTyping) return;
    setShowAll(true);
    appendLine({ role: 'user', text: 'Override AI' });
    const overrideMessage = 'Manual override activated. Displaying all engineered systems.';
    typeLine(overrideMessage, () => appendLine({ role: 'ai', text: overrideMessage }));
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-24 px-6 relative z-10 overflow-hidden bg-[var(--bg)]">
      <div className="absolute left-1/2 top-10 h-24 w-24 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mb-14 text-center"
        >

          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span>Featured </span> <span className="text-primary" >Projects</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-platinum/70 sm:text-base">
          Choose a prompt and let the AI select the optimal project, or force an override to browse all work.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[32px] border border-platinum/10 bg-[var(--surf)]/90 p-6 shadow-[0_35px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-platinum/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-primary/80">Terminal</p>
                <h3 className="mt-3 text-2xl font-semibold">Rogue AI transcript</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-[var(--surf2)]/80 px-3 py-2 text-xs uppercase tracking-[0.35em] text-platinum/70">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live session
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-[28px] border border-platinum/10 bg-[var(--bg)]/80 p-5 font-mono text-sm leading-7 text-platinum/80 shadow-[inset_0_0_30px_rgba(184,204,216,0.02)]">
              {history.map((line, index) => (
                <div key={`${line.role}-${index}`} className="space-y-1">
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-platinum/60">
                    <span className={line.role === 'user' ? 'text-warm' : 'text-primary'}>
                      {line.role === 'user' ? 'USER' : 'AI'}
                    </span>
                    <span>{line.role === 'user' ? '>' : '>'}</span>
                  </div>
                  <p className={`whitespace-pre-wrap ${line.role === 'user' ? 'text-platinum' : 'text-platinum/80'}`}>
                    {line.text}
                  </p>
                </div>
              ))}

              {isTyping && (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-platinum/60">
                    <span className="text-primary">AI</span>
                    <span>{'>'}</span>
                  </div>
                  <p className="text-platinum/80">{typing}<span className="inline-block h-4 w-1 animate-[blink_1.2s_steps(2, end)_infinite] bg-platinum/80 align-middle" /></p>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handlePrompt('ai')}
                disabled={isTyping}
                className="rounded-full border border-primary/30 bg-[var(--surf)]/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] transition-all duration-300 hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Show AI projects
              </button>
              <button
                type="button"
                onClick={() => handlePrompt('healthcare')}
                disabled={isTyping}
                className="rounded-full border border-primary/30 bg-[var(--surf)]/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] transition-all duration-300 hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Show healthcare systems
              </button>
              <button
                type="button"
                onClick={() => handlePrompt('surprise')}
                disabled={isTyping}
                className="rounded-full border border-primary/30 bg-[var(--surf)]/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] transition-all duration-300 hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Show a random project
              </button>
            </div>

            <button
              type="button"
              onClick={handleOverride}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-warm/40 bg-[var(--surf2)]/90 px-5 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-warm transition-all duration-300 hover:border-warm hover:bg-warm/10"
            >
              <AlertTriangle size={16} /> Override AI
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-[32px] border border-platinum/10 bg-[var(--surf)]/90 p-6 shadow-[0_35px_80px_rgba(0,0,0,0.35)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-primary/80">Match result</p>
                  <h3 className="mt-3 text-3xl font-semibold">{selectedProject ? selectedProject.title : 'Awaiting command...'}</h3>
                </div>
                <div className="rounded-3xl bg-[var(--bg)]/60 px-4 py-3 text-xs uppercase tracking-[0.35em] text-platinum/70">
                  {selectedProject ? selectedProject.category : 'Rogue AI Network'}
                </div>
              </div>

              {selectedProject ? (
                <>
                  <p className="mt-5 text-sm leading-7 text-platinum/70">{selectedProject.description}</p>
                  <p className="mt-4 italic text-sm text-platinum/70">"{witty || 'The AI is thinking...'}"</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-primary/20 bg-[var(--surf)]/80 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-platinum/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">

                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-[28px] border border-dashed border-platinum/10 bg-[var(--surf)]/70 p-6 text-center text-sm text-platinum/70">
                  The AI will reveal the optimal project once you ask it a question. Use the prompt buttons to begin.
                </div>
              )}
            </div>

            {showAll && (
              <div className="rounded-[32px] border border-platinum/10 bg-[var(--surf)]/90 p-6 shadow-[0_35px_80px_rgba(0,0,0,0.35)]">
                <div className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-primary/80">
                  <Sparkles size={18} /> Full project repository
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {projects.map((project) => (
                    <article key={project.id} className="rounded-[28px] border border-platinum/10 bg-[var(--bg)]/80 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-[var(--surf)]/90">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-semibold">{project.title}</h4>
                          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-platinum/70">{project.category}</p>
                        </div>
                        <div className="rounded-full bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-primary">{project.tags.length} tags</div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-platinum/70">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-primary/20 bg-[var(--surf)]/80 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-platinum/70">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
