
import "./BrandLogo.css";
import logo from "../assets/logo.png";

export default function BrandLogo({ className = "" }) {
  return (
    <img
      src={logo}
      alt="Chapterly"
      className={`brand-logo ${className}`}
    />
  );
}
