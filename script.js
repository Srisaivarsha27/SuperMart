const apiUrl = "http://localhost:5000/items";

// Fetch and display items
async function fetchItems() {
    try {
        const response = await fetch(apiUrl);
        const items = await response.json();
        
        if (!Array.isArray(items)) {
            console.error("Invalid API response:", items);
            return;
        }

        const tableBody = document.getElementById("itemsTable");
        tableBody.innerHTML = ""; // Clear old data

        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
                <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>
                    <button onclick="editItem('${item._id}', '${item.name}', '${item.quantity}', '${item.price}', '${item.image}')">Edit</button>
                    <button onclick="deleteItem('${item._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Add or update an item
async function addOrUpdateItem() {
    const id = document.getElementById("itemId").value;
    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    if (!name || !quantity || !price) {
        alert("Please fill all fields!");
        return;
    }

    const item = { name, quantity, price, image };

    await fetch(id ? `${apiUrl}/${id}` : apiUrl, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    });

    clearForm();
    fetchItems();
}

// Edit an item
function editItem(id, name, quantity, price, image) {
    document.getElementById("itemId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("quantity").value = quantity;
    document.getElementById("price").value = price;
    document.getElementById("image").value = image;
}

// Delete an item
async function deleteItem(id) {
    if (confirm("Are you sure?")) {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        fetchItems();
    }
}

// Load items on page load
window.onload = fetchItems;
