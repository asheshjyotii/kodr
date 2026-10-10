import React, { useState } from "react";
import { nanoid } from "nanoid";

const Form = ({
  setUserData,
  editHandler,
  IsEditted,
  EditToggle
}) => {
    console.log(IsEditted);
    
  const [FormData, setFormData] = useState(
    IsEditted
      ? IsEditted
      
      : {
          name: "",
          email: "",
          imageUrl: "",
        }
  );

  function handleChange(e) {
    let { name, value } = e.target;

    setFormData({ ...FormData, [name]: value });
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-2">
      <form onSubmit={(e) => {
            e.preventDefault();
            setUserData((prev) => [...prev, { ...FormData, id: nanoid() }]);
          }} className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">
          Create Profile
        </h1>

        <input
        value={FormData.name}
          name="name"
          type="text"
          placeholder="Name"
          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => {
            handleChange(e);
          }}
        />

        <input
        value={FormData.email}

          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => {
            handleChange(e);
          }}
        />

        <input
        value={FormData.imageUrl}

          name="imageUrl"
          type="url"
          placeholder="Image URL"
          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => {
            handleChange(e);
          }}
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
          
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default Form;
