import { NavLink } from "react-router-dom";
import "./header.css";
const Header = () => {
    return(
        <div className="header">
            <div className="header_wrapper">
                <div className="header_title">Notification Task</div>
                <NavLink className="header_menu" style={({ isActive }) => {
                    return {
                        color: isActive ? "#8DCAFE" : "rgba(255, 255, 255, 0.6)",
                        textDecoration: isActive? "underline" : "none",
                    };
                }} to="/">Home</NavLink>
                <NavLink className="header_menu" style={({ isActive }) => {
                    return {
                        color: isActive ? "#8DCAFE" : "rgba(255, 255, 255, 0.6)",
                        textDecoration: isActive? "underline" : "none",
                    };
                }} to="/page2">Settings</NavLink>
            </div>

        </div>
    );
};

export default Header;