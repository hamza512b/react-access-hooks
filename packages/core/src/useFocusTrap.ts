/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect, useRef } from "react";

export interface FocusTrapArgs {
    element: RefObject<Element>;
    initialFocus?: RefObject<Element>;
    condition: boolean;
}

export function useFocusTrap ({element: parentElement, initialFocus, condition}: FocusTrapArgs): void {
    const firstFocus = useRef<Element>();
    const lastFocus = useRef<Element>();
    const prevFocus = useRef<Element | null>();
    
    
    useEffect(()=> {
        if (!parentElement.current) throw new Error("The passed element undefined in useFocusTrap hook.");
        
        // Get focusable elements
        function isFocusable(element: any) {
            if (element?.tabIndex >= 0 && element.getAttribute("tabIndex") !== null) return true;
            else if (element?.disabled) return false;
            else if (element?.nodeName === "A" && !!element?.href && element?.rel != "ignore") return true;
            else if (element?.nodeName === "INPUT" && element?.type != "hidden" && element?.type != "file") return true;
            else if (element?.nodeName === "BUTTON" || element?.nodeName === "SELECT" || element?.nodeName === "TEXTAREA") return true;
            else return false;
        }

        // Traps the focus in parentElement
        function handleKeydown (ev: KeyboardEvent) {
            if (!ev.shiftKey && ev.key === "Tab") {
                if (lastFocus.current === document.activeElement) {
                    ev.preventDefault();
                    (firstFocus.current as any)?.focus();
                }
            } else if (ev.shiftKey && ev.key === "Tab") {
                if (firstFocus.current === document.activeElement) {
                    ev.preventDefault();
                    (lastFocus.current as unknown as any)?.focus();
                }
            }
        }

        // Get all focusable elements inside parentElement
        const focusableElements = parentElement.current.querySelectorAll("a, button, input, textarea, select, details,[tabindex]:not([tabindex='-1'])");
        
        // Get first focusable element 
        for (let i = 0; i < focusableElements.length; i++) {
            if (isFocusable(focusableElements[i])) {
                firstFocus.current = focusableElements[i];
                break;
            }
        }

        // Get last focusable element 
        for (let i = focusableElements.length; i > 0; i--) {
            if (isFocusable(focusableElements[i])) {
                lastFocus.current = focusableElements[i];
                break;
            }
        }

        // Set prevFocus ref to the active element outside
        if (condition && !document.activeElement?.contains(parentElement.current as Node)) prevFocus.current = document.activeElement;

        // Focus initialFocus or firstFocus
        if (initialFocus) (initialFocus as any)?.current?.focus();
        else (firstFocus as any)?.current?.focus();
        
        if (condition) {
            addEventListener("keydown", handleKeydown);
        } else {
            (prevFocus.current as any)?.focus();            
        }
        return () => {
            removeEventListener("keydown", handleKeydown);
        };   
    }, [parentElement, initialFocus, condition]);
}