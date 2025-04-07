import { useState } from "react";

function SidebarItem({ title, subItems = [] }) {
    const [open, setOpen] = useState(false);
    
    return (

        <div className="sidebar-item">
            <div className="sidebar-title" onClick={() => setOpen(!open)}>
                {title}
                <span className="arrow">{open ? "v" : "v"}</span>
            </div>
            {open && subItems.length > 0 && (
                <ul className="sidebar-submenu">
                    {subItems.map((subItem, index) => (
                        <li key={index}>{subItem}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SidebarItem;
