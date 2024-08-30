import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MdCancel } from "react-icons/md";

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(userData.data);
        setFilteredUsers(userData.data); 
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current.focus(); 
  };

  // Handle user selection
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true); 
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <div className='flex flex-col justify-evenly items-center py-[2rem]'>
    <div className='flex flex-row gap-[1rem] items-center'>
    <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={handleInputChange}
        ref={inputRef}
        className='px-4 py-1 border-2 border-solid border-black rounded-lg'
      />
      <MdCancel onClick={clearSearch} color='red' size={30}/>
    </div>

  <div className='flex flex-col w-full mt-[2rem]'>
<h2 className='text-3xl font-semibold ms-[1.5rem]'>Our Users</h2>
  {filteredUsers.length > 0 ? (
        <ul className='mt-[1.5rem] ms-[4rem]'>
          {filteredUsers.map((user) => (
            <li key={user.id} onClick={() => handleUserClick(user)} className='text-[1.2rem]'>
              {user.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
  </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-end me-[4rem]">
        <div className="modal bg-white rounded-lg p-6">
          
        <div className='flex flex-row items-center gap-4'>
        <h2 className="text-xl font-bold">User Details</h2>
        <MdCancel onClick={closeModal} size={20} color='red'/> </div>
          <ul className=" mt-4">
            <li><strong>Name:</strong> {selectedUser.name}</li>
            <li><strong>Username:</strong> {selectedUser.username}</li>
            <li><strong>Email:</strong> {selectedUser.email}</li>
            <li><strong>Address:</strong> {selectedUser.address.street}  
              {selectedUser.address.zipcode}
              </li>

          </ul>
        </div>
      </div>
      )}
    </div>
  );
};

export default App;