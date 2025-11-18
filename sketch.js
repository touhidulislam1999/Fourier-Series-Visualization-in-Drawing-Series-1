let time = 0;            // keeps track of animation time for rotation of epicycles
let wave = []            // stores the wave points generated from the epicycles

let slider;              // slider that controls number of Fourier terms
let waveTypeSelect;      // dropdown to choose waveform type
let nInput;              // 🔹 input box to manually set number of terms

function setup() {
    createCanvas(1900, 700);           // create canvas of given size

    slider = createSlider(1, 1000, 1); // slider(min, max, starting value)
    slider.position(420, 100);         // position of the slider on screen
    // 🔹 Increase slider size
    slider.style("width", "1200px");    // sets slider length in pixels

    // 🔹 Input box for manual 'n' (number of terms)
    nInput = createInput('1');         // default 1
    nInput.position(990, 60);          // position above the slider (adjust if you want)
    nInput.size(40);
    nInput.style("text-align", "center");


    // 🔹 Sync: when slider changes, update input box
    slider.input(() => {
        nInput.value(slider.value());
    });

    // 🔹 Sync: when input changes, update slider
    nInput.input(() => {
        let v = parseInt(nInput.value());
        if (isNaN(v)) return;          // ignore non-numeric input
        v = constrain(v, 1, 1000);     // keep it in [1,1000]
        slider.value(v);
    });


    // Dropdown (choice list) for waveform type
    waveTypeSelect = createSelect();
    waveTypeSelect.position(600, 160); // position above the slider
    waveTypeSelect.option('Square');
    waveTypeSelect.option('Sawtooth');
    waveTypeSelect.option('Triangle');
    waveTypeSelect.selected('Square'); // default
    waveTypeSelect.style('font-size', '20px');
}

function draw() {
    background(0);                      // clear screen every frame (black background)

    
    // ==============================
    // 🔹 NEW: Show slider value & n
    // ==============================

    fill(255);                          // white text
    noStroke();                         // no outline for text
    textSize(20);                       // text size
    text("Number of Terms: " + slider.value(), 930, 150); // display the current number of Fourier terms
    text("Select Wavetype - ", 430, 180);  // display label for waveform type dropdown
    text("Enter Terms Manually ", 920, 50);
                                        

    // let currentN = (slider.value() - 1) * 2 + 1;  // largest n (odd number)
    // text("Largest n: " + currentN, 50, 70);       // show the largest odd n
    // ==============================
    // 🔹 END OF NEW PART
    // ==============================

    translate(200, 450);                // move origin to bottom-left for epicycles
    

    let x = 0;                          // x position of current endpoint of epicycle
    let y = 0;                          // y position of current endpoint of epicycle

    let type = waveTypeSelect.value();  // current waveform choice

    // loop through Fourier series terms based on slider value
    for (let i = 0; i < slider.value(); i++) {

        let prevx = x;                  // store previous x position before adding new vector
        let prevy = y;                  // store previous y position

        let n;
        let radius;

        // ==============================
        // Choose formula by wave type
        // ==============================
        if (type === 'Square') {
            // Square wave: only odd harmonics 1,3,5,...
            // f(x) ~ 4/π Σ (1/n) sin(nx) over n odd
            n = i * 2 + 1;                  // only odd harmonics (1,3,5,7,...)
            radius = 100 * (4 / (n * PI)); // amplitude of each Fourier term (circle radius)
        } else if (type === 'Sawtooth') {
            // Sawtooth wave: all harmonics 1,2,3,...
            // f(x) ~ 2/π Σ ((-1)^(n+1)/n) sin(nx) over n=1 to ∞
            n = i + 1;                      // all harmonics (1,2,3,4,...)
            radius = 200 * ((2 * (-1) ** n)/(n * PI)); // Sawtooth wave Fourier series
        } else if (type === 'Triangle') {
            // Triangle wave: only odd harmonics 1,3,5,...
            // f(x) ~ 8/π² Σ ((-1)^((n-1)/2)/n²) sin(nx) over n odd
            n = i * 2 + 1;                  // only odd harmonics (1,3,5,7,...)
            radius = 158 * ((8 / (PI ** 2)) * (((-1) ** ((n-1)/2))/(n ** 2) )); // Traingular wave Fourier series
        }
        

        x += radius * cos(n * time);    // update x using cosine component
        y += radius * sin(n * time);    // update y using sine component
        
        stroke(0, 255, 0);              // color of circles (green)
        noFill();                       // circles have no fill
        ellipse(prevx, prevy, radius * 2);
                                        // draw each rotating circle

        //fill(255);
        stroke(255,255,0);              // color of connecting radius lines (yellow)
        line(prevx, prevy, x, y);       // draw radius line from old to new position
        
        //ellipse(x,y,10);              // optional small dot at the tip (disabled)
    }

    translate(200, 0);                  // shift drawing area for plotting waveform

    line(x - 200, y, 0, wave[0]);       // connect circle endpoint to wave start
    wave.unshift(y);                    // push new y-value at start of array

    beginShape();                       // begin drawing the waveform
    noFill();                           // no fill for wave shape
    for(let i = 0; i < wave.length; i++){
        vertex(i, wave[i]);             // plot each point of wave
    }
    endShape();                         // finish drawing the wave

    /*// make another point that moves twice as fast (disabled)
    let x2 = radius * cos(-time);
    let y2 = radius * sin(-time);
    fill(255, 0, 0);
    line(0, 0, x2, y2);
    ellipse(x2,y2,10);*/

    time += 0.05;                       // increase time for animation (speed control)

    if (wave.length > 1450) {           // limit wave length to avoid overgrowth
        wave.pop();                     // remove last array element
    }
}
