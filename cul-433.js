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
       /*
        function sendMessage(sMessage, callback) {
                var com = new SerialPort(module.port, {baudRate: 38400}, function(err) {
                        if(err) {
                                console.log('Error while opening the port "' + module.port +'" ' + error);
                                callback(false);
                        }else{
                
                                // by having the write call within the callback you can access it directly w/o using .on()
                                com.write(sMessage + '\n', function(err) {
                                        if(err) {
                                                console.log('Error writing message to port "' + module.port +'" ' + error);
                                                callback(false);
                                        }else{
                                                console.log('Sent message "'+ sMessage + '" ');
                                                callback(true);
                                                com.close();
                                        }
                                });
                        }
                      });
        }
        */
        function sendMessage(sMessage, callback) {
                var com = new SerialPort(module.port, {baudRate: 38400});
                // On event port opened
                com.on('open', function() {
                        console.log('Port ' + sPortNanoCul + ' opened');
                        setTimeout(comTimedOut, 1000);
                        com.write(sMessage + '\n', function(err) {
                                if(err) {
                                        console.log('Error writing message to port "' + module.port +'" ' + error);
                                        com.close();
                                        callback(false);
                                }else{
                                        console.log('Sent message "'+ sMessage + '" ');
                                }
                        });
                });
                
                // On event data received
                com.on('data', function (data) {
                        console.log('Serial data received: ' + data);
                        callback(true);
                });
                
                // On event error occured
                com.on('error', function(err) {
                        console.log('Error on port: ', err.message);
                        callback(false);
                });
                
                // On event port closed
                com.on('close', function() {
                        console.log('Port ' + sPortNanoCul + ' closed');
                });
                
                function comTimedOut(){
                        com.close();
                        callback(false);
                }
        }
        return module;
};
