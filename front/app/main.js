import './styles/index.scss';

const submitBtn = document.getElementById('submit');
const inputurl = document.getElementById('url-input');
const outputURL = document.getElementById('output-url');
const statisticInput = document.getElementById('statistic-input');
const statisticBtn = document.getElementById('statisticBtn');
const statisticOutput = document.getElementById('statistic-output');
const outputContiner = document.getElementById('output-continer');
const copyUrl = document.getElementById('copyUrl');

// copy url
copyUrl.addEventListener('click', () => {
  copyUrl.textContent = 'Copied!';
  const copyText = outputURL.textContent; // text
  navigator.clipboard.writeText(copyText);
  setTimeout(() => {
    copyUrl.innerHTML = 'Copy';
  }, 1000);
});

submitBtn.addEventListener('click', postUrl);
statisticBtn.addEventListener('click', getStatistic);

async function postUrl() {
  try {
    const response = await axios.post(
      'https://shortyllink.herokuapp.com/api/shorturl/new',
      {
        longURL: inputurl.value,
      }
    );
    outputURL.textContent = response.data;
    outputURL.setAttribute('href', response.data);
    outputContiner.style.visibility = 'visible';
    inputurl.value = '';
  } catch (error) {
    alartError('Invalid URL');
    inputurl.value = '';
  }
}

async function getStatistic() {
  try {
    const url = statisticInput.value;
    let urlArr = url.split('/');
    let urlCode = urlArr[urlArr.length - 1];
    const response = await axios.get(
      `https://shortyllink.herokuapp.com/api/statistic/${urlCode}`
    );
    statisticOutput.innerHTML = `
    <i id="trash" class="far fa-trash-alt"></i><br><br>
    Creation Date:  <span id="creationDate">${response.data['creationDate']}</span> <br><br>
    Redirect Count:  <span id="redirectCount">${response.data['redirectCount']}</span> <br><br>
    Original Url:  <span id="originalUrl">${response.data['originalUrl']}</span> <br><br>
    Shorturl Id:  <span id="shorturl-id">${response.data['shorturl-id']}</span> <br><br>
    `;
    statisticOutput.style.display = 'block';
    document.getElementById('trash').addEventListener('click', () => {
      statisticOutput.style.display = 'none';
      statisticInput.value = '';
    });
  } catch (error) {
    alartError('No such URL was found in the system');
  }
}

// error handling
function alartError(str) {
  let alart = `
  <div class="alert alert-danger" role="alert" id="danger">
  ${str}
  </div>`;
  let div = document.createElement('div');
  div.innerHTML = alart;
  document.body.insertBefore(div, document.querySelector('div'));
  setTimeout(() => {
    document.getElementById('danger').remove();
  }, 2000);
}
