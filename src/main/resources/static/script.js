 // Sample data - in a real app, this would come from an API
        let products = [
            { id: 1, description: "Notebook Dell Inspiron", quantity: 15, price: 4299.99 },
            { id: 2, description: "Mouse sem fio Logitech", quantity: 42, price: 129.90 },
            { id: 3, description: "Teclado mecânico RGB", quantity: 8, price: 349.90 },
            { id: 4, description: "Monitor 24\" Full HD", quantity: 12, price: 899.00 },
            { id: 5, description: "Webcam HD 1080p", quantity: 0, price: 249.90 },
            { id: 6, description: "Headphone Bluetooth", quantity: 25, price: 199.00 },
            { id: 7, description: "SSD 500GB", quantity: 18, price: 399.90 },
            { id: 8, description: "Cadeira Gamer", quantity: 5, price: 1299.90 },
            { id: 9, description: "Mesa digitalizadora", quantity: 3, price: 599.00 },
            { id: 10, description: "Hub USB-C", quantity: 30, price: 89.90 },
        ];

        // DOM Elements
        const productsTableBody = document.getElementById('productsTableBody');
        const emptyState = document.getElementById('emptyState');
        const searchInput = document.getElementById('searchInput');
        const lowStockFilter = document.getElementById('lowStockFilter');
        const sortSelect = document.getElementById('sortSelect');
        const addProductBtn = document.getElementById('addProductBtn');
        const productModal = document.getElementById('productModal');
        const deleteModal = document.getElementById('deleteModal');
        const productForm = document.getElementById('productForm');
        const saveProductBtn = document.getElementById('saveProduct');
        const cancelModalBtn = document.getElementById('cancelModal');
        const closeModalBtn = document.getElementById('closeModal');
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        const cancelDeleteBtn = document.getElementById('cancelDelete');
        const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
        const productIdInput = document.getElementById('productId');
        const productIdToDelete = document.getElementById('productIdToDelete');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageNumbersContainer = document.getElementById('pageNumbers');
        const showingFrom = document.getElementById('showingFrom');
        const showingTo = document.getElementById('showingTo');
        const totalItems = document.getElementById('totalItems');
        const totalProductsEl = document.getElementById('totalProducts');
        const totalValueEl = document.getElementById('totalValue');
        const inStockProductsEl = document.getElementById('inStockProducts');
        const outOfStockProductsEl = document.getElementById('outOfStockProducts');

        // Pagination variables
        let currentPage = 1;
        const itemsPerPage = 5;
        let totalPages = Math.ceil(products.length / itemsPerPage);

        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            loadProductsFromAPI();
            updateStats();
            renderPagination();

        });
            
            // Event listeners
            addProductBtn.addEventListener('click', openAddModal);
            saveProductBtn.addEventListener('click', saveProduct);
            cancelModalBtn.addEventListener('click', closeModal);
            closeModalBtn.addEventListener('click', closeModal);
            confirmDeleteBtn.addEventListener('click', deleteProduct);
            cancelDeleteBtn.addEventListener('click', closeDeleteModal);
            closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
            searchInput.addEventListener('input', filterProducts);
            lowStockFilter.addEventListener('change', filterProducts);
            sortSelect.addEventListener('change', filterProducts);
            prevPageBtn.addEventListener('click', goToPrevPage);
            nextPageBtn.addEventListener('click', goToNextPage);

        // Render products table
        function renderProducts(filteredProducts = products) {
            productsTableBody.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }
            
            emptyState.classList.add('hidden');
            
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
            
            showingFrom.textContent = startIndex + 1;
            showingTo.textContent = endIndex;
            totalItems.textContent = filteredProducts.length;
            
            paginatedProducts.forEach(product => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                
                const totalValue = product.quantity * product.price;
                const isLowStock = product.quantity > 0 && product.quantity <= 5;
                const isOutOfStock = product.quantity === 0;
                
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.description}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOutOfStock ? 'bg-red-100 text-red-800' : isLowStock ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                            ${product.quantity}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ ${product.price.toFixed(2).replace('.', ',')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">R$ ${totalValue.toFixed(2).replace('.', ',')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div class="flex gap-2">
                            <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn text-red-500 hover:text-red-700" data-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                productsTableBody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                    openEditModal(productId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                    openDeleteModal(productId);
                });
            });
        }

        // Update statistics
        function updateStats() {
            const totalProducts = products.length;
            const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
            const inStockProducts = products.filter(p => p.quantity > 0).length;
            const outOfStockProducts = products.filter(p => p.quantity === 0).length;
            
            totalProductsEl.textContent = totalProducts;
            totalValueEl.textContent = `R$ ${totalValue.toFixed(2).replace('.', ',')}`;
            inStockProductsEl.textContent = inStockProducts;
            outOfStockProductsEl.textContent = outOfStockProducts;
        }

        // Filter and sort products
        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const sortBy = sortSelect.value;
            const showLowStock = lowStockFilter.checked;
            
            let filtered = products.filter(product => 
                product.description.toLowerCase().includes(searchTerm) || 
                product.id.toString().includes(searchTerm)
            );
            
            if (showLowStock) {
                filtered = filtered.filter(product => product.quantity > 0 && product.quantity <= 5);
            }
            
            // Sorting
            filtered.sort((a, b) => {
                if (sortBy === 'id') return a.id - b.id;
                if (sortBy === 'name') return a.description.localeCompare(b.description);
                if (sortBy === 'quantity') return a.quantity - b.quantity;
                if (sortBy === 'price') return a.price - b.price;
                return 0;
            });
            
            totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
            
            renderProducts(filtered);
            renderPagination();
        }

        // Pagination functions
        function renderPagination() {
            pageNumbersContainer.innerHTML = '';
            
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
            
            if (totalPages === 0) return;
            
            // Always show first page
            addPageNumber(1);
            
            // Show ellipsis if needed
            if (currentPage > 3) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-3 py-1';
                ellipsis.textContent = '...';
                pageNumbersContainer.appendChild(ellipsis);
            }
            
            // Show current page and neighbors
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = startPage; i <= endPage; i++) {
                addPageNumber(i);
            }
            
            // Show ellipsis if needed
            if (currentPage < totalPages - 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-3 py-1';
                ellipsis.textContent = '...';
                pageNumbersContainer.appendChild(ellipsis);
            }
            
            // Always show last page if different from first
            if (totalPages > 1) {
                addPageNumber(totalPages);
            }
        }
        
        function addPageNumber(page) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `px-3 py-1 rounded-lg ${currentPage === page ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-100'}`;
            pageBtn.textContent = page;
            pageBtn.addEventListener('click', () => {
                currentPage = page;
                filterProducts();
            });
            pageNumbersContainer.appendChild(pageBtn);
        }
        
        function goToPrevPage() {
            if (currentPage > 1) {
                currentPage--;
                filterProducts();
            }
        }
        
        function goToNextPage() {
            if (currentPage < totalPages) {
                currentPage++;
                filterProducts();
            }
        }

        // Modal functions
        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Adicionar Produto';
            productIdInput.value = '';
            productForm.reset();
            productModal.classList.remove('hidden');
        }
        
        function openEditModal(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            document.getElementById('modalTitle').textContent = 'Editar Produto';
            productIdInput.value = product.id;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productPrice').value = product.price;
            productModal.classList.remove('hidden');
        }
        
        function closeModal() {
            productModal.classList.add('hidden');
        }
        
        function openDeleteModal(productId) {
            productIdToDelete.value = productId;
            deleteModal.classList.remove('hidden');
        }
        
        function closeDeleteModal() {
            deleteModal.classList.add('hidden');
        }
        
        // CRUD operations
        function saveProduct() {
            if (!productForm.checkValidity()) {
                productForm.reportValidity();
                return;
            }
            
            const id = productIdInput.value ? parseInt(productIdInput.value) : 0;
            const description = document.getElementById('productDescription').value;
            const quantity = parseInt(document.getElementById('productQuantity').value);
            const price = parseFloat(document.getElementById('productPrice').value);

             const payload = {
                nome: description,
                preco: price,
                quantidade: quantity
            };
            
            if (id) {
        // Atualizar produto
        fetch(`http://localhost:8080/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao atualizar produto');
            return res.json();
        })
        .then(data => {
            alert('Produto atualizado com sucesso!');
            closeModal();
            loadProductsFromAPI();
        })
        .catch(err => console.error('Erro:', err));
        } else {
            // Cadastrar novo produto
            fetch('http://localhost:8080/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao cadastrar produto');
                return res.json();
            })
            .then(data => {
                alert('Produto cadastrado com sucesso!');
                closeModal();
                loadProductsFromAPI();
            })
            .catch(err => console.error('Erro:', err));
        }
    }
      function deleteProduct() {
        const productId = parseInt(productIdToDelete.value);

        fetch(`http://localhost:8080/produtos/${productId}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao excluir produto');
            alert('Produto excluído com sucesso!');
            closeDeleteModal();
            loadProductsFromAPI();
        })
        .catch(err => console.error('Erro:', err));
    }

    function loadProductsFromAPI() {
        fetch('http://localhost:8080/produtos')
            .then(res => res.json())
            .then(data => {
                // Suponha que a API retorne no formato { id, nome, preco, quantidade }
                products = data.map(p => ({
                    id: p.id,
                    description: p.nome,
                    price: p.preco,
                    quantity: p.quantidade
                }));

                filterProducts();
                updateStats();
            })
            .catch(err => console.error('Erro ao carregar produtos:', err));
    }
