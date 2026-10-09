const Navbar = ({setToggle}) => {
    return (
      <nav className="bg-blue-700 text-white flex items-center justify-between px-8 py-3 mb-10">
        <h1 className="text-xl font-bold">Product App</h1>
  
        <div className="flex items-center gap-6">
          <p className="cursor-pointer hover:text-blue-200">Home</p>
          <p className="cursor-pointer hover:text-blue-200">Products</p>
          <button className="bg-black px-5 py-2 rounded-md cursor-pointer hover:bg-gray-800" onClick={()=>{
            setToggle(prev=>!prev)
          }}>
            Create
          </button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;