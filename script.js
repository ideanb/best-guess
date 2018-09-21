let features;
let classifier;
let loadingModel;
let resultContainer = document.querySelector('.result');

features = ml5.featureExtractor('MobileNet', modelReady);

const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.width = 224;
    img.height = 224;
    img.onload = function() {
      console.log(`Added: ${url}`)
      resolve(this);
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

const loadImagesClasses = async (type, amount) => {
  const imgs = [];
  for (let i = 1; i <= amount; i++) {
    const img = await loadImage(`images/${type}${i}.jpg`);
    imgs.push(img);
  }
  return imgs;
}

async function modelReady() {
  console.log("model ready");
  loadingModel = true;
  loadingModelState();

  classifier = features.classification();
  const dexterImgs = await loadImagesClasses('dexter', 3);
  for (const dexter of dexterImgs) {
    classifier.addImage(dexter, "dexter");
  }

  const deedeeImgs = await loadImagesClasses('dee', 4);
  for (const deedee of deedeeImgs) {
    classifier.addImage(deedee, "dee dee");
  }

  const cerebroImgs = await loadImagesClasses('cerebro', 3);
  for (const cerebro of cerebroImgs) {
    classifier.addImage(cerebro, "cerebro");
  }

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