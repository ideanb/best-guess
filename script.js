let features;
let classifier;
let loadingModel;
let resultContainer = document.querySelector('.result-text');
let resultPrefixContainer = document.querySelector('.result-prefix');
let imageContainer = document.querySelector('.previewInnerBox');

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
    resultContainer.textContent = "Loading..."
  } else {
    resultContainer.textContent = "Model Ready!!!"
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
  await addNewClass('Santiago', 'butterfly', 32, 'images/butterfly/');
  await addNewClass('Pedro Null', 'shampoo', 51, 'images/shampoo/');

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
    resultPrefixContainer.textContent = `I'm sure it's a`;
    resultContainer.textContent = result.toUpperCase();
  })
}

const displayImage = async () => {
  try {
    const url = document.querySelector('#classifyUrl').value;
    const img = await loadImage(url);
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);
    await classify();
  } catch (error) {
    resultContainer.textContent = `Image protected by CORS or doesn't exists, please use another one`;
  }
}