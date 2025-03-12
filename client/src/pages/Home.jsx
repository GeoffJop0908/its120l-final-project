import '../App.css';
import { AnimatePresence, motion } from 'framer-motion';
import useModeStore from '../store/modeStore';

export default function Home() {
  const currentMode = useModeStore((state) => state.currentMode);

  return (
    <>
      <AnimatePresence mode="wait">
        {currentMode == 'recommend' ? (
          <motion.h1
            key="recommend"
            className="font-bold text-4xl"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut' }}
            exit={{ y: 10, opacity: 0 }}
          >
            What can I recommend for you today?
          </motion.h1>
        ) : (
          <motion.h1
            key="chat"
            className="font-bold text-4xl"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut' }}
            exit={{ y: 10, opacity: 0 }}
          >
            How can I help you today?
          </motion.h1>
        )}
      </AnimatePresence>
    </>
  );
}
