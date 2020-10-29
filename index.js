var Service, Characteristic;

module.exports = function (homebridge){
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	UUIDGen = homebridge.hap.uuid;
	homebridge.registerAccessory('homebridge-cul-433', 'cul-433', ControllerAccessory)
}

function ControllerAccessory(log, config) {
	this.log = log;
	this.name = config['name'];
	this.type = config['type'];
	this.variant = config['variant'];
	this.port = config['port'];
	this.debug = config['debug'];
	this.cmd_on = config['cmd_on'];
	this.cmd_off = config['cmd_off'];
	this.verifyConfig();
	
	this.stripe = require('./cul-433.js')(this.type, this.variant, this.port, this.cmd_on,this.cmd_off, this.debug);
	
}

ControllerAccessory.prototype = {
	
	verifyConfig: function() {
		if (!this.type || !this.variant){
			this.log.error('Please define type and variant in config.json');
		}
		if (!this.type) this.type = 'switch';
		if (!this.variant) this.variant = 1;
		if (!this.port) this.port = '/dev/tty0';
		if (!this.cmd_on) this.cmd_on = '';
		if (!this.cmd_off) this.cmd_off = '';
		if (!this.debug) this.debug = false;
	},
	
	identify: function(callback){
		if (this.debug === true) this.log('Identify requested!');
		callback();
	},
	
	getServices: function() {
		
		var informationService = new Service.AccessoryInformation();
		
		informationService
			.setCharacteristic(Characteristic.Manufacturer, 'CUL 433Mhz')
			.setCharacteristic(Characteristic.Model, 'homebridge-cul-433')
			.setCharacteristic(Characteristic.SerialNumber, 'CUL 433Mhz Serial Number');
			
		if (this.debug === true) this.log('creating Outlet service');
		
		var outletService = new Service.Outlet(this.name);
		
		outletService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getPowerState.bind(this))
			.on('set', this.setPowerState.bind(this));
			
	/*
    if (this.debug === true) this.log('... adding Brightness');
    outletService
    	.addCharacteristic(new Characteristic.Brightness())
    	.on('get', this.getBrightness.bind(this))
    	.on('set', this.setBrightness.bind(this));
*/
    	
    return [informationService, outletService];
  },
  
  getPowerState: function(callback) {
  	var result = this.stripe.getPowerState();
    if (this.debug === true) this.log('... powerState: ' + result);
    callback(null, result);
  },
  
  setPowerState: function(state, callback) {
  	var me = this;
  	if (this.debug === true) this.log('... setting powerState to ' + state);
  	this.stripe.setPowerState(state, function(success) {
  		if (me.debug === true) me.log('... setting powerState success: ' + success);
  		callback(undefined, success)
  	});
  },
  /*
  getBrightness: function(callback) {
  	var result = this.stripe.getBrightness();
    if (this.debug === true) this.log('... brightness: ' + result);
    callback(null, result);
  },
  
  setBrightness: function(level, callback) {
  	var me = this;
  	if (this.debug === true) this.log('... setting brightness to ' + level);
  	this.stripe.setBrightness(level, function(success) {
  		if (me.debug === true) me.log('... setting brightness success: ' + success);
  		callback(undefined, success)
  	});
  },
  */

	
};