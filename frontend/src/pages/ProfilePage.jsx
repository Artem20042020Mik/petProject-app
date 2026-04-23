import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getBossData } from '../api/profile.js';
import { logout } from '../api/auth.js';
import {Shield, LogOut, ArrowLeft, UserCircle, Briefcase, BarChart3, User} from 'lucide-react';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [bossData, setBossData] = useState(false);
    const [isLoadingBoss, setIsLoadingBoss] = useState(false);
    const [bossError, setBossError] = useState("");
    const navigate = useNavigate();



    useEffect(()=>{
        const loadProfile= async ()=>{
            try{
                const profile = await getProfile();
                setProfile(profile.data);
            }catch (e) {
                setError(e.response?.data?.error || "error loading profile");
            }
        }

        loadProfile();
    },[]);


    const handleLogout = async ()=>{
        try{
            await logout();
        }catch (e) {
            setError(e.response?.data?.error || "some error by logging out");
        }finally {
            localStorage.removeItem("accessToken");
            navigate("/login");
        }
    }

    const fetchBossPanel = async ()=>{
        try{
            const boss = await getBossData();
            setBossData(boss.data);
        }
        catch (e) {
            setBossError(e.response?.data?.error || "you don't have access to boss panel ")
        }
        finally {
            setIsLoadingBoss(false);
        }
    }

    const getRoleName= ()=>{
        if (!profile || !profile.role || !profile.role[0]) return "unknown";
        const role = profile.role[0].authority;
        return role==="ROLE_USER"? "user" :
                role==="ROLE_BOSS" ? "boss" : role;
    }

    const isBoss = profile?.role[0].authority === "ROLE_BOSS";

    return (
        <div className = "flex h-[100vh] justify-center items-center p-6 font-sans bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md border-gray-200 p-6">

                <div className="flex items-center gap-5 justify-between">
                    <button onClick={()=>navigate("/projects")} title="back to projects" className="
                    bg-cyan-50 border-gray-200 p-2 rounded-lg transition cursor-pointer hover:bg-cyan-200 shadow-sm">
                        <ArrowLeft className=" h-5 w-5"/>
                    </button>
                    <h1 className="text-sm font-bold tracking-wider uppercase">profile page</h1>
                </div>

                <div className="p-8">
                    {error ? (<div className="text-center  bg-red-50 text-red-500 p-4 mb-6 rounded-lg">{error}</div>)
                        : !profile ? (<div className="text-center py-8 text-gray-800 animate-pulse">loading...</div>)
                            :
                            (<div className="flex flex-col gap-6 items-center">
                                <div className="w-24 h-24 bg-cyan-50 text-cyan-700 rounded-full flex justify-center items-center relative">
                                    <UserCircle className="w-12 h-12 opacity-80 "/>
                                    {!isBoss && (
                                        <div className="absolute -right-1 -bottom-1 text-white bg-indigo-500 rounded-full p-1.5 border-2 shadow-sm border-white">
                                            <Shield className="h-5 w-5"/>
                                        </div>)}
                                </div>

                                <div className="flex flex-col gap-4 w-full max-w-md">
                                    <div className="bg-gray-100 rounded-2xl flex items-center p-4 gap-4 border border-gray-200">
                                        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center border-gray-200 shadow-sm">
                                            <UserCircle className="w-6 h-6 " />
                                        </div>
                                        <div>
                                            <p className="tracking-wider uppercase text-xs font-bold mb-2">Login (email)</p>
                                            <p className="text-gray-800 font-medium text-sm"> {profile.email || "data is hidden"}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-100 rounded-2xl flex p-4 gap-3 border border-gray-200 ">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                                            <Shield className="w-6 h-6 "/>
                                        </div>
                                        <div className="">
                                            <p className="text-xs uppercase tracking-wider font-bold mb-2">level of access</p>
                                            <p className={` text-sm ${isBoss ? "font-bold text-indigo-600" : "text-gray-800 font-medium"}`}>{getRoleName()|| "problem"}</p>
                                        </div>
                                    </div>
                                </div>

                                {isBoss && (<div>
                                    {!bossData ?
                                        (
                                        <button
                                            className="bg-indigo-400 hover:bg-indigo-500 rounded-xl text-white shadow-sm shadow-amber-800
                                            transition cursor-pointer font-bold px-3 py-2"
                                            onClick={fetchBossPanel}
                                            disabled={isLoadingBoss}>
                                            {isLoadingBoss ? "loading data..." : "control panel"}
                                        </button>
                                        ) :
                                        (<div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 animate-in fade-in-1 slide-in-from-top-1">
                                            <div className="flex items-center gap-3 text-md border-b border-b-indigo-200/50 mb-2 pb-3 text-indigo-900 font-bold">
                                                <BarChart3/>
                                                stats
                                            </div>
                                            <p className="text-sm text-indigo-700 mb-4 font-medium italic">
                                                "{bossData.message}"
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm text-center">
                                                    <p className="text-xs font-black text-indigo-500 mb-1 uppercase">total amount of pages</p>
                                                    <p className="font-black text-2xl text-indigo-900"> {bossData.amountOfProjects}</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm text-center">
                                                    <p className="text-xs font-black text-indigo-500 mb-1 uppercase">total amount of tasks</p>
                                                    <p className="text-2xl font-black text-indigo-900">{bossData.amountOfTasks}</p>
                                                </div>
                                            </div>
                                        </div>)}


                                    {bossError && <p className="text-red-500 text-sm">{bossError}</p>}
                                </div>)}

                                <button
                                    onClick={handleLogout}
                                    className="mt-2 px-3 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5" />
                                    logout
                                </button>
                            </div>)}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;