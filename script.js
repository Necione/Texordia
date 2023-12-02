document.addEventListener('DOMContentLoaded', function() {
    var consoleElement = document.getElementById('console');
    var promptText = "Texordia> ";
    var currentDirectory = "";
    var registeredName = "";

    const directoryStructure = {
        Root: {
            Inventory: {}
        }
    };

    consoleElement.value = promptText;
    consoleElement.focus();
    consoleElement.setSelectionRange(promptText.length, promptText.length);

    consoleElement.addEventListener('keydown', function(event) {
        var currentLineStart = this.value.lastIndexOf(promptText) + promptText.length;

        // Prevent modification
        if (this.selectionStart < currentLineStart) {
            this.setSelectionRange(currentLineStart, currentLineStart);
            if (event.key !== 'Enter') {
                event.preventDefault();
            }
        }

        // Handling Ctrl + A
        if (event.ctrlKey && event.key === 'a') {
            event.preventDefault();
            this.setSelectionRange(currentLineStart, this.value.length);
            return;
        }

        // Prevent Backspace and Delete keys from modifying past the prompt
        if (event.key === 'Backspace' && this.selectionStart <= currentLineStart ||
            event.key === 'Delete' && this.selectionStart < currentLineStart) {
            event.preventDefault();
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            var input = this.value.substring(currentLineStart).trim();

            processCommand(input);

            if (input.toLowerCase() !== 'cls') {
                this.value += "\n" + promptText;
            }
            this.scrollTop = this.scrollHeight;
            this.setSelectionRange(this.value.length, this.value.length);
        }
    });

    // Set focus back to the console whenever it loses focus
    document.addEventListener('click', function() {
        consoleElement.focus();
    });

    function processCommand(input) {
        var commandParts = input.split(/\s+/); // Split the input into parts
        var command = commandParts[0].toLowerCase();
        var argument = commandParts.slice(1).join(" ").toLowerCase(); // Convert argument to lowercase

        if (command === 'cd') {
            if (argument === 'inventory' && currentDirectory === '') {
                currentDirectory = 'Inventory';
                promptText = "Texordia\\Inventory> "; // Update the prompt text for Inventory
                consoleElement.value += "\nChanged directory to Inventory.";
            } else if (argument === '~') {
                currentDirectory = "";
                promptText = "Texordia> "; // Update the prompt text for root
                consoleElement.value += "\nChanged directory to root.";
            }
        } else if (command === 'hello') {
            consoleElement.value += "\nHello" + (registeredName ? ", " + registeredName : "") + "!";
        } else if (command === 'cls') {
            consoleElement.value = promptText;
        } else if (command === 'register') {
            registeredName = argument;
            consoleElement.value += "\nSuccessfully registered a new character with name " + registeredName + ".";
        } else if (command === 'tree') {
            const tree = displayDirectoryTree(currentDirectory);
            consoleElement.value += '\n' + tree;
        } else {
            consoleElement.value += "\nUnrecognized command: " + input;
        }
    }

    function displayDirectoryTree(currentDirectory) {
        if (currentDirectory === '') {
            return Object.keys(directoryStructure.Root).map(directory => `- ${directory}`);
        } else if (directoryStructure[currentDirectory]) {
            const subdirectories = Object.keys(directoryStructure[currentDirectory]);
            if (subdirectories.length === 0) {
                return 'No subdirectories in the current directory.';
            }
            return subdirectories.map(subdirectory => `- ${subdirectory}`);
        }
        return 'Directory not found.';
    }    
});
