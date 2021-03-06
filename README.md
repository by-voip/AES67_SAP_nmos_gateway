# AES67_SAP_nmos_gateway
An NMOS IS-04 implementation built around discovering AES67 streams announced with SAP (dante devices in AES67 mode).

This service is intended to be run on a computer with an interface on a Dante network with AES67 compatible devices configured
to generate AES67 flows. The service will discover those AES67 streams announced via SAP (session announcement protocol), parse their SDP's
and from there will serve an NMOS node API on the port specified in the config.json file.

The service will present one NODE which represents the entire Dante VLAN the service runs on, and then based on parsing SDP's will create
an NMOS device under this node for every dante device on the network, and for every device, will create sources, flows and senders.

The service will register itself with any IS-04 registration API, and from there any NMOS campatible control system will be able to treat AES67 streams from dante devices like any other NMOS sender.

Note that the intention of this service is to enumerate senders based on discovered AES67 flows, a complimentary service is being made that can act more akin to a node registration API, in that you can send it an array of SDP's and it will in turn annouce those so that AES67 flows can be detected and patched in dante controller.

To use just run "npm install" and then "node server.js"

You will need to have git installed before running "npm install" due to an external dependency of the nmos-ledger package.

Written in Javascript and tested with NODE.js v10.13.0.
Dockerfile included but this is untested.

The IS-04 implementation built on top of nmos-ledger from Streampunkd:
https://github.com/Streampunk/ledger

And the SDP parsing for dynamically generating devices is done using sdp-transform from clux:
https://github.com/clux/sdp-transform
