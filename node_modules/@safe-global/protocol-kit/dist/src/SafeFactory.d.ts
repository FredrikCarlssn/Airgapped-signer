import Safe from './Safe';
import { SafeAccountConfig, SafeFactoryConfig, DeploySafeProps } from './types';
import { SafeVersion } from '@safe-global/safe-core-sdk-types';
import SafeProvider from './SafeProvider';
declare class SafeFactory {
    #private;
    static init({ provider, signer, safeVersion, isL1SafeSingleton, contractNetworks }: SafeFactoryConfig): Promise<SafeFactory>;
    getSafeProvider(): SafeProvider;
    getSafeVersion(): SafeVersion;
    getAddress(): Promise<string>;
    getChainId(): Promise<bigint>;
    predictSafeAddress(safeAccountConfig: SafeAccountConfig, saltNonce?: string): Promise<string>;
    deploySafe({ safeAccountConfig, saltNonce, options, callback }: DeploySafeProps): Promise<Safe>;
}
export default SafeFactory;
