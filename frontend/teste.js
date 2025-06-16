fetch('http://localhost:8080/api/users/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0YTEwZGVjZTk4MzY2ZDZmNjNlMTY3Mjg2YWU5YjYxMWQyYmFhMjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2ljYi0zNWMwMCIsImF1ZCI6ImNpY2ItMzVjMDAiLCJhdXRoX3RpbWUiOjE3NTAwMjYxNDksInVzZXJfaWQiOiJwcXZpM1Nvdm1lYUk3YTcyd3Budklxc0pnNjIyIiwic3ViIjoicHF2aTNTb3ZtZWFJN2E3MndwbnZJcXNKZzYyMiIsImlhdCI6MTc1MDAyNjE0OSwiZXhwIjoxNzUwMDI5NzQ5LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhZG1pbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.OqzPTdOKemgSfrkeZtBGJfw_WvxPh24nxxoreUiVauv8m00bI0HY0ap57RGuelC1FAcay2_6HYG9Ph39c25QDr-2hUWZA5vohOWYln4PkAlt_Pa1gbTu6UTdKKpcxe45Di6NNo1PA9V3K-ZEo_ZUl5n-PYGd6itj35O_FyTW0yzNiFBNpyNxJYk_d-YXdTa8ywgCsW-tgWta2J320n-97kDqK9fG3SJHlLIyXjTrfFoRQiGIwRnyg406XfL0NnIfmBedHXI9oBnMHpH1X8FW1jMlBW6rVZ7cke9fHr_OIMWRKw0h97tY77bFZcKvM6SBeGYxKXf-TaqsIUL100z7_g'
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
