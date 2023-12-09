import { events } from "../data/events.js";
import { gameData } from "../gameData.js";
import { consoleElement, saveGameData } from "../utilities.js";

export function triggerRandomEvent() {
  const randomEventIndex = Math.floor(Math.random() * events.length);
  const selectedEvent = events[randomEventIndex];

  if (eventTriggerRequirementsMet(selectedEvent)) {
    initiateEvent(selectedEvent);
  } else {
    consoleElement.value += "\nA quiet day, no events occurred.\n";
    gameData.isAsyncCommandRunning = false;
    appendPrompt();
    saveGameData();
  }
}

function eventTriggerRequirementsMet(event) {
  const { minLevel, minGold } = event.triggerRequirements;
  return gameData.level >= minLevel && gameData.goldAmount >= minGold;
}

function initiateEvent(event) {
  displayDialogue(event.dialogue, event);
  gameData.isEventInProgress = true;
  gameData.currentEvent = event;
}

function displayDialogue(dialogue, event) {
  consoleElement.disabled = true;

  const sentences = dialogue.split(". ");
  let currentSentenceIndex = 0;
  let currentLetterIndex = 0;

  const displayNextLetter = () => {
    if (currentSentenceIndex < sentences.length) {
      const sentence = sentences[currentSentenceIndex];
      if (currentLetterIndex < sentence.length) {
        consoleElement.value += sentence[currentLetterIndex];
        currentLetterIndex++;
        setTimeout(displayNextLetter, 50);
      } else {
        consoleElement.value += ".\n";
        currentSentenceIndex++;
        currentLetterIndex = 0;
        if (currentSentenceIndex < sentences.length) {
          setTimeout(displayNextSentence, 2000);
        } else {
          presentChoices(event.choices);
        }
      }
    }
  };

  const displayNextSentence = () => {
    consoleElement.value += "\n";
    displayNextLetter();
  };

  displayNextSentence();
}

function presentChoices(choices) {
  consoleElement.value += "\n";
  choices.forEach((choice, index) => {
    consoleElement.value += `${index + 1}: ${choice.description}\n`;
  });
  consoleElement.value += "Press the corresponding number to choose.\n";

  // Re-enable console input here
  consoleElement.disabled = false;

  listenForChoiceSelection();
}

function listenForChoiceSelection() {
  consoleElement.addEventListener("keydown", handleChoiceSelection, {
    once: true,
  });
}

function handleChoiceSelection(e) {
  const choiceKey = e.key;
  const choiceIndex = parseInt(choiceKey, 10) - 1;
  const selectedChoice = gameData.currentEvent.choices[choiceIndex];

  if (selectedChoice) {
    handleEventOutcome(selectedChoice);
  } else {
    consoleElement.value += "\nInvalid choice. Please try again.\n";
    listenForChoiceSelection();
  }
}

function handleEventOutcome(choice) {
  // Execute the action associated with the chosen option
  const actionOutcome = choice.action();

  // Display the result of the action
  consoleElement.value += `\n${actionOutcome}\n`;

  // Reset event flags and handlers
  gameData.isEventInProgress = false;
  gameData.isAsyncCommandRunning = false;
  gameData.currentEvent = null;

  // Append the next command prompt
  appendPrompt();
  saveGameData();
}

function appendPrompt() {
  const prompt = gameData.currentDirectory
    ? `\nTexordia\\${gameData.currentDirectory}> `
    : "Texordia> ";
  consoleElement.value += prompt;
  consoleElement.disabled = false;
  consoleElement.focus();
  consoleElement.setSelectionRange(
    consoleElement.value.length,
    consoleElement.value.length
  );
  consoleElement.scrollTop = consoleElement.scrollHeight;
}
