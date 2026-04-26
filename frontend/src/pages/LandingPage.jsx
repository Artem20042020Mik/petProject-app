import { Link } from 'react-router-dom';
import {
    ArrowRight, CheckCircle2, Shield, Database,
    Layout, Server, Code, Zap, Terminal, AnvilIcon, GitCommit, Info
} from 'lucide-react';

function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800 selection:bg-cyan-200">
            {/* Navigation */}
            <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-700 font-bold text-xl tracking-tight">
                    <CheckCircle2 className="w-6 h-6" />
                    Pet-Project
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-cyan-700 transition">
                        Sign In
                    </Link>
                    <Link to="/register" className="text-sm font-bold bg-cyan-700 text-white px-5 py-2.5 rounded-lg hover:bg-cyan-800 transition shadow-sm">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                    Smart Task Management <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-500">
                        in Clean Architecture
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    A reliable tool for project planning. Built on modern technologies with a focus on security, performance, and a user-friendly interface.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
                        Create Account <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a href="#about" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-3.5 rounded-xl font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm">
                        Learn More
                    </a>
                </div>
            </header>

            {/* Tech Stack */}
            <section className="bg-white border-y border-slate-200 py-20" id="about">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Tech Stack</h2>
                        <p className="text-slate-500">The project utilizes cutting-edge tools to ensure stability and scalability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Frontend */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Layout className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Frontend</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                React.js with Tailwind CSS. Axios with interceptors for seamless token refreshing.
                            </p>
                        </div>

                        {/* Backend */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                <Server className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Backend</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Java Spring Boot. Clean REST API architecture, layered design, and strict DTO validation.
                            </p>
                        </div>

                        {/* Database */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                                <Database className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Database</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                PostgreSQL for persistent data (Flyway migrations) and Redis for caching and blacklisting.
                            </p>
                        </div>

                        {/* Security */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Security</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Stateless authorization. Access + Refresh token pattern (HttpOnly cookies), BCrypt hashing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Me & Project Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* About Me */}
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <Terminal className="w-64 h-64" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-sm font-bold mb-6 w-fit">
                                <Code className="w-4 h-4" /> About Me
                            </div>
                            <h2 className="text-3xl font-bold mb-6">Hello!</h2>
                            <div className="space-y-4 text-slate-300 leading-relaxed mb-8 flex-1">
                                <p>
                                    I am a fourth-semester Computer Science bachelor's student at the Technical University of Dresden. Building this project over the last 4-5 months has been a profound learning experience, giving me a solid grasp of full-stack development.
                                </p>
                                <p>
                                    I learned how to seamlessly connect frontend and backend architectures, implement foundational security, and efficiently interact with databases.
                                </p>
                                <p>
                                    Beyond solo work, I value team collaboration. In my third semester, I worked in a team to build a complete Vinotheque web application, which taught me role delegation and clean code structuring.
                                </p>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <a href="https://github.com/Artem20042020Mik/petProject-app" className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-lg font-bold hover:bg-slate-100 transition">
                                    <GitCommit className="w-5 h-5" /> Project on GitHub
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* About Project */}
                    <div className="bg-slate-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-700">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <AnvilIcon className="w-64 h-64" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-emerald-400 text-sm font-bold mb-6 w-fit">
                                <Info className="w-4 h-4" /> About Project
                            </div>
                            <h2 className="text-3xl font-bold mb-6">The Architecture</h2>
                            <div className="space-y-4 text-slate-300 leading-relaxed mb-8 flex-1">
                                <p>
                                    The core focus of this application is robust security. The backend is built on <strong>Spring Boot</strong> utilizing Inversion of Control, layered architecture, and <strong>PostgreSQL</strong> managed by <strong>Flyway</strong> migrations.
                                </p>
                                <p>
                                    I implemented a dual-token <strong>JWT</strong> strategy. Access tokens provide quick authorization, while Refresh tokens are stored safely in <strong>HttpOnly cookies</strong> to prevent XSS/CSRF attacks. <strong>Redis</strong> is integrated to efficiently manage token blacklisting and lifecycles.
                                </p>
                                <p>
                                    The frontend leverages <strong>React.js</strong> and <strong>Tailwind CSS</strong>. Using <strong>Axios interceptors</strong>, the app automatically handles expired sessions in the background. Combined with React hooks and async/await features, it ensures a seamless and uninterrupted user experience.

                                </p>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <Link to="/register" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-600 transition shadow-sm">
                                    <Zap className="w-5 h-5" /> Try It Now
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
                <p>© 2026 Pet-Project. My email: mikishevartem@gmail.com |
                    {" "}
                    <a
                    href="https://www.linkedin.com/in/artem-mikishev-670044273/?isSelfProfile=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline">LinkedIn
                    </a> |
                    {" "}
                    <a
                        href="https://github.com/Artem20042020Mik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline">GitHub
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default LandingPage;