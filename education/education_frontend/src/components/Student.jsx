import axios from "axios"
import { useState } from "react";
import { LANGUAGES } from "./language";

export default function Student() {
    const [writing, setWriting] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [translateLoading, setTranslateLoading] = useState(false);
    const [langCode, setLangCode] = useState('en');
    const [engFeedBack, setEngFeedBack] = useState('');

    const handleWritingChange = (event) => {
        setWriting(event.target.value)
        console.log(event.target.value)
    }
    const grade = async () => {
        try {
            const data = {
                writing: writing,
                langCode: langCode
            }
            setLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/langchain/chat`, data);
            setLoading(false);
            setFeedback(res.data.message)
            setEngFeedBack(res.data.message)
            // console.log(res.data.message)
        } catch (err) {
            console.log(err);
        }
    }

    const handleTranslate = async () => {
        setTranslateLoading(true)
        const inputData = {
            langCode: langCode,
            text: engFeedBack
        }
        try {

            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/langchain/translate`, inputData);
            setFeedback(data.message)
        } catch (error) {
            console.log(error)
        }
        setTranslateLoading(false)
    }

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
                                <span className="ml-3">Dashboard</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside >
            <div className="p-8 sm:ml-64 flex justify-between gap-8">
                <div className="w-full">
                    <div className="mb-12 flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="website" className="block mt-2 text-sm font-medium text-gray-900">GoogleDoc URL</label>
                        <input type="url" id="website" className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="https://docs.google.com/document" required />
                    </div>
                    <label htmlFor="message" className="mt-2 block text-sm font-medium">Or</label>

                    <textarea id="message" value={writing} onChange={handleWritingChange} rows="4" className="block mt-2 p-2.5 w-full h-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your writings here..."></textarea>
                    <button type="button" className={`mt-10 px-5 py-2.5 w-full text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-blue-300 rounded-lg text-center ${loading ? 'bg-indigo-500' : 'bg-indigo-600'}`} onClick={grade}>
                        {
                            loading == true ?
                                <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                                </svg>
                                : null
                        }
                        SUBMIT
                    </button>
                </div>
                <div className="w-full">
                    <div className="flex justify-between items-center mb-[10px]">

                        <label htmlFor="message" className="block text-sm font-medium">Feedback:</label>
                        <button type="button" className={`px-5 py-2.5 w-[150px] text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-blue-300 rounded-lg text-center ${translateLoading ? 'bg-indigo-500' : 'bg-indigo-600'}`} onClick={handleTranslate}>Translate</button>
                    </div>
                    <div>
                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={langCode} onChange={(e) => setLangCode(e.target.value)}>
                            {
                                Object.keys(LANGUAGES).map((key) => {
                                    return <option key={key} value={key}> {LANGUAGES[key]}</option>
                                })
                            }
                        </select>
                    </div>
                    <textarea id="message" value={feedback} readOnly rows="4" className="block mt-2 p-2.5 w-full h-[600px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
            </div>
        </>
    )
}