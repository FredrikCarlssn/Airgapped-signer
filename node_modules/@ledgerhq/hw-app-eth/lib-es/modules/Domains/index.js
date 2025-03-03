var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ledgerService from "../../services/ledger";
/**
 * @ignore for the README
 *
 * This method will execute the pipeline of actions necessary for clear signing domains.
 * Signature is provided by the backend used in @ledgerhq/domain-service
 */
export const domainResolutionFlow = (appBinding, domainDescriptor) => __awaiter(void 0, void 0, void 0, function* () {
    if (!domainDescriptor)
        return;
    const { domain, address, registry, type } = domainDescriptor;
    const challenge = yield appBinding.getChallenge();
    const domainAPDU = type === "forward"
        ? yield ledgerService.signDomainResolution(domain, registry, challenge)
        : yield ledgerService.signAddressResolution(address, registry, challenge);
    if (domainAPDU) {
        yield appBinding.provideDomainName(domainAPDU);
    }
});
//# sourceMappingURL=index.js.map