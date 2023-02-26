const video = document.getElementById('webcam')
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)
const label = document.getElementById("label")
let classifier

const iphonebtn = document.querySelector("#iphone")
const headphonebtn = document.querySelector("#headphone")
const trainbtn = document.querySelector("#train")
const savebtn = document.querySelector("#save")

iphonebtn.addEventListener("click", () => addIphone())
headphonebtn.addEventListener("click", () => addHeadphone())
trainbtn.addEventListener("click", () => train())
savebtn.addEventListener("click", () => saveElectronics())

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

function modelLoaded(){
    console.log("The mobileNet model is loaded!")
    classifier = featureExtractor.classification(video, videoReady)
    classifier.load('./model.json', customModelLoaded)
}

function customModelLoaded(){
    console.log('custom model added')
    startClassifying();
}
function videoReady(){
    console.log(classifier)
}

function addIphone(){
    classifier.addImage(video, "Iphone", addedImage)
}



function addHeadphone() {
    classifier.addImage(video, "Headphone", addedImage)
}


function train(){
    console.log("start training...")
    classifier.train((lossValue) => {
        console.log(lossValue)
        if(lossValue == null){
            startClassifying()
        }
    })
}

function saveElectronics(){
    classifier.save();
}

function startClassifying(){
    setInterval(()=>{
        classifier.classify(video, (err, result)=>{
            if(err) console.log(err)
            console.log(result)
            label.innerHTML = result[0].label
        })
    }, 1000)
}

function addedImage(){
    console.log("added image to network")
}