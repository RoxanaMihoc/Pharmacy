import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import "./styles/recom.css";

const MedicationList = () => {
    const [filter, setFilter] = useState("");
    const [prescriptions, setPrescriptions] = useState([]);
    const history = useHistory();
    const location = useLocation();
    const patient = location.state?.patient;

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await fetch('http://localhost:3000/home/all-products');
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const data = await response.json();
                const enhancedData = data.map(item => ({
                    ...item,
                    quantity: 1,
                    notes: '',
                    dosage: '',
                    duration: '',
                    reason: '',
                    sideEffects: '',
                    selected: false
                }));
                setPrescriptions(enhancedData);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
    
        fetchPrescriptions();
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        const filtered = prescriptions.filter(prescription =>
            prescription.title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setPrescriptions(filtered);
    };

    const handleInputChange = (index, key, value) => {
        const updatedPrescriptions = [...prescriptions];
        updatedPrescriptions[index][key] = value;
        setPrescriptions(updatedPrescriptions);
    };

    const handleSave = () => {
        const selectedItems = prescriptions.filter(item => item.selected);
        history.push('/patients/prescription/path-to-overview', { patient, selectedItems });
    };

    return (
        <div className="prescription-list-container">
            <input
                type="text"
                placeholder="Search prescriptions..."
                value={filter}
                onChange={handleFilterChange}
                className="search-input"
            />
            <div className="table-container">
                <table className="prescription-list">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Dosage</th>
                            <th>Duration</th>
                            <th>Reason</th>
                            <th>Side Effects</th>
                            <th>Quantity</th>
                            <th>Notes</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{item.title}</td>
                                <td>
                                    <input type="text" value={item.dosage} onChange={(e) => handleInputChange(index, 'dosage', e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" value={item.duration} onChange={(e) => handleInputChange(index, 'duration', e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" value={item.reason} onChange={(e) => handleInputChange(index, 'reason', e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" value={item.sideEffects} onChange={(e) => handleInputChange(index, 'sideEffects', e.target.value)} />
                                </td>
                                <td>
                                    <input type="number" value={item.quantity} min={1} onChange={(e) => handleInputChange(index, 'quantity', parseInt(e.target.value, 10))} />
                                </td>
                                <td>
                                    <textarea value={item.notes} onChange={(e) => handleInputChange(index, 'notes', e.target.value)} />
                                </td>
                                <td>
                                    <input type="checkbox" checked={item.selected} onChange={(e) => handleInputChange(index, 'selected', e.target.checked)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleSave} className="save-button">Save Selected</button>
        </div>
    );
};

export default MedicationList;
