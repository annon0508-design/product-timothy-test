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
                background-color: rgba(255, 255, 255, 0.1);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.18);
                text-align: center;
            }
            h2 {
                color: #fff;
                margin-bottom: 20px;
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
                color: #fff;
                animation: pop-in 0.5s ease-out forwards;
            }
            .bonus-container::before {
                content: '+';
                font-size: 24px;
                margin-right: 10px;
            }
            button {
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                background-color: #fff;
                color: #2575fc;
                font-size: 18px;
                cursor: pointer;
                transition: transform 0.2s;
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
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa'; // Gray
        return '#b0d840'; // Green
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
