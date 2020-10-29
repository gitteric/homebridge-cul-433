# homebridge-lw12-rgb-legacy

Homebridge Plugin for some 4333Mhz swithcing devices controlled by a nanoCUL dongle

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: sudo npm install -g git+https://github.com/gitteric/homebridge-cul-433.git
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

Configuration sample file:

 ```

	"accessories": [
		{
		    "type": "switch",
		    "variant": 1,
		    "port" : "/dev/serial/by-id/usb-FTDI_FT232R_USB_UART_A105N8TV-if00-port0",
		    "cmd_on": 'is00111011010100100000111010011101',
		    "cmd_on": 'is00111011010100100000111010001101',
		    "debug": false
		}

```
