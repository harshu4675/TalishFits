import { useInView } from "react-intersection-observer";

export const useScrollReveal = (options = {}) => {
  const { ref, inView } = useInView({
    threshold: options.threshold || 0.1,
    triggerOnce: options.triggerOnce !== false,
    rootMargin: options.rootMargin || "0px 0px -50px 0px",
  });

  return { ref, inView };
};

export default useScrollReveal;
