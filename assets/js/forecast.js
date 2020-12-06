// import * as tf from '@tensorflow/tfjs';

async function run(){
    
    const model = await tf.loadLayersModel('../assets/Models/model.json');

    // document.getElementById('output').innerText =
    console.log("fsfsd")
    console.log(model);
    model.predict().dataSync();
}
run();
