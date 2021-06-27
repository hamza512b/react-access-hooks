import { useKeyboardAction, useOutsideClick } from "@linears/react-access";
import React, { useRef, useState } from "react";

const items = ["Foo", "Bar", "Baz", "Qux", "Quux", "Quuz", "Corge"];

export default function Listbox() {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(-1);
    const [selectedItem, setSelectedItem] = useState(-1);
    const ButtonRef = useRef(null);
    const ListRef = useRef(null);
    const ListboxRef = useRef(null);"";

    useOutsideClick({element:ListboxRef, action: ()=> setOpen(false), condition: open});
    function expand(ev) {
        if (ev) ev.preventDefault();
        setOpen(true);
        ListRef.current.focus();
    }

    function selectNext() {
        if (activeItem < items.length - 1) setActiveItem(activeItem + 1);
    }

    function selectPrevious() {
        if (activeItem > 0) setActiveItem(activeItem - 1);
    }

    function select() {
        setSelectedItem(activeItem);
        setOpen(false);
        ButtonRef.current.focus();
    }
    // Following collapsible listbox WCAG 
    // https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html#kbd_label
    useKeyboardAction({
        key: "Enter",
        action: () => {
            if (!open) expand();
            else setOpen(false);
        },
        target: ButtonRef.current,
    });
    useKeyboardAction({
        key: "Enter",
        action: () => {
            select();
        },
        target: ListRef.current,
    });
    useKeyboardAction({
        key: "Escape",
        action: (ev) => {
            if (open) {
                ev.stopImmediatePropagation();
                setOpen(false);
                ButtonRef.current.focus();
            }
        },
    });
    useKeyboardAction({
        key: "ArrowDown",
        action: () => {
            expand();
            selectNext();
        },
        target: ButtonRef.current,
    });
    useKeyboardAction({
        key: "ArrowDown",
        condition: open,
        action: selectNext,
        target: ListRef.current,
    });
    useKeyboardAction({
        key: "ArrowUp",
        action: () => {
            expand();
            selectPrevious();
        },
        target: ButtonRef.current,
    });
    useKeyboardAction({
        key: "ArrowUp",
        condition: open,
        action: selectPrevious,
        target: ListRef.current,
    });
    useKeyboardAction({
        key: "Home",
        condition: open,
        action: () => {
            setActiveItem(0);
        },
        target: ListRef.current,
    });
    useKeyboardAction({
        key: "End",
        condition: open,
        action: () => {
            setActiveItem(items.length - 1);
        },
        target: ListRef.current,
    });
    useKeyboardAction({
        key: "printable",
        target: ListRef.current,
        clearTimeout: 500,
        action: (_, keys) => {
            const index = items.findIndex((item) =>
                RegExp(`^${keys}`, "i").test(item)
            );
            if (index !== -1) setActiveItem(index);
        },
    });
    return (
        <>
            <span id="listbox">Select an Items:</span>
            <div className="listbox" ref={ListboxRef}>
                <button
                    ref={ButtonRef}
                    className="button"
                    onClick={() => setOpen(!open)}
                    id={"listbox-button"}
                    aria-labelledby={"listbox listbox-button"}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    {selectedItem !== -1 ? items[selectedItem] : "Select An Item"}
                </button>
                <ul
                    ref={ListRef}
                    className={`list ${!open ? "hidden" : ""}`}
                    role="listbox"
                    tabIndex={-1}
                    aria-activedescendant={activeItem && `${activeItem}-listbox-item`}
                >
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`item ${selectedItem === index ? "selected" : ""} ${
                                activeItem === index ? "active" : ""
                            }`}
                            onMouseOver={() => setActiveItem(index)}
                            onClick={select}
                            id={`${index}-listbox-item`}
                            role="option"
                            aria-selected={selectedItem === index}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
