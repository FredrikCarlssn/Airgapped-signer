import { Signer } from 'ethers';
export declare function signDelegate(signer: Signer, delegateAddress: string, chainId: bigint): Promise<string>;
