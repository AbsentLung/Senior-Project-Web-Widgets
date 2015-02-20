     
             return output;
             }
             
             /**
              * Takes a String and calculates its length in bytes when encoded in UTF8.
              * @private
              */
             function UTF8Length(input) {
             var output = 0;
             for (var i = 0; i<input.length; i++)
             {
             var charCode = input.charCodeAt(i);
             if (charCode > 0x7FF)
             {
             // Surrogate pair means its a 4 byte character
             if (0xD800 <= charCode && charCode <= 0xDBFF)
             {
             i++;
             output++;
             }
             output +=3;
             }
             else if (charCode > 0x7F)
             output +=2;
             else
             output++;
             }
             return output;
             }
             
             /**
              * Takes a String and writes it into an array as UTF8 encoded bytes.
              * @private
              */
             function stringToUTF8(input, output, start) {
             var pos = start;
             for (var i = 0; i<input.length; i++) {
             var charCode = input.charCodeAt(i);
             
             // Check for a surrogate pair.
             if (0xD800 <= charCode && charCode <= 0xDBFF) {
             lowCharCode = input.charCodeAt(++i);
             if (isNaN(lowCharCode)) {
             throw new Error(format(ERROR.MALFORMED_UNICODE, [charCode, lowCharCode]));
             }
             charCode = ((charCode - 0xD800)<<10) + (lowCharCode - 0xDC00) + 0x10000;
             
             }
             
             if (charCode <= 0x7F) {
             output[pos++] = charCode;
             } else if (charCode <= 0x7FF) {
             output[pos++] = charCode>>6  & 0x1F | 0xC0;
             output[pos++] = charCode     & 0x3F | 0x80;
             } else if (charCode <= 0xFFFF) {
             output[pos++] = charCode>>12 & 0x0F | 0xE0;
             output[pos++] = charCode>>6  & 0x3F | 0x80;
             output[pos++] = charCode     & 0x3F | 0x80;
             } else {
             output[pos++] = charCode>>18 & 0x07 | 0xF0;
             output[pos++] = charCode>>12 & 0x3F | 0x80;
             output[pos++] = charCode>>6  & 0x3F | 0x80;
             output[pos++] = charCode     & 0x3F | 0x80;
             };
             }
             return output;
             }
             
             function parseUTF8(input, offset, length) {
             var output = "";
             var utf16;
             var pos = offset;
             
             while (pos < offset+length)
             {
             var byte1 = input[pos++];
             if (byte1 < 128)
             utf16 = byte1;
             else
             {
             var byte2 = input[pos++]-128;
             if (byte2 < 0)
             throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16),""]));
             if (byte1 < 0xE0)             // 2 byte character
             utf16 = 64*(byte1-0xC0) + byte2;
             else
             {
             var byte3 = input[pos++]-128;
             if (byte3 < 0)
             throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16)]));
             if (byte1 < 0xF0)        // 3 byte character
             utf16 = 4096*(byte1-0xE0) + 64*byte2 + byte3;
             else
             {
             var byte4 = input[pos++]-128;
             if (byte4 < 0)
             throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
             if (byte1 < 0xF8)        // 4 byte character
             utf16 = 262144*(byte1-0xF0) + 4096*byte2 + 64*byte3 + byte4;
             else                     // longer encodings are not supported
             throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
             }
             }
             }
             
             if (utf16 > 0xFFFF)   // 4 byte character - express as a surrogate pair
             {
             utf16 -= 0x10000;
             output += String.fromCharCode(0xD800 + (utf16 >> 10)); // lead character
             utf16 = 0xDC00 + (utf16 & 0x3FF);  // trail character
             }
             output += String.fromCharCode(utf16);
             }
             return output;
             }
             
             /** @ignore Repeat keepalive requests, monitor responses.*/
             var Pinger = function(client, window, keepAliveInterval) {
             this._client = client;
             this._window = window;
             this._keepAliveInterval = keepAliveInterval*1000;
             this.isReset = false;
             
             var pingReq = new WireMessage(MESSAGE_TYPE.PINGREQ).encode();
             
             var doTimeout = function (pinger) {
             return function () {
             return doPing.apply(pinger);
             };
             };
             
             /** @ignore */
             var doPing = function() {
             if (!this.isReset) {
             this._client._trace("Pinger.doPing", "Timed out");
             this._client._disconnected( ERROR.PING_TIMEOUT.code , format(ERROR.PING_TIMEOUT));
             } else {
             this.isReset = false;
             this._client._trace("Pinger.doPing", "send PINGREQ");
             this._client.socket.send(pingReq);
             this.timeout = this._window.setTimeout(doTimeout(this), this._keepAliveInterval);
             }
             }
             
             this.reset = function() {
             this.isReset = true;
             this._window.clearTimeout(this.timeout);
             if (this._keepAliveInterval > 0)
             this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
             }
             
             this.cancel = function() {
             this._window.clearTimeout(this.timeout);
             }
             };
             
             /** @ignore Monitor request completion. */
             var Timeout = function(client, window, timeoutSeconds, action, args) {
             this._window = window;
             if (!timeoutSeconds)
             timeoutSeconds = 30;
             
             var doTimeout = function (action, client, args) {
             return function () {
             return action.apply(client, args);
             };
             };
             this.timeout = setTimeout(doTimeout(action, client, args), timeoutSeconds * 1000);
             
             this.cancel = function() {
             this._window.clearTimeout(this.timeout);
             }
             };
             
             /*
              * Internal implementation of the Websockets MQTT V3.1 client.
              *
              * @name Messaging.ClientImpl @constructor
              * @param {String} host the DNS nameof the webSocket host.
              * @param {Number} port the port number for that host.
              * @param {String} clientId the MQ client identifier.
              */
             var ClientImpl = function (host, port, clientId) {
             // Check dependencies are satisfied in this browser.
             if (!("WebSocket" in global && global["WebSocket"] !== null)) {
             throw new Error(format(ERROR.UNSUPPORTED, ["WebSocket"]));
             }
             if (!("localStorage" in global && global["localStorage"] !== null)) {
             throw new Error(format(ERROR.UNSUPPORTED, ["localStorage"]));
             }
             if (!("ArrayBuffer" in global && global["ArrayBuffer"] !== null)) {
             throw new Error(format(ERROR.UNSUPPORTED, ["ArrayBuffer"]));
             }
             
             this._trace("Messaging.Client", host, port, clientId);
             
             this.host = host;
             this.port = port;
             this.clientId = clientId;
             
             // Local storagekeys are qualified with the following string.
             this._localKey=host+":"+port+":"+clientId+":";
             
             // Create private instance-only message queue
             // Internal queue of messages to be sent, in sending order.
             this._msg_queue = [];
             
             // Messages we have sent and are expecting a response for, indexed by their respective message ids.
             this._sentMessages = {};
             
             // Messages we have received and acknowleged and are expecting a confirm message for
             // indexed by their respective message ids.
             this._receivedMessages = {};
             
             // Internal list of callbacks to be executed when messages
             // have been successfully sent over web socket, e.g. disconnect
             // when it doesn't have to wait for ACK, just message is dispatched.
             this._notify_msg_sent = {};
             
             // Unique identifier for SEND messages, incrementing
             // counter as messages are sent.
             this._message_identifier = 1;
             
             // Used to determine the transmission sequence of stored sent messages.
             this._sequence = 0;
             
             
             // Load the local state, if any, from the saved version, only restore state relevant to this client.
             for(key in localStorage)
             if (   key.indexOf("Sent:"+this._localKey) == 0
                 || key.indexOf("Received:"+this._localKey) == 0)
             this.restore(key);
             };
             
             // Messaging Client public instance members.
             ClientImpl.prototype.host;
             ClientImpl.prototype.port;
             ClientImpl.prototype.clientId;
             
             // Messaging Client private instance members.
             ClientImpl.prototype.socket;
             /* true once we have received an acknowledgement to a CONNECT packet. */
             ClientImpl.prototype.connected = false;
             /* The largest message identifier allowed, may not be larger than 2**16 but
              * if set smaller reduces the maximum number of outbound messages allowed.
              */
             ClientImpl.prototype.maxMessageIdentifier = 65536;
             ClientImpl.prototype.connectOptions;
             ClientImpl.prototype.hostIndex;
             ClientImpl.prototype.onConnectionLost;
             ClientImpl.prototype.onMessageDelivered;
             ClientImpl.prototype.onMessageArrived;
             ClientImpl.prototype._msg_queue = null;
             ClientImpl.prototype._connectTimeout;
             /* The sendPinger monitors how long we allow before we send data to prove to the server that we are alive. */
             ClientImpl.prototype.sendPinger = null;
             /* The receivePinger monitors how long we allow before we require evidence that the server is alive. */
             ClientImpl.prototype.receivePinger = null;
             
             ClientImpl.prototype._traceBuffer = null;
             ClientImpl.prototype._MAX_TRACE_ENTRIES = 100;
             
             ClientImpl.prototype.connect = function (connectOptions) {
             var connectOptionsMasked = this._traceMask(connectOptions, "password");
             this._trace("Client.connect", connectOptionsMasked, this.socket, this.connected);
             
             if (this.connected)
             throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
             if (this.socket)
             throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
             
             this.connectOptions = connectOptions;
             
             if (connectOptions.hosts) {
             this.hostIndex = 0;
             this._doConnect(connectOptions.hosts[0], connectOptions.ports[0]);
             } else {
             this._doConnect(this.host, this.port);
             }
             
             };
             
             ClientImpl.prototype.subscribe = function (filter, subscribeOptions) {
             this._trace("Client.subscribe", filter, subscribeOptions);
             
             if (!this.connected)
             throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
             
             var wireMessage = new WireMessage(MESSAGE_TYPE.SUBSCRIBE);
             wireMessage.topics=[filter];
             if (subscribeOptions.qos != undefined)
             wireMessage.requestedQos = [subscribeOptions.qos];
             else
             wireMessage.requestedQos = [0];
             
             if (subscribeOptions.onSuccess) {
             wireMessage.callback = function() {subscribeOptions.onSuccess({invocationContext:subscribeOptions.invocationContext});};
             }
             if (subscribeOptions.timeout) {
             wireMessage.timeOut = new Timeout(this, window, subscribeOptions.timeout, subscribeOptions.onFailure
                                               , [{invocationContext:subscribeOptions.invocationContext,
                                                           errorCode:ERROR.SUBSCRIBE_TIMEOUT.code,
                                                        errorMessage:format(ERROR.SUBSCRIBE_TIMEOUT)}]);
             }
             
             // All subscriptions return a SUBACK.
             this._requires_ack(wireMessage);
             this._schedule_message(wireMessage);
             };
             
             /** @ignore */
             ClientImpl.prototype.unsubscribe = function(filter, unsubscribeOptions) {
             this._trace("Client.unsubscribe", filter, unsubscribeOptions);
             
             if (!this.connected)
             throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
             
             var wireMessage = new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);
             wireMessage.topics = [filter];
             
             if (unsubscribeOptions.onSuccess) {
             wireMessage.callback = function() {unsubscribeOptions.onSuccess({invocationContext:unsubscribeOptions.invocationContext});};
             }
             if (unsubscribeOptions.timeout) {
             wireMessage.timeOut = new Timeout(this, window, unsubscribeOptions.timeout, unsubscribeOptions.onFailure
                                               , [{invocationContext:unsubscribeOptions.invocationContext,
                                                           errorCode:ERROR.UNSUBSCRIBE_TIMEOUT.code,
                                                        errorMessage:format(ERROR.UNSUBSCRIBE_TIMEOUT)}]);
             }
             
             // All unsubscribes return a SUBACK.
             this._requires_ack(wireMessage);
             this._schedule_message(wireMessage);
             };
             
             ClientImpl.prototype.send = function (message) {
             this._trace("Client.send", message);
             
             if (!this.connected)
             throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
             
             wireMessage = new WireMessage(MESSAGE_TYPE.PUBLISH);
             wireMessage.payloadMessage = message;
             
             if (message.qos > 0)
             this._requires_ack(wireMessage);
             else if (this.onMessageDelivered)
             this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage);
             this._schedule_message(wireMessage);
             };
             
             ClientImpl.prototype.disconnect = function () {
             this._trace("Client.disconnect");
             
             if (!this.socket)
             throw new Error(format(ERROR.INVALID_STATE, ["not connecting or connected"]));
             
             wireMessage = new WireMessage(MESSAGE_TYPE.DISCONNECT);
             
             // Run the disconnected call back as soon as the message has been sent,
             // in case of a failure later on in the disconnect processing.
             // as a consequence, the _disconected call back may be run several times.
             this._notify_msg_sent[wireMessage] = scope(this._disconnected, this);
             
             this._schedule_message(wireMessage);
             };
             
             ClientImpl.prototype.getTraceLog = function () {
             if ( this._traceBuffer !== null ) {
             this._trace("Client.getTraceLog", new Date());
             this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
             for (key in this._sentMessages)
             this._trace("_sentMessages ",key, this._sentMessages[key]);
             for (key in this._receivedMessages)
             this._trace("_receivedMessages ",key, this._receivedMessages[key]);
             
             return this._traceBuffer;
             }
             };
             
             ClientImpl.prototype.startTrace = function () {
             if ( this._traceBuffer === null ) {
             this._traceBuffer = [];
             }
             this._trace("Client.startTrace", new Date(), version);
             };
             
             ClientImpl.prototype.stopTrace = function () {
             delete this._traceBuffer;
             };
             
             ClientImpl.prototype._doConnect = function (host, port) {
             // When the socket is open, this client will send the CONNECT WireMessage using the saved parameters.
             if (this.connectOptions.useSSL)
             wsurl = ["wss://", host, ":", port, "/mqtt"].join("");
             else
             wsurl = ["ws://", host, ":", port, "/mqtt"].join("");
             this.connected = false;
             this.socket = new WebSocket(wsurl, 'mqttv3.1');
             this.socket.binaryType = 'arraybuffer';
             this.socket.onopen = scope(this._on_socket_open, this);
             this.socket.onmessage = scope(this._on_socket_message, this);
             this.socket.onerror = scope(this._on_socket_error, this);
             this.socket.onclose = scope(this._on_socket_close, this);
             
             this.sendPinger = new Pinger(this, window, this.connectOptions.keepAliveInterval);
             this.receivePinger = new Pinger(this, window, this.connectOptions.keepAliveInterval);
             
             this._connectTimeout = new Timeout(this, window, this.connectOptions.timeout, this._disconnected,  [ERROR.CONNECT_TIMEOUT.code, format(ERROR.CONNECT_TIMEOUT)]);
             };
             
             
             // Schedule a new message to be sent over the WebSockets
             // connection. CONNECT messages cause WebSocket connection
             // to be started. All other messages are queued internally
             // until this has happened. When WS connection starts, process
             // all outstanding messages.
             ClientImpl.prototype._schedule_message = function (message) {
             this._msg_queue.push(message);
             // Process outstanding messages in the queue if we have an  open socket, and have received CONNACK.
             if (this.connected) {
             this._process_queue();
             }
             };
             
             ClientImpl.prototype.store = function(prefix, wireMessage) {
             storedMessage = {type:wireMessage.type, messageIdentifier:wireMessage.messageIdentifier, version:1};
             
             switch(wireMessage.type) {
             case MESSAGE_TYPE.PUBLISH:
             if(wireMessage.pubRecReceived)
             storedMessage.pubRecReceived = true;
             
             // Convert the payload to a hex string.
             storedMessage.payloadMessage = {};
             var hex = "";
             var messageBytes = wireMessage.payloadMessage.payloadBytes;
             for (var i=0; i<messageBytes.length; i++) {
             if (messageBytes[i] <= 0xF)
             hex = hex+"0"+messageBytes[i].toString(16);
             else
             hex = hex+messageBytes[i].toString(16);
             }
             storedMessage.payloadMessage.payloadHex = hex;
             
             storedMessage.payloadMessage.qos = wireMessage.payloadMessage.qos;
             storedMessage.payloadMessage.destinationName = wireMessage.payloadMessage.destinationName;
             if (wireMessage.payloadMessage.duplicate)
             storedMessage.payloadMessage.duplicate = true;
             if (wireMessage.payloadMessage.retained)
             storedMessage.payloadMessage.retained = true;
             
             // Add a sequence number to sent messages.
             if ( prefix.indexOf("Sent:") == 0 ) {
             if ( wireMessage.sequence === undefined )
             wireMessage.sequence = ++this._sequence;
             storedMessage.sequence = wireMessage.sequence;
             }
             break;
             
             default:
             throw Error(format(ERROR.INVALID_STORED_DATA, [key, storedMessage]));
             }
             localStorage.setItem(prefix+this._localKey+wireMessage.messageIdentifier, JSON.stringify(storedMessage));
             };
             
             ClientImpl.prototype.restore = function(key) {
             var value = localStorage.getItem(key);
             var storedMessage = JSON.parse(value);
             
             var wireMessage = new WireMessage(storedMessage.type, storedMessage);
             
             switch(storedMessage.type) {
             case MESSAGE_TYPE.PUBLISH:
             // Replace the payload message with a Message object.
             var hex = storedMessage.payloadMessage.payloadHex;
             var buffer = new ArrayBuffer((hex.length)/2);
             var byteStream = new Uint8Array(buffer);
             var i = 0;
             while (hex.length >= 2) {
             var x = parseInt(hex.substring(0, 2), 16);
             hex = hex.substring(2, hex.length);
             byteStream[i++] = x;
             }
             var payloadMessage = new Messaging.Message(byteStream);
             
             payloadMessage.qos = storedMessage.payloadMessage.qos;
             payloadMessage.destinationName = storedMessage.payloadMessage.destinationName;
             if (storedMessage.payloadMessage.duplicate)
             payloadMessage.duplicate = true;
             if (storedMessage.payloadMessage.retained)
             payloadMessage.retained = true;
             wireMessage.payloadMessage = payloadMessage;
             
             break;
             
             default:
             throw Error(format(ERROR.INVALID_STORED_DATA, [key, value]));
             }
             
             if (key.indexOf("Sent:"+this._localKey) == 0) {
             this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
             } else if (key.indexOf("Received:"+this._localKey) == 0) {
             this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
             }
             };
             
             ClientImpl.prototype._process_queue = function () {
             var message = null;
             // Process messages in order they were added
             var fifo = this._msg_queue.reverse();
             
             // Send all queued messages down socket connection
             while ((message = fifo.pop())) {
             this._socket_send(message);
             // Notify listeners that message was successfully sent
             if (this._notify_msg_sent[message]) {
             this._notify_msg_sent[message]();
             delete this._notify_msg_sent[message];
             }
             }
             };
             
             /**
              * @ignore
              * Expect an ACK response for this message. Add message to the set of in progress
              * messages and set an unused identifier in this message.
              */
             ClientImpl.prototype._requires_ack = function (wireMessage) {
             var messageCount = Object.keys(this._sentMessages).length;
             if (messageCount > this.maxMessageIdentifier)
             throw Error ("Too many messages:"+messageCount);
             
             while(this._sentMessages[this._message_identifier] !== undefined) {
             this._message_identifier++;
             }
             wireMessage.messageIdentifier = this._message_identifier;
             this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
             if (wireMessage.type === MESSAGE_TYPE.PUBLISH) {
             this.store("Sent:", wireMessage);
             }
             if (this._message_identifier === this.maxMessagIdentifier) {
             this._message_identifier = 1;
             }
             };
             
             /**
              * @ignore
              * Called when the underlying websocket has been opened.
              */
             ClientImpl.prototype._on_socket_open = function () {
             // Create the CONNECT message object.
             var wireMessage = new WireMessage(MESSAGE_TYPE.CONNECT, this.connectOptions);
             wireMessage.clientId = this.clientId;
             this._socket_send(wireMessage);
             };
             
             /**
              * @ignore
              * Called when the underlying websocket has received a complete packet.
              */
             ClientImpl.prototype._on_socket_message = function (event) {
             this._trace("Client._on_socket_message", event.data);
             
             // Reset the receive ping timer, we now have evidence the server is alive.
             this.receivePinger.reset();
             var byteArray = new Uint8Array(event.data);
             try {
             var wireMessage = decodeMessage(byteArray);
             } catch (error) {
             this._disconnected(ERROR.INTERNAL_ERROR.code , format(ERROR.INTERNAL_ERROR, [error.message]));
             return;
             }
             this._trace("Client._on_socket_message", wireMessage);
             
             try {
             switch(wireMessage.type) {
             case MESSAGE_TYPE.CONNACK:
             this._connectTimeout.cancel();
             
             // If we have started using clean session then clear up the local state.
             if (this.connectOptions.cleanSession) {
             for (key in this._sentMessages) {
             var sentMessage = this._sentMessages[key];
             localStorage.removeItem("Sent:"+this._localKey+sentMessage.messageIdentifier);
             }
             this._sentMessages = {};
             
             for (key in this._receivedMessages) {
             var receivedMessage = this._receivedMessages[key];
             localStorage.removeItem("Received:"+this._localKey+receivedMessage.messageIdentifier);
             }
             this._receivedMessages = {};
             }
             // Client connected and ready for business.
             if (wireMessage.returnCode === 0) {
             this.connected = true;
             // Jump to the end of the list of hosts and stop looking for a good host.
             if (this.connectOptions.hosts)
             this.hostIndex = this.connectOptions.hosts.length;
             } else {
             this._disconnected(ERROR.CONNACK_RETURNCODE.code , format(ERROR.CONNACK_RETURNCODE, [wireMessage.returnCode, CONNACK_RC[wireMessage.returnCode]]));
             break;
             }
             
             // Resend messages.
             var sequencedMessages = new Array();
             for (var msgId in this._sentMessages) {
             if (this._sentMessages.hasOwnProperty(msgId))
             sequencedMessages.push(this._sentMessages[msgId]);
             }
             
             // Sort sentMessages into the original sent order.
             var sequencedMessages = sequencedMessages.sort(function(a,b) {return a.sequence - b.sequence;} );
             for (var i=0, len=sequencedMessages.length; i<len; i++) {
             var sentMessage = sequencedMessages[i];
             if (sentMessage.type == MESSAGE_TYPE.PUBLISH && sentMessage.pubRecReceived) {
             var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {messageIdentifier:sentMessage.messageIdentifier});
             this._schedule_message(pubRelMessage);
             } else {
             this._schedule_message(sentMessage);
             };
             }
             
             // Execute the connectOptions.onSuccess callback if there is one.
             if (this.connectOptions.onSuccess) {
             this.connectOptions.onSuccess({invocationContext:this.connectOptions.invocationContext});
             }
             
             // Process all queued messages now that the connection is established.
             this._process_queue();
             break;
             
             case MESSAGE_TYPE.PUBLISH:
             this._receivePublish(wireMessage);
             break;
             
             case MESSAGE_TYPE.PUBACK:
             var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
             // If this is a re flow of a PUBACK after we have restarted receivedMessage will not exist.
             if (sentMessage) {
             delete this._sentMessages[wireMessage.messageIdentifier];
             localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);
             if (this.onMessageDelivered)
             this.onMessageDelivered(sentMessage.payloadMessage);
             }
             break;
             
             case MESSAGE_TYPE.PUBREC:
             var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
             // If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
             if (sentMessage) {
             sentMessage.pubRecReceived = true;
             var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {messageIdentifier:wireMessage.messageIdentifier});
             this.store("Sent:", sentMessage);
             this._schedule_message(pubRelMessage);
             }
             break;
             
             case MESSAGE_TYPE.PUBREL:
             var receivedMessage = this._receivedMessages[wireMessage.messageIdentifier];
             localStorage.removeItem("Received:"+this._localKey+wireMessage.messageIdentifier);
             // If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
             if (receivedMessage) {
             this._receiveMessage(receivedMessage);
             delete this._receivedMessages[wireMessage.messageIdentifier];
             }
             // Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
             pubCompMessage = new WireMessage(MESSAGE_TYPE.PUBCOMP, {messageIdentifier:wireMessage.messageIdentifier});
             this._schedule_message(pubCompMessage);
             
             
             break;
             
             case MESSAGE_TYPE.PUBCOMP:
             var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
             delete this._sentMessages[wireMessage.messageIdentifier];
             localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);
             if (this.onMessageDelivered)
             this.onMessageDelivered(sentMessage.payloadMessage);
             break;
             
             case MESSAGE_TYPE.SUBACK:
             var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
             if (sentMessage) {
             if(sentMessage.timeOut)
             sentMessage.timeOut.cancel();
             if (sentMessage.callback) {
             sentMessage.callback();
             }
             delete this._sentMessages[wireMessage.messageIdentifier];
             }
             break;
             
             case MESSAGE_TYPE.UNSUBACK:
             var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
             if (sentMessage) {
             if (sentMessage.timeOut)
             sentMessage.timeOut.cancel();
             if (sentMessage.callback) {
             sentMessage.callback();
             }
             delete this._sentMessages[wireMessage.messageIdentifier];
             }
             
             break;
             
             case MESSAGE_TYPE.PINGRESP:
             /* The sendPinger or receivePinger may have sent a ping, the receivePinger has already been reset. */
             this.sendPinger.reset();
             break;
             
             case MESSAGE_TYPE.DISCONNECT:
             // Clients do not expect to receive disconnect packets.
             this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code , format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
             break;
             
             default:
             this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code , format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
             };
             } catch (error) {
             this._disconnected(ERROR.INTERNAL_ERROR.code , format(ERROR.INTERNAL_ERROR, [error.message]));
             return;
             }
             };
             
             /** @ignore */
             ClientImpl.prototype._on_socket_error = function (error) {
             this._disconnected(ERROR.SOCKET_ERROR.code , format(ERROR.SOCKET_ERROR, [error.data]));
             };
             
             /** @ignore */
             ClientImpl.prototype._on_socket_close = function () {
             this._disconnected(ERROR.SOCKET_CLOSE.code , format(ERROR.SOCKET_CLOSE));
             };
             
             /** @ignore */
             ClientImpl.prototype._socket_send = function (wireMessage) {
             if (wireMessage.type == 1) {
             var wireMessageMasked = this._traceMask(wireMessage, "password");
             this._trace("Client._socket_send", wireMessageMasked);
             }
             else this._trace("Client._socket_send", wireMessage);
             
             this.socket.send(wireMessage.encode());
             /* We have proved to the server we are alive. */
             this.sendPinger.reset();
             };
             
             /** @ignore */
             ClientImpl.prototype._receivePublish = function (wireMessage) {
             switch(wireMessage.payloadMessage.qos) {
             case "undefined":
             case 0:
             this._receiveMessage(wireMessage);
             break;
             
             case 1:
             var pubAckMessage = new WireMessage(MESSAGE_TYPE.PUBACK, {messageIdentifier:wireMessage.messageIdentifier});
             this._schedule_message(pubAckMessage);
             this._receiveMessage(wireMessage);
             break;
             
             case 2:
             this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
             this.store("Received:", wireMessage);
             var pubRecMessage = new WireMessage(MESSAGE_TYPE.PUBREC, {messageIdentifier:wireMessage.messageIdentifier});
             this._schedule_message(pubRecMessage);
             
             break;
             
             default:
             throw Error("Invaild qos="+wireMmessage.payloadMessage.qos);
             };
             };
             
             /** @ignore */
             ClientImpl.prototype._receiveMessage = function (wireMessage) {
             if (this.onMessageArrived) {
             this.onMessageArrived(wireMessage.payloadMessage);
             }
             };
             
             /**
              * @ignore
              * Client has disconnected either at its own request or because the server
              * or network disconnected it. Remove all non-durable state.
              * @param {errorCode} [number] the error number.
              * @param {errorText} [string] the error text.
              */
             ClientImpl.prototype._disconnected = function (errorCode, errorText) {
             this._trace("Client._disconnected", errorCode, errorText);
             
             this.sendPinger.cancel();
             this.receivePinger.cancel();
             if (this._connectTimeout)
             this._connectTimeout.cancel();
             // Clear message buffers.
             this._msg_queue = [];
             this._notify_msg_sent = {};
             
             if (this.socket) {
             // Cancel all socket callbacks so that they cannot be driven again by this socket.
             this.socket.onopen = null;
             this.socket.onmessage = null;
             this.socket.onerror = null;
             this.socket.onclose = null;
             if (this.socket.readyState === 1)
             this.socket.close();
             delete this.socket;
             }
             
             if (this.connectOptions.hosts && this.hostIndex < this.connectOptions.hosts.length-1) {
             // Try the next host.
             this.hostIndex++;
             this._doConnect(this.connectOptions.hosts[this.hostIndex], this.connectOptions.ports[this.hostIndex]);
             
             } else {
             
             if (errorCode === undefined) {
             errorCode = ERROR.OK.code;
             errorText = format(ERROR.OK);
             }
             
             // Run any application callbacks last as they may attempt to reconnect and hence create a new socket.
             if (this.connected) {
             this.connected = false;
             // Execute the connectionLostCallback if there is one, and we were connected.
             if (this.onConnectionLost)
             this.onConnectionLost({errorCode:errorCode, errorMessage:errorText});
             } else {
             // Otherwise we never had a connection, so indicate that the connect has failed.
             if(this.connectOptions.onFailure)
             this.connectOptions.onFailure({invocationContext:this.connectOptions.invocationContext, errorCode:errorCode, errorMessage:errorText});
             }
             }
             };
             
             /** @ignore */
             ClientImpl.prototype._trace = function () {
             if ( this._traceBuffer !== null ) {
             for (var i = 0, max = arguments.length; i < max; i++) {
             if ( this._traceBuffer.length == this._MAX_TRACE_ENTRIES ) {
             this._traceBuffer.shift();
             }
             if (i === 0) this._traceBuffer.push(arguments[i]);
             else if (typeof arguments[i] === "undefined" ) this._traceBuffer.push(arguments[i]);
             else this._traceBuffer.push("  "+JSON.stringify(arguments[i]));
             };
             };
             };
             
             /** @ignore */
             ClientImpl.prototype._traceMask = function (traceObject, masked) {
             var traceObjectMasked = {};
             for (var attr in traceObject) {
             if (traceObject.hasOwnProperty(attr)) {
             if (attr == masked)
             traceObjectMasked[attr] = "******";
             else
             traceObjectMasked[attr] = traceObject[attr];
             }
             }
             return traceObjectMasked;
             };
             
             // ------------------------------------------------------------------------
             // Public Programming interface.
             // ------------------------------------------------------------------------
             
             /**
              * The JavaScript application communicates to the server using a Messaging.Client object.
              * <p>
              * Other programming languages,
              * <a href="/clients/java/doc/javadoc/com/ibm/micro/client/mqttv3/MqttClient.html"><big>Java</big></a>,
              * <a href="/clients/c/doc/html/index.html"><big>C</big></a>.
              * <p>
              * Most applications will create just one Client object and then call its connect() method,
              * however applications can create more than one Client object if they wish.
              * In this case the combination of host, port and clientId attributes must be different for each Client object.
              * <p>
              * The send, subscribe and unsubscribe methods are implemented as asynchronous JavaScript methods
              * (even though the underlying protocol exchange might be synchronous in nature).
              * This means they signal their completion by calling back to the application,
              * via Success or Failure callback functions provided by the application on the method in question.
              * Such callbacks are called at most once per method invocation and do not persist beyond the lifetime
              * of the script that made the invocation.
              * <p>
              * In contrast there are some callback functions <i> most notably onMessageArrived</i>
              * that are defined on the Messaging.Client object.
              * These may get called multiple times, and aren't directly related to specific method invocations made by the client.
              *
              * @name Messaging.Client
              *
              * @constructor
              * Creates a Messaging.Client object that can be used to communicate with a Messaging server.
              *
              * @param {string} host the address of the messaging server, as a DNS name or dotted decimal IP address.
              * @param {number} port the port number in the host to connect to.
              * @param {string} clientId the Messaging client identifier, between 1 and 23 characters in length.
              *
              * @property {string} host <i>read only</i> the server's DNS hostname or dotted decimal IP address.
              * @property {number} port <i>read only</i> the server's port.
              * @property {string} clientId <i>read only</i> used when connecting to the server.
              * @property {function} onConnectionLost called when a connection has been lost,
              * after a connect() method has succeeded.
              * Establish the call back used when a connection has been lost. The connection may be
              * lost because the client initiates a disconnect or because the server or network
              * cause the client to be disconnected. The disconnect call back may be called without
              * the connectionComplete call back being invoked if, for example the client fails to
              * connect.
              * A single response object parameter is passed to the onConnectionLost callback containing the following fields:
              * <ol>
              * <li>errorCode
              * <li>errorMessage
              * </ol>
              * @property {function} onMessageDelivered called when a message has been delivered.
              * All processing that this Client will ever do has been completed. So, for example,
              * in the case of a Qos=2 message sent by this client, the PubComp flow has been received from the server
              * and the message has been removed from persistent storage before this callback is invoked.
              * Parameters passed to the onMessageDelivered callback are:
              * <ol>
              * <li>Messaging.Message that was delivered.
              * </ol>
              * @property {function} onMessageArrived called when a message has arrived in this Messaging.client.
              * Parameters passed to the onMessageArrived callback are:
              * <ol>
              * <li>Messaging.Message that has arrived.
              * </ol>
              */
             var Client = function (host, port, clientId) {
             if (typeof host !== "string")
             throw new Error(format(ERROR.INVALID_TYPE, [typeof host, "host"]));
             if (typeof port !== "number" || port < 0)
             throw new Error(format(ERROR.INVALID_TYPE, [typeof port, "port"]));
             
             var clientIdLength = 0;
             for (var i = 0; i<clientId.length; i++) {
             var charCode = clientId.charCodeAt(i);
             if (0xD800 <= charCode && charCode <= 0xDBFF)  {
             i++; // Surrogate pair.
             }
             clientIdLength++;
             }
             if (typeof clientId !== "string" || clientIdLength < 1 | clientIdLength > 23)
             throw new Error(format(ERROR.INVALID_ARGUMENT, [clientId, "clientId"]));
             
             var client = new ClientImpl(host, port, clientId);
             this._getHost =  function() { return client.host; };
             this._setHost = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };
             
             this._getPort = function() { return client.port; };
             this._setPort = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };
             
             this._getClientId = function() { return client.clientId; };
             this._setClientId = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };
             
             this._getOnConnectionLost = function() { return client.onConnectionLost; };
             this._setOnConnectionLost = function(newOnConnectionLost) {
             if (typeof newOnConnectionLost === "function")
             client.onConnectionLost = newOnConnectionLost;
             else
             throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnectionLost, "onConnectionLost"]));
             };
             
             this._getOnMessageDelivered = function() { return client.onMessageDelivered; };
             this._setOnMessageDelivered = function(newOnMessageDelivered) {
             if (typeof newOnMessageDelivered === "function")
             client.onMessageDelivered = newOnMessageDelivered;
             else
             throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageDelivered, "onMessageDelivered"]));
             };
             
             this._getOnMessageArrived = function() { return client.onMessageArrived; };
             this._setOnMessageArrived = function(newOnMessageArrived) {
             if (typeof newOnMessageArrived === "function")
             client.onMessageArrived = newOnMessageArrived;
             else
             throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageArrived, "onMessageArrived"]));
             };
             
             /**
              * Connect this Messaging client to its server.
              *
              * @name Messaging.Client#connect
              * @function
              * @param {Object} [connectOptions] attributes used with the connection.
              * <p>
              * Properties of the connect options are:
              * @config {number} [timeout] If the connect has not succeeded within this number of seconds, it is deemed to have failed.
              *                            The default is 30 seconds.
              * @config {string} [userName] Authentication username for this connection.
              * @config {string} [password] Authentication password for this connection.
              * @config {Messaging.Message} [willMessage] sent by the server when the client disconnects abnormally.
              * @config {Number} [keepAliveInterval] the server disconnects this client if there is no activity for this
              *                number of seconds. The default value of 60 seconds is assumed if not set.
              * @config {boolean} [cleanSession] if true(default) the client and server persistent state is deleted on successful connect.
              * @config {boolean} [useSSL] if present and true, use an SSL Websocket connection.
              * @config {object} [invocationContext] passed to the onSuccess callback or onFailure callback.
              * @config {function} [onSuccess] called when the connect acknowledgement has been received from the server.
              * A single response object parameter is passed to the onSuccess callback containing the following fields:
              * <ol>
              * <li>invocationContext as passed in to the onSuccess method in the connectOptions.
              * </ol>
              * @config {function} [onFailure] called when the connect request has failed or timed out.
              * A single response object parameter is passed to the onFailure callback containing the following fields:
              * <ol>
              * <li>invocationContext as passed in to the onFailure method in the connectOptions.
              * <li>errorCode a number indicating the nature of the error.
              * <li>errorMessage text describing the error.
              * </ol>
              * @config {Array} [hosts] If present this set of hostnames is tried in order in place
              * of the host and port paramater on the construtor. The hosts and the matching ports are tried one at at time in order until
              * one of then succeeds.
              * @config {Array} [ports] If present this set of ports matching the hosts.
              * @throws {InvalidState} if the client is not in disconnected state. The client must have received connectionLost
              * or disconnected before calling connect for a second or subsequent time.
              */
             this.connect = function (connectOptions) {
             connectOptions = connectOptions || {} ;
             validate(connectOptions,  {timeout:"number",
                      userName:"string",
                      password:"string",
                      willMessage:"object",
                      keepAliveInterval:"number",
                      cleanSession:"boolean",
                      useSSL:"boolean",
                      invocationContext:"object",
                      onSuccess:"function",
                      onFailure:"function",
                      hosts:"object",
                      ports:"object"});
             
             // If no keep alive interval is set, assume 60 seconds.
             if (connectOptions.keepAliveInterval === undefined)
             connectOptions.keepAliveInterval = 60;
             
             if (connectOptions.willMessage) {
             if (!(connectOptions.willMessage instanceof Message))
             throw new Error(format(ERROR.INVALID_TYPE, [connectOptions.willMessage, "connectOptions.willMessage"]));
             // The will message must have a payload that can be represented as a string.
             // Cause the willMessage to throw an exception if this is not the case.
             connectOptions.willMessage.stringPayload;
             
             if (typeof connectOptions.willMessage.destinationName === "undefined")
             throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.willMessage.destinationName, "connectOptions.willMessage.destinationName"]));
             }
             if (typeof connectOptions.cleanSession === "undefined")
             connectOptions.cleanSession = true;
             if (connectOptions.hosts) {
             if (!connectOptions.ports)
             throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
             if (!(connectOptions.hosts instanceof Array) )
             throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
             if (!(connectOptions.ports instanceof Array) )
             throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
             if (connectOptions.hosts.length <1 )
             throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
             if (connectOptions.hosts.length != connectOptions.ports.length)
             throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
             for (var i = 0; i<connectOptions.hosts.length; i++) {
             if (typeof connectOptions.hosts[i] !== "string")
             throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.hosts[i], "connectOptions.hosts["+i+"]"]));
             if (typeof connectOptions.ports[i] !== "number" || connectOptions.ports[i] < 0)
             throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.ports[i], "connectOptions.ports["+i+"]"]));
             }
             }
             
             client.connect(connectOptions);
             };
             
             /**
              * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
              *
              * @name Messaging.Client#subscribe
              * @function
              * @param {string} filter describing the destinations to receive messages from.
              * <br>
              * @param {object} [subscribeOptions] used to control the subscription, as follows:
              * <p>
              * @config {number} [qos] the maiximum qos of any publications sent as a result of making this subscription.
              * @config {object} [invocationContext] passed to the onSuccess callback or onFailure callback.
              * @config {function} [onSuccess] called when the subscribe acknowledgement has been received from the server.
              * A single response object parameter is passed to the onSuccess callback containing the following fields:
              * <ol>
              * <li>invocationContext if set in the subscribeOptions.
              * </ol>
              * @config {function} [onFailure] called when the subscribe request has failed or timed out.
              * A single response object parameter is passed to the onFailure callback containing the following fields:
              * <ol>
              * <li>invocationContext if set in the subscribeOptions.
              * <li>errorCode a number indicating the nature of the error.
              * <li>errorMessage text describing the error.
              * </ol>
              * @config {number} [timeout] which if present determines the number of seconds after which the onFailure calback is called
              * the presence of a timeout does not prevent the onSuccess callback from being called when the MQTT Suback is eventually received.
              * @throws {InvalidState} if the client is not in connected state.
              */
             this.subscribe = function (filter, subscribeOptions) {
             if (typeof filter !== "string")
             throw new Error("Invalid argument:"+filter);
             subscribeOptions = subscribeOptions || {} ;
             validate(subscribeOptions,  {qos:"number",
                      invocationContext:"object",
                      onSuccess:"function",
                      onFailure:"function",
                      timeout:"number"
                      });
             if (subscribeOptions.timeout && !subscribeOptions.onFailure)
             throw new Error("subscribeOptions.timeout specified with no onFailure callback.");
             if (typeof subscribeOptions.qos !== "undefined"
                 && !(subscribeOptions.qos === 0 || subscribeOptions.qos === 1 || subscribeOptions.qos === 2 ))
             throw new Error(format(ERROR.INVALID_ARGUMENT, [subscribeOptions.qos, "subscribeOptions.qos"]));
             client.subscribe(filter, subscribeOptions);
             };
             
             /**
              * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
              *
              * @name Messaging.Client#unsubscribe
              * @function
              * @param {string} filter describing the destinations to receive messages from.
              * @param {object} [unsubscribeOptions] used to control the subscription, as follows:
              * <p>
              * @config {object} [invocationContext] passed to the onSuccess callback or onFailure callback.
              * @config {function} [onSuccess] called when the unsubscribe acknowledgement has been receive dfrom the server.
              * A single response object parameter is passed to the onSuccess callback containing the following fields:
              * <ol>
              * <li>invocationContext if set in the unsubscribeOptions.
              * </ol>
              * @config {function} [onFailure] called when the unsubscribe request has failed or timed out.
              * A single response object parameter is passed to the onFailure callback containing the following fields:
              * <ol>
              * <li>invocationContext if set in the unsubscribeOptions.
              * <li>errorCode a number indicating the nature of the error.
              * <li>errorMessage text describing the error.
              * </ol>
              * @config {number} [timeout] which if present determines the number of seconds after which the onFailure callback is called, the
              * presence of a timeout does not prevent the onSuccess callback from being called when the MQTT UnSuback is eventually received.
              * @throws {InvalidState} if the client is not in connected state.
              */
             this.unsubscribe = function (filter, unsubscribeOptions) {
             if (typeof filter !== "string")
             throw new Error("Invalid argument:"+filter);
             unsubscribeOptions = unsubscribeOptions || {} ;
             validate(unsubscribeOptions,  {invocationContext:"object",
                      onSuccess:"function",
                      onFailure:"function",
                      timeout:"number"
                      });
             if (unsubscribeOptions.timeout && !unsubscribeOptions.onFailure)
             throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");
             client.unsubscribe(filter, unsubscribeOptions);
             };
             
             /**
              * Send a message to the consumers of the destination in the Message.
              *
              * @name Messaging.Client#send
              * @function
              * @param {Messaging.Message} message to send.
              
              * @throws {InvalidState} if the client is not in connected state.
              */   
             this.send = function (message) {       	
             if (!(message instanceof Message))
             throw new Error("Invalid argument:"+typeof message);
             if (typeof message.destinationName === "undefined")
             throw new Error("Invalid parameter Message.destinationName:"+message.destinationName);
             
             client.send(message);   
             };
             
             /** 
              * Normal disconnect of this Messaging client from its server.
              * 
              * @name Messaging.Client#disconnect
              * @function
              * @throws {InvalidState} if the client is not in connected or connecting state.     
              */
             this.disconnect = function () {
             client.disconnect();
             };
             
             /** 
              * Get the contents of the trace log.
              * 
              * @name Messaging.Client#getTraceLog
              * @function
              * @return {Object[]} tracebuffer containing the time ordered trace records.
              */
             this.getTraceLog = function () {
             return client.getTraceLog();
             }
             
             /** 
              * Start tracing.
              * 
              * @name Messaging.Client#startTrace
              * @function
              */
             this.startTrace = function () {
             client.startTrace();
             };
             
             /** 
              * Stop tracing.
              * 
              * @name Messaging.Client#stopTrace
              * @function
              */
             this.stopTrace = function () {
             client.stopTrace();
             };
             };
             
             Client.prototype = {
             get host() { return this._getHost(); },
             set host(newHost) { this._setHost(newHost); },
             
             get port() { return this._getPort(); },
             set port(newPort) { this._setPort(newPort); },
             
             get clientId() { return this._getClientId(); },
             set clientId(newClientId) { this._setClientId(newClientId); },
             
             get onConnectionLost() { return this._getOnConnectionLost(); },
             set onConnectionLost(newOnConnectionLost) { this._setOnConnectionLost(newOnConnectionLost); },
             
             get onMessageDelivered() { return this._getOnMessageDelivered(); },
             set onMessageDelivered(newOnMessageDelivered) { this._setOnMessageDelivered(newOnMessageDelivered); },
             
             get onMessageArrived() { return this._getOnMessageArrived(); },
             set onMessageArrived(newOnMessageArrived) { this._setOnMessageArrived(newOnMessageArrived); }
             };
             
             /** 
              * An application message, sent or received.
              * <p>
              * Other programming languages,
              * <a href="/clients/java/doc/javadoc/com/ibm/micro/client/mqttv3/MqttMessage.html"><big>Java</big></a>,
              * <a href="/clients/c/doc/html/struct_m_q_t_t_client__message.html"><big>C</big></a>.
              * <p>
              * All attributes may be null, which implies the default values.
              * 
              * @name Messaging.Message
              * @constructor
              * @param {String|ArrayBuffer} payload The message data to be sent.
              * <p>
              * @property {string} payloadString <i>read only</i> The payload as a string if the payload consists of valid UTF-8 characters.
              * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an ArrayBuffer.
              * <p>
              * @property {string} destinationName <b>mandatory</b> The name of the destination to which the message is to be sent
              *                    (for messages about to be sent) or the name of the destination from which the message has been received.
              *                    (for messages received by the onMessage function).
              * <p>
              * @property {number} qos The Quality of Service used to deliver the message.
              * <dl>
              *     <dt>0 Best effort (default).
              *     <dt>1 At least once.
              *     <dt>2 Exactly once.     
              * </dl>
              * <p>
              * @property {Boolean} retained If true, the message is to be retained by the server and delivered 
              *                     to both current and future subscriptions.
              *                     If false the server only delivers the message to current subscribers, this is the default for new Messages. 
              *                     A received message has the retained boolean set to true if the message was published 
              *                     with the retained boolean set to true
              *                     and the subscrption was made after the message has been published. 
              * <p>
              * @property {Boolean} duplicate <i>read only</i> If true, this message might be a duplicate of one which has already been received. 
              *                     This is only set on messages received from the server.
              *                     
              */
             var Message = function (newPayload) {  
             var payload;
             if (   typeof newPayload === "string" 
                 || newPayload instanceof ArrayBuffer
                 || newPayload instanceof Int8Array
                 || newPayload instanceof Uint8Array
                 || newPayload instanceof Int16Array
                 || newPayload instanceof Uint16Array
                 || newPayload instanceof Int32Array
                 || newPayload instanceof Uint32Array
                 || newPayload instanceof Float32Array
                 || newPayload instanceof Float64Array
                 ) {
             payload = newPayload;
             } else {
             throw (format(ERROR.INVALID_ARGUMENT, [newPayload, "newPayload"]));
             }
             
             this._getPayloadString = function () {
             if (typeof payload === "string")
             return payload;
             else
             return parseUTF8(payload, 0, payload.length); 
             };
             
             this._getPayloadBytes = function() {
             if (typeof payload === "string") {
             var buffer = new ArrayBuffer(UTF8Length(payload));
             var byteStream = new Uint8Array(buffer); 
             stringToUTF8(payload, byteStream, 0);
             
             return byteStream;
             } else {
             return payload;
             };
             };
             
             var destinationName = undefined;
             this._getDestinationName = function() { return destinationName; };
             this._setDestinationName = function(newDestinationName) { 
             if (typeof newDestinationName === "string")
             destinationName = newDestinationName;
             else 
             throw new Error(format(ERROR.INVALID_ARGUMENT, [newDestinationName, "newDestinationName"]));
             };
             
             var qos = 0;
             this._getQos = function() { return qos; };
             this._setQos = function(newQos) { 
             if (newQos === 0 || newQos === 1 || newQos === 2 )
             qos = newQos;
             else 
             throw new Error("Invalid argument:"+newQos);
             };
             
             var retained = false;
             this._getRetained = function() { return retained; };
             this._setRetained = function(newRetained) { 
             if (typeof newRetained === "boolean")
             retained = newRetained;
             else 
             throw new Error(format(ERROR.INVALID_ARGUMENT, [newRetained, "newRetained"]));
             };
             
             var duplicate = false;
             this._getDuplicate = function() { return duplicate; };
             this._setDuplicate = function(newDuplicate) { duplicate = newDuplicate; };
             };
             
             Message.prototype = {
             get payloadString() { return this._getPayloadString(); },
             get payloadBytes() { return this._getPayloadBytes(); },
             
             get destinationName() { return this._getDestinationName(); },
             set destinationName(newDestinationName) { this._setDestinationName(newDestinationName); },
             
             get qos() { return this._getQos(); },
             set qos(newQos) { this._setQos(newQos); },
             
             get retained() { return this._getRetained(); },
             set retained(newRetained) { this._setRetained(newRetained); },
             
             get duplicate() { return this._getDuplicate(); },
             set duplicate(newDuplicate) { this._setDuplicate(newDuplicate); }
             };
             
             // Module contents.
             return {
             Client: Client,
             Message: Message
             };
             })(window);
