import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 px-6 relative z-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 transition-colors duration-300"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-platinum">
            About <span className="text-primary italic font-serif text-glow">Me</span>
          </h2>
          <div className="h-[1px] w-24 bg-primary mx-auto transition-colors duration-300"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 font-light leading-relaxed text-base lg:text-lg order-2 lg:order-1 transition-colors duration-300"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <p className="text-justify">
              Hi, I'm <strong className="text-primary font-medium">Prem M</strong>, a final-year B.E. Computer Science and Technology student at SNS College of Engineering. I work as an <strong className="text-primary font-medium">AI Product Engineer</strong> with a strong foundation in <strong className="text-primary font-medium">full-stack development</strong> and <strong className="text-primary font-medium">UI/UX design</strong>, focused on building scalable and impactful digital solutions.
            </p>
            <p className="text-justify">
             
I enjoy creating end-to-end applications that combine intelligent systems with clean, user-centered design. My work revolves around developing AI-powered products, especially in domain of healthcare, where technology can solve real-world problems and improve lives.
</p>

<p className="text-justify">
I’m particularly interested in building systems using LLMs, RAG, and modern full-stack technologies to create smart, efficient, and accessible solutions. My goal is to not just build applications, but to create products that are meaningful, practical, and ready for real-world use.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <h4 className="text-primary font-mono text-sm mb-1 transition-colors duration-300">01. Focus</h4>
                <p className="text-sm transition-colors duration-300" style={{ color: 'var(--color-text-muted)' }}>Healthcare technology solutions.</p>
              </div>
              <div>
                <h4 className="text-primary font-mono text-sm mb-1 transition-colors duration-300">02. Mission</h4>
                <p className="text-sm transition-colors duration-300" style={{ color: 'var(--color-text-muted)' }}>Building scalable products that create meaningful impact.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center order-1 lg:order-2 group"
          >
            <div className="group relative mx-auto w-full max-w-sm aspect-[4/5] overflow-hidden rounded-2xl glass-card transition-transform duration-500 hover:scale-105">
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/20 via-transparent to-warm/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none rounded-2xl" />
              <img
                src="/images/my-profile-img.jpg"
                alt="Profile picture"
                className="h-full w-full object-cover object-top rounded-2xl shadow-lg transition-all duration-500 group-hover:brightness-110"
                width={413}
                height={531}
                loading="lazy"
              />
            </div>
            
<div className="absolute -z-10 top-8 -right-8 w-full h-full rounded-2xl pointer-events-none transition-all duration-500 ease-out group-hover:scale-105">
  
  {/* Shadow Only */}
  <div
    className="absolute inset-0 rounded-2xl"
    style={{
      boxShadow: "0 0 20px rgba(224,169,109,0.6), 0 20px 60px rgba(183,110,121,0.4)",
    }}
  ></div>

</div>

<div className="absolute -z-10 -bottom-4 -left-4 w-24 h-24 bg-warm/20 blur-[40px] rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;