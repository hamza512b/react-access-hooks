/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

export type KeyboardAction =
    | {
          key: string | string[];
          action: (ev: KeyboardEvent) => void;
          target?: HTMLElement;
          condition?: boolean;
      }
    | {
          key: "printable";
          clearTimeout?: number;
          action: (ev: KeyboardEvent, keys: string) => void;
          target?: HTMLElement;
          condition?: boolean;
      };

export function useKeyboardAction(keyboardAction: KeyboardAction): void {
    const clearPrintableTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const printableRef = useRef("");

    useEffect(() => {
        const EventTarget = keyboardAction?.target || window;
        const condition = keyboardAction.condition ?? true;
        if (!condition) return;

        let handler: ((ev: KeyboardEvent) => void) | null = null;
        if (typeof keyboardAction.key === "string") {
            if (keyboardAction.key === "printable") {
                handler = (ev: KeyboardEvent) => {
                    if (ev.key.length === 1 && !ev.ctrlKey) {
                        ev.preventDefault();
                        if (clearPrintableTimeoutRef.current) clearTimeout(clearPrintableTimeoutRef.current);
                        clearPrintableTimeoutRef.current = setTimeout(() => {
                            printableRef.current = "";
                        }, (keyboardAction as any).clearTimeout || 750);
                        printableRef.current += ev.key;
                        console.log("Pritanble", printableRef.current);

                        keyboardAction.action(ev, printableRef.current);
                    }
                };
            } else {
                handler = (ev: KeyboardEvent) => {
                    if (ev.code === keyboardAction.key) {
                        console.log("string");
                        ev.preventDefault();
                        keyboardAction.action(ev, "");
                    }
                };
            }
        } else if (Array.isArray(keyboardAction.key)) {
            handler = (ev: KeyboardEvent) => {
                if ((keyboardAction.key as string[]).some((key) => key === ev.code)) {
                    console.log("array");
                    keyboardAction.action(ev, "");
                }
            };
        }

        if (handler) {
            (EventTarget as HTMLElement).addEventListener("keydown", handler);
            return () => {
                (EventTarget as HTMLElement).removeEventListener("keydown", handler as () => void);
            };
        }
    }, [keyboardAction]);
}
