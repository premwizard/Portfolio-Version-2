import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import {
  SiHtml5, SiJavascript, SiReact, SiNodedotjs, SiTailwindcss, SiBootstrap, SiExpress, SiDjango, SiFlask, 
  SiPython, SiJupyter, SiNumpy, SiPandas, SiScikitlearn, SiOpenai, SiOllama, 
  SiMongodb, SiMysql, SiSqlite, SiFirebase,
  SiGithub, SiPycharm, SiSpyderide, SiAndroidstudio, 
  SiCanva, SiFigma, SiLangchain,
} from "react-icons/si";

import { FaAws, FaChartLine, FaCss3Alt } from "react-icons/fa";
import { VscAzure, VscVscode } from "react-icons/vsc";
import { MdCloud } from 'react-icons/md';
import { TfiMicrosoftAlt } from "react-icons/tfi";
import { Camera, Image } from 'react-feather';
import { BiBarChartAlt2, BiChart } from 'react-icons/bi';

import 'swiper/css';

const skills = [
  { name: "HTML5", icon: SiHtml5 },
  { name: "CSS3", icon: FaCss3Alt },
  { name: "JavaScript", icon: SiJavascript },
  { name: "React.js", icon: SiReact },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Bootstrap 5", icon: SiBootstrap },
  { name: "Express.js", icon: SiExpress },
  { name: "Django", icon: SiDjango },
  { name: "Flask", icon: SiFlask },
  { name: "Python", icon: SiPython },
  { name: "Jupyter Notebook", icon: SiJupyter },
  { name: "NumPy", icon: SiNumpy },
  { name: "Pandas", icon: SiPandas },
  { name: "Matplotlib", icon: FaChartLine },
  { name: "Scikit-learn", icon: SiScikitlearn },
  { name: "LLMs", icon: SiOpenai },
  { name: "Ollama", icon: SiOllama },
  { name: "Langchain", icon: SiLangchain },
  { name: "MongoDB", icon: SiMongodb },
  { name: "MySQL", icon: SiMysql },
  { name: "SQLite", icon: SiSqlite },
  { name: "Firebase", icon: SiFirebase },
  { name: "AWS", icon: FaAws },
  { name: "Azure", icon: VscAzure },
  { name: "GCP", icon: MdCloud },
  { name: "Git & GitHub", icon: SiGithub },
  { name: "VS Code", icon: VscVscode },
  { name: "PyCharm", icon: SiPycharm },
  { name: "Spyder IDE", icon: SiSpyderide },
  { name: "Thonny", icon: SiPython },
  { name: "Canva", icon: SiCanva },
  { name: "Figma", icon: SiFigma },
  { name: "FlutterFlow", icon: Camera },
  { name: "Power BI", icon: BiBarChartAlt2 },
  { name: "Tableau", icon: BiChart },
  { name: "Microsoft 365", icon: TfiMicrosoftAlt },
];

const SkillsCarousel = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="skills-carousel" className="py-24 px-6 relative z-10 overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none transition-colors duration-300"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 5%, transparent)' }}></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 transition-colors duration-300"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 transition-colors duration-300">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4 text-platinum">
            Skills <span className="text-primary italic font-serif text-glow">& Technologies</span>
          </h2>
          </h2>
          <div className="h-[1px] w-24 bg-primary mx-auto transition-colors duration-300"></div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showAll ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Swiper
                modules={[Autoplay]}
                spaceBetween={28}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 3, spaceBetween: 28 },
                  768: { slidesPerView: 4, spaceBetween: 32 },
                  1024: { slidesPerView: 5, spaceBetween: 34 },
                  1280: { slidesPerView: 6, spaceBetween: 38 }
                }}
                autoplay={{ delay: 1800, disableOnInteraction: false, pauseOnMouseEnter: true }}
                loop={true}
                speed={900}
                className="skills-swiper"
              >
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <SwiperSlide key={index} className="flex justify-center">
                      <div className="group">
                        <div className="glass-card relative flex h-40 w-40 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl transition-all duration-300 shadow-[inset_0_0_20px_rgba(184,204,216,0.08)] backdrop-blur-xl"
                          style={{
                            border: '1px solid var(--color-border)',
                            backgroundColor: `color-mix(in srgb, var(--color-surface) 5%, transparent)`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 20px var(--color-primary), inset 0 0 20px rgba(184,204,216,0.08)`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `inset 0 0 20px rgba(184,204,216,0.08)`;
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#b8ccd8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                          <IconComponent
                            size={38}
                            className="transition-colors duration-300 group-hover:text-primary drop-shadow-[0_0_15px_var(--border2)] text-platinum"
                          />
                          <h3 className="text-sm font-semibold transition-colors duration-300 group-hover:text-primary text-platinum/80">
                            {skill.name}
                          </h3>
                        </div>
                      </div>
                    </SwiperSlide>
                  );  
                })}
              </Swiper>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex justify-center"
                    >
                      <div className="group">
                        <div className="glass-card relative flex h-40 w-40 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl transition-all duration-300 shadow-[inset_0_0_20px_rgba(184,204,216,0.08)] backdrop-blur-xl"
                          style={{
                            border: '1px solid var(--color-border)',
                            backgroundColor: `color-mix(in srgb, var(--color-surface) 5%, transparent)`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 20px var(--color-primary), inset 0 0 20px rgba(184,204,216,0.08)`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `inset 0 0 20px rgba(184,204,216,0.08)`;
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#b8ccd8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                          <IconComponent
                            size={38}
                            className="transition-colors duration-300 group-hover:text-primary drop-shadow-[0_0_15px_var(--border2)] text-platinum"
                          />
                          <h3 className="text-sm font-semibold transition-colors duration-300 group-hover:text-primary text-platinum/80">
                            {skill.name}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="group relative px-6 py-2 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(212,150,122,0.3)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">{showAll ? 'Show Less' : 'Show All'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsCarousel;