export const InputBox = ({ label, placeholder, value, onChange }) => {
    return (
        <div className="w-full mb-4 ">
            <label className="block text-amber-50 text-lg font-bold mb-2">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="shadow-inner shadow-zinc-950 bg-zinc-800 appearance-none rounded w-full py-2 px-3 text-amber-50  "
            />
        </div>
    );
};
