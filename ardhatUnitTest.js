require('mocha');

var assert = require('chai').assert;
var should = require("should");
var expect = require('chai').expect;
var result = null;
var sprintf=require("sprintf-js").sprintf;


var five = require("johnny-five");
//var board = new five.Board();
// OSX
var board =new five.Board({ port: "/dev/tty.SLAB_USBtoUART" });

var board_ready = false;
var IMUid = 0;
var RTCid = 0;
var ENVid = 0;



// ******************  Start Board *******************************

board.on("ready", function() {
  board_ready = true;
  this.i2cConfig();
  this.i2cReadOnce(0x68, 0x75, 1, function(data) { //should return 0x68 (104)
      IMUid = data[0];
  });

  this.i2cReadOnce(0x77, 0xD0, 1, function(data) { //should return 0x58 (88)
      ENVid = data[0];
  });

   this.i2cReadOnce(0x51, 0x00, 1, function(data) { //should return 8
      RTCid = data[0];
  });

  led = new five.Led(9);
  extVoltage = new five.Sensor("A6");
  lipoVoltage = new five.Sensor("A7");
  RFM69ID = new five.Sensor("A8");
  RFM95ID = new five.Sensor("A9");
});


// ******************  Start tests *******************************


describe('Ardhat Functional Test', function() {

  describe('Connecting board', function() {
    it('Should initialise Firmata', function(done) {
      this.timeout(10000);
      setTimeout(function() {
        assert.equal(board_ready, true);
        done();
      }, 6000);
    });
  });


  describe("External Voltage", function(){
    it("should be greater than 12V", function(){
      expect(extVoltage.value/27).to.be.above(12);
      console.log(sprintf("extVoltage: %4.2fV", extVoltage.value/27));
    });
  });

  describe("LiPo Voltage", function(){
    it("should be greater than 4V", function(){
      expect(lipoVoltage.value/186).to.be.above(4);
      console.log(sprintf("lipoVoltage: %4.2fV", lipoVoltage.value/186));
    });
  });

  describe('User LED on', function() {
    it('Should turn on LED', function() {
      led.on();
      assert.equal(1, 1);
    });
  });

  describe("IMU detect", function(){
    it("ID should be 113", function(){
      (IMUid).should.equal(113);
    });
  });

  describe("ENV detect", function(){
      it("should be 88", function(){
      (ENVid).should.equal(88);
      });
  });

  describe("RTC detect", function(){
    it("should be 8", function(){
      (RTCid).should.equal(8);
    });
  });

  describe("Radio detect", function(){
    it("Ardhat-W radio ID should be 36", function(){
      expect(RFM69ID.value).to.equal(36);
    });
  });

    describe("Radio detect", function(){
      it("Ardhat-U radio ID should be 18", function(){
        expect(RFM95ID.value).to.equal(18);
      });
    });

});
