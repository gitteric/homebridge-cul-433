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
                var tTimeout;
                var response = '';
                var i=0;
                // On event port opened
                com.on('open', function() {
                        console.log('Port ' + module.port + ' opened');
                        tTimeout = null;//setTimeout(comTimedOut, 5000);
                        com.flush();
                        com.write(sMessage + '\n', function(err) {
                                if(err) {
                                        console.log('Error writing message to port "' + module.port +'" ' + error);
                                        com.close();
                                        callback(false);
                                }else{
                                        console.log('Sent message ' + sMessage);
                                        while(i<50) {
                                          response += com.read(sMessage.length); // BLOCKING, PERHAPS WITH TIMEOUT EXCEPTION;
                                          if(response!=null){
                                                console.log('Received + ' + response);
                                          }
                                          if(response == sMessage) {
                                                break;
                                          }
                                          sleep(100);
                                          i++;
                                        }
                                        if(i>=50){
                                                console.log('Sending message to' + module.port + ' timed out');
                                                callback(false);
                                        }else{
                                                callback(true);
                                        }

                                }
                        });
                });
                
                // On event data received
                com.on('data', function (data) {
                        console.log('Serial data received: ' + data);
                        clearTimeout(tTimeout);
                        callback(true);
                });
                
                // On event error occured
                com.on('error', function(err) {
                        console.log('Error on port: ', err.message);
                        callback(false);
                });
                
                // On event port closed
                com.on('close', function() {
                        console.log('Port ' + module.port + ' closed');
                });
                
                function comTimedOut(){
                        console.log('Sending message to' + module.port + ' timed out');
                        com.close();
                        callback(false);
                }
                
                function sleep(ms) {
                        return new Promise(resolve => {
                        setTimeout(resolve, ms)
                        })
                }
        }
        return module;
};
