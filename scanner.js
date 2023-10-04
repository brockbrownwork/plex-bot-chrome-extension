const listenForScans = () => {
        let buffer = [];
        let lastKeystrokeTime = 0;
        const rapidThreshold = 100; // milliseconds
        const printThreshold = 500; // milliseconds
        let timeout;
        console.log("listening for scans...");
        document.addEventListener('keydown', function(e) {
        let currentTime = new Date().getTime();
        
        if (currentTime - lastKeystrokeTime < rapidThreshold) {
            buffer.push(e.key);
        } else {
            buffer = [e.key];
        }

        clearTimeout(timeout);
        timeout = setTimeout(function() {
            if (buffer.length > 1) { // Change this if you want to print single key strokes as well
                console.log(buffer.join(''));
            }
            buffer = [];
        }, printThreshold);

        lastKeystrokeTime = currentTime;
    });
};

export {listenForScans};
