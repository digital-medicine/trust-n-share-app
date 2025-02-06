import React from 'react';
import {useAvailableCompensationsStore} from '../../stores/availableCompensations';
import CompensationsGrid from '../../components/CompensationsGrid'; // Adjust path as needed

export default function Money() {
  const money = useAvailableCompensationsStore(state => state.money);
  const redeemMoney = useAvailableCompensationsStore(state => state.redeemMoney);

  return (
    <CompensationsGrid
      items={money}
      onRedeem={redeemMoney}
      emptyStateTranslationKey="compensations.money.empty-state"
    />
  );
}