import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="landing">
      <h1>Welcome to Auth Service</h1>
      <p>Please login or register to continue</p>
      <div className="cta-buttons">
        <Link to="/login" className="button">Login</Link>
        <Link to="/register" className="button">Register</Link>
      </div>
    </div>
  );
}
