'use client'

import { Input } from "../form-controls/index.jsx"

const controls = [
    {
        name: 'username',
        placeholder: 'Enter User Name',
        type: 'text',
        label: 'Enter User Name'
    },
    {
        name: 'password',
        placeholder: 'Enter Password',
        type: 'text',
        label: 'Enter Password'
    }
] 
  
export default function Login({formData,setFormData,handleLogin}){
    // console.log(formData);
    return <div className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md bg-slate-400 shadow-lg rounded-lg px-8 pt-6 pb-8">
        
        <Input controls={controls}
         formData={formData}
         setFormData={setFormData}
        /> 

        <button onClick={handleLogin} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
            Login
        </button>

            </div>
         </div>
}