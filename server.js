let fs = require("fs");
let rawconfig = fs.readFileSync('config.json');
let config = JSON.parse(rawconfig);

//let bodyParser = require('body-parser');
//let app = express();
//var server = dgram.createSocket("udp4");
node_api_port = config.node_api_params.port
node_api_address = config.node_api_params.address


let sdpTransform = require('sdp-transform');
var dgram = require('dgram');
let uuidv3 = require('uuid/v3');
let custom_namespace = '8d68016f-b72a-4b2a-8816-af8b234293dd';
let express = require("express");
var ledger = require('nmos-ledger');
var node = new ledger.Node(null, null, 'Dante Node', `http://+${node_api_address}+":"+${node_api_port}`, "Dante_Node");
var store = new ledger.NodeRAMStore(node);
var nodeAPI = new ledger.NodeAPI(6000, store);


nodeAPI.init().start();
nodeAPI.on('modify', console.log);



function putRes(res) {
  return function () { return nodeAPI.putResource(res); };
}


//Client vars
var client_PORT = config.sap_client_params.port;
var client_HOST = config.sap_client_params.address;
var dgram = require('dgram');
var sap_client = dgram.createSocket('udp4');
var danteflows = {};
//var aes67flows = {};

sap_client.on('listening', function() {
    var address = sap_client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    sap_client.setBroadcast(true)
    sap_client.setMulticastTTL(128);
    sap_client.addMembership('239.255.255.255', client_HOST);
});

sap_client.on('message', function(message, remote) {
  console.log('message!');
    messageobj = sdpTransform.parse(message.toString());
    sdp = message.toString().substring(message.indexOf("v="));
    console.log(messageobj);
    dantedevkey = messageobj.name;
    danteflows.dantedevkey = {};
    device = new ledger.Device(uuidv3(messageobj.origin.address, custom_namespace), null, messageobj.name.split(":")[0].trim(), null, node.id);
    source = new ledger.Source(uuidv3(messageobj.name, custom_namespace), null, messageobj.name, messageobj.media[0].description, ledger.formats.audio, null, null, device.id);
    flow = new ledger.Flow(uuidv3(source.id, custom_namespace), null, messageobj.name, messageobj.description, ledger.formats.audio, null, source.id);
    sender = new ledger.Sender(uuidv3(flow.id, custom_namespace), null, messageobj.name, messageobj.description, flow.id,
    ledger.transports.rtp_mcast, device.id, `http://${node_api_address}:${node_api_port}/sdp/${uuidv3(flow.id, custom_namespace)}.sdp`)

    nodeAPI.putSDP(sender.id, sdp);

    danteflows.dantedevkey.device = device
    danteflows.dantedevkey.source = source
    danteflows.dantedevkey.flow = flow
    danteflows.dantedevkey.sender = sender
    
   nodeAPI.putResource(danteflows.dantedevkey.device)
        .then(putRes(danteflows.dantedevkey.source))
        .then(putRes(danteflows.dantedevkey.flow))
        .then(putRes(danteflows.dantedevkey.sender))
})


sap_client.bind(client_PORT, client_HOST);

























