/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const SmmpHeader = $root.SmmpHeader = (() => {

    /**
     * Properties of a SmmpHeader.
     * @name ISmmpHeader
     * @interface ISmmpHeader
     * @property {number|null} [magic] SmmpHeader magic
     * @property {Uint8Array|null} [control] SmmpHeader control
     * @property {number|null} [payloadLen] SmmpHeader payloadLen
     * @property {number|null} [blockNum] SmmpHeader blockNum
     * @property {number|null} [totalBlocks] SmmpHeader totalBlocks
     * @property {string|null} [uuid] SmmpHeader uuid
     */

    /**
     * Constructs a new SmmpHeader.
     * @name SmmpHeader
     * @classdesc Represents a SmmpHeader.
     * @implements ISmmpHeader
     * @constructor
     * @param {ISmmpHeader=} [properties] Properties to set
     */
    function SmmpHeader(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SmmpHeader magic.
     * @member {number} magic
     * @memberof SmmpHeader
     * @instance
     */
    SmmpHeader.prototype.magic = 0;

    /**
     * SmmpHeader control.
     * @member {Uint8Array} control
     * @memberof SmmpHeader
     * @instance
     */
    SmmpHeader.prototype.control = $util.newBuffer([]);

    /**
     * SmmpHeader payloadLen.
     * @member {number} payloadLen
     * @memberof SmmpHeader
     * @instance
     */
    SmmpHeader.prototype.payloadLen = 0;

    /**
     * SmmpHeader blockNum.
     * @member {number} blockNum
     * @memberof SmmpHeader
     * @instance
     */
    SmmpHeader.prototype.blockNum = 0;

    /**
     * SmmpHeader totalBlocks.
     * @member {number} totalBlocks
     * @memberof SmmpHeader
     * @instance
     */
    SmmpHeader.prototype.totalBlocks = 0;

    /**
     * SmmpHeader uuid.
     * @member {string} uuid
     * @memberof SmmpHeader
     * @instance
     */
    SmmpHeader.prototype.uuid = "";

    /**
     * Creates a new SmmpHeader instance using the specified properties.
     * @function create
     * @memberof SmmpHeader
     * @static
     * @param {ISmmpHeader=} [properties] Properties to set
     * @returns {SmmpHeader} SmmpHeader instance
     */
    SmmpHeader.create = function create(properties) {
        return new SmmpHeader(properties);
    };

    /**
     * Encodes the specified SmmpHeader message. Does not implicitly {@link SmmpHeader.verify|verify} messages.
     * @function encode
     * @memberof SmmpHeader
     * @static
     * @param {ISmmpHeader} message SmmpHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SmmpHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.magic != null && Object.hasOwnProperty.call(message, "magic"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.magic);
        if (message.control != null && Object.hasOwnProperty.call(message, "control"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.control);
        if (message.payloadLen != null && Object.hasOwnProperty.call(message, "payloadLen"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.payloadLen);
        if (message.blockNum != null && Object.hasOwnProperty.call(message, "blockNum"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.blockNum);
        if (message.totalBlocks != null && Object.hasOwnProperty.call(message, "totalBlocks"))
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.totalBlocks);
        if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.uuid);
        return writer;
    };

    /**
     * Encodes the specified SmmpHeader message, length delimited. Does not implicitly {@link SmmpHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SmmpHeader
     * @static
     * @param {ISmmpHeader} message SmmpHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SmmpHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SmmpHeader message from the specified reader or buffer.
     * @function decode
     * @memberof SmmpHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SmmpHeader} SmmpHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SmmpHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SmmpHeader();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.magic = reader.int32();
                    break;
                }
            case 2: {
                    message.control = reader.bytes();
                    break;
                }
            case 3: {
                    message.payloadLen = reader.uint32();
                    break;
                }
            case 4: {
                    message.blockNum = reader.uint32();
                    break;
                }
            case 5: {
                    message.totalBlocks = reader.uint32();
                    break;
                }
            case 6: {
                    message.uuid = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SmmpHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SmmpHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SmmpHeader} SmmpHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SmmpHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SmmpHeader message.
     * @function verify
     * @memberof SmmpHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SmmpHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.magic != null && message.hasOwnProperty("magic"))
            if (!$util.isInteger(message.magic))
                return "magic: integer expected";
        if (message.control != null && message.hasOwnProperty("control"))
            if (!(message.control && typeof message.control.length === "number" || $util.isString(message.control)))
                return "control: buffer expected";
        if (message.payloadLen != null && message.hasOwnProperty("payloadLen"))
            if (!$util.isInteger(message.payloadLen))
                return "payloadLen: integer expected";
        if (message.blockNum != null && message.hasOwnProperty("blockNum"))
            if (!$util.isInteger(message.blockNum))
                return "blockNum: integer expected";
        if (message.totalBlocks != null && message.hasOwnProperty("totalBlocks"))
            if (!$util.isInteger(message.totalBlocks))
                return "totalBlocks: integer expected";
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            if (!$util.isString(message.uuid))
                return "uuid: string expected";
        return null;
    };

    /**
     * Creates a SmmpHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SmmpHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SmmpHeader} SmmpHeader
     */
    SmmpHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.SmmpHeader)
            return object;
        let message = new $root.SmmpHeader();
        if (object.magic != null)
            message.magic = object.magic | 0;
        if (object.control != null)
            if (typeof object.control === "string")
                $util.base64.decode(object.control, message.control = $util.newBuffer($util.base64.length(object.control)), 0);
            else if (object.control.length >= 0)
                message.control = object.control;
        if (object.payloadLen != null)
            message.payloadLen = object.payloadLen >>> 0;
        if (object.blockNum != null)
            message.blockNum = object.blockNum >>> 0;
        if (object.totalBlocks != null)
            message.totalBlocks = object.totalBlocks >>> 0;
        if (object.uuid != null)
            message.uuid = String(object.uuid);
        return message;
    };

    /**
     * Creates a plain object from a SmmpHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SmmpHeader
     * @static
     * @param {SmmpHeader} message SmmpHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SmmpHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.magic = 0;
            if (options.bytes === String)
                object.control = "";
            else {
                object.control = [];
                if (options.bytes !== Array)
                    object.control = $util.newBuffer(object.control);
            }
            object.payloadLen = 0;
            object.blockNum = 0;
            object.totalBlocks = 0;
            object.uuid = "";
        }
        if (message.magic != null && message.hasOwnProperty("magic"))
            object.magic = message.magic;
        if (message.control != null && message.hasOwnProperty("control"))
            object.control = options.bytes === String ? $util.base64.encode(message.control, 0, message.control.length) : options.bytes === Array ? Array.prototype.slice.call(message.control) : message.control;
        if (message.payloadLen != null && message.hasOwnProperty("payloadLen"))
            object.payloadLen = message.payloadLen;
        if (message.blockNum != null && message.hasOwnProperty("blockNum"))
            object.blockNum = message.blockNum;
        if (message.totalBlocks != null && message.hasOwnProperty("totalBlocks"))
            object.totalBlocks = message.totalBlocks;
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            object.uuid = message.uuid;
        return object;
    };

    /**
     * Converts this SmmpHeader to JSON.
     * @function toJSON
     * @memberof SmmpHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SmmpHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for SmmpHeader
     * @function getTypeUrl
     * @memberof SmmpHeader
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    SmmpHeader.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/SmmpHeader";
    };

    return SmmpHeader;
})();

export const SmmpMessage = $root.SmmpMessage = (() => {

    /**
     * Properties of a SmmpMessage.
     * @name ISmmpMessage
     * @interface ISmmpMessage
     * @property {ISmmpHeader|null} [header] SmmpMessage header
     * @property {Uint8Array|null} [data] SmmpMessage data
     */

    /**
     * Constructs a new SmmpMessage.
     * @name SmmpMessage
     * @classdesc Represents a SmmpMessage.
     * @implements ISmmpMessage
     * @constructor
     * @param {ISmmpMessage=} [properties] Properties to set
     */
    function SmmpMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SmmpMessage header.
     * @member {ISmmpHeader|null|undefined} header
     * @memberof SmmpMessage
     * @instance
     */
    SmmpMessage.prototype.header = null;

    /**
     * SmmpMessage data.
     * @member {Uint8Array} data
     * @memberof SmmpMessage
     * @instance
     */
    SmmpMessage.prototype.data = $util.newBuffer([]);

    /**
     * Creates a new SmmpMessage instance using the specified properties.
     * @function create
     * @memberof SmmpMessage
     * @static
     * @param {ISmmpMessage=} [properties] Properties to set
     * @returns {SmmpMessage} SmmpMessage instance
     */
    SmmpMessage.create = function create(properties) {
        return new SmmpMessage(properties);
    };

    /**
     * Encodes the specified SmmpMessage message. Does not implicitly {@link SmmpMessage.verify|verify} messages.
     * @function encode
     * @memberof SmmpMessage
     * @static
     * @param {ISmmpMessage} message SmmpMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SmmpMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.header != null && Object.hasOwnProperty.call(message, "header"))
            $root.SmmpHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified SmmpMessage message, length delimited. Does not implicitly {@link SmmpMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SmmpMessage
     * @static
     * @param {ISmmpMessage} message SmmpMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SmmpMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SmmpMessage message from the specified reader or buffer.
     * @function decode
     * @memberof SmmpMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SmmpMessage} SmmpMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SmmpMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SmmpMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.header = $root.SmmpHeader.decode(reader, reader.uint32());
                    break;
                }
            case 2: {
                    message.data = reader.bytes();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SmmpMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SmmpMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SmmpMessage} SmmpMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SmmpMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SmmpMessage message.
     * @function verify
     * @memberof SmmpMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SmmpMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.header != null && message.hasOwnProperty("header")) {
            let error = $root.SmmpHeader.verify(message.header);
            if (error)
                return "header." + error;
        }
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        return null;
    };

    /**
     * Creates a SmmpMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SmmpMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SmmpMessage} SmmpMessage
     */
    SmmpMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.SmmpMessage)
            return object;
        let message = new $root.SmmpMessage();
        if (object.header != null) {
            if (typeof object.header !== "object")
                throw TypeError(".SmmpMessage.header: object expected");
            message.header = $root.SmmpHeader.fromObject(object.header);
        }
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length >= 0)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a SmmpMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SmmpMessage
     * @static
     * @param {SmmpMessage} message SmmpMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SmmpMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.header = null;
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
        }
        if (message.header != null && message.hasOwnProperty("header"))
            object.header = $root.SmmpHeader.toObject(message.header, options);
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        return object;
    };

    /**
     * Converts this SmmpMessage to JSON.
     * @function toJSON
     * @memberof SmmpMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SmmpMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for SmmpMessage
     * @function getTypeUrl
     * @memberof SmmpMessage
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    SmmpMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/SmmpMessage";
    };

    return SmmpMessage;
})();

export { $root as default };
