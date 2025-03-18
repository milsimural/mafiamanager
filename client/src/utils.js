// Функция для форматирования чисел пробелами
export function formatNumberWithSpaces(input) {
    // Проверяем, является ли входное значение числом
    if (typeof input !== 'number' || isNaN(input)) {
        console.log('Принято не число')
      return input; // Возвращаем значение без изменений
    }
  
    // Преобразуем число в строку
    let numStr = input.toString();
  
    // Разделяем строку на части по 3 символа с конца
    let parts = [];
    for (let i = numStr.length; i > 0; i -= 3) {
      parts.unshift(numStr.slice(Math.max(0, i - 3), i));
    }
  
    // Объединяем части с пробелами
    return parts.join(' ');
  }