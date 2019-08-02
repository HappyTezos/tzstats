import { setGlobal } from 'reactn';

const supply = {
  height: 0.0,
  cycle: 0.0,
  time: 0.0,
  total: 0.0,
  activated: 0.0,
  unclaimed: 0.0,
  vested: 0.0,
  unvested: 0.0,
  circulating: 0.0,
  delegated: 0.0,
  staking: 0.0,
  active_delegated: 0.0,
  active_staking: 0.0,
  inactive_delegated: 0.0,
  inactive_staking: 0.0,
  mined: 0.0,
  mined_baking: 0.0,
  mined_endorsing: 0.0,
  mined_seeding: 0.0,
  burned: 0.0,
  burned_double_baking: 0.0,
  burned_double_endorse: 0.0,
  burned_origination: 0.0,
  burned_implicit: 0.0,
  frozen: 0.0,
  frozen_deposits: 0.0,
  frozen_rewards: 0.0,
  frozen_fees: 0.0,
};
const chain = {
  total_accounts: 0.0,
  total_ops: 0.0,
  funded_accounts: 0.0,
  delegators: 0.0,
  rolls: 0.0,
  roll_owners: 0.0,
  total_supply: 0.0,
  vested_supply: 0.0,
  activated_supply: 0.0,
  circulating_supply: 0.0,
  staking_supply: 0.0,
  mined_supply: 0.0,
  burned_supply: 0.0,
  frozen_supply: 0.0,
  height: 0.0,
  cycle: 0.0,
  new_accounts_30d: 0.0,
  cleared_accounts_30d: 0.0,
  time: new Date(),
  supply: supply
};


const lastMarketData = { date: new Date(), price: 0.0, change: 0.0 };
const setDefaultGlobalState = () => {
  setGlobal({ chain, lastMarketData });
};

export default setDefaultGlobalState;
