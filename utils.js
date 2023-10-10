(function() {
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function() {
        var xhr = this;
        var originalOnreadystatechange = this.onreadystatechange;

        this.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                // console.log('XHR Completed with status:', xhr.status, 'Response:', xhr.responseText);
                try {
                    let response = JSON.parse(xhr.responseText);
                    console.log(response);
                    if (response && response.Data && response.Data.OperationCode !== undefined) {
                        console.log('response.Data.OperationCode exists');
                        if (response.Data.OperationCode === "QC") {
                            alert("QC detected! Make sure not to double scan. :)");
                            location.reload();
                        } else {
                            console.log("Doesn't appear to be in QC.");
                        }
                    }
                } catch (e) {
                }
            }
            if (originalOnreadystatechange) {
                originalOnreadystatechange.apply(this, arguments);
            }
        };

        originalSend.apply(this, arguments);
    };
})();
