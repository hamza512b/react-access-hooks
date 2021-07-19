import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFocusTrap, useKeyboardAction, useOutsideClick } from "react-access-hooks";

let listbox_id = -1;

function isIsoDate(str) {
    return RegExp(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/).test(str);
}
export default function DatePicker() {
    const [open, setOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState(new Date().getDate());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [displayedDate, setDisplayedDate] = useState("");
    const currentDate = new Date(currentYear, currentMonth, currentDay);
    const id = useMemo(() => listbox_id += 1, []);
    let activeIndex = 0;
    const weeks = useMemo(() => {
        let daysToPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDay() + 1;
        daysToPrevMonth = daysToPrevMonth === 7 ? 0 : daysToPrevMonth;
        const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const daysOfNextMonth = (daysToPrevMonth + daysInMonth) % 7 !== 0 ? 7 - (daysToPrevMonth + daysInMonth) % 7 : 0;
        const sum = daysToPrevMonth + daysInMonth + daysOfNextMonth;

        let prevDay = daysToPrevMonth;
        let currentDay = 0;
        let nextDay = 0;
        let temp = 0;
        let weeks = [];
        const date = currentDate.getDate();
        for (let i = 0; i < sum / 7; i++) {
            let week = [];
            for (let j = 0; j < 7; j++) {
                temp++;
                if (temp <= daysToPrevMonth) {
                    prevDay--;
                    week.push({ date: daysInPrevMonth - prevDay, type: "inactive", active: false });
                } else if (temp > daysInMonth + daysToPrevMonth) {
                    nextDay++;
                    week.push({ date: nextDay, type: "inactive", active: false });
                } else {
                    currentDay++;
                    if (date === currentDay) activeIndex = temp;
                    week.push({ date: currentDay, type: "current", active: date === currentDay });
                }
            }
            weeks.push(week);
        }

        return weeks;
    }, [currentDate]);
    const datePickerDialogRef = useRef(null);
    const selectedItemRef = useRef(null);
    const datePickerGridRef = useRef(null);
    useFocusTrap({ element: datePickerDialogRef, condition: open, initialFocus: selectedItemRef });
    useOutsideClick({ element: datePickerDialogRef, condition: open, action: () => cancel() });
    useKeyboardAction({
        key: "Escape",
        action: () => cancel(),
        condition: open
    });
    useKeyboardAction({
        key: "ArrowUp",
        action: () => {
            setCurrentDay(currentDay - 7);
        },
        target: datePickerGridRef.current
    });
    useKeyboardAction({
        key: "ArrowDown",
        action: () => {
            setCurrentDay(currentDay + 7);
        },
        target: datePickerGridRef.current
    });
    useKeyboardAction({
        key: "ArrowLeft",
        action: () => {
            setCurrentDay(currentDay - 1);
        },
        target: datePickerGridRef.current
    });
    useKeyboardAction({
        key: "ArrowRight",
        action: () => {
            setCurrentDay(currentDay + 1);
        },
        target: datePickerGridRef.current
    });
    useKeyboardAction({
        key: "Home",
        action: () => {
            const left = (activeIndex - 1) % 7;
            setCurrentDay(currentDay - left);
        },
        target: datePickerGridRef.current
    });
    useKeyboardAction({
        key: "End",
        action: () => {
            const left = 7 - activeIndex % 7;
            setCurrentDay(currentDay + (left === 7 ? 0 : left));
        },
        target: datePickerGridRef.current
    });
    useKeyboardAction({
        key: "PageUp",
        action: (ev) => {
            if (ev.shiftKey) setCurrentYear(currentYear - 1);
            else setCurrentMonth(currentMonth - 1);
        },
        target: datePickerGridRef.current
    });
    useKeyboardAction({
        key: "PageDown",
        action: (ev) => {
            if (ev.shiftKey) setCurrentYear(currentYear + 1);
            else setCurrentMonth(currentMonth + 1);
        },
        target: datePickerGridRef.current
    });
    useEffect(() => {
        if (selectedItemRef.current) selectedItemRef.current.focus();
    });

    function displayDate(date) {
        const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
        const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
        const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
        setDisplayedDate(`${ye}/${mo}/${da}`);
        console.log(`${ye}/${mo}/${da}`);
        setOpen(false);
    }

    function cancel() {
        const now = isIsoDate(displayedDate) ? new Date(displayedDate) : new Date();
        setCurrentDay(now.getDate());
        setCurrentMonth(now.getMonth());
        setCurrentYear(now.getFullYear());
        setOpen(false);
    }


    return (
        <div className="date-picker" >

            <label htmlFor={`datepicker-label-${id}`}>Choose Date:</label>
            <div className="date-picker-button">
                <input type="text" id={`datepicker-label-${id}`} placeholder="yyyy/mm/dd" defaultValue={displayedDate} disabled aria-autocomplete="none"/>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label={`Date picker button ${isIsoDate(displayedDate) ? `${new Intl.DateTimeFormat("en", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(displayedDate))}` : ""}`}
                >
                    <svg width="21" height="20" fill="none"><path d="M6.1 5V1m8 4V1m-9 8h10m-12 10h14a2 2 0 002-2V5a2 2 0 00-2-2h-14a2 2 0 00-2 2v12c0 1.1 1 2 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
            </div>
            <div className={`date-picker-dialog ${!open ? "hidden" : ""}`} ref={datePickerDialogRef} role="dialog" aria-modal="true" aria-labelledby={`dialog-label-${id}`} >
                <div className="date-picker-dialog-header">
                    <button onClick={() => setCurrentYear(currentYear - 1)} aria-label="Previous Year">
                        <svg width="18" height="16" fill="none"><path d="M8.5 15l-7-7 7-7m8 14l-7-7 7-7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button onClick={() => setCurrentMonth(currentMonth - 1)} aria-label="Previous Month">
                        <svg width="9" height="16" fill="none"><path d="M8 15L1 8l7-7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <h2 id={`dialog-label-${id}`} aria-live="polite">
                        {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(currentYear, currentMonth, currentDay))}
                    </h2>
                    <button onClick={() => setCurrentMonth(currentMonth + 1)} aria-label="Next Month">
                        <svg width="9" height="16" fill="none"><path d="M1 1l7 7-7 7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button onClick={() => setCurrentYear(currentYear + 1)} aria-label="Next Year">
                        <svg width="18" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 1l7 7-7 7m-8-14l7 7-7 7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>
                <table className="date-picker-dialog-grid" ref={datePickerGridRef} role="grid" aria-labelledby={`dialog-label-${id}`}>
                    <thead>
                        <tr>
                            <th scope="col" abbr="Monday">Mo</th>
                            <th scope="col" abbr="Tuesday">Tu</th>
                            <th scope="col" abbr="Wednesday">We</th>
                            <th scope="col" abbr="Thursday">Th</th>
                            <th scope="col" abbr="Friday">Fr</th>
                            <th scope="col" abbr="Saturday">Sa</th>
                            <th scope="col" abbr="Sunday">Su</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((days, index) =>
                            <tr key={index}>
                                {days.map(day => 
                                    <td key={day.date} className={day.type}>
                                        <button
                                            key={day.date}
                                            className={day.active ? "active" : ""}
                                            tabIndex={day.active ? 0 : -1}
                                            aria-selected={day.active}
                                            ref={day.active ? selectedItemRef : undefined}
                                            onClick={() => displayDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date))}
                                            disabled={day.type === "inactive"}
                                        >
                                            {day.date}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="date-picker-dialog-buttons">
                    <button className="secondary" onClick={cancel}>Cancel</button>
                    <button className="primary" onClick={() => displayDate(currentDate)}>Done</button>
                </div>
            </div>
        </div>);
}

