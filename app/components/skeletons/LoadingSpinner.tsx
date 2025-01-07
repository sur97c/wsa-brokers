import { motion } from 'framer-motion'

import { useTranslations } from '@/translations/hooks/useTranslations'

const LoadingSpinner: React.FC = () => {
  const { t, translations } = useTranslations()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-full h-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
        <span className="text-primary font-medium">
          {t(translations.core.common.loading)}
        </span>
      </div>
    </motion.div>
  )
}

export default LoadingSpinner

// interface LoadingSpinnerProps {
//   isLoading: boolean;
// }

// const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
//   return (
//     <AnimatePresence>
//       {isLoading && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="flex items-center justify-center w-full h-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50"
//         >
//           <div className="flex flex-col items-center gap-4">
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
//             />
//             <span className="text-primary font-medium">Loading...</span>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
