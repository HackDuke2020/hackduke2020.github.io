<script>
  let init = 321000;

  setInterval(() => {
    let a = Math.round(Math.random() * 5);
    let b = (init + a).toString();
    init = init + a;
    document.querySelector('#toplinecases').innerText = b;
  }, 10000);

  document.querySelector('.searchTest').addEventListener('click', search);

  function search(e) {
    e.preventDefault();
    document.querySelector('.test').removeChild(document.querySelector('.test').children[0]);
    const searchValue = document.querySelector('.search').value;
    document.querySelector('.test').innerHTML = `
    <blockquote class="embedly-card">
      <h4><a href=" ">College News </a ></h4>
      <p>Latest College Epidemic News</p >
    </blockquote>
  `
  }
</script>