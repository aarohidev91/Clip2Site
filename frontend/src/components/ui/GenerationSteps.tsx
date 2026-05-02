import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const steps = [
  { message: 'Reading your video context...', icon: '📹' },
  { message: 'Understanding your offer...', icon: '🧠' },
  { message: 'Generating with Gemini...', icon: '✨' },
  { message: 'Writing conversion copy...', icon: '✍️' },
  { message: 'Building your page...', icon: '🏗️' },
];

export default function GenerationSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <div className="space-y-3 w-full max-w-sm">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.3, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="text-lg">{step.icon}</span>
            <span className={`text-sm ${i <= currentStep ? 'text-dark-200' : 'text-dark-600'}`}>
              {step.message}
            </span>
            <AnimatePresence>
              {i < currentStep && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400 text-xs ml-auto"
                >
                  Done
                </motion.span>
              )}
              {i === currentStep && (
                <motion.div
                  className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full ml-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
