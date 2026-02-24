const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        toggleSwitch.checked = true;
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        const title = document.createElement('h2');
        title.textContent = 'This Week\'s Winning Numbers';

        const numbersContainer = document.createElement('div');
        numbersContainer.setAttribute('class', 'numbers');
        
        const bonusContainer = document.createElement('div');
        bonusContainer.setAttribute('class', 'bonus-container');

        const button = document.createElement('button');
        button.textContent = 'Generate Numbers';
        button.addEventListener('click', () => this.generateNumbers(numbersContainer, bonusContainer));

        const style = document.createElement('style');
        style.textContent = `
            .wrapper {
                padding: 30px;
                border-radius: 15px;
                background-color: var(--component-bg);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                border: 1px solid var(--component-border);
                text-align: center;
                transition: background-color 0.3s, border 0.3s;
            }
            h2 {
                color: var(--text-color);
                margin-bottom: 20px;
                transition: color 0.3s;
            }
            .numbers, .bonus-container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 20px 0;
            }
            .number, .bonus-number {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                font-weight: bold;
                color: #fff; /* Keep text white for contrast on colored circles */
                animation: pop-in 0.5s ease-out forwards;
            }
            .bonus-container::before {
                content: '+';
                font-size: 24px;
                margin-right: 10px;
                color: var(--text-color);
                transition: color 0.3s;
            }
            button {
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                background-color: var(--button-bg);
                color: var(--button-text);
                font-size: 18px;
                cursor: pointer;
                transition: transform 0.2s, background-color 0.3s, color 0.3s;
            }
            button:hover {
                transform: scale(1.05);
            }

            @keyframes pop-in {
                0% {
                    transform: scale(0);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(title);
        wrapper.appendChild(numbersContainer);
        wrapper.appendChild(bonusContainer);
        wrapper.appendChild(button);

        this.generateNumbers(numbersContainer, bonusContainer);
    }

    getColor(number) {
        if (number <= 10) return '#fbc400';
        if (number <= 20) return '#69c8f2';
        if (number <= 30) return '#ff7272';
        if (number <= 40) return '#aaa';
        return '#b0d840';
    }

    generateNumbers(numbersContainer, bonusContainer) {
        numbersContainer.innerHTML = '';
        bonusContainer.innerHTML = '';

        const numbers = new Set();
        while (numbers.size < 7) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = [...numbers].sort((a, b) => a - b);
        const mainNumbers = sortedNumbers.slice(0, 6);
        const bonusNumber = sortedNumbers[6];

        mainNumbers.forEach((number, index) => {
            const numberDiv = document.createElement('div');
            numberDiv.setAttribute('class', 'number');
            numberDiv.textContent = number;
            numberDiv.style.backgroundColor = this.getColor(number);
            numberDiv.style.animationDelay = `${index * 100}ms`;
            numbersContainer.appendChild(numberDiv);
        });
        
        const bonusDiv = document.createElement('div');
        bonusDiv.setAttribute('class', 'bonus-number');
        bonusDiv.textContent = bonusNumber;
        bonusDiv.style.backgroundColor = this.getColor(bonusNumber);
        bonusDiv.style.animationDelay = `600ms`;
        bonusContainer.appendChild(bonusDiv);
    }
}

customElements.define('lotto-generator', LottoGenerator);
