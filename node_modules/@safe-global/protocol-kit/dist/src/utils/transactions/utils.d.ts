import { AddOwnerTxParams, AddPasskeyOwnerTxParams, PasskeyArgType, RemoveOwnerTxParams, RemovePasskeyOwnerTxParams, StandardizeSafeTransactionDataProps, SwapOwnerTxParams } from '../../types';
import { MetaTransactionData, SafeMultisigTransactionResponse, SafeTransaction, SafeTransactionData, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
export declare function standardizeMetaTransactionData(tx: SafeTransactionDataPartial): MetaTransactionData;
export declare function standardizeSafeTransactionData({ safeContract, predictedSafe, provider, tx, contractNetworks }: StandardizeSafeTransactionDataProps): Promise<SafeTransactionData>;
export declare function encodeMultiSendData(txs: MetaTransactionData[]): string;
export declare function decodeMultiSendData(encodedData: string): MetaTransactionData[];
export declare function isSafeMultisigTransactionResponse(safeTransaction: SafeTransaction | SafeMultisigTransactionResponse): safeTransaction is SafeMultisigTransactionResponse;
type PasskeyParam = {
    passkey: PasskeyArgType;
};
export declare function isPasskeyParam(params: AddOwnerTxParams | AddPasskeyOwnerTxParams | RemoveOwnerTxParams | RemovePasskeyOwnerTxParams): params is PasskeyParam;
export declare function isOldOwnerPasskey(params: SwapOwnerTxParams): params is SwapOwnerTxParams & {
    oldOwnerPasskey: PasskeyArgType;
};
export declare function isNewOwnerPasskey(params: SwapOwnerTxParams): params is SwapOwnerTxParams & {
    newOwnerPasskey: PasskeyArgType;
};
export {};
