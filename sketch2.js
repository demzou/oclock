
let cnv;

let xOff = [];
let yOff = [];
const space = 25;
let numLines, numWaves;
let amplitude;
let backgroundColor, lineColor;
let prevSec;

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  //  createCanvas(windowWidth, windowHeight);
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  //frameRate(60);

  // Array to manage the movement of each bump on each line
  // Lines depend on the hours (24+1)
  // Bumps depend on the minutes but need 3 more points to see something when at 0

  for (let i = 0; i < 25; i++) {        // Initiate the array with some values
    xOff[i] = [];  
    yOff[i] = [];                     // create nested array
    for (let j = 0; j < 63; j++) {
      xOff[i][j] = random(500);
      yOff[i][j] = random(500);
    }
  }
  background(255);

}

function draw() {

  //Update values
  numWaves = minute() + 3;
  numLines = hour();
  amplitude = minute()/5 + 0.5;
  
  //Print real time
  if (second() != prevSec) {
    print("The time is now: \n");
    print(hour() + ":" + minute() + ":" + second() + "\n");
    prevSec = second();
  }

  // Day and night mode
  if (numLines >= 7 && numLines < 21) {
    backgroundColor = 255;
    lineColor = 0;
  } else {
    backgroundColor = 0;
    lineColor = 150;
  }

  // Draw a semi-transparent background to leave a trail
  fill(backgroundColor, 140);
  noStroke();
  rect(0, 0, width, height);

  // Draw lines
  noFill();
  //strokeWeight(1);
  stroke(lineColor);

  translate(0, height / 2 - numLines * space / 2 + space / 2);    // Centre block of lines


  for (let l = 0; l < numLines; l++) {          // Loop to draw all the lines (/hour)
    beginShape();
    curveVertex(0, l * space);
    for (let w = 1; w < numWaves; w++) {        // Loop to draw all the vertices (/minute)
      let amt = map(noise(xOff[l][w],yOff[l][w]), 0, 1, -3, 3);
      curveVertex(w * width / numWaves, l * space + amt * amplitude);
    }
    curveVertex(width, l * space);
    endShape();
  }


  // Special mode at midnight otherwise there are no lines drawn on the screen
  if (numLines == 0) {
    fill(lineColor);
    noStroke();
    for (let w = 3; w < numWaves; w++) {
      let amt = map(noise(xOff[0][w],yOff[0][w]), 0, 1, -3, 3);
      ellipse(w * width / numWaves - width / numWaves, 0 + amt * amplitude, 3, 3);
    }
  }

      // Update the amtY to generate movement of the bumps on the lines
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 63; j++) {
          xOff[i][j] += 0.08;
          xOff[i][j] += 0.01;
        }
      }

  // Draw seconds
  stroke(255, 0, 0);
  strokeWeight(1);
  line(second() * width / 60, -20, second() * width / 60, space * (numLines - 1) + 20);

}

function windowResized() {
  centerCanvas();
}

