import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';

const steps = [
  {
    key: 'name',
    label: 'Name',
    prompt: 'Welcome to Mission Control. First, what should I call you?',
    placeholder: 'Type your name…',
    quickReplies: ['Client', 'Prospective Partner', 'Guest'],
  },
  {
    key: 'email',
    label: 'Email',
    prompt: 'Perfect. What email should I use to reach you?',
    placeholder: 'name@company.com',
    quickReplies: ['contact@company.com', 'info@organization.com', 'support@business.com'],
  },
  {
    key: 'reason',
    label: 'Reason',
    prompt: 'What brings you here today? Select one.',
    quickReplies: ['Collaboration', 'Employment Opportunity', 'Project Inquiry', 'Other'],
  },
  {
    key: 'message',
    label: 'Message',
    prompt: 'Awesome. Give me the quick brief for your message.',
    placeholder: 'Share your idea, timeline, or ask…',
    quickReplies: ['Regarding a product idea', 'Assistance with a launch', 'Discussion about an opportunity'],
  },
];

const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const Contact = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [history, setHistory] = useState([{ from: 'bot', text: steps[0].prompt }]);
  const [responses, setResponses] = useState({ name: '', email: '', reason: '', message: '' });
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const currentStep = steps[stepIndex] || null;
  const isComplete = stepIndex >= steps.length;

  const progressDots = useMemo(
    () => steps.map((step, index) => ({
      label: step.label,
      active: index === stepIndex,
      completed: index < stepIndex,
    })),
    [stepIndex],
  );

  useEffect(() => {
    if (currentStep && inputRef.current && stepIndex > 0) {
      inputRef.current.focus();
    }
  }, [currentStep, stepIndex]);

  useEffect(() => {
    if (!serviceId || !templateId || !publicKey) return;
    emailjs.init(publicKey);
  }, [publicKey, serviceId, templateId]);

  useEffect(() => {
    if (!isComplete) return;

    const summaryMessage = `I received your message and am sending the details now. You asked to be contacted as ${responses.name}, via ${responses.email}, regarding ${responses.reason}.`;
    setHistory((prev) => [...prev, { from: 'bot', text: summaryMessage }]);
    setStatus('sending');

    if (!serviceId || !templateId || !publicKey) {
      setError('EmailJS is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your env.');
      setStatus('failed');
      return;
    }

    const templateParams = {
      from_name: responses.name,
      from_email: responses.email,
      contact_reason: responses.reason,
      message: responses.message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setStatus('sent');
        setHistory((prev) => [
          ...prev,
          {
            from: 'bot',
            text: `Mission accomplished. Your note is on route. I’ll reply to ${responses.email} shortly.`,
          },
        ]);
      })
      .catch((sendError) => {
        console.error(sendError);
        setError('There was an issue sending your note. Please try again or email contact@ironcrown.dev directly.');
        setStatus('failed');
      });
  }, [isComplete]);

  const handleUserSubmit = (answer) => {
    const value = answer?.trim() || inputValue.trim();
    if (!value) {
      setError('Please enter a response to continue.');
      return;
    }

    setError('');
    setHistory((prev) => [...prev, { from: 'user', text: value }]);
    setResponses((prev) => ({ ...prev, [currentStep.key]: value }));
    setInputValue('');

    const nextStep = stepIndex + 1;
    if (nextStep < steps.length) {
      setTimeout(() => {
        setHistory((prev) => [...prev, { from: 'bot', text: steps[nextStep].prompt }]);
      }, 250);
      setStepIndex(nextStep);
      return;
    }

    setStepIndex(nextStep);
  };

  const handleQuickReply = (text) => {
    if (!currentStep) return;
    if (currentStep.key === 'reason') {
      handleUserSubmit(text);
      return;
    }
    setInputValue(text);
    setError('');
    if (currentStep.key === 'email') {
      return;
    }
  };

  const submitCurrentStep = () => {
    if (!currentStep) return;

    if (currentStep.key === 'email' && inputValue && !validateEmail(inputValue)) {
      setError('Please enter a valid email address.');
      return;
    }

    handleUserSubmit(inputValue);
  };

  const renderStatusBadge = () => {
    if (status === 'sending') {
      return 'SENDING...';
    }
    if (status === 'sent') {
      return 'DELIVERED';
    }
    if (status === 'failed') {
      return 'ERROR';
    }
    return 'ONLINE';
  };

  return (
    <section id="contact" className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Get in <span className="text-primary italic font-serif text-glow">Touch</span>
          </motion.h2>
          <p className="text-platinum/60 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Experience a terminal-inspired contact flow for instant context, quick replies, and seamless email delivery.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass-card relative overflow-hidden border border-platinum/10 bg-[var(--surf)]/95"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center justify-between px-5 py-4 border-b border-platinum/10 backdrop-blur-xl">
          
            <div className="flex items-center gap-2">
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base text-platinum/70">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase tracking-[0.35em]">{renderStatusBadge()}</span>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-8">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-platinum/60">
              {progressDots.map((dot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      dot.completed ? 'bg-primary' : dot.active ? 'bg-platinum' : 'bg-platinum/10'
                    }`}
                  />
                  <span className={`whitespace-nowrap ${dot.active ? 'text-platinum' : 'text-platinum/50'}`}>
                    {dot.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={`${item.from}-${index}-${item.text.slice(0, 10)}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className={`max-w-3xl ${item.from === 'bot' ? 'self-start' : 'self-end'} flex flex-col gap-2`}
                >
                  <div
                    className={`rounded-3xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      item.from === 'bot'
                        ? 'bg-platinum/5 border-primary/15 text-platinum'
                        : 'bg-primary/10 border-primary/20 text-platinum'
                    }`}
                  >
                    {item.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {currentStep && currentStep.quickReplies ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentStep.quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => handleQuickReply(reply)}
                      className="rounded-2xl border border-platinum/10 bg-platinum/5 px-4 py-3 text-left text-sm text-platinum/80 transition hover:border-primary/40 hover:bg-primary/10 hover:text-platinum"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              ) : null}

              {!isComplete ? (
                <div className="w-full rounded-3xl border border-platinum/10 bg-[var(--surf)]/90 p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.25)]">
                  <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-platinum/50">
                    {currentStep?.label}
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          submitCurrentStep();
                        }
                      }}
                      className="flex-1 rounded-2xl border border-platinum/10 bg-transparent px-4 py-3 text-platinum outline-none transition focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                      placeholder={currentStep?.placeholder || 'Type your answer…'}
                      disabled={status === 'sending'}
                    />
                    <button
                      type="button"
                      onClick={submitCurrentStep}
                      disabled={status === 'sending'}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl bg-gradient-to-r from-primary to-warm px-5 py-3 text-sm font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="mt-3 h-4 text-xs text-rose-200 min-h-[1rem]">{error || 'Use the quick replies for a faster start.'}</div>
                </div>
              ) : (
                <div className="rounded-3xl border border-platinum/10 bg-[#050403]/90 p-6 text-sm text-platinum/80">
                  <div className="mb-4 text-platinum font-medium">Conversation summary</div>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-platinum/10 bg-platinum/5 p-4">
                      <p className="text-platinum/80 text-sm">Name</p>
                      <p className="mt-1 font-medium text-platinum">{responses.name}</p>
                    </div>
                    <div className="rounded-2xl border border-platinum/10 bg-platinum/5 p-4">
                      <p className="text-platinum/80 text-sm">Email</p>
                      <p className="mt-1 font-medium text-platinum">{responses.email}</p>
                    </div>
                    <div className="rounded-2xl border border-platinum/10 bg-platinum/5 p-4">
                      <p className="text-platinum/80 text-sm">Reason</p>
                      <p className="mt-1 font-medium text-platinum">{responses.reason}</p>
                    </div>
                    <div className="rounded-2xl border border-platinum/10 bg-platinum/5 p-4">
                      <p className="text-platinum/80 text-sm">Message</p>
                      <p className="mt-1 font-medium text-platinum">{responses.message}</p>
                    </div>
                  </div>
                  <div className="mt-5 text-xs uppercase tracking-[0.35em] text-platinum/60">
                    {status === 'sending' && 'Dispatching to EmailJS…'}
                    {status === 'sent' && 'Message delivered successfully.'}
                    {status === 'failed' && 'Delivery failed. See the chat thread above.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
