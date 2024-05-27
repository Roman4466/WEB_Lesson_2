document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.getElementById('add-item');
    const itemNameInput = document.getElementById('item-name');
    const toBuyList = document.getElementById('to-buy-list');
    const remainingList = document.getElementById('remaining-list');
    const boughtList = document.getElementById('bought-list');

    // Initialize with 3 items
    addItem('Помідори');
    addItem('Печиво');
    addItem('Сир');

    // Add event listener for the 'Add' button
    addItemButton.addEventListener('click', () => {
        const itemName = itemNameInput.value.trim();
        if (itemName) {
            addItem(itemName);
            itemNameInput.value = '';
            itemNameInput.focus();
        }
    });

    // Add event listener for 'Enter' key press in the text field
    itemNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addItemButton.click();
        }
    });

    function addItem(name) {
        const existingItem = Array.from(toBuyList.children).find(item => item.querySelector('input').value === name);

        if (existingItem) {
            // Update the amount of the existing item
            const amount = existingItem.querySelector('.amount');
            amount.textContent = parseInt(amount.textContent) + 1;
            updateRemainingList(name, parseInt(amount.textContent));
        } else {
            // Create a new item if it doesn't exist
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="text" value="${name}" readonly class="readonly" />
                <div class="button-group">
                    <button class="decrease" data-tooltip="Зменшити кількість">-</button>
                    <span class="amount">1</span>
                    <button class="increase" data-tooltip="Збільшити кількість">+</button>
                    <button class="buy" data-tooltip="Позначити як куплено">Куплено</button>
                    <button class="delete" data-tooltip="Видалити елемент">×</button>
                </div>
            `;
            toBuyList.appendChild(li);
            updateRemainingList(name, 1);

            // Make item name editable on click
            const inputField = li.querySelector('input');
            inputField.addEventListener('click', () => {
                inputField.removeAttribute('readonly');
                inputField.classList.remove('readonly');
                inputField.focus();
            });

            // Save item name on blur or enter key press
            inputField.addEventListener('blur', () => {
                inputField.setAttribute('readonly', true);
                inputField.classList.add('readonly');
                saveItems();
            });
            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    inputField.blur();
                }
            });

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
                    li.querySelector('.increase').style.display = 'inline-block';
                    li.querySelector('.decrease').style.display = 'inline-block';
                } else {
                    li.classList.add('bought');
                    li.querySelector('.buy').textContent = 'не куплено';
                    li.querySelector('.delete').style.display = 'none';
                    removeFromList(remainingList, name);
                    updateBoughtList(name, parseInt(li.querySelector('.amount').textContent));
                    li.querySelector('.increase').style.display = 'none';
                    li.querySelector('.decrease').style.display = 'none';
                }
                saveItems();
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
                saveItems();
            });
        }
        saveItems();
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
        saveItems();
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
        saveItems();
    }

    function removeFromList(list, name) {
        const existingItem = Array.from(list.children).find(item => item.querySelector('span').textContent === name);
        if (existingItem) {
            existingItem.remove();
        }
        saveItems();
    }

    function saveItems() {
        const items = {
            toBuy: [],
            remaining: [],
            bought: []
        };

        toBuyList.querySelectorAll('li').forEach(li => {
            items.toBuy.push({
                name: li.querySelector('input').value,
                amount: parseInt(li.querySelector('.amount').textContent),
                bought: li.classList.contains('bought')
            });
        });

        remainingList.querySelectorAll('li').forEach(li => {
            items.remaining.push({
                name: li.querySelector('span').textContent,
                amount: parseInt(li.querySelector('.amount').textContent)
            });
        });

        boughtList.querySelectorAll('li').forEach(li => {
            items.bought.push({
                name: li.querySelector('span').textContent,
                amount: parseInt(li.querySelector('.amount').textContent)
            });
        });

        localStorage.setItem('items', JSON.stringify(items));
    }

    function loadItems() {
        const items = JSON.parse(localStorage.getItem('items')) || {
            toBuy: [],
            remaining: [],
            bought: []
        };

        items.toBuy.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="text" value="${item.name}" readonly class="readonly" />
                <div class="button-group">
                    <button class="decrease" data-tooltip="Зменшити кількість">-</button>
                    <span class="amount">${item.amount}</span>
                    <button class="increase" data-tooltip="Збільшити кількість">+</button>
                    <button class="buy" data-tooltip="${item.bought ? 'Позначити як не куплено' : 'Позначити як куплено'}">${item.bought ? 'не куплено' : 'Куплено'}</button>
                    <button class="delete" data-tooltip="Видалити елемент" style="${item.bought ? 'display: none;' : ''}">×</button>
                </div>
            `;
            if (item.bought) {
                li.classList.add('bought');
                li.querySelector('.increase').style.display = 'none';
                li.querySelector('.decrease').style.display = 'none';
            }
            toBuyList.appendChild(li);

            // Make item name editable on click
            const inputField = li.querySelector('input');
            inputField.addEventListener('click', () => {
                inputField.removeAttribute('readonly');
                inputField.classList.remove('readonly');
                inputField.focus();
            });

            // Save item name on blur or enter key press
            inputField.addEventListener('blur', () => {
                inputField.setAttribute('readonly', true);
                inputField.classList.add('readonly');
                saveItems();
            });
            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    inputField.blur();
                }
            });

            // Increase button functionality
            li.querySelector('.increase').addEventListener('click', () => {
                const amount = li.querySelector('.amount');
                amount.textContent = parseInt(amount.textContent) + 1;
                updateRemainingList(item.name, parseInt(amount.textContent));
            });

            // Decrease button functionality
            li.querySelector('.decrease').addEventListener('click', () => {
                const amount = li.querySelector('.amount');
                if (parseInt(amount.textContent) > 1) {
                    amount.textContent = parseInt(amount.textContent) - 1;
                    updateRemainingList(item.name, parseInt(amount.textContent));
                }
            });

            // Buy button functionality
            li.querySelector('.buy').addEventListener('click', () => {
                if (li.classList.contains('bought')) {
                    li.classList.remove('bought');
                    li.querySelector('.buy').textContent = 'Куплено';
                    li.querySelector('.buy').setAttribute('data-tooltip', 'Позначити як куплено');
                    li.querySelector('.delete').style.display = 'inline-block';
                    updateRemainingList(item.name, parseInt(li.querySelector('.amount').textContent));
                    removeFromList(boughtList, item.name);
                    li.querySelector('.increase').style.display = 'inline-block';
                    li.querySelector('.decrease').style.display = 'inline-block';
                } else {
                    li.classList.add('bought');
                    li.querySelector('.buy').textContent = 'не куплено';
                    li.querySelector('.buy').setAttribute('data-tooltip', 'Позначити як не куплено');
                    li.querySelector('.delete').style.display = 'none';
                    removeFromList(remainingList, item.name);
                    updateBoughtList(item.name, parseInt(li.querySelector('.amount').textContent));
                    li.querySelector('.increase').style.display = 'none';
                    li.querySelector('.decrease').style.display = 'none';
                }
                saveItems();
            });

            // Delete button functionality
            li.querySelector('.delete').addEventListener('click', () => {
                const amount = parseInt(li.querySelector('.amount').textContent);
                if (li.classList.contains('bought')) {
                    removeFromList(boughtList, item.name);
                } else {
                    removeFromList(remainingList, item.name);
                }
                li.remove();
                saveItems();
            });
        });

        items.remaining.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name}</span><span class="amount">${item.amount}</span>`;
            remainingList.appendChild(li);
        });

        items.bought.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name}</span><span class="amount">${item.amount}</span>`;
            boughtList.appendChild(li);
        });
    }
});