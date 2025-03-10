import '../App.css';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <motion.h1
        className="font-bold text-4xl"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut' }}
      >
        What can I recommend for you today?
      </motion.h1>
    </>
  );
}
