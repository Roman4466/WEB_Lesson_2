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
            <div class="button-group">
                <button class="decrease">-</button>
                <span class="amount">1</span>
                <button class="increase">+</button>
                <button class="buy">Куплено</button>
                <button class="delete">×</button>
            </div>
        `;
        toBuyList.appendChild(li);
        updateRemainingList(name, 1);

        // Increase button functionality
        li.querySelector('.increase').addEventListener('click', () => {
            const amount = li.querySelector('.amount');
            amount.textContent = parseInt(amount.textContent) + 1;
            updateRemainingList(name, parseInt(amount.textContent));
        });

        // Decrease button functionality
        li.querySelector('.decrease').addEventListener('click', () => {
            const amount = li.querySelector('.amount');
            if (parseInt(amount.textContent) > 1) {
                amount.textContent = parseInt(amount.textContent) - 1;
                updateRemainingList(name, parseInt(amount.textContent));
            }
        });

        // Buy button functionality
        li.querySelector('.buy').addEventListener('click', () => {
            if (li.classList.contains('bought')) {
                li.classList.remove('bought');
                li.querySelector('.buy').textContent = 'Куплено';
                li.querySelector('.delete').style.display = 'inline-block';
                updateRemainingList(name, parseInt(li.querySelector('.amount').textContent));
                removeFromList(boughtList, name);
            } else {
                li.classList.add('bought');
                li.querySelector('.buy').textContent = 'Не куплено';
                li.querySelector('.delete').style.display = 'none';
                removeFromList(remainingList, name);
                updateBoughtList(name, parseInt(li.querySelector('.amount').textContent));
            }
        });

        // Delete button functionality
        li.querySelector('.delete').addEventListener('click', () => {
            const amount = parseInt(li.querySelector('.amount').textContent);
            if (li.classList.contains('bought')) {
                removeFromList(boughtList, name);
            } else {
                removeFromList(remainingList, name);
            }
            li.remove();
        });
    }

    function updateRemainingList(name, amount) {
        const existingItem = Array.from(remainingList.children).find(item => item.querySelector('span').textContent === name);
        if (existingItem) {
            existingItem.querySelector('.amount').textContent = amount;
        } else {
            const li = document.createElement('li');
            li.innerHTML = `<span>${name}</span><span class="amount">${amount}</span>`;
            remainingList.appendChild(li);
        }
    }

    function updateBoughtList(name, amount) {
        const existingItem = Array.from(boughtList.children).find(item => item.querySelector('span').textContent === name);
        if (existingItem) {
            existingItem.querySelector('.amount').textContent = amount;
        } else {
            const li = document.createElement('li');
            li.innerHTML = `<span>${name}</span><span class="amount">${amount}</span>`;
            boughtList.appendChild(li);
        }
    }

    function removeFromList(list, name) {
        const existingItem = Array.from(list.children).find(item => item.querySelector('span').textContent === name);
        if (existingItem) {
            existingItem.remove();
        }
    }
});
