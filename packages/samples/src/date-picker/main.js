import React from "react";
import ReactDom from "react-dom";
import DatePicker from "./date-picker";

ReactDom.render(<React.StrictMode>
    <div>
        <DatePicker />
    </div>
</React.StrictMode>, document.getElementById("root"));