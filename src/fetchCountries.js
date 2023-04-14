//Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту. Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.

export default function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const params = `fields=name,capital,population,flags,languages`;
  return fetch(`${BASE_URL}${name}?${params}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
