import React, { useState, useEffect } from 'react';
import axios from "axios";

const Inventory = () => {
  const [inventory, setInventory] = useState("");
  useEffect(() => {
      axios.get("http://localhost:5555/inventory")
      .then((res) => {
          setInventory(res.data.data.docs);
          console.log(inventory);
      })
      .catch((err) => {
          console.error(err);
      })
  })

  return (
    <div>
      <p>{ inventory.inventories[0] }</p>
    </div>
  )
}

export default Inventory
