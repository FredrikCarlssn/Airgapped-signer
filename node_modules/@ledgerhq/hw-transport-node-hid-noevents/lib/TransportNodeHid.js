"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevices = void 0;
const node_hid_1 = __importDefault(require("node-hid"));
const hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
const devices_1 = require("@ledgerhq/devices");
const hid_framing_1 = __importDefault(require("@ledgerhq/devices/hid-framing"));
const devices_2 = require("@ledgerhq/devices");
const errors_1 = require("@ledgerhq/errors");
const filterInterface = device => ["win32", "darwin"].includes(process.platform)
    ? device.usagePage === 0xffa0
    : device.interface === 0;
function getDevices() {
    return node_hid_1.default.devices(devices_1.ledgerUSBVendorId, 0x0).filter(filterInterface);
}
exports.getDevices = getDevices;
/**
 * node-hid Transport minimal implementation
 * @example
 * import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-noevents";
 * ...
 * TransportNodeHid.create().then(transport => ...)
 */
class TransportNodeHidNoEvents extends hw_transport_1.default {
    /**
     * if path="" is not provided, the library will take the first device
     */
    static open(path) {
        return Promise.resolve().then(() => {
            if (path) {
                return new TransportNodeHidNoEvents(new node_hid_1.default.HID(path));
            }
            const device = getDevices()[0];
            if (!device)
                throw new errors_1.TransportError("NoDevice", "NoDevice");
            return new TransportNodeHidNoEvents(new node_hid_1.default.HID(device.path));
        });
    }
    constructor(device, { context, logType } = {}) {
        super({ context, logType });
        this.channel = Math.floor(Math.random() * 0xffff);
        this.packetSize = 64;
        this.disconnected = false;
        this.setDisconnected = () => {
            this.tracer.trace("Setting to disconnected", { alreadyDisconnected: this.disconnected });
            if (!this.disconnected) {
                this.emit("disconnect");
                this.disconnected = true;
            }
        };
        this.writeHID = (content) => {
            const data = [0x00];
            for (let i = 0; i < content.length; i++) {
                data.push(content[i]);
            }
            try {
                this.device.write(data);
                return Promise.resolve();
            }
            catch (error) {
                this.tracer.trace(`Received an error during HID write: ${error}`, { error });
                let maybeMappedError = error;
                if (error instanceof Error) {
                    maybeMappedError = new errors_1.DisconnectedDeviceDuringOperation(error.message);
                }
                if (maybeMappedError instanceof errors_1.DisconnectedDeviceDuringOperation) {
                    this.tracer.trace("Disconnected during HID write");
                    this.setDisconnected();
                }
                return Promise.reject(maybeMappedError);
            }
        };
        this.readHID = () => new Promise((resolve, reject) => this.device.read((e, res) => {
            if (!res) {
                return reject(new errors_1.DisconnectedDevice());
            }
            if (e) {
                this.tracer.trace(`Received an error during HID read: ${e}`, { e });
                const maybeMappedError = e && e.message ? new errors_1.DisconnectedDeviceDuringOperation(e.message) : e;
                if (maybeMappedError instanceof errors_1.DisconnectedDeviceDuringOperation) {
                    this.tracer.trace("Disconnected during HID read");
                    this.setDisconnected();
                }
                reject(maybeMappedError);
            }
            else {
                const buffer = Buffer.from(res);
                resolve(buffer);
            }
        }));
        this.updateTraceContext({ hidChannel: this.channel });
        this.device = device;
        // @ts-expect-error accessing low level API in C
        const info = device.getDeviceInfo();
        this.tracer.trace(`Connected to HID device ${!!info}`, { info });
        this.deviceModel = info && info.product ? (0, devices_2.identifyProductName)(info.product) : null;
    }
    /**
     * Exchange with the device using APDU protocol.
     *
     * @param apdu
     * @returns a promise of apdu response
     */
    exchange(apdu) {
        return __awaiter(this, void 0, void 0, function* () {
            const tracer = this.tracer.withUpdatedContext({
                function: "exchange",
            });
            tracer.trace("Exchanging APDU ...");
            const b = yield this.exchangeAtomicImpl(() => __awaiter(this, void 0, void 0, function* () {
                const { channel, packetSize } = this;
                tracer.withType("apdu").trace(`=> ${apdu.toString("hex")}`, { channel, packetSize });
                const framingHelper = (0, hid_framing_1.default)(channel, packetSize);
                // Creates HID-framed chunks from the APDU to be sent to the device...
                const blocks = framingHelper.makeBlocks(apdu);
                for (let i = 0; i < blocks.length; i++) {
                    yield this.writeHID(blocks[i]);
                }
                // Read...
                let result;
                let acc;
                while (!(result = framingHelper.getReducedResult(acc))) {
                    const buffer = yield this.readHID();
                    acc = framingHelper.reduceResponse(acc, buffer);
                }
                tracer.withType("apdu").trace(`<= ${result.toString("hex")}`, { channel, packetSize });
                return result;
            }));
            return b;
        });
    }
    setScrambleKey() { }
    /**
     * release the USB device.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exchangeBusyPromise;
            this.device.close();
        });
    }
}
/**
 *
 */
TransportNodeHidNoEvents.isSupported = () => Promise.resolve(typeof node_hid_1.default.HID === "function");
/**
 *
 */
TransportNodeHidNoEvents.list = () => Promise.resolve(getDevices().map(d => d.path));
/**
 */
TransportNodeHidNoEvents.listen = (observer) => {
    getDevices().forEach(device => {
        const deviceModel = (0, devices_2.identifyUSBProductId)(device.productId);
        observer.next({
            type: "add",
            descriptor: device.path,
            deviceModel,
            device: device,
        });
    });
    observer.complete();
    return {
        unsubscribe: () => { },
    };
};
exports.default = TransportNodeHidNoEvents;
//# sourceMappingURL=TransportNodeHid.js.map