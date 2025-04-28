import PropTypes from "prop-types";

const Boton = ({
  text,
  onClick,
  type = "button",
  className = "",
  icon: Icon,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-primary hover:bg-prymary-light transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{text}</span>
    </button>
  );
};

Boton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
};

export default Boton;
