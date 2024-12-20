import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  const base =
    "inline-block rounded-full text-sm bg-yellow-400 uppercase tracking-wide text-stone-800 transition-colors hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed font-semibold";

  const styles = {
    primary: base + " px-4 py-2 md:px-6 md:py-3",
    small: base + " px-3 py-2 md:px-5 md:py-2.5 text-xs",
    round: base + " px-2 py-1 text-xs",
    secondary:
      "inline-block rounded-xl text-sm uppercase tracking-wide text-stone-400 border border-stone-300 border-2 transition-colors hover:bg-stone-300 hover:text-stone-800 focus:bg-stone-300 focus:outline-none focus:ring focus:ring-stone-200 focus:ring-offset-2 focus:text-stone-800 disabled:cursor-not-allowed font-semibold px-4 py-2 md:px-5 md:py-2.5",
  };

  if (to) {
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button disabled={disabled} className={styles[type]} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
