document.addEventListener('DOMContentLoaded', () => {
    type Build = {
        id: string;
        textContent: string;
        onClick: () => void;
    }

    interface outputDiv {
        id: string;
        textContent: string;
    }

    interface buildButton {
        id: string;
        text: string;
        onClick: () => void;
    }

    const outputDiv: outputDiv = { 
        id: 'output',
        textContent: 'Output'
    };

    const buildButton: buildButton = {
        id: 'build-button',
        text: 'Build',
        onClick: () => {
            const output = document.getElementById(outputDiv.id);
            if (output) {
                output.textContent = 'Build button clicked!';
            }
        }
    };
    
    const output = document.createElement('div');
    output.id = outputDiv.id;
    output.textContent = outputDiv.textContent;
    document.body.appendChild(output);
    const button = document.createElement('button');
    button.id = buildButton.id;
    button.textContent = buildButton.text;
    button.onclick = buildButton.onClick;
    document.body.appendChild(button);
});
