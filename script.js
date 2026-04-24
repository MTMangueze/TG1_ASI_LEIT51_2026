// --- MODELO ---
const model = {
    getProdutos() {
        return JSON.parse(localStorage.getItem('produtos')) || [];
    },
    salvarProduto(produto) {
        const produtos = this.getProdutos();
        // Verifica se o produto com esse nome já existe para não duplicar no cadastro
        const existe = produtos.find(p => p.nome.toLowerCase() === produto.nome.toLowerCase());
        if (!existe) {
            produtos.push(produto);
            localStorage.setItem('produtos', JSON.stringify(produtos));
            return true;
        }
        return false;
    },
    getCarrinho() {
        return JSON.parse(sessionStorage.getItem('carrinho')) || [];
    },
    adicionarAoCarrinho(produto) {
        let carrinho = this.getCarrinho();
        // Procura se o produto já está no carrinho
        const index = carrinho.findIndex(item => item.nome === produto.nome);

        if (index !== -1) {
            // Se já existe, apenas aumenta a quantidade
            carrinho[index].quantidade += 1;
        } else {
            // Se é novo, adiciona com quantidade 1
            carrinho.push({ ...produto, quantidade: 1 });
        }
        
        sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    },
    limparCarrinho() {
        sessionStorage.removeItem('carrinho');
    }
};

// --- VISÃO ---
const view = {
    renderizarProdutos(produtos) {
        const lista = document.getElementById('listaProdutos');
        lista.innerHTML = '';
        produtos.forEach((p, index) => {
            lista.innerHTML += `
                <div class="produto-card">
                    <span>${p.nome} - ${p.preco} MT</span>
                    <button onclick="controller.comprar(${index})">Adicionar ao Carrinho</button>
                </div>`;
        });
    },
    renderizarCarrinho(carrinho) {
        const divItens = document.getElementById('itensCarrinho');
        const spanQtd = document.getElementById('qtdTotal');
        const spanTotal = document.getElementById('precoTotal');

        // Adicionamos um cabeçalho simples para a "tabela" do carrinho
        divItens.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #ccc;">
                <span style="width: 40%">Produto</span>
                <span style="width: 20%">Qtd</span>
                <span style="width: 40%">Subtotal</span>
            </div>
        `;

        let totalGeralPreco = 0;
        let totalGeralItens = 0;

        carrinho.forEach(item => {
            const subtotal = parseFloat(item.preco) * item.quantidade;
            totalGeralPreco += subtotal;
            totalGeralItens += item.quantidade;

            divItens.innerHTML += `
                <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                    <span style="width: 40%">${item.nome}</span>
                    <span style="width: 20%">${item.quantidade}</span>
                    <span style="width: 40%">${subtotal.toFixed(2)} MT</span>
                </div>`;
        });

        spanQtd.innerText = totalGeralItens;
        spanTotal.innerText = totalGeralPreco.toFixed(2);
    }
};

// --- CONTROLADOR ---
const controller = {
    init() {
        view.renderizarProdutos(model.getProdutos());
        view.renderizarCarrinho(model.getCarrinho());
    },
    adicionarProduto() {
        const nome = document.getElementById('nomeProduto').value.trim();
        const preco = document.getElementById('precoProduto').value;

        if (nome && preco) {
            const sucesso = model.salvarProduto({ nome, preco });
            if (sucesso) {
                view.renderizarProdutos(model.getProdutos());
                document.getElementById('nomeProduto').value = '';
                document.getElementById('precoProduto').value = '';
            } else {
                alert("Este produto já está cadastrado!");
            }
        } else {
            alert("Preencha todos os campos!");
        }
    },
    comprar(index) {
        const produto = model.getProdutos()[index];
        model.adicionarAoCarrinho(produto);
        view.renderizarCarrinho(model.getCarrinho());
    },
    encerrarCompra() {
        if(confirm("Deseja encerrar a compra e limpar o carrinho?")) {
            model.limparCarrinho();
            view.renderizarCarrinho([]);
            alert("Compra finalizada!");
        }
    }
};

controller.init();