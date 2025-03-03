import { TransactionResponse, AbstractSigner, Provider } from 'ethers';
import { Eip3770Address, SafeEIP712Args, SafeVersion } from '@safe-global/safe-core-sdk-types';
import { SafeProviderTransaction, GetContractProps, SafeProviderConfig, SafeSigner, SafeConfig, ContractNetworksConfig } from './types';
declare class SafeProvider {
    #private;
    provider: SafeProviderConfig['provider'];
    signer?: SafeSigner;
    constructor({ provider, signer }: {
        provider: SafeProviderConfig['provider'];
        signer?: SafeSigner;
    });
    getExternalProvider(): Provider;
    static init(provider: SafeConfig['provider'], signer?: SafeConfig['signer'], safeVersion?: SafeVersion, contractNetworks?: ContractNetworksConfig, safeAddress?: string, owners?: string[]): Promise<SafeProvider>;
    getExternalSigner(): Promise<AbstractSigner | undefined>;
    isPasskeySigner(): Promise<boolean>;
    isAddress(address: string): boolean;
    getEip3770Address(fullAddress: string): Promise<Eip3770Address>;
    getBalance(address: string, blockTag?: string | number): Promise<bigint>;
    getNonce(address: string, blockTag?: string | number): Promise<number>;
    getChainId(): Promise<bigint>;
    getChecksummedAddress(address: string): string;
    getSafeContract({ safeVersion, customContractAddress, customContractAbi, isL1SafeSingleton }: GetContractProps): Promise<import("./contracts/Safe/v1.0.0/SafeContract_v1_0_0").default | import("./contracts/Safe/v1.1.1/SafeContract_v1_1_1").default | import("./contracts/Safe/v1.2.0/SafeContract_v1_2_0").default | import("./contracts/Safe/v1.3.0/SafeContract_v1_3_0").default | import("./contracts/Safe/v1.4.1/SafeContract_v1_4_1").default>;
    getSafeProxyFactoryContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/SafeProxyFactory/v1.0.0/SafeProxyFactoryContract_v1_0_0").default | import("./contracts/SafeProxyFactory/v1.1.1/SafeProxyFactoryContract_v1_1_1").default | import("./contracts/SafeProxyFactory/v1.3.0/SafeProxyFactoryContract_v1_3_0").default | import("./contracts/SafeProxyFactory/v1.4.1/SafeProxyFactoryContract_v1_4_1").default>;
    getMultiSendContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/MultiSend/v1.1.1/MultiSendContract_v1_1_1").default | import("./contracts/MultiSend/v1.3.0/MultiSendContract_v1_3_0").default | import("./contracts/MultiSend/v1.4.1/MultiSendContract_v1_4_1").default>;
    getMultiSendCallOnlyContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/MultiSend/v1.4.1/MultiSendCallOnlyContract_v1_4_1").default | import("./contracts/MultiSend/v1.3.0/MultiSendCallOnlyContract_v1_3_0").default>;
    getCompatibilityFallbackHandlerContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/CompatibilityFallbackHandler/v1.3.0/CompatibilityFallbackHandlerContract_v1_3_0").default | import("./contracts/CompatibilityFallbackHandler/v1.4.1/CompatibilityFallbackHandlerContract_v1_4_1").default>;
    getSignMessageLibContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/SignMessageLib/v1.3.0/SignMessageLibContract_v1_3_0").default | import("./contracts/SignMessageLib/v1.4.1/SignMessageLibContract_v1_4_1").default>;
    getCreateCallContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/CreateCall/v1.3.0/CreateCallContract_v1_3_0").default | import("./contracts/CreateCall/v1.4.1/CreateCallContract_v1_4_1").default>;
    getSimulateTxAccessorContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/SimulateTxAccessor/v1.3.0/SimulateTxAccessorContract_v1_3_0").default | import("./contracts/SimulateTxAccessor/v1.4.1/SimulateTxAccessorContract_v1_4_1").default>;
    getSafeWebAuthnSignerFactoryContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/SafeWebAuthnSignerFactory/v0.2.1/SafeWebAuthnSignerFactoryContract_v0_2_1").default>;
    getSafeWebAuthnSharedSignerContract({ safeVersion, customContractAddress, customContractAbi }: GetContractProps): Promise<import("./contracts/SafeWebAuthnSharedSigner/v0.2.1/SafeWebAuthnSharedSignerContract_v0_2_1").default>;
    getContractCode(address: string, blockTag?: string | number): Promise<string>;
    isContractDeployed(address: string, blockTag?: string | number): Promise<boolean>;
    getStorageAt(address: string, position: string): Promise<string>;
    getTransaction(transactionHash: string): Promise<TransactionResponse>;
    getSignerAddress(): Promise<string | undefined>;
    signMessage(message: string): Promise<string>;
    signTypedData(safeEIP712Args: SafeEIP712Args): Promise<string>;
    estimateGas(transaction: SafeProviderTransaction): Promise<string>;
    call(transaction: SafeProviderTransaction, blockTag?: string | number): Promise<string>;
    encodeParameters(types: string[], values: any[]): string;
    decodeParameters(types: string[], values: string): {
        [key: string]: any;
    };
}
export default SafeProvider;
