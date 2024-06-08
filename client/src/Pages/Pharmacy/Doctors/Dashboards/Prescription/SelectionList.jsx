import React, { useState, useEffect } from "react";

function SelectionList({ selectedItems }) {
  return (
    <div className="selection-list">
      {selectedItems.map((item, index) => (
        <div key={index} className="selected-item">
          <span>{item.name} - Quantity: {item.quantity}</span>
          <textarea 
            value={item.notes || ''}
            onChange={(e) => item.notes = e.target.value}
            placeholder="Notes"
          />
        </div>
      ))}
    </div>
  );
}

export default SelectionList;
