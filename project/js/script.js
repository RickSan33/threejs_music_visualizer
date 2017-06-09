// check if user uses a mobile device
function isMobileDevice() {
    var isMobile = false; //initiate as false

    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

    return isMobile;
};

console.log(isMobileDevice());
// Change message for mobile vr users
if(isMobileDevice() == true)
{
    $('#loading').html('Please wait<br>Calculating song tempo and preparing the experience<br>Please put your device in the virtual reality headset');
}

// check if webaudiokit is available
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

// check if blob is available
var blob = window.URL || window.webkitURL;
if (!blob) {
    console.log('Your browser does not support Blob URLs');     
}

// start calculating tempo in music
var context = new AudioContext();
var fileInput = document.getElementById("fileInput");
var files = [];
var tempo;
var bpm;

// when user has selected an audio file start calculating
fileInput.onchange = function () 
{
    $('#fileInput').animate({opacity: 0}, 1000);
    $('#loading').animate({opacity: 1}, 1000);
    files = fileInput.files;

    // if there are no files return
    if (files.length == 0) return;
    var reader = new FileReader();

    // when there is a file start reading and decoding the file
    reader.onload = function(fileEvent) 
    {
        context.decodeAudioData(fileEvent.target.result, calcTempo);
    }

    reader.readAsArrayBuffer(files[0]);
}

// calculate the tempo of the song
var calcTempo = function (buffer) {
    var audioData = [];
    // Take the average of the two channels
    if (buffer.numberOfChannels == 2) 
    {
        var channel1Data = buffer.getChannelData(0);
        var channel2Data = buffer.getChannelData(1);
        var length = channel1Data.length;

        for (var i = 0; i < length; i++) 
        {
          audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
        }
    } 
    else 
    {
        audioData = buffer.getChannelData(0);
    }

    // music tempo data (BPM)
    var mt = new MusicTempo(audioData);

    console.log(mt.tempo);

    tempo = mt.tempo / 100;
    bpm = mt.tempo;

    // when music tempo has been succesfully calculated. place the song into the audio player.
    var file = files[0],
    fileURL = blob.createObjectURL(file);
    console.log(file);
    console.log('File name: '+file.name);
    console.log('File type: '+file.type);
    console.log('File BlobURL: '+ fileURL);
    document.getElementById('audio').src = fileURL;

    // after calculating the tempo and placing the song into the audio player the animation can start
    $('#loading').css({left: '45%'});
    if(isMobileDevice() == true)
    {
        $('#loading').html('Touch the screen to start the audio');
    }
    else
    {
        $('#loading').html('Get ready');
    }

    $('#loading').animate({opacity: 0}, 2500, startAnimation);
}        

