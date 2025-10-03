// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IProxyDomaRecord, IDomaRecord} from "./interfaces/IDoma.sol";

contract Tokenizer {
    IProxyDomaRecord public domaRecord;

    constructor(address _domaRecord) {
        domaRecord = IProxyDomaRecord(_domaRecord);
    }

    /**
     * @dev Tokenizes domain names using a voucher and signature
     * @param voucher The tokenization voucher containing domain names and metadata
     * @param signature The signature to verify the voucher
     */
    function tokenize(
        IProxyDomaRecord.TokenizationVoucher calldata voucher,
        bytes calldata signature
    ) public payable {
        domaRecord.requestTokenization{value: msg.value}(voucher, signature);
    }

    /**
     * @dev Helper function to create a tokenization voucher
     * @param names Array of domain names to tokenize
     * @param nonce Unique nonce for the request
     * @param expiresAt Expiration timestamp for the voucher
     * @param ownerAddress Address of the domain owner
     * @return voucher The created tokenization voucher
     */
    function createVoucher(
        IDomaRecord.NameInfo[] calldata names,
        uint256 nonce,
        uint256 expiresAt,
        address ownerAddress
    ) public pure returns (IProxyDomaRecord.TokenizationVoucher memory voucher) {
        voucher = IProxyDomaRecord.TokenizationVoucher({
            names: names,
            nonce: nonce,
            expiresAt: expiresAt,
            ownerAddress: ownerAddress
        });
    }

    /**
     * @dev Convenience function to tokenize a single domain
     * @param sld Second level domain (e.g., "example")
     * @param tld Top level domain (e.g., "com")
     * @param nonce Unique nonce for the request
     * @param expiresAt Expiration timestamp for the voucher
     * @param ownerAddress Address of the domain owner
     * @param signature The signature to verify the voucher
     */
    function tokenizeSingleDomain(
        string calldata sld,
        string calldata tld,
        uint256 nonce,
        uint256 expiresAt,
        address ownerAddress,
        bytes calldata signature
    ) public payable {
        IDomaRecord.NameInfo[] memory names = new IDomaRecord.NameInfo[](1);
        names[0] = IDomaRecord.NameInfo({
            sld: sld,
            tld: tld
        });

        IProxyDomaRecord.TokenizationVoucher memory voucher = IProxyDomaRecord.TokenizationVoucher({
            names: names,
            nonce: nonce,
            expiresAt: expiresAt,
            ownerAddress: ownerAddress
        });

        domaRecord.requestTokenization{value: msg.value}(voucher, signature);
    }
}