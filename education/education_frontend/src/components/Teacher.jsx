import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Teacher() {
    const [rubrics, setRubrics] = useState('');
    const [assignments, setAssignments] = useState('');
    const [editRubrics, setEditRubrics] = useState(false);
    const [editAssignments, setEditAssignments] = useState(false);
    const navigate = useNavigate();

    const getData = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/langchain/get_attr`);

            setRubrics(res.data.rubrics);
            setAssignments(res.data.assignments);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                console.error(error);
                toast.error('An unexpected error occurred.');
            }
        }
    }
    const saveRubrics = async () => {
        const data = {
            rubrics: rubrics
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/langchain/save_attr`, data);

            if (res.error) {
                toast.error(res.error.data.error);
            } else if (res.status === 200) {
                toast.success('Saved successfully.');
                setEditRubrics(false);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                console.error(error);
                toast.error('An unexpected error occurred.');
            }
        }
    }
    const changeRubrics = event => {
        setRubrics(event.target.value);
    }
    
    const saveAssignments = async () => {
        const data = {
            assignments: assignments
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/langchain/save_attr`, data);

            if (res.error) {
                toast.error(res.error.data.error);
            } else if (res.status === 200) {
                toast.success('Saved successfully.');
                setEditAssignments(false);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                console.error(error);
                toast.error('An unexpected error occurred.');
            }
        }
    }
    const changeAssignments = event => {
        setAssignments(event.target.value);
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <>
            <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-indigo-600">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-indigo-500 group">
                                <svg className="w-5 h-5 text-white transition duration-75 group-hover:text-white-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ml-3">Rubrics</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside >
            <div className="p-8 sm:ml-64">
                {
                    editRubrics === false
                        ? <>
                            <div className="flex justify-between">
                                <h2 htmlFor="message" className="mt-2 block font-medium">Rubrics</h2>
                                <button className="text-base  rounded-l-none rounded-r-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                    hover:bg-teal-700 hover:text-teal-100 
                                    bg-teal-100 
                                    text-teal-700 
                                    border duration-200 ease-in-out 
                                    border-teal-600 transition"
                                    onClick={() => setEditRubrics(true)}
                                >
                                    <div className="flex leading-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit w-5 h-5 mr-1">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Edit</div>
                                </button>
                            </div>

                            <div className="whitespace-pre-wrap	block mt-2 px-4 py-2 w-full h-[400px] overflow-y-scroll text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                {rubrics}
                            </div>
                        </>
                        :
                        <>
                            <div className="flex justify-between">
                                <h2 htmlFor="message" className="mt-2 block font-medium">Rubrics</h2>
                                <div className="flex gap-2">
                                    <button className="text-base  rounded-l-none rounded-r-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                        hover:bg-teal-700 hover:text-teal-100 
                                        bg-teal-100 
                                        text-teal-700 
                                        border duration-200 ease-in-out 
                                        border-teal-600 transition"
                                        onClick={saveRubrics}
                                    >
                                        <div className="flex leading-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-save w-5 h-5 mr-1">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                <polyline points="7 3 7 8 15 8"></polyline>
                                            </svg>
                                            Save
                                        </div>
                                    </button>
                                    <button className="text-base  rounded-l-none rounded-r-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                        hover:bg-teal-700 hover:text-teal-100 
                                        bg-teal-100 
                                        text-teal-700 
                                        border duration-200 ease-in-out 
                                        border-teal-600 transition"
                                        onClick={() => setEditRubrics(false)}
                                    >
                                        <div className="flex leading-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit w-5 h-5 mr-1">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            Cancel
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <textarea value={rubrics} onChange={changeRubrics} id="message" rows="4" className="block mt-2 p-2.5 w-full h-[600px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your writings here..." />
                        </>
                }
            </div>
            <div className="p-8 sm:ml-64">
                {
                    editAssignments === false
                        ? <>
                            <div className="flex justify-between">
                                <h2 htmlFor="message" className="mt-2 block font-medium">Assignments</h2>
                                <button className="text-base  rounded-l-none rounded-r-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                    hover:bg-teal-700 hover:text-teal-100 
                                    bg-teal-100 
                                    text-teal-700 
                                    border duration-200 ease-in-out 
                                    border-teal-600 transition"
                                    onClick={() => setEditAssignments(true)}
                                >
                                    <div className="flex leading-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit w-5 h-5 mr-1">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Edit</div>
                                </button>
                            </div>

                            <div className="whitespace-pre-wrap	block mt-2 px-4 py-2 w-full h-[400px] overflow-y-scroll text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                {assignments}
                            </div>
                        </>
                        :
                        <>
                            <div className="flex justify-between">
                                <h2 htmlFor="message" className="mt-2 block font-medium">Assignments</h2>
                                <div className="flex gap-2">
                                    <button className="text-base  rounded-l-none rounded-r-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                        hover:bg-teal-700 hover:text-teal-100 
                                        bg-teal-100 
                                        text-teal-700 
                                        border duration-200 ease-in-out 
                                        border-teal-600 transition"
                                        onClick={saveAssignments}
                                    >
                                        <div className="flex leading-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-save w-5 h-5 mr-1">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                <polyline points="7 3 7 8 15 8"></polyline>
                                            </svg>
                                            Save
                                        </div>
                                    </button>
                                    <button className="text-base  rounded-l-none rounded-r-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                        hover:bg-teal-700 hover:text-teal-100 
                                        bg-teal-100 
                                        text-teal-700 
                                        border duration-200 ease-in-out 
                                        border-teal-600 transition"
                                        onClick={() => setEditAssignments(false)}
                                    >
                                        <div className="flex leading-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit w-5 h-5 mr-1">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            Cancel
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <textarea value={assignments} onChange={changeAssignments} id="message" rows="4" className="block mt-2 p-2.5 w-full h-[600px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your assignments here..." />
                        </>
                }
            </div>
            <Toaster />
        </>
    )
}