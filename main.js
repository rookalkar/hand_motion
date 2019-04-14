const videoWidth = 600;
const videoHeight = 500;
let net;

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

// load camera
async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = videoWidth;
  video.height = videoHeight;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}

function detectPoseInRealTime(video, net) {
  // const canvas = document.getElementById('output');
  // const ctx = canvas.getContext('2d');

  // Flip the webcam image to get it right
  const flipHorizontal = true;

  // canvas.width = videoWidth;
  // canvas.height = videoHeight;

  async function detect() {

    // Load posenet
    net = await posenet.load(0.5);

    // Scale the image. The smaller the faster
    const imageScaleFactor = 0.75;

    // Stride, the larger, the smaller the output, the faster
    const outputStride = 32;

    // Store all the poses
    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;

    const pose = await net.estimateSinglePose(video,
                                              imageScaleFactor,
                                              flipHorizontal,
                                              outputStride);
    poses.push(pose);

    // Show a pose (i.e. a person) only if probability more than 0.1
    minPoseConfidence = 0.1;
    // Show a body part only if probability more than 0.3
    minPartConfidence = 0.3;

    // ctx.clearRect(0, 0, videoWidth, videoHeight);
    //
    // const showVideo = true;
    //
    // if (showVideo) {
    //   ctx.save();
    //   ctx.scale(-1, 1);
    //   ctx.translate(-videoWidth, 0);
    //   // ctx.filter = 'blur(5px)';
    //   ctx.filter = 'opacity(50%) blur(3px) grayscale(100%)';
    //   ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    //   ctx.restore();
    // }

    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        keypoints.forEach((d,i)=>{
          if(d.part == 'rightWrist') {
            createRandomCircle(d.position.x, d.position.y);
          }
        })
      }
    });

    requestAnimationFrame(detect);
  }

  detect();

}

var color_selected = 0;

function createRandomCircle(x, y) {

    (color_selected == 5) ? color_selected = 0: color_selected = color_selected + 1;

    // shadow has 100px top offset, so compensate with -100px top
    y = y -100;

    var colours = ['#eeaf61', '#fb9062', '#ee5d6c', '#ce4993', '#ce4993', '#ee5d6c', '#fb9062']

    // random color
    // var colorR = Math.ceil(Math.random() * 255);
    // var colorG = Math.ceil(Math.random() * 255);
    // var colorB = Math.ceil(Math.random() * 255);
    // var color = 'rgb('+colorR+','+colorG+','+colorB+')';

    var color = colours[color_selected];



    // random size
    // var size = Math.ceil(Math.random() * 80);
    var size = 80;

    // create the circle
    var circle = $('<span />')
        .addClass('circle')
        .css('left', x+"px")
        .css('top', y+"px")
        .css('width', size+"px")
        .css('height', size+"px")
        .css('color', color)
        .css('box-shadow', '0px 100px 40px')
        .css('border-radius', '80px');

    circle.appendTo('body');

    // animate the circle (shrink and fade out)
    circle.animate({opacity: 0, width: '10px', height: '10px'}, 3000, function() {
        // remove it when animation is finished
        $(this).remove();
    });
}

function changeShape(e) {
  $('svg').empty()
  var shape;
  switch (e.target.value) {
    case 'circle':
      shape = document.createElementNS("http://www.w3.org/2000/svg","circle"); //to create a circle. for rectangle use "rectangle"
      shape.setAttributeNS(null,"class","shape");
      shape.setAttributeNS(null,"cx",400);
      shape.setAttributeNS(null,"cy",250);
      shape.setAttributeNS(null,"r",200);
      break;
    case 'rectangle':
      shape = document.createElementNS("http://www.w3.org/2000/svg","rect"); //to create a circle. for rectangle use "rectangle"
      shape.setAttributeNS(null,"class","shape");
      shape.setAttributeNS(null,"x",100);
      shape.setAttributeNS(null,"y",100);
      shape.setAttributeNS(null,"width",600);
      shape.setAttributeNS(null,"height",350);
      break;
    case 'horizontal_line':
      shape = document.createElementNS("http://www.w3.org/2000/svg","line"); //to create a circle. for rectangle use "rectangle"
      shape.setAttributeNS(null,"class","shape");
      shape.setAttributeNS(null,"x1",100);
      shape.setAttributeNS(null,"y1",200);
      shape.setAttributeNS(null,"x2",700);
      shape.setAttributeNS(null,"y2",200);
      break;
    case 'vertical_line':
      shape = document.createElementNS("http://www.w3.org/2000/svg","line"); //to create a circle. for rectangle use "rectangle"
      shape.setAttributeNS(null,"class","shape");
      shape.setAttributeNS(null,"x1",400);
      shape.setAttributeNS(null,"y1",100);
      shape.setAttributeNS(null,"x2",400);
      shape.setAttributeNS(null,"y2",500);
      break;
  }
  $('svg').append(shape)
}

async function main() {
  // Load posenet
  const net = await posenet.load(0.75);

  document.getElementById('main').style.display = 'block';
  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }

  detectPoseInRealTime(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


main();
