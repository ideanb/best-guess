let features;
let classifier;

features = ml5.featureExtractor('MobileNet', modelReady);

function modelReady() {
  console.log("model ready");

  classifier = features.classification();
  const dexterImgs = document.querySelectorAll('.dexter')
  for (const dexter of dexterImgs) {
    classifier.addImage(dexter, "dexter", imageAdded);
  }

  const deedeeImgs = document.querySelectorAll('.deedee');
  for (const deedee of deedeeImgs) {
    classifier.addImage(deedee, "dee dee", imageAdded);
  }

  const cerebroImgs = document.querySelectorAll('.cerebro');
  for (const cerebro of cerebroImgs) {
    classifier.addImage(cerebro, "cerebro", imageAdded);
  }
}

function imageAdded() {
  console.log("added");
}

function train() {
  console.log("train");
  classifier.train(function (lease) { console.log(lease) });
}

function classify() {
  const test = new Image()
  test.src = 'images/dexter1.jpg';
  test.onload = function () {
    classifier.classify(this, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result)
    })
  }
}