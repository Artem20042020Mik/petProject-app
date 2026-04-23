import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

function RegisterPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError("");
        try{
            await register(email, password);
            navigate("/login");
        }catch (e) {
            setError(e.response?.data?.error || "error by registration");
        }
    }

    return (
        <div className="min-h-[100vh] bg-gray-100 flex flex-col">
            <nav className="bg-white shadow-sm px-8 py-4">
                <Link to="/" className="text-cyan-700 font-extrabold text-xl hover:text-cyan-500 transition">
                    Pet-Project
                </Link>
            </nav>

            <div className="flex-1 flex items-center justify-center">
                <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-md">
                    <h1 className="text-2xl text-gray-700 mb-4 font-bold">register</h1>
                    {error && (
                        <div className="bg-white text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-cyan-700">email</label>
                            <input
                                type="email"
                                value={email}
                                placeholder="example@mail"
                                required
                                onChange={(e)=> setEmail(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm
                            focus:outline-none focus:border-cyan-700 transition-shadow"/>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm text-cyan-700">password</label>
                            <input
                                type="password"
                                value={password}
                                placeholder="password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm
                            focus:outline-none focus:border-cyan-700 transition"/>
                        </div>


                        <button
                            type="submit"
                            className="px-4 py-2 flex flex-col rounded-md border border-gray-300 text-white
                             w-1/4 hover:shadow bg-emerald-500 hover:bg-emerald-600 transition cursor-pointer">submit</button>

                    </form>

                    <p className="text-sm font-light mt-2 text-left ml-2 text-gray-500">already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 hover:underline font-bold">login</Link></p>

                </div>
            </div>
        </div>
    );
}
export default RegisterPage;