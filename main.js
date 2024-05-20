document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.getElementById('add-item');
    const itemNameInput = document.getElementById('item-name');
    const toBuyList = document.getElementById('to-buy-list');
    const remainingList = document.getElementById('remaining-list');
    const boughtList = document.getElementById('bought-list');

    // Add event listener for the 'Add' button
    addItemButton.addEventListener('click', () => {
        const itemName = itemNameInput.value.trim();
        if (itemName) {
            addItem(itemName);
            itemNameInput.value = '';
        }
    });

    // Add event listener for 'Enter' key press in the text field
    itemNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addItemButton.click();
        }
    });

    function addItem(name) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${name}</span>
            <span class="amount">1</span>
            <div class="button-group">
                <button class="increase">+</button>
                <button class="decrease">-</button>
                <button class="buy">Куплено</button>
                <button class="delete">×</button>
            </div>
        `;
        toBuyList.appendChild(li);

        // Increase button functionality
        li.querySelector('.increase').addEventListener('click', () => {
            const amount = li.querySelector('.amount');
            amount.textContent = parseInt(amount.textContent) + 1;
        });

        // Decrease button functionality
        li.querySelector('.decrease').addEventListener('click', () => {
            const amount = li.querySelector('.amount');
            if (parseInt(amount.textContent) > 1) {
                amount.textContent = parseInt(amount.textContent) - 1;
            }
        });

        // Buy button functionality
        li.querySelector('.buy').addEventListener('click', () => {
            li.classList.add('bought');
            toBuyList.removeChild(li);
            boughtList.appendChild(li);
            li.querySelector('.buy').style.display = 'none';
        });

        // Delete button functionality
        li.querySelector('.delete').addEventListener('click', () => {
            li.remove();
        });
    }
});
