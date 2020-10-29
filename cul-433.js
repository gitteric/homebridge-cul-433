var SerialPort = require('serialport');

module.exports = function (type, variant, port, cmd_on, cmd_off, debug) {
        var module = {};

        module.type = type;
        module.variant = variant;
        module.debug = debug;
        module.port = port;
        module.cmd_on = cmd_on;
        module.cmd_off = cmd_off;
        module.powerState = false;
        module.lastHex = null;

        module.getPowerState = function () {
                return module.powerState;
        }

        module.setPowerState = function (state, callback) {
                if (module.powerState != state){
                        sendMessage(state ? module.cmd_on : module.cmd_off, function(success) {
                                if (success) {
                                        module.powerState = state;
                                }
                                callback(true);
                        });
                } else {
                        callback(true);
                }
        };
        /*
        module.getBrightness = function() {
                return module.color.V;
        }

        module.setBrightness = function (value, callback) {
                module.color.V = value;
                setColor(callback);
        };
        */
        function sendMessage(sMessage, callback) {
                var com = new SerialPort(module.port, {baudRate: 38400, databits: 8, parity: 'none'});
                
                com.open(function (error) {
                        if (error) {
                                console.log('Error while opening the port ' +module.port +' ' + error);
                        } else {
                                console.log('CST port open');
                                com.write(sMessage + String.fromCharCode(0x0A), function (err, result) {
                                        if (err) {
                                                console.log('Error while sending message : ' + err);
                                        }
                                        if (result) {
                                                //console.log('Response received after sending message : ' + result);
                                        }    
                                });
                        }
                com.close();  
                });
        }

        return module;
};
