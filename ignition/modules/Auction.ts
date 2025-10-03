import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const sepolia_token_contract_address = "0x9A374915648f1352827fFbf0A7bB5752b6995eB7"

export default buildModule("Doma", (m) => {  
  
  const auction = m.contract("DomaDomainAuction", [sepolia_token_contract_address]);

  return { auction };
});