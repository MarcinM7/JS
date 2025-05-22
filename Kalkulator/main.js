 // Zmienna przechowująca aktualny stan wyświetlacza
 let displayValue = '';
        
 // Flaga sprawdzająca czy ostatnia operacja była obliczeniem
 let lastOperationWasCalculation = false;

 /**
  * FUNKCJA: appendToDisplay
  * OPIS: Dodaje wartość (liczbę lub operator) do wyświetlacza
  * PARAMETR: value - wartość do dodania
  */
 function appendToDisplay(value) {
     const display = document.getElementById('display');
     
     // Jeśli ostatnia operacja była obliczeniem i dodajemy liczbę
     if (lastOperationWasCalculation && !isOperator(value)) {
         // Rozpocznij nowe obliczenie
         displayValue = '';
         lastOperationWasCalculation = false;
     }
     
     // WALIDACJA PRZECINKA - sprawdź czy dodajemy przecinek
     if (value === '.') {
         // Jeśli wyświetlacz jest pusty lub ostatni znak to operator
         if (displayValue === '' || isOperator(displayValue.slice(-1))) {
             // Dodaj "0." zamiast samego przecinka
             displayValue += '0.';
             display.value = displayValue;
             lastOperationWasCalculation = false;
             return; // Zakończ funkcję
         }
         
         // Sprawdź czy w aktualnej liczbie już jest przecinek
         // Znajdź ostatni operator w wyrażeniu
         let lastOperatorIndex = -1;
         for (let i = displayValue.length - 1; i >= 0; i--) {
             if (isOperator(displayValue[i])) {
                 lastOperatorIndex = i;
                 break;
             }
         }
         
         // Pobierz aktualną liczbę (część po ostatnim operatorze)
         let currentNumber = displayValue.substring(lastOperatorIndex + 1);
         
         // Jeśli aktualna liczba już zawiera przecinek, nie dodawaj kolejnego
         if (currentNumber.includes('.')) {
             return; // Nie dodawaj przecinka i zakończ funkcję
         }
     }
     
     // Sprawdź czy nie dodajemy dwóch operatorów pod rząd
     if (isOperator(value) && isOperator(displayValue.slice(-1))) {
         // Zamień ostatni operator na nowy
         displayValue = displayValue.slice(0, -1) + value;
     } else {
         // Dodaj wartość do wyświetlacza
         displayValue += value;
     }
     
     // Aktualizuj wyświetlacz
     display.value = displayValue;
     lastOperationWasCalculation = false;
 }

 /**
  * FUNKCJA: isOperator
  * OPIS: Sprawdza czy podany znak jest operatorem matematycznym
  * PARAMETR: char - znak do sprawdzenia
  * ZWRACA: true jeśli to operator, false w przeciwnym razie
  */
 function isOperator(char) {
     return ['+', '-', '*', '/'].includes(char);
 }

 /**
  * FUNKCJA: calculateResult
  * OPIS: Oblicza wynik wyrażenia matematycznego
  */
 function calculateResult() {
     const display = document.getElementById('display');
     
     try {
         // Sprawdź czy wyrażenie nie jest puste
         if (displayValue === '') {
             display.value = '0';
             return;
         }
         
         // Zastąp × na * dla obliczenia (× jest bardziej czytelne wizualnie)
         let expression = displayValue.replace(/×/g, '*');
         
         // Sprawdź czy wyrażenie kończy się operatorem
         if (isOperator(expression.slice(-1))) {
             // Usuń ostatni operator
             expression = expression.slice(0, -1);
         }
         
         // Oblicz wynik używając eval() - UWAGA: w prawdziwych aplikacjach
         // lepiej użyć bezpieczniejszych metod parsowania wyrażeń
         let result = eval(expression);
         
         // Sprawdź czy wynik jest liczbą
         if (isNaN(result) || !isFinite(result)) {
             throw new Error('Nieprawidłowe obliczenie');
         }
         
         // Zaokrąglij wynik do 10 miejsc dziesiętnych aby uniknąć błędów floating point
         result = Math.round(result * 10000000000) / 10000000000;
         
         // Aktualizuj wyświetlacz i stan
         displayValue = result.toString();
         display.value = displayValue;
         lastOperationWasCalculation = true;
         
     } catch (error) {
         // W przypadku błędu wyświetl komunikat
         display.value = 'Błąd';
         displayValue = '';
         console.error('Błąd obliczenia:', error);
     }
 }

 /**
  * FUNKCJA: clearDisplay
  * OPIS: Czyści wyświetlacz i resetuje stan kalkulatora
  */
 function clearDisplay() {
     displayValue = '';
     document.getElementById('display').value = '0';
     lastOperationWasCalculation = false;
 }

 /**
  * FUNKCJA: calculatePercentage
  * OPIS: Oblicza procent z aktualnej wartości na wyświetlaczu
  * PRZYKŁAD: 50% = 0.5, 25% = 0.25
  */
 function calculatePercentage() {
     const display = document.getElementById('display');
     
     try {
         // Jeśli wyświetlacz jest pusty, nic nie rób
         if (displayValue === '' || displayValue === '0') {
             return;
         }
         
         // Znajdź ostatni operator w wyrażeniu
         let lastOperatorIndex = -1;
         let lastOperator = '';
         
         for (let i = displayValue.length - 1; i >= 0; i--) {
             if (isOperator(displayValue[i])) {
                 lastOperatorIndex = i;
                 lastOperator = displayValue[i];
                 break;
             }
         }
         
         // Jeśli nie ma operatora, oblicz procent z całej wartości
         if (lastOperatorIndex === -1) {
             let value = parseFloat(displayValue);
             if (!isNaN(value)) {
                 let result = value / 100;
                 displayValue = result.toString();
                 display.value = displayValue;
                 lastOperationWasCalculation = true;
             }
         } else {
             // Jeśli jest operator, oblicz procent tylko z ostatniej liczby
             let beforeOperator = displayValue.substring(0, lastOperatorIndex);
             let afterOperator = displayValue.substring(lastOperatorIndex + 1);
             
             if (afterOperator !== '') {
                 let baseValue = parseFloat(beforeOperator);
                 let percentValue = parseFloat(afterOperator);
                 
                 if (!isNaN(baseValue) && !isNaN(percentValue)) {
                     // Oblicz procent w kontekście operacji
                     // Przykład: 200 + 10% = 200 + (200 * 10/100) = 200 + 20 = 220
                     // Przykład: 200 - 15% = 200 - (200 * 15/100) = 200 - 30 = 170
                     let percentResult;
                     
                     if (lastOperator === '+' || lastOperator === '-') {
                         // Dla + i -, procent jest od pierwszej liczby
                         percentResult = baseValue * (percentValue / 100);
                     } else {
                         // Dla * i /, po prostu zamień na procent
                         percentResult = percentValue / 100;
                     }
                     
                     displayValue = beforeOperator + lastOperator + percentResult.toString();
                     display.value = displayValue;
                 }
             }
         }
         
     } catch (error) {
         console.error('Błąd obliczania procentu:', error);
         display.value = 'Błąd';
         displayValue = '';
     }
 }

 function deleteLastChar() {
     const display = document.getElementById('display');
     
     // Jeśli ostatnia operacja była obliczeniem, wyczyść całkowicie
     if (lastOperationWasCalculation) {
         clearDisplay();
         return;
     }
     
     // Usuń ostatni znak
     displayValue = displayValue.slice(0, -1);
     
     // Jeśli nie ma żadnych znaków, wyświetl 0
     if (displayValue === '') {
         display.value = '0';
     } else {
         display.value = displayValue;
     }
 }

 /**
  * OBSŁUGA KLAWIATURY
  * Pozwala używać kalkulatora za pomocą klawiatury
  */
 document.addEventListener('keydown', function(event) {
     const key = event.key;
     
     // Liczby i kropka dziesiętna (przecinek też traktujemy jako kropkę)
     if (/[0-9]/.test(key)) {
         appendToDisplay(key);
     }
     // Obsługa kropki i przecinka z klawiatury
     else if (key === '.' || key === ',') {
         appendToDisplay('.');
     }
     // Operatory
     else if (['+', '-', '*', '/'].includes(key)) {
         appendToDisplay(key);
     }
     // Enter lub = dla obliczenia
     else if (key === 'Enter' || key === '=') {
         event.preventDefault(); // Zapobiega domyślnej akcji
         calculateResult();
     }
     // Escape lub c dla wyczyszczenia
     else if (key === 'Escape' || key.toLowerCase() === 'c') {
         clearDisplay();
     }
     // Backspace dla usunięcia ostatniego znaku
     else if (key === 'Backspace') {
         event.preventDefault();
         deleteLastChar();
     }
 });

 // Ustaw domyślną wartość przy załadowaniu strony
 document.addEventListener('DOMContentLoaded', function() {
     document.getElementById('display').value = '0';
 });