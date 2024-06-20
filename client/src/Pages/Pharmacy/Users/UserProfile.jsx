import React, { useState, useEffect } from 'react';
import "./styles/user-profile.css"

const UserProfile = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profilePic: '',
        addresses: [],
    });
    const [newAddress, setNewAddress] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/user/details', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on how you handle auth
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
        setLoading(false);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            await uploadProfilePicture(formData);
            fetchUserDetails(); // Refresh user details
        }
    };

    const uploadProfilePicture = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/home/user/upload-picture', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            alert('Picture uploaded successfully!');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const handleSaveDetails = async () => {
        try {
            const response = await fetch('http://localhost:3000/home/user/update-details', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error saving user details:', error);
        }
    };

    const handleAddAddress = () => {
        if (newAddress) {
            const updatedAddresses = [...user.addresses, newAddress];
            setUser({ ...user, addresses: updatedAddresses });
            setNewAddress('');
            // Optionally, save to backend here
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    return (
        <div className="user-profile">
            <h1>Edit Profile</h1>
            {loading ? <p>Loading...</p> : (
                <>
                    <div className="profile-picture">
                        <img src={user.profilePic || 'default_profile_pic.png'} alt="Profile" />
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload Picture</button>
                    </div>
                    <div className="profile-details">
                        <label>
                            First Name:
                            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" value={user.email} onChange={handleChange} readOnly />
                        </label>
                        <button onClick={handleSaveDetails}>Save Changes</button>
                    </div>
                    <div className="addresses">
                        <h2>Addresses</h2>
                        {user.addresses.map((address, index) => (
                            <div key={index}>{address}</div>
                        ))}
                        <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                        <button onClick={handleAddAddress}>Add Address</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfile;
