fetch("https://pessoas-api-c5ef63b1acc3.herokuapp.com/api/users/me", {
  "headers": {
    "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0YTEwZGVjZTk4MzY2ZDZmNjNlMTY3Mjg2YWU5YjYxMWQyYmFhMjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2ljYi0zNWMwMCIsImF1ZCI6ImNpY2ItMzVjMDAiLCJhdXRoX3RpbWUiOjE3NTAwNDQ4MzAsInVzZXJfaWQiOiJwcXZiM1Nvdm1lYUk3YTcyd3Budklxc0pnNjIyIiwic3ViIjoicHF2aTNTb3ZtZWFJN2E3MndwbnZJcXNKZzYyMiIsImlhdCI6MTc1MDA0NDgzMCwiZXhwIjoxNzUwMDQ4NDMwLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhZG1pbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.cvEJHjQZLe2wUV7Th4vBmqdciRkIcr3vm6_KDAC6_cKAPB6UPzXd12Ug2doUJKiAeoFTVKC9hE78UtoWZJ78Z0s2VrPPh-Ea6Uv8wFcKKqBtVZ-A1l6_8Os6W7Sd0lR-laoR_uImUXOkNqbpy0I1kA9n3FbYh4ZKhGB_mezAKyoSrcmwEVOM54t0Tx10nUOBIq3LeOXtDzyoLMb_uO6KrKJ0l91oqBfjKElJSJNYhGsPfNkMzv-WJG5ODJS9yNfY8l1USdpuyLeHMQkokR8Q0PIL3Ae2uU2RuIXdTXIYFpZCysrfmJWo8z-GisOxJETnMWsOJPguMkZs24hF_QUj8Q",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
  },
  "referrer": "http://localhost:8081/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "credentials": "include"
})
.then(response => {
    // Verifique se a resposta foi bem-sucedida (status 2xx)
    if (!response.ok) {
        // Se a resposta não for OK, lança um erro para o bloco .catch
        throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    return response.json(); // Ou .text() se a resposta não for JSON
})
.then(data => {
    console.log("Dados recebidos:", data);
})
.catch(error => {
    console.error("Erro na requisição fetch:", error);
    // Aqui você pode adicionar lógica para tratar o erro CORS no frontend,
    // embora a solução principal seja no backend.
});