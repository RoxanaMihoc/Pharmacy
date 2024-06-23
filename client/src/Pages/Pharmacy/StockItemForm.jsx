import React, { useState } from 'react';

const StockItemForm = ({ stockItem, saveStockItem, cancel }) => {
    const [item, setItem] = useState(stockItem);

    const handleSubmit = (event) => {
        event.preventDefault();
        saveStockItem(item);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
                type="text"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
            <label>Quantity:</label>
            <input
                type="number"
                value={item.quantity}
                onChange={(e) => setItem({ ...item, quantity: parseInt(e.target.value) })}
            />
            <button type="submit">Save</button>
            <button onClick={cancel}>Cancel</button>
        </form>
    );
};

export default StockItemForm;
