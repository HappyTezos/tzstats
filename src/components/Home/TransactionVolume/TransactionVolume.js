import React from 'react';
import styled from 'styled-components';
import { Card, FlexColumnSpaceBetween, FlexRow, DataBox } from '../../Common';
import AreaChart from './AreaChart';
import _ from 'lodash';

const TransactionVolume = ({ txSeries }) => {
  const [currentValue] = React.useState(txSeries.slice(-1)[0]);
  const avrVolume = _.sumBy(txSeries, o => o.value) / txSeries.length;
  const avrTxn = _.sumBy(txSeries, o => o.n_tx) / txSeries.length;
  return (
    <Wrapper>
      <Card title={'Tezos On-Chain Volume (30d)'}>
        <FlexRow>
          <AreaChart data={txSeries} />

          <FlexColumnSpaceBetween minWidth={100} ml={20}>
            <DataBox valueSize="14px" title="24h Transactions" value={currentValue.n_tx} />
            <DataBox valueSize="14px" valueType="currency" title="24h Volume" valueOpts={{digits:3,dim:0}} value={currentValue.value} />
            <DataBox valueSize="14px" title="30d Avg Transactions" value={avrTxn} />
            <DataBox valueSize="14px" valueType="currency" valueOpts={{digits:3,dim:0}} title="30d Avg Volume" value={avrVolume} />
          </FlexColumnSpaceBetween>
        </FlexRow>
      </Card>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  min-width: 340px;
  margin: 0 5px;
  flex: 2;
`;

export default TransactionVolume;
