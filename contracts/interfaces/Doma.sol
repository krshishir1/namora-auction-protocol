// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IDomaRecord {
    struct NameInfo {
        string sld;
        string tld;
    }

    enum ProofOfContactsSource {
        NONE,
        REGISTRAR,
        DOMA
    }

    function initiateTokenization(
        uint256 registrarIanaId,
        NameInfo[] calldata names,
        string calldata ownershipTokenChainId,
        string calldata ownershipTokenOwnerAddress,
        string calldata correlationId
    ) external;

    function claimOwnership(
        string calldata tokenId,
        string calldata chainId,
        string calldata claimedBy,
        ProofOfContactsSource proofSource,
        uint256 registrantHandle,
        string calldata correlationId
    ) external;

    function bridge(
        string calldata tokenId,
        string calldata targetChainId,
        string calldata targetOwnerAddress,
        string calldata correlationId
    ) external;

    function ownerDetokenize(
        string calldata tokenId,
        string calldata chainId,
        string calldata ownerAddress,
        string calldata correlationId
    ) external;

    function completeDetokenization(
        string calldata tokenId,
        string calldata correlationId
    ) external;

    function tokenTransfer(
        string calldata chainId,
        string calldata tokenId,
        string calldata oldOwnerAddress,
        string calldata newOwnerAddress,
        string calldata correlationId
    ) external;
}

interface IProxyDomaRecord {
  struct TokenizationVoucher {
    IDomaRecord.NameInfo[] names;
    uint256 nonce;
    uint256 expiresAt;
    address ownerAddress;
  }

  function requestTokenization(TokenizationVoucher calldata voucher, bytes calldata signature) external payable;
}
