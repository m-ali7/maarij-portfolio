import { motion } from 'framer-motion'

export default function Logo() {
  return (
    <motion.div
      className="navbar-logo"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="navbar-logo__ring"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.span
        className="navbar-logo__mark"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        M
      </motion.span>
    </motion.div>
  )
}
