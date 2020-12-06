document.querySelector('.searchTest').addEventListener('click', search);

function search(e) {
  e.preventDefault();
  document.querySelector('.test').removeChild(document.querySelector('.test').children[0]);
  const searchValue = document.querySelector('.search').value;
  document.querySelector('.test').innerHTML = `
  <blockquote class="embedly-card">
    <h4><a href=" ">College News </a ></h4>
    <p class="text-justify">Latest College Epidemic News</p >
  </blockquote>
`
}