// Lista inicial customizada focada em treino e estilo dark/Y2K para o Lucas
let itens = JSON.parse(localStorage.getItem('luckDay_itens')) || [
    "Creatina",
    "Whey Protein",
    "Pré-Treino",
    "Camiseta Oversized",
    "Regata DryFit",
    "Shorts de Treino",
    "Tênis de Corrida",
    "Strap / Munhequeira",
    "Garrafa de Água 2L",
    "Fone Bluetooth",
    "Mochila Tática",
    "Perfume",
    "Boné Streetwear"
];

const gridContainer = document.getElementById('shoppingGrid');
const newItemInput = document.getElementById('newItemInput');
const addItemBtn = document.getElementById('addItemBtn');
const countdownTimer = document.getElementById('countdownTimer');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// --- Lógica do Tema (Claro/Escuro) ---
const temaSalvo = localStorage.getItem('luckDay_tema');
if (temaSalvo === 'light') {
    document.body.classList.add('light-theme');
    themeToggleBtn.innerText = '⏾';
}

themeToggleBtn.onclick = () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('luckDay_tema', 'light');
        themeToggleBtn.innerText = '⏾';
    } else {
        localStorage.setItem('luckDay_tema', 'dark');
        themeToggleBtn.innerText = '☀︎︎';
    }
};

function salvarNoNavegador() {
    localStorage.setItem('luckDay_itens', JSON.stringify(itens));
}

function atualizarCronometro() {
    const agora = new Date();
    let ano = agora.getFullYear();
    let mes = agora.getMonth();

    let alvo = new Date(ano, mes, 15, 23, 59, 59);

    if (agora > alvo) {
        mes += 1;
        if (mes > 11) {
            mes = 0;
            ano += 1;
        }
        alvo = new Date(ano, mes, 15, 23, 59, 59);
    }

    const diferenca = alvo - agora;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    if (agora.getDate() === 15) {
        countdownTimer.innerText = `> É HOJEEE!!!`;
    } else {
        countdownTimer.innerText = `> CONTAGEM: ${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }
}

setInterval(atualizarCronometro, 1000);
atualizarCronometro();

function renderizarLista() {
    gridContainer.innerHTML = '';
    
    itens.forEach((nomeItem, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('draggable', 'true');
        card.dataset.index = index;
        
        card.innerHTML = `
            <h3>${nomeItem}</h3>
            <button class="delete-btn" title="Remover">×</button>
        `;
        
        card.onclick = function(e) {
            if (e.target.classList.contains('delete-btn')) return;
            this.classList.toggle('purchased');
            criarExplosaoEstrelas(e);
        };
        
        card.querySelector('.delete-btn').onclick = (e) => {
            e.stopPropagation();
            itens.splice(index, 1);
            salvarNoNavegador();
            renderizarLista();
        };

        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));

        gridContainer.addEventListener('dragover', e => {
            e.preventDefault();
            const draggingCard = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(gridContainer, e.clientY);
            if (afterElement == null) {
                gridContainer.appendChild(draggingCard);
            } else {
                gridContainer.insertBefore(draggingCard, afterElement);
            }
        });

        gridContainer.addEventListener('drop', () => {
            const cardsAtualizados = gridContainer.querySelectorAll('.project-card');
            itens = Array.from(cardsAtualizados).map(c => c.querySelector('h3').innerText);
            salvarNoNavegador();
        });

        gridContainer.appendChild(card);
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.project-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function adicionarItem() {
    const texto = newItemInput.value.trim();
    if (texto !== "") {
        itens.push(texto);
        newItemInput.value = "";
        salvarNoNavegador();
        renderizarLista();
    }
}

addItemBtn.onclick = adicionarItem;
newItemInput.onkeypress = (e) => { if (e.key === 'Enter') adicionarItem(); };

function criarExplosaoEstrelas(event) {
    for (let i = 0; i < 5; i++) {
        const estrela = document.createElement('div');
        estrela.className = 'star-explosion';
        estrela.innerText = '★'; 

        estrela.style.left = `${event.clientX}px`;
        estrela.style.top = `${event.clientY}px`;
        
        estrela.style.setProperty('--random-x', `${(Math.random() - 0.5) * 60}px`);
        estrela.style.setProperty('--random-y', `${(Math.random() - 0.5) * 60}px`);

        document.body.appendChild(estrela);
        setTimeout(() => estrela.remove(), 600);
    }
}

function iniciarCascata() {
    const simbolos = ['❚█══█❚','⚡︎', '♬', '🎧', '☠','❚█══█❚']; 
    const quantidade = 15; 

    for (let i = 0; i < quantidade; i++) {
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
        item.style.left = `${Math.random() * 100}vw`;
        item.style.fontSize = `${Math.random() * 0.8 + 0.8}rem`;
        
        const duracao = Math.random() * 7 + 2;
        item.style.animationDuration = `${duracao}s`;
        item.style.animationDelay = `${Math.random() * 5}s`;

        document.body.appendChild(item);
    }
}

renderizarLista();
iniciarCascata();