const Input = () => (
    <div className="mb-8">
        <label htmlFor="email" className="block font-medium text-white">
            Email
        </label>
        <input
            type="email"
            id="email"
            className="mt-1 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-[#4ade80]"
            required
        />
    </div>
);

export default Input;
