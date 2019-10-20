import React from 'react';
import { Spiner } from '../../../../components/Common';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';
import { NoDataFound } from '../../../Common';
import { TableBody, TableHeader, TableHeaderCell, TableRow, TableCell, Value } from '../../../Common';
import { getAccountIncome } from '../../../../services/api/tz-stats';
import { useGlobal } from 'reactn';

// status
// projected_balance
// overdelegated  (display lines in red if overdelegated)
function updateStatus(income, cycle, config, balance) {
  let j = 0;
  for (var i = income.length-1; i>=0; j++ && i--) {
    let item = income[i];
    let iplus5 = j > 5 ? income[i+5] : {projected_balance:0};
    let share = j > 5 ? iplus5.balance / (iplus5.balance + iplus5.delegated) : 0;
    // let share = 1;
    switch (true) {
    case item.cycle < cycle - config.preserved_cycles:
      item.status = 'Unfrozen';
      item.color = 'inherit';
      item.projected_balance = 0;
      break;
    case item.cycle < cycle:
      item.status = 'Frozen';
      item.color = '#26B2EE';
      item.projected_balance = 0;
      break;
    case item.cycle === cycle:
      item.status = 'Active';
      item.color = 'inherit';
      // console.log("Projecting cycle",item.cycle,"balance from spendable=", balance,
      //   "bond_diff=", item.expected_bonds - item.total_bonds,
      //   "unfreeze_bonds=", iplus5.total_bonds,
      //   "unfreeze_income=", iplus5.total_income,
      //   "unfreeze_income_share=", share,
      //   "unfreeze_income_after_share=", iplus5.total_income * share
      // );
      item.projected_balance = balance - (item.expected_bonds - item.total_bonds);
      if (item.projected_balance < 0) {
        item.projected_balance = 0;
        item.overdelegated = true;
        item.color = '#ED6290';
      }
      item.projected_balance += iplus5.total_bonds + iplus5.total_income * share;
      break;
    default:
      item.status = 'Pending';
      item.color = 'rgba(255, 255, 255, 0.52)';
      // console.log("Projecting cycle",item.cycle,"balance from projected=", income[i+1].projected_balance,
      //   "bonds=", item.expected_bonds,
      //   "unfreeze_bonds=", iplus5.total_bonds,
      //   "unfreeze_income=", iplus5.total_income,
      //   "unfreeze_income_share=", share,
      //   "unfreeze_income_after_share=", iplus5.total_income * share
      // );
      item.projected_balance = income[i+1].projected_balance - item.expected_bonds;
      if (item.projected_balance < 0) {
        item.projected_balance = 0;
        item.overdelegated = true;
        item.color = '#ED6290';
      }
      item.projected_balance += iplus5.total_bonds + iplus5.total_income * share;
    }
  };
}

const columns = [
  'row_id',
  'cycle',
  'balance',
  'delegated',
  'expected_bonds',
  'expected_income',
  'total_bonds',
  'total_income',
  'n_baking_rights',
  'n_endorsing_rights',
];

const BondsTable = ({ account }) => {
  const [chain] = useGlobal('chain');
  const [config] = useGlobal('config');
  const [data, setData] = React.useState({ table: [], isLoaded: false, cursor: 0, eof: false });
  useInfiniteScroll(fetchMoreOperations, 'bonds');

  async function fetchMoreOperations() {
    if (data.eof) { return; }
    let more = await getAccountIncome({
      address: account.address,
      order: 'desc',
      columns: columns,
      cursor: data.cursor
    });
    let eof = !more.length;
    let table = [...data.table, ...more];
    updateStatus(table, chain.cycle, config, account.spendable_balance);
    setData({
      table: table,
      isLoaded: true,
      cursor: eof?data.cursor:more.slice(-1)[0].row_id,
      eof: eof
    });
  }

  React.useEffect(() => {
    const fetchData = async () => {
      let income = await getAccountIncome({
        address: account.address,
        columns: columns,
        order: 'desc'
      });
      let eof = !income.length;
      updateStatus(income, chain.cycle, config, account.spendable_balance);
      setData({
        table: income,
        isLoaded: true,
        cursor: !eof?income.slice(-1)[0].row_id:0,
        eof: eof,
      });
    };
    fetchData();
    return function cleanup() {
      setData({
        table: [],
        isLoaded: false,
        cursor: 0,
        eof: false
      });
    };
  }, [account.address, account.last_seen, account.spendable_balance, chain.cycle, config]);

  return (
    <>
      <TableHeader>
        <TableHeaderCell width={5}>Cycle</TableHeaderCell>
        <TableHeaderCell width={8}>Status</TableHeaderCell>
        <TableHeaderCell width={10}>Staking</TableHeaderCell>
        <TableHeaderCell width={10}>Delegated</TableHeaderCell>
        <TableHeaderCell width={10}>Bake/Endorse Rights</TableHeaderCell>
        <TableHeaderCell width={10}>Expected Income</TableHeaderCell>
        <TableHeaderCell width={10}>Actual Income</TableHeaderCell>
        <TableHeaderCell width={10}>Expected Bonds</TableHeaderCell>
        <TableHeaderCell width={10}>Actual Bonds</TableHeaderCell>
        <TableHeaderCell width={10}>Projected Balance</TableHeaderCell>
      </TableHeader>
      {data.isLoaded ? (
        <TableBody id={'bonds'}>
          {data.table.length ? (
            data.table.map((item, i) => {
              return (
                <TableRow key={i} color={item.color}>
                  <TableCell width={5}><Value value={item.cycle} type="value-full"/></TableCell>
                  <TableCell width={8}>{item.status}</TableCell>
                  <TableCell width={10}><Value value={item.balance} type="currency-short" digits={0} zero="-"/></TableCell>
                  <TableCell width={10}><Value value={item.delegated} type="currency-short" digits={0} zero="-"/></TableCell>
                  <TableCell width={10}><Value value={item.n_baking_rights} zero="-"/>/<Value value={item.n_endorsing_rights} zero="-"/></TableCell>
                  <TableCell width={10}><Value value={item.expected_income} type="currency-short" digits={0} zero="-"/></TableCell>
                  <TableCell width={10}><Value value={item.total_income} type="currency-short" digits={0} zero="-"/></TableCell>
                  <TableCell width={10}><Value value={item.expected_bonds} type="currency-short" digits={0} zero="-"/></TableCell>
                  <TableCell width={10}><Value value={item.total_bonds} type="currency-short" digits={0} zero="-"/></TableCell>
                  <TableCell width={10}><Value value={item.projected_balance} type="currency-short" zero="-"/></TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoDataFound />
          )}
        </TableBody>
      ) : (
        <TableBody>
          <Spiner />
        </TableBody>
      )}
    </>
  );
};

export default BondsTable;