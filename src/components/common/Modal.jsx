import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ open, onClose, title, children, footer }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl rounded-2xl border bg-white p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
          </div>
          <div className="max-h-[70vh] overflow-auto pr-1">{children}</div>
          {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;