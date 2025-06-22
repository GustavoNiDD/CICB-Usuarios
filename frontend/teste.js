fetch('https://pessoas-api-c5ef63b1acc3.herokuapp.com/api/users/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0YTEwZGVjZTk4MzY2ZDZmNjNlMTY3Mjg2YWU5YjYxMWQyYmFhMjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2ljYi0zNWMwMCIsImF1ZCI6ImNpY2ItMzVjMDAiLCJhdXRoX3RpbWUiOjE3NTAwNDQ4MzAsInVzZXJfaWQiOiJwcXZiM1Nvdm1lYUk3YTcyd3Budklxc0pnNjIyIiwic3ViIjoicHF2aTNTb3ZtZWFJN2E3MndwbnZJcXNKZzYyMiIsImlhdCI6MTc1MDA0NDgzMCwiZXhwIjoxNzUwMDQ4NDMwLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhZG1pbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.cvEJHjQZLe2wUV7Th4vBmqdciRkIcr3vm6_KDAC6_cKAPB6UPzXd12Ug2doUJKiAeoFTVKC9hE78UtoWZJ78Z0s2VrPPh-Ea6Uv8wFcKKqBtVZ-A1l6_8Os6W7Sd0lR-laoR_uImUXOkNqbpy0I1kA9n3FbYh4ZKhGB_mezAKyoSrcmwEVOM54t0Tx10nUOBIq3LeOXtDzyoLMb_uO6KrKJ0l91oqBfjKElJSJNYhGsPfNkMzv-WJG5ODJS9yNfY8l1USdpuyLeHMQkokR8Q0PIL3Ae2uU2RuIXdTXIYFpZCysrfmJWo8z-GisOxJETnMWsOJPguMkZs24hF_QUj8Q'
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }) 
  .then(data => {
    console.log(data);
  })  
  .catch(error => {
    console.error('Fetch error:', error);
  });
