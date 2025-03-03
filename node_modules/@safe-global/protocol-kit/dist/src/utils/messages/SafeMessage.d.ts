import { EIP712TypedData, SafeMessage, SafeSignature } from '@safe-global/safe-core-sdk-types';
declare class EthSafeMessage implements SafeMessage {
    data: EIP712TypedData | string;
    signatures: Map<string, SafeSignature>;
    constructor(data: EIP712TypedData | string);
    getSignature(signer: string): SafeSignature | undefined;
    addSignature(signature: SafeSignature): void;
    encodedSignatures(): string;
}
export default EthSafeMessage;