// start threejs animation
function startAnimation()
{
    // get the audio element
    var audio = document.getElementById('audio');

    // init audio analyser and data
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    analyser.fftSize = 256;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // number of frequencies to calculate
    var meterNum = 35;   

    // make scene for threejs
    var scene = new THREE.Scene();

    // make camera for scene and position it
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 

    // position camera and add to scene
    camera.position.set(0, 0, 50);
    scene.add(camera);

    // create renderer
    var renderer = new THREE.WebGLRenderer();
    var element = renderer.domElement;

    // append renderer
    document.body.appendChild(element);

    // set rendersize to fullscreen
    renderer.setSize(window.innerWidth, window.innerHeight);            

    if(isMobileDevice() == true)
    {
        // make stereoscopic effect for VR
        var effect = new THREE.StereoEffect(renderer);
    }

    // create orbit controls if orientation controls are not available
    var controls = new THREE.OrbitControls(camera, element);
    controls.target.set(
      camera.position.x + 0.15,
      camera.position.y,
      camera.position.z
    );
    controls.noPan = true;
    controls.noZoom = true;

    // Preferred controls via DeviceOrientation
    function setOrientationControls(e) {
      if (!e.alpha) {
        return;
      }

      controls = new THREE.DeviceOrientationControls(camera, true);
      controls.connect();
      controls.update();

      element.addEventListener('click', fullscreen, false);

      window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);

    // init geometry mesh and material
    var bar = new THREE.CubeGeometry(5, 60, 5);
    var lungs = new THREE.CubeGeometry(30, 10, 2000);
    var heart = new THREE.CubeGeometry(30, 10, 2000);

//            dub/reggae: 60-90 bpm
//            downtempo/chillout: 90-120 bpm
//            deep house: 120-125 bpm
//            house: 120-130 bpm
//            tech house: 120-130 bpm
//            electro house: 125-130 bpm
//            progressive house: 125-130 bpm
//            trance: 130-135 bpm
//            dubstep: 130-145 bpm
//            techno: 130-150 bpm
//            hard house: 145-150 bpm
//            jungle: 155-180 bpm
//            drum and bass: 165-185 bpm
//            hardcore/gabber: 160-200 bpm

    var colorBar;
    var colorHeart;
    var colorLungs;

    // reggae
    if(bpm < 90)
    {
        colorBar = 0x27ae60;
        colorHeart = 0x1abc9c;
        colorLungs = 0x2ecc71;
    }
    // chill
    else if(bpm > 90 && bpm < 120)
    {
        colorBar = 0xecf0f1;
        colorHeart = 0xbdc3c7;
        colorLungs = 0x2c3e50;
    }
    // house
    else if(bpm > 120 && bpm < 130)
    {
        colorBar = 0x16a085;
        colorHeart = 0xe74c3c;
        colorLungs = 0x9b59b6;
    }
    // trance
    else if(bpm > 130 && bpm < 150)
    {
        colorBar = 0x3498db;
        colorHeart = 0x9b59b6;
        colorLungs = 0x2980b9;
    }
    // drum and bass/electro
    else if(bpm > 150 && bpm < 180)
    {
        colorBar = 0xf1c40f;
        colorHeart = 0xf39c12;
        colorLungs = 0xe67e22;
    }
    // hardcore
    else if(bpm > 180)
    {
        colorBar = 0x34495e;
        colorHeart = 0x7f8c8d;
        colorLungs = 0x2c3e50;
    }

    var materialBar = new THREE.MeshBasicMaterial({ color: colorBar });
    var materialLungs = new THREE.MeshBasicMaterial({ color: colorHeart });
    var materialHeart = new THREE.MeshBasicMaterial({ color: colorLungs });

    // random degrees for cristal like spawning of equalizer
    var degrees = [10, -10, 0];

    // arrays for equalizer
    var barsLeft = [];
    var barsRight = [];
    var frequencies = [];

    // create equalizer
    for (var i = 0; i <= 35; ++i) {
        barsLeft[i] = new THREE.Mesh(bar, materialBar);

        barsLeft[i].position.z = -i*20;
        barsLeft[i].position.x = -50;

        barsRight[i] = new THREE.Mesh(bar, materialBar);

        barsRight[i].position.z = -i*20;
        barsRight[i].position.x = 50;

        scene.add(barsLeft[i], barsRight[i]);
    }

    // create heart and lungs
    LungLeft = new THREE.Mesh(lungs, materialLungs);
    LungLeft.position.x = -40;
    LungLeft.position.y = -40;
    LungLeft.position.z = -50;
    LungLeft.scale.x = 1;

    LungRight = new THREE.Mesh(lungs, materialLungs);
    LungRight.position.x = 40;
    LungRight.position.y = -40;
    LungRight.position.z = -50;            
    LungRight.scale.x = 1;

    Heart = new THREE.Mesh(heart, materialHeart);
    Heart.position.x = 0;
    Heart.position.y = -40;
    Heart.position.z = -50;
    Heart.scale.x = 0.1;

    scene.add(LungLeft, LungRight, Heart);


    // Depending on your age and level of physical fitness, a normal resting pulse ranges from 60 to 80 beats per minute. Your breathing rate is measured in a similar manner, with an average resting rate of 12 to 20 breaths per minute. Both your pulse and breathing rate increase with exercise, maintaining a ratio of approximately 1 breath for every 4 heartbeats.

    //var msPerBeat = 1000 / (tempo / 60);
    var BPS = Math.round(bpm / 60);
    //var sPerBeat = 60 / tempo;
    var secs = 0;
    var expanded = false;
    var beats = 0;

    var clock = new THREE.Clock();

    // loop render frame
    function animate() {  

        for(var i = 0; i < barsLeft.length; i++)
        {
            // if bars are our of screen reposition
            if(barsLeft[i].position.z <= 300)
            {
                barsLeft[i].position.z += tempo;
            }
            else
            {
                // make bars spawn crystal like
                var rand = Math.floor((Math.random() * 3) + 0);
                barsLeft[i].rotation.z = degrees[rand];
                barsLeft[i].position.z = -300;
            }
            // apply frequency data of music to bar
            scaleY(barsLeft[i], frequencies[i]);
        }

        // same as above
        for(var i = 0; i < barsRight.length; i++)
        {
            if(barsRight[i].position.z <= 300)
            {
                barsRight[i].position.z += tempo;
            }
            else
            {                    
                var rand = Math.floor((Math.random() * 3) + 0);
                barsRight[i].rotation.z = degrees[rand];
                barsRight[i].position.z = -300;
            }

            scaleY(barsRight[i], frequencies[i]);
        }

        // make the heart pump
        if(secs >= 60)
        {
            secs = 0;
        }

        secs++;             

        // (prototype) raw conversion of BPM to heartbeats per second
        for(var i = 1; i < BPS+1; i++)
        {
            if(secs == (60/BPS) * i)
            {
                if(expanded == false)
                {
                    Heart.scale.x = 1;
                    expanded = true;

                    // make the lungs breath
                    if(beats > 3)
                    {
                        LungLeft.scale.x = 1;
                        LungRight.scale.x = 1;
                        beats = 0;
                    }

                    else
                    {
                        LungLeft.scale.x -= 0.3;
                        LungRight.scale.x -= 0.3;
                    }

                    beats++;
                }
                else
                {
                    Heart.scale.x = 0.1;
                    expanded = false;
                }
            }
        }

        // when not a mobile device disable vr stereo display
        if(isMobileDevice() == false)
        {
            // render the scene
            renderer.render(scene, camera);
        }
        setTimeout( function() {

            // render again maintaining 60fps (loop)                    
            requestAnimationFrame(animate);

            // when using a mobile device start rendering stereo vr display
            if(isMobileDevice() == true)
            {
                // update movement of camera
                update(clock.getDelta());
                render(clock.getDelta());
            }

        }, 1000 / 60 );

    };

    // start first render
    animate();

    // resize screen
    function resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        effect.setSize(width, height);
    }

    // update camera projection
    function update(dt) {
        resize();

        camera.updateProjectionMatrix();

        controls.update(dt);
    }

    // render camera pov
    function render(dt) {
        effect.render(scene, camera);
    }

    // make browser fullscreen on mobile device
    function fullscreen() {
        if (document.body.requestFullscreen) {
          document.body.requestFullscreen();
        } else if (document.body.msRequestFullscreen) {
          document.body.msRequestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
          document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
          document.body.webkitRequestFullscreen();
        }
        // play audio via user gesture (needed in mobile browsers)
        audio.play();
    }

    // loop music analyser
    function renderAudio() 
    {
        // init music analyser data
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); //sample limited data from the total array

        // apply all analysed data into array
        for (var i = 0; i < meterNum; i++) 
        {            
            var value = ((array[i * step])/2.55)/100;

            frequencies[i] = value;
        }

        // analyse audio again (loop)
        requestAnimationFrame(renderAudio);
    }

    // start first audio analyse
    renderAudio();

    // start audio for analyser to analyse (for pc)
    audio.play();

    // scale the mesh shapes and split in half to give illusion of having the bars coming from the ground up
    function scaleY ( mesh, scale ) {
        mesh.scale.y = scale ;
        if( ! mesh.geometry.boundingBox ) mesh.geometry.computeBoundingBox();
        var height = mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;

        mesh.position.y = height * scale / 2 - 20;
    }
}