import React from 'react';
import {useAvailableCompensationsStore} from '../../stores/availableCompensations';
import CompensationsGrid from '../../components/CompensationsGrid'; // Adjust path as needed

export default function Vouchers() {
  const vouchers = useAvailableCompensationsStore(state => state.vouchers);
  const redeemVoucher = useAvailableCompensationsStore(
    state => state.redeemVoucher,
  );

  return (
    <CompensationsGrid
      items={vouchers}
      onRedeem={redeemVoucher}
      emptyStateTranslationKey="compensations.vouchers.empty-state"
    />
  );
}
