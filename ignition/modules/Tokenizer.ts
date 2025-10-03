import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import { PROXY_DOMA_RECORD_ADDRESS } from "../../config";

export default buildModule("Doma", (m) => {
  
  const tokenizer = m.contract("Tokenizer", [PROXY_DOMA_RECORD_ADDRESS]);

  return { tokenizer };
});