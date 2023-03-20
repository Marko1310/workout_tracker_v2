import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="error-container">
      <div className="text-container">
        <h2>404</h2>
        <h3>Page not found</h3>
        <Link className="backTo" to="/">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
