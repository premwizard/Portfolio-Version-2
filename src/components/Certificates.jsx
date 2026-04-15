import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X } from 'lucide-react';

/**
 * Royal Chess Board — Your Achievement Portfolio
 * piece: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
 * side: 'platinum' | 'rosegold'
 * file: 0–7 (a–h), rank: 0–7 (rank 8 at top → rank 1 at bottom, White's view)
 * category: AI/ML | Cloud | Web Development | Python | UI/UX
 */

const CERTIFICATE_PIECES = [
  // KINGS
  {
    id: 'cert-king-1',
    side: 'platinum',
    piece: 'king',
    file: 4,
    rank: 0,
    title: 'Micro-Certification - Agentic AI Executive',
    issuer: 'ServiceNow',
    date: 'Sep 2025',
    link: '/certificates/servicenow.png',
    image: '/certificates/servicenow.png',
    category: 'AI/ML',
    description: 'Executive-level AI leadership and Agentic AI mastery.',
  },
  {
    id: 'cert-king-2',
    side: 'rosegold',
    piece: 'king',
    file: 4,
    rank: 7,
    title: 'Databricks Accredited Generative AI Fundamentals',
    issuer: 'Databricks Academy',
    date: 'Oct 2025',
    link: '/certificates/databricks.png',
    image: '/certificates/databricks.png',
    category: 'AI/ML',
    description: 'Advanced generative AI fundamentals and architectures.',
  },
  
  // QUEENS
  {
    id: 'cert-queen-1',
    side: 'platinum',
    piece: 'queen',
    file: 3,
    rank: 0,
    title: 'Azure AI Fundamentals',
    issuer: 'Microsoft',
    date: 'Sep 2025',
    link: '/certificates/azureai.png',
    image: '/certificates/azureai.png',
    category: 'AI/ML',
    description: 'Core AI concepts and Azure AI services.',
  },
  {
    id: 'cert-queen-2',
    side: 'rosegold',
    piece: 'queen',
    file: 3,
    rank: 7,
    title: 'Deep Learning',
    issuer: 'Reccsar Private Limited',
    date: 'NOV 2024',
    link: '/certificates/DL.jpg',
    image: '/certificates/DL.jpg',
    category: 'AI/ML',
    description: 'Deep learning architectures and neural networks.',
  },

  // ROOKS
  {
    id: 'cert-rook-1',
    side: 'platinum',
    piece: 'rook',
    file: 0,
    rank: 0,
    title: 'AWS Databricks Platform Architect',
    issuer: 'Databricks Academy',
    date: 'Oct 2025',
    link: '/certificates/databricksaws.png',
    image: '/certificates/databricksaws.png',
    category: 'Cloud',
    description: 'Data platform architecture on AWS and Databricks.',
  },
  {
    id: 'cert-rook-2',
    side: 'platinum',
    piece: 'rook',
    file: 7,
    rank: 0,
    title: 'Cloud Computing',
    issuer: 'NPTEL',
    date: 'OCT 2024',
    link: '/certificates/CLOUD COMMPUTING.jpg',
    image: '/certificates/CLOUD  COMMPUTING.jpg',
    category: 'Cloud',
    description: 'Cloud architecture, services, and enterprise deployment.',
  },
  {
    id: 'cert-rook-3',
    side: 'rosegold',
    piece: 'rook',
    file: 0,
    rank: 7,
    title: 'Mastering Cloud Engineering with AWS and Python',
    issuer: 'Code Signal',
    date: 'Aug 2025',
    link: '/certificates/codesignalMCEWAWS.png',
    image: '/certificates/codesignalMCEWAWS.png',
    category: 'Cloud',
    description: 'Cloud engineering with AWS SDK and Python automation.',
  },


  // BISHOPS
  {
    id: 'cert-bishop-1',
    side: 'platinum',
    piece: 'bishop',
    file: 2,
    rank: 3,
    title: 'UI/UX Design Traineeship',
    issuer: 'Maiyyam',
    date: 'FEB 2025',
    link: '/certificates/UX Design.png',
    image: '/certificates/UX Design.png',
    category: 'UI/UX',
    description: 'Full UI/UX design principles and prototyping.',
  },
  {
    id: 'cert-bishop-2',
    side: 'platinum',
    piece: 'bishop',
    file: 5,
    rank: 2,
    title: 'Responsive Web Design',
    issuer: 'FreeCodeCamp',
    date: 'APR 2025',
    link: '/certificates/RWD.png',
    image: '/certificates/RWD.png',
    category: 'Web Development',
    description: 'Mobile-first responsive design and CSS layouts.',
  },
  {
    id: 'cert-bishop-3',
    side: 'rosegold',
    piece: 'bishop',
    file: 2,
    rank: 4,
    title: 'React.js Unfiltered - AIALCHEMIST',
    issuer: 'Gyan Ganga Institute of Technology and Science',
    date: 'July 2025',
    link: '/certificates/react.jpg',
    image: '/certificates/react.jpg',
    category: 'Web Development',
    description: 'Advanced React patterns and component architecture.',
  },
  {
    id: 'cert-bishop-4',
    side: 'rosegold',
    piece: 'bishop',
    file: 5,
    rank: 5,
    title: 'Full-Stack(MERN) App/Web Development Traineeship',
    issuer: 'Maiyyam',
    date: 'MAY 2025',
    link: '/certificates/FSD MAiyyam.png',
    image: '/certificates/FSD MAiyyam.png',
    category: 'Web Development',
    description: 'Full-stack MERN development and production engineering.',
  },

  // KNIGHTS
  {
    id: 'cert-knight-1',
    side: 'platinum',
    piece: 'knight',
    file: 2,
    rank: 2,
    title: 'Postman API Fundamentals Student Expert',
    issuer: 'Postman',
    date: 'JUN 2025',
    link: '/certificates/postman.png',
    image: '/certificates/postman.png',
    category: 'Web Development',
    description: 'API testing and REST fundamentals mastery.',
  },
  {
    id: 'cert-knight-2',
    side: 'platinum',

    piece: 'knight',

    file: 6,

    rank: 2,
    title: 'INTRODUCTION TO MONGODB',
    issuer: 'MongoDB University',
    date: 'JUN 2025',
    link: '/certificates/intro to mongodb.png',
    image: '/certificates/intro to mongodb.png',
    category: 'Web Development',
    description: 'NoSQL database design and MongoDB fundamentals.',
  },
  {
    id: 'cert-knight-3',
    side: 'rosegold',
    piece: 'knight',
    file: 2,
    rank: 5,
    title: 'Python Flask',
    issuer: 'Mind Luster',
    date: 'MAY 2025',
    link: '/certificates/pythonflask.png',
    image: '/certificates/pythonflask.png',
    category: 'Web Development',
    description: 'Flask web framework and Python backend development.',
  },
  {
    id: 'cert-knight-4',
    side: 'rosegold',
    piece: 'knight',
    file: 6,
    rank: 5,
    title: 'Prompt Engineering',
    issuer: 'Infosys SpringBoard',
    date: 'Aug 2025',
    link: '/certificates/promptinfosys.png',
    image: '/certificates/promptinfosys.png',
    category: 'AI/ML',
    description: 'Prompt engineering for LLMs and AI applications.',
  },

  // PAWNS
  {
    id: 'cert-pawn-1',
    side: 'platinum',
    piece: 'pawn',
    file: 0,
    rank: 1,
    title: 'Natural Language Processing',
    issuer: 'Reccsar Private Limited',
    date: 'NOV 2024',
    link: '/certificates/NLP.jpg',
    image: '/certificates/NLP.jpg',
    category: 'AI/ML',
    description: 'NLP techniques and language understanding models.',
  },
  {
    id: 'cert-rook-4',
    side: 'rosegold',
    piece: 'rook',
    file: 7,
    rank: 7,
    title: 'Progressive Hands-on App Developement',
    issuer: 'KPR Institute of Engineering and Technology',
    date: 'JAN 2025',
    link: '/certificates/PWA.jpg',
    image: '/certificates/PWA.jpg',
    category: 'Web Development',
    description: 'Progressive web app development and modern patterns.',
  },
  {
    id: 'cert-pawn-3',
    side: 'platinum',
    piece: 'pawn',
    file: 1,
    rank: 1,
    title: 'Python Essentials 1',
    issuer: 'CISCO Networking Academy',
    date: 'JUN 2025',
    link: '/certificates/python essentials 1.png',
    image: '/certificates/python essentials 1.png',
    category: 'Python',
    description: 'Python fundamentals and essential programming concepts.',
  },
  {
    id: 'cert-pawn-4',
    side: 'platinum',
    piece: 'pawn',
    file: 2,
    rank: 1,
    title: 'Mastering Algorithms and Data Structures in Python',
    issuer: 'Code Signal',
    date: 'Sep 2025',
    link: '/certificates/mastering A&DS In python.png',
    image: '/certificates/mastering A&DS In python.png',
    category: 'Python',
    description: 'Advanced algorithms and data structure optimization.',
  },

  {
    id: 'cert-pawn-5',
    side: 'platinum',
    piece: 'pawn',
    file: 3,
    rank: 3,
    title: 'Introduction to Machine Learning: Art of the Possible',
    issuer: 'AWS Training and Certification',
    date: 'July 2025',
    link: '/certificates/intro to ML art of the possible.png',
    image: '/certificates/intro to ML art of the possible.png',
    category: 'AI/ML',
    description: 'ML fundamentals and practical applications overview.',
  },

  {
    id: 'cert-pawn-7',
    side: 'rosegold',
    piece: 'pawn',
    file: 4,
    rank: 4,
    title: 'Fundamentals of Machine Learning and Artificial Intelligence',
    issuer: 'AWS Training and Certification',
    date: 'Aug 2025',
    link: '/certificates/fundamentals of MLandAI.png',
    image: '/certificates/fundamentals of MLandAI.png',
    category: 'AI/ML',
    description: 'Core concepts of machine learning and AI systems.',
  },
  {
    id: 'cert-pawn-8',
    side: 'rosegold',
    piece: 'pawn',
    file: 1,
    rank: 6,
    title: 'Foundation: Introduction to Langsmith',
    issuer: 'Langchain Academy',
    date: 'Aug 2025',
    link: '/certificates/intro to langsmith.png',
    image: '/certificates/intro to langsmith.png',
    category: 'AI/ML',
    description: 'LangSmith development tools for LLM engineering.',
  },

  {
    id: 'cert-pawn-9',
    side: 'rosegold',
    piece: 'pawn',
    file: 2,
    rank: 6,
    title: 'Machine Learning Terminology and Process',
    issuer: 'AWS Training and Certification',
    date: 'Oct 2025',
    link: '/certificates/ml terminology.png',
    image: '/certificates/ml terminology.png',
    category: 'AI/ML',
    description: 'ML terminology, workflows, and industry processes.',
  },
  {
    id: 'cert-pawn-10',
    side: 'rosegold',
    piece: 'pawn',
    file: 2,
    rank: 6,
    title: 'Introduction to Amazon SageMaker',
    issuer: 'AWS Training and Certification',
    date: 'Oct 2025',
    link: '/certificates/intro to aws sagemaker.png',
    image: '/certificates/intro to aws sagemaker.png',
    category: 'Cloud',
    description: 'AWS SageMaker for machine learning at scale.',
  },
  {
    id: 'cert-pawn-11',
    side: 'rosegold',
    piece: 'pawn',
    file: 3,
    rank: 4,
    title: 'Planning a Machine Learning Project',
    issuer: 'AWS Training and Certification',
    date: 'Oct 2025',
    link: '/certificates/ML Project AWS.png',
    image: '/certificates/ML Project AWS.png',
    category: 'AI/ML',
    description: 'ML project planning and implementation strategies.',
  },
];

