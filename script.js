let features;
let classifier;
let loadingModel;
let resultContainer = document.querySelector('.result');
let imageContainer = document.querySelector('.imageContainer');

features = ml5.featureExtractor('MobileNet', modelReady);

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.width = 224;
    img.height = 224;
    img.onload = function () {
      console.log(`Added: ${url}`)
      resolve(this);
    }
    img.onerror = function (err) {
      reject(err)
    }
  })
}

const loadingModelState = () => {
  if (loadingModel) {
    resultContainer.textContent = "Loading model.."
    document.querySelector('.classifyBtn').setAttribute('disabled', 'disabled');
  } else {
    resultContainer.textContent = "Model Ready!!!"
    document.querySelector('.classifyBtn').removeAttribute('disabled');
  }
}

const addNewClass = async (imageClass, imageName, numberOfImages, path = "images/") => {
  const imgs = [];
  for (let i = 1; i <= numberOfImages; i++) {
    const img = await loadImage(`${path}${imageName}${i}.jpg`);
    imgs.push(img);
  }

  for (const img of imgs) {
    classifier.addImage(img, imageClass);
  }
}

async function modelReady() {
  console.log("model ready");
  loadingModel = true;
  loadingModelState();

  classifier = features.classification();
  await addNewClass('dexter', 'dexter', 3);
  await addNewClass('dee dee', 'dee', 4);
  await addNewClass('cerebro', 'cerebro', 3);
  await addNewClass('santiago', 'butterfly', 32, 'images/butterfly/');
  await addNewClass('Pedro Sierra', 'shampoo', 32, 'images/shampoo/');

  await train();

  loadingModel = false;
  loadingModelState()
}

function train() {
  return new Promise((resolve) => {
    classifier.train(function (loose) {
      console.log(loose)
      if (loose === null) {
        resolve();
      }
    });
  })
}

async function classify() {
  const url = document.querySelector('#classifyUrl').value;
  const testImg = await loadImage(url);
  classifier.classify(testImg, function (result, err) {
    if (err) {
      console.log(err);
    }
    console.log(result);
    resultContainer.textContent = `Result: ${result.toUpperCase()}`;
  })
}

const displayImage = async () => {
  try {
    const url = document.querySelector('#classifyUrl').value;
    const img = await loadImage(url);
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);
  } catch (error) {
    resultContainer.textContent = `Image protected by CORS or doesn't exists, please use another one`;
  }
}