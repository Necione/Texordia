import { events } from "../data/events.js";
import { gameData } from "../gameData.js";
import { consoleElement, saveGameData } from "../utilities.js";

export function triggerRandomEvent() {
  // Filter out events that meet the trigger requirements
  const validEvents = events.filter((event) =>
    eventTriggerRequirementsMet(event)
  );

  if (validEvents.length > 0) {
    // Select a random event from the valid events
    const randomEventIndex = Math.floor(Math.random() * validEvents.length);
    const selectedEvent = validEvents[randomEventIndex];
    initiateEvent(selectedEvent);
  } else {
    // No valid events available
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
        updateScroll(); // Update scroll position after each letter
        setTimeout(displayNextLetter, 50);
      } else {
        consoleElement.value += ".\n";
        updateScroll(); // Update scroll position after each sentence
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

  const updateScroll = () => {
    consoleElement.scrollTop = consoleElement.scrollHeight;
  };

  displayNextSentence();
}

function presentChoices(choices) {
  consoleElement.value += "\n";
  choices.forEach((choice, index) => {
    consoleElement.value += `${index + 1}: ${choice.description}\n`;
  });
  consoleElement.value += "\nPress the corresponding number to choose.\n";

  // Re-enable console input here
  consoleElement.disabled = false;
  consoleElement.focus();

  listenForChoiceSelection();
}

function listenForChoiceSelection() {
  consoleElement.addEventListener("keydown", handleChoiceSelection, {
    once: true,
  });
}

function handleChoiceSelection(e) {
  // Prevent default behavior to avoid typing the number in the console
  e.preventDefault();

  const choiceKey = e.key;
  const choiceIndex = parseInt(choiceKey, 10) - 1;

  // Ensure that the pressed key is a valid choice number
  if (
    !isNaN(choiceIndex) &&
    choiceIndex >= 0 &&
    choiceIndex < gameData.currentEvent.choices.length
  ) {
    const selectedChoice = gameData.currentEvent.choices[choiceIndex];
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
