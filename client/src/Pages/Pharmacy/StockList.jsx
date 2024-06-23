import React, { useState, useEffect } from 'react';
import { useAuth } from "../../Context/AuthContext";
import "./styles/stock-list.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const currentUser = "66746a45149b6a27a9018fa5";
    const [editStockId, setEditStockId] = useState(null); // ID of the stock currently being edited
    const [editQuantity, setEditQuantity] = useState(''); // Edited quantity value
    // const { currentUser } = useAuth();
    
    

    useEffect(() => {
        if(currentUser){
        fetchStocks();}
    }, [currentUser]);

    const fetchStocks = async () => {
        try {
            const response = await fetch(`http://localhost:3000/home/stocks/${currentUser}`);
            if (!response.ok) throw new Error("Failed to fetch stocks");
            const data = await response.json();
            setStocks(data);
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };
    const updateStockItem = async (id, quantity) => {
        try {
            await fetch(`http://localhost:3000/home/quantity/${id}/${currentUser}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ quantity })
            });
            fetchStocks(); // Refresh the list
            setEditStockId(null); // Exit edit mode
        } catch (error) {
            console.error('Failed to update stock', error);
        }
    };

    const deleteStockItem = async (id) => {
        try {
            await fetch(`http://localhost:3000/home/stoc/${id}/${currentUser}`, {
                method: 'DELETE'
            });
            fetchStocks(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete stock', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = stocks.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="stock-list-container">
            <h1> Inventar</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nume</th>
                        <th>Cantitate</th>
                        <th>Categorie</th>
                        <th>Actiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(stock => (
                        <tr key={stock.productId}>
                        <td>{stock.title}</td>
                        <td>
                            {editStockId === stock.productId ? (
                                <input type="number" value={editQuantity} onChange={e => setEditQuantity(e.target.value)} />
                            ) : (
                                stock.quantity
                            )}
                        </td>
                        <td>{stock.category}</td>
                        <td>
                            {editStockId === stock.id ? (
                                <button onClick={() => updateStockItem(stock.productId, editQuantity)}>Save</button>
                            ) : (
                                <button onClick={() => { setEditStockId(stock.productId); setEditQuantity(stock.quantity); }}>Edit</button>
                            )}
                            <button onClick={() => deleteStockItem(stock.productId)}>Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className='pages-content'>
            <Pagination itemsPerPage={itemsPerPage} totalItems={stocks.length} paginate={paginate} />
            </div>
        </div>
    );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination-container">
            <button 
                className="page-button" 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                {"<"}
            </button>
            <select 
                className="page-select" 
                value={currentPage} 
                onChange={(e) => paginate(Number(e.target.value))}
            >
                {pageNumbers.map(number => (
                    <option key={number} value={number}>
                        Page {number}
                    </option>
                ))}
            </select>
            <button 
                className="page-button" 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                {">"}
            </button>
        </div>
    );
};


export default StockList;