const PIECE_GLYPH = {
  king: '♔',
  queen: '♕',
  rook: '♖',
  bishop: '♗',
  knight: '♘',
  pawn: '♙',
};

const LEGEND = [
  {
    piece: 'king',
    glyph: '♔',
    label: 'King',
    role: 'Highest-level certification & core expertise',
  },
  {
    piece: 'queen',
    glyph: '♕',
    label: 'Queen',
    role: 'Major certifications & flagship credentials',
  },
  {
    piece: 'rook',
    glyph: '♖',
    label: 'Rook',
    role: 'Backend, data & infrastructure strength',
  },
  {
    piece: 'bishop',
    glyph: '♗',
    label: 'Bishop',
    role: 'Design, UX & visual systems',
  },
  {
    piece: 'knight',
    glyph: '♘',
    label: 'Knight',
    role: 'Special skills & distinctive expertise',
  },
  {
    piece: 'pawn',
    glyph: '♙',
    label: 'Pawn',
    role: 'Tools, platforms & everyday craft',
  },
];

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function pieceAt(piecesBySquare, file, rank) {
  return piecesBySquare[`${file}-${rank}`] ?? null;
}

function ChessPiece({
  cert,
  flipped,
  onToggleFlip,
  onHoverStart,
  onHoverEnd,
  onMobileDetailOpen,
}) {
  const glyph = PIECE_GLYPH[cert.piece];
  const isQueen = cert.piece === 'queen';
  const isPawn = cert.piece === 'pawn';
  const tier = cert.tier || 'regular';

  const sideStyle =
    cert.side === 'platinum'
      ? 'text-platinum border-platinum'
      : 'text-[var(--acc)] shadow-[0_0_15px_var(--border2)]';

  const baseScale = 
    tier === 'platinum' ? 1.25 
    : tier === 'rose-gold' ? 1.25
    : isPawn ? 0.96 
    : 1;
  
  const hoverScale = 
    tier === 'platinum' ? 1.35
    : tier === 'rose-gold' ? 1.2
    : isQueen ? 1.18 
    : isPawn ? 1.06 
    : 1.14;

  return (
    <motion.button
      type="button"
      aria-label={`${cert.title}. ${flipped ? 'Show piece face' : 'Show certificate'}.`}
      animate={{ scale: baseScale }}
      className={`relative z-[1] flex h-full w-full items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${sideStyle}`}
      style={{ perspective: 800 }}
      onMouseEnter={() => onHoverStart(cert)}
      onMouseLeave={onHoverEnd}
      onFocus={() => onHoverStart(cert)}
      onBlur={onHoverEnd}
      onClick={(e) => {
        e.stopPropagation();
        onToggleFlip(cert);
        onHoverStart(cert);
        onMobileDetailOpen?.();
      }}
      whileHover={{
        scale: hoverScale,
        zIndex: 20,
        transition: { type: 'spring', stiffness: 400, damping: 22 },
      }}
      whileTap={{ scale: 1.02 }}
    >
      <motion.div
        className="relative h-[88%] w-[88%]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-md border bg-gradient-to-b from-[var(--surf)]/95 to-[var(--bg)] shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${
            tier === 'platinum'
              ? 'border-[var(--acc)]/35'
              : tier === 'rose-gold'
              ? 'border-transparent'
              : 'border-[var(--acc)]/35'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span
            className={`select-none text-[clamp(1.1rem,4.5vmin,2.25rem)] leading-none ${cert.side === 'platinum' ? 'text-platinum' : 'text-[var(--acc)] drop-shadow-[0_0_12px_var(--border)]'}`}
            aria-hidden
          >
            {glyph}
          </span>
        </div>
        <div
          className={`absolute inset-0 overflow-hidden rounded-md border-2 bg-[var(--surf)] ${
            tier === 'platinum'
              ? 'border-platinum/50'
              : tier === 'rose-gold'
              ? 'border-transparent'
              : 'border-[var(--acc)]/40'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            src={cert.image}
            alt=""
            className="h-[55%] w-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="flex flex-col gap-0.5 px-2 py-2">
            <p className="line-clamp-3 text-left text-[0.65rem] font-semibold leading-tight text-[var(--tx)] sm:text-[0.75rem]">
              {cert.title}
            </p>
            <p className="text-left text-[0.5rem] text-[var(--pt)]/80">{cert.issuer}</p>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

const Certificates = () => {
  const [hoveredCert, setHoveredCert] = useState(null);
  const [pinnedCert, setPinnedCert] = useState(null);
  const [flipped, setFlipped] = useState(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // Assign tiers based on side only; use file/rank values from CERTIFICATE_PIECES directly
  const certificatesWithTiers = useMemo(() => {
    return CERTIFICATE_PIECES.map((cert) => ({
      ...cert,
      tier: cert.side === 'platinum' ? 'platinum' : 'rose-gold',
    }));
  }, []);

  const piecesBySquare = useMemo(() => {
    const map = {};
    certificatesWithTiers.forEach((c) => {
      map[`${c.file}-${c.rank}`] = c;
    });
    return map;
  }, [certificatesWithTiers]);

  const toggleFlip = useCallback((cert) => {
    setFlipped((prev) => {
      if (prev === cert.id) {
        setPinnedCert(null);
        if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) {
          setMobilePanelOpen(false);
        }
        return null;
      } else {
        setPinnedCert(cert);
        if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) {
          setMobilePanelOpen(true);
        }
        return cert.id;
      }
    });
  }, []);

  const handleHoverStart = useCallback((cert) => {
    setHoveredCert(cert);
  }, []);

  const openMobileDetail = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(min-width: 1024px)').matches
    ) {
      setMobilePanelOpen(true);
    }
  }, []);

  const handleHoverEnd = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      setHoveredCert(null);
    }
  }, []);

  const closeMobilePanel = () => {
    setMobilePanelOpen(false);
    setFlipped(null);
    setPinnedCert(null);
  };

  return (
    <section
      id="certificates"
      className="relative z-10 overflow-hidden bg-[var(--bg)] py-20 px-4 sm:px-6 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <Crown className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-platinum" />
      </div>
      <div className="pointer-events-none absolute left-10 top-20 h-40 w-40 rounded-full bg-[var(--acc)]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 right-10 h-36 w-36 rounded-full bg-[var(--acc2)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="mb-10 text-center lg:mb-12"
        >
          <h2 className="mb-4 font-serif text-3xl font-bold italic text-[var(--tx)] sm:text-4xl md:text-5xl">
            Achievement <span className="text-[var(--acc)]">Chess Board</span>
          </h2>
          <div className="mx-auto mb-6 h-px w-28 bg-gradient-to-r from-transparent via-[var(--acc)] to-transparent" />
          <p className="mx-auto max-w-2xl text-sm text-[var(--tx)]/55 sm:text-base">
            Each piece is a credential. Hover to lift and reveal the court dossier; click to flip
            and read the decree on the underside. Conquer the board.
          </p>
        </motion.div>


        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          {/* Board + legend column */}
          <div className="min-w-0 flex-1 space-y-8">
            <div className="mx-auto w-full max-w-[min(100%,92vmin)] lg:max-w-[min(100%,640px)]">
              <div className="relative rounded-2xl border border-[var(--acc)]/20 bg-[var(--surf)]/50 p-2 sm:p-3">
                <div
                  className="grid w-full overflow-hidden rounded-lg border border-[var(--acc)]/15"
                  style={{
                    aspectRatio: '1 / 1',
                    gridTemplateColumns: 'minmax(1.25rem,0.45fr) repeat(8, minmax(0,1fr))',
                    gridTemplateRows: 'minmax(1rem,0.4fr) repeat(8, minmax(0,1fr))',
                  }}
                  onMouseLeave={() => {
                    if (
                      typeof window !== 'undefined' &&
                      window.matchMedia('(min-width: 1024px)').matches
                    ) {
                      setHoveredCert(null);
                    }
                  }}
                >
                  <div className="min-h-0" />
                  {FILES.map((f) => (
                    <div
                      key={f}
                      className="flex min-h-0 items-end justify-center pb-0.5 font-mono text-[0.55rem] text-[var(--pt)]/50 sm:text-xs"
                    >
                      {f}
                    </div>
                  ))}
                  {[8, 7, 6, 5, 4, 3, 2, 1].map((rankLabel, rank) => (
                    <React.Fragment key={rankLabel}>
                      <div className="flex min-h-0 items-center justify-end pr-1 font-mono text-[0.55rem] text-[var(--pt)]/50 sm:text-xs">
                        {rankLabel}
                      </div>
                      {Array.from({ length: 8 }, (_, file) => {
                        const isLight = (rank + file) % 2 === 1;
                        const cert = pieceAt(piecesBySquare, file, rank);
                        return (
                          <div
                            key={`${file}-${rank}`}
                            className={`relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden ${
                              isLight
                                ? 'bg-[var(--surf2)] shadow-[inset_0_0_0_1px_var(--border)]'
                                : 'bg-[var(--bg)] shadow-[inset_0_0_0_1px_rgba(184,204,216,0.04)]'
                            }`}
                          >
                            {cert ? (
                              <ChessPiece
                                cert={cert}
                                flipped={flipped === cert.id}
                                onToggleFlip={toggleFlip}
                                onHoverStart={handleHoverStart}
                                onHoverEnd={handleHoverEnd}
                                onMobileDetailOpen={openMobileDetail}
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <p className="mt-2 text-center text-[0.65rem] text-[var(--pt)]/40 sm:text-xs">
                  White&apos;s view · tap a piece on mobile to open details
                </p>
              </div>
            </div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="rounded-2xl border border-[var(--acc)]/15 bg-[var(--surf)]/80 p-4 backdrop-blur-md sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--acc)]">
                  Royal legend
                </h3>
                <span className="rounded-lg bg-[var(--acc)]/10 px-3 py-1 text-xs font-semibold text-[var(--acc)]">
                  {certificatesWithTiers.length} of {CERTIFICATE_PIECES.length} pieces
                </span>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {LEGEND.map((row) => (
                  <li
                    key={row.piece}
                    className="flex items-start gap-3 rounded-xl border border-platinum/5 bg-[var(--bg)]/60 px-3 py-2.5"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--acc)]/25 bg-[var(--surf2)] text-xl text-[var(--acc)]"
                      aria-hidden
                    >
                      {row.glyph}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--tx)]">{row.label}</p>
                      <p className="text-sm text-[var(--pt)]/70">{row.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden w-full shrink-0 lg:block lg:w-[340px] xl:w-[380px]">
            <div className="sticky top-28 min-h-[320px] rounded-2xl border border-[var(--acc)]/20 bg-[var(--surf)]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <AnimatePresence mode="wait">
                {pinnedCert || hoveredCert ? (
                  <motion.div
                    key={(pinnedCert || hoveredCert).id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--acc2)]">
                      {LEGEND.find((l) => l.piece === (pinnedCert || hoveredCert).piece)?.label ?? (pinnedCert || hoveredCert).piece}
                    </p>
                    <h3 className="mb-2 font-serif text-2xl font-bold text-[var(--tx)]">
                      {(pinnedCert || hoveredCert).title}
                    </h3>
                    <p className="mb-4 text-sm text-[var(--pt)]">
                      {(pinnedCert || hoveredCert).issuer} · {(pinnedCert || hoveredCert).date}
                    </p>
                    <div className="mb-4 overflow-hidden rounded-xl border border-[var(--acc)]/20">
                      <img
                        src={(pinnedCert || hoveredCert).image}
                        alt=""
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-[var(--tx)]/70">
                      {(pinnedCert || hoveredCert).description}
                    </p>
                    <a
                      href={(pinnedCert || hoveredCert).link}
                      className="inline-flex w-full items-center justify-center rounded-full border border-[var(--acc)]/50 bg-[var(--acc)]/10 py-3 text-sm font-semibold text-[var(--acc)] transition-colors hover:bg-[var(--acc)] hover:text-[var(--tx-on-acc)]"
                    >
                      Open credential
                    </a>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <span className="mb-4 text-5xl text-[var(--acc)]/25">♔</span>
                    <p className="max-w-[240px] text-sm text-[var(--pt)]/60">
                      Hover a piece on the board to summon the full royal dossier here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {mobilePanelOpen && (pinnedCert || hoveredCert) && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobilePanel}
          >
            <motion.div
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[var(--acc)]/25 border-b-0 bg-[var(--bg)] p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--acc2)]">
                    {LEGEND.find((l) => l.piece === (pinnedCert || hoveredCert).piece)?.label}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold text-[var(--tx)]">
                    {(pinnedCert || hoveredCert).title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeMobilePanel}
                  className="rounded-full border border-platinum/10 p-2 text-[var(--tx)] hover:border-[var(--acc)]/40"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <img
                src={(pinnedCert || hoveredCert).image}
                alt=""
                className="mb-4 max-h-48 w-full rounded-xl object-cover"
                loading="lazy"
              />
              <p className="mb-2 text-sm text-[var(--pt)]">
                {(pinnedCert || hoveredCert).issuer} · {(pinnedCert || hoveredCert).date}
              </p>
              <p className="mb-6 text-sm leading-relaxed text-[var(--tx)]/75">
                {(pinnedCert || hoveredCert).description}
              </p>
              <a
                href={(pinnedCert || hoveredCert).link}
                className="inline-flex w-full items-center justify-center rounded-full border border-[var(--acc)]/50 bg-[var(--acc)]/10 py-3 text-sm font-semibold text-[var(--acc)]"
              >
                Open credential
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
