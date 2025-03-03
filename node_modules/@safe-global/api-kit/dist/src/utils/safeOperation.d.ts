import { SafeOperation } from '@safe-global/safe-core-sdk-types';
export declare const getAddSafeOperationProps: (safeOperation: SafeOperation) => Promise<{
    entryPoint: string;
    moduleAddress: string;
    safeAddress: string;
    userOperation: import("@safe-global/safe-core-sdk-types").UserOperation;
    options: {
        validAfter: number;
        validUntil: number;
    };
}>;
