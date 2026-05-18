import { motion } from "framer-motion";

const PortalTransition = ({ active, transitionSpeed, liteMode }) => (
  <motion.div
    className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    initial={false}
    animate={active ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
    transition={{ duration: 1.15 / transitionSpeed, times: [0, 0.18, 0.62, 1] }}
  >
    <div className="absolute inset-0 bg-white" />
    <div className="absolute inset-[-20%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1),rgba(0,217,255,.85)_18%,rgba(5,8,20,0)_55%)] mix-blend-screen" />
    <motion.div
      className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100"
      animate={active ? { scale: [0.2, 14], opacity: [1, 0] } : {}}
      transition={{ duration: 0.8 / transitionSpeed, ease: "easeOut" }}
    />
    {!liteMode && <div className="absolute inset-[-15%] bg-[radial-gradient(circle_at_center,transparent_18%,rgba(255,0,120,.18)_36%,transparent_52%)] mix-blend-screen blur-2xl" />}
  </motion.div>
);

export default PortalTransition;
