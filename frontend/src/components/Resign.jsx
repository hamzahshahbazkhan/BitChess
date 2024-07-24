export const Resign = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="bg-emerald-600 text-amber-50 px-4 py-2 rounded mt-4 hover:bg-red-600"
        >
            {label}
        </button>
    );
};
