import { useCallback } from "react";

const useScrollToTop = () => {
    const scrollToTop = useCallback(() => {
        if (typeof window !== "undefined") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, []);

    return { scrollToTop };
};

export default useScrollToTop;
