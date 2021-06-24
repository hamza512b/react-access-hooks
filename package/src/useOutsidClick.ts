import { RefObject, useEffect } from "react";

export function useOutsideClick(ref: RefObject<HTMLElement>, action: () => void): void {
    useEffect(() => {
        function handleClickOutside(ev: MouseEvent) {
            if (!ref.current || ref.current.contains(ev.target as Node)) {
                return;
            }

            action();
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [ref, action]);
}
