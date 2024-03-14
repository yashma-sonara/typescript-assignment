import { NavLink } from "react-router-dom";
import "./header.css";
const Header = () => {
    const page1 = <NavLink className="header_menu" style={({ isActive }) => {
        return {
            color: isActive ? "#8DCAFE" : "rgba(255, 255, 255, 0.6)",
            textDecoration: isActive ? "underline" : "none",
        };
    } } to="/">Home</NavLink>;
    
    
    const page2 = <NavLink className="header_menu" style={({ isActive }) => {
        return {
            color: isActive ? "#8DCAFE" : "rgba(255, 255, 255, 0.6)",
            textDecoration: isActive ? "underline" : "none",
        };
    } } to="/page2">Settings</NavLink>;
    
    return(
        <div className="header">
            <div className="header_wrapper">
                <div className="header_title">Notification Task</div>
                {page1}
                {page2}
            </div>

        </div>
    );
};

export default Header;