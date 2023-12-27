const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const {spice, genericKernels, et_now} = require('./modules/js-spice');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.use(express.static('public'));

const moonScale = 0.5;
const earthScale = 1.0;
const sunScale = 2.0;

let rotationY = 0; // Initialize rotationY

io.on('connection', (socket) => {
//    console.log('A user connected');
    let moonScale = spice.bodvrd('moon', 'RADII');
    let earthScale = spice.bodvrd('earth', 'RADII');
    let sunScale = spice.bodvrd('sun', 'RADII');
    let scaleDivisor = earthScale[0];
    socket.emit('moonScale', moonScale[0]/scaleDivisor);
    socket.emit('earthScale', earthScale[0]/scaleDivisor);
    socket.emit('sunScale', sunScale[0]/scaleDivisor);

    const ref = 'ECLIPJ2000';
    const abcorr = 'NONE';
    const obs = 'EARTH_BARYCENTER';
    const sceneRotation = spice.rotate(spice.halfpi(), 1);
    const spherePreRotation = spice.eul2m(-spice.halfpi(), 0, 0, 1, 2, 3);

    var moonPos;
    var earthPos;
    var sunPos;
    var et = et_now();

    // Emit sphere rotation value every second
    const intervalId = setInterval(() => {
    
        // et = et_now();
        et += spice.spd()/1200;

        // positions
        sunPos = spice.spkpos('sun', et, ref, abcorr, obs).ptarg;
        earthPos = spice.spkpos('earth', et, ref, abcorr, obs).ptarg;
        moonPos = spice.spkpos('moon', et, ref, abcorr, obs).ptarg;

        sunPos = spice.mxv(sceneRotation, sunPos);
        earthPos = spice.mxv(sceneRotation, earthPos);
        moonPos = spice.mxv(sceneRotation, moonPos);

        const sunPosition = {'x': sunPos[0] / scaleDivisor, 'y': sunPos[1] / scaleDivisor, 'z' : sunPos[2] / scaleDivisor };
        const earthPosition = {'x': earthPos[0] / scaleDivisor, 'y': earthPos[1] / scaleDivisor, 'z' : earthPos[2] / scaleDivisor };
        const moonPosition = {'x': moonPos[0] / scaleDivisor, 'y': moonPos[1] / scaleDivisor, 'z' : moonPos[2] / scaleDivisor };

        socket.emit('sunPosition', sunPosition);
        socket.emit('earthPosition', earthPosition);
        socket.emit('moonPosition', moonPosition);

        // rotations
        // Get the rotation matrix from the origin's frame to the Body frame.
        var earthLocalRotation = spice.pxform('IAU_EARTH', ref, et);
        var earthTotalRotation = spice.mxm(earthLocalRotation, spherePreRotation);
        earthTotalRotation = spice.mxm(sceneRotation, earthTotalRotation);
      
        socket.emit('earthQuat', spice.m2q(earthTotalRotation));
        socket.emit('moonQuat', spice.m2q(spice.mxm(sceneRotation, spice.pxform('IAU_MOON', ref, et))));
        socket.emit('sunQuat', spice.m2q(spice.mxm(sceneRotation, spice.pxform('IAU_SUN', ref, et))));

    }, 20);

    socket.on('disconnect', () => {
//        console.log('A user disconnected');
        clearInterval(intervalId);
    });
});

// Change to server.listen
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});



async function getKernels() {

    const kernelsToLoad = [
        'lsk/latest_leapseconds.tls',
        'pck/pck00011.tpc',
        'pck/gm_de440.tpc',
        'spk/planets/de440.bsp',
        'spk/stations/earthstns_itrf93_201023.bsp',
        'fk/stations/earth_topo_201023.tf',
        'pck/earth_200101_990825_predict.bpc'
    ];


    async function loadAndProcessFiles(files) {
        const operations = files.map(file => {
            return genericKernels.getGenericKernel(file, `data/naif/generic_kernels/${file}`).then(kernel => {
                spice.furnsh(kernel);
            });
        });
    
        await Promise.all(operations);
        console.log("done loading kernels");
    }
    await loadAndProcessFiles(kernelsToLoad);
}

getKernels();