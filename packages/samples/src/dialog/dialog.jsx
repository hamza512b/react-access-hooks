import React, { useRef, useState } from "react";
import { useFocusTrap, useKeyboardAction, useOutsideClick } from "react-access-hooks";

export default function Dialog() {
    const [open, setOpen] = useState(false);
    const initialFocus = useRef(null);
    const DialogRef = useRef(null);
    useFocusTrap({condition: open, initialFocus, element: DialogRef});
    useKeyboardAction({
        key: "Escape",
        condition: open,
        action: () => setOpen(false)
    });
    useOutsideClick({element: DialogRef, action: () => setOpen(false), condition: open});

    return (
        <div>
            <button 
                type="button"
                onClick={() => setOpen(true)}>
                Open dialog
            </button>
            <div className={`dialog-backdrop no-scroll ${open ? "" : "hidden"}`}>
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dialog_label"
                    aria-describedby="dialog_desc"
                    ref={DialogRef}
                >
                    <h2 id="dialog_label">
                        Message
                    </h2>
                    <div id="dialog_desc">
                        <p>
                            Lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh euismod tincidunt.
                        </p>
                    </div>
                    <div className="dialog_form">
                        <label htmlFor="textarea" className="label_text">Your message</label>
                        <textarea id="textarea" className="wide_input"></textarea>
                    </div>
                    <div className="dialog_actions">
                        <button 
                            ref={initialFocus}
                            type="button"
                            onClick={() => setOpen(false)}>
                            Back
                        </button>
                        <button 
                            type="button"
                            onClick={() => setOpen(false)}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
