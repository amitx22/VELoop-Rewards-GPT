import React, { useState } from 'react';
import { WinnersTabs } from '../../components/WinnersTabs/WinnersTabs.jsx';
import { WinnerClaimBanner } from '../../components/WinnerClaimBanner/WinnerClaimBanner.jsx';
import { PrizeClaimModal } from '../../components/PrizeClaimModal/PrizeClaimModal.jsx';
import { WinnerSlider } from '../../components/WinnerSlider/WinnerSlider.jsx';
import { TrustSection } from '../../components/TrustSection/TrustSection.jsx';

export const WinnersPage = () => {
  const [claimModalRecord, setClaimModalRecord] = useState(null);

  return (
    <main style={{ paddingTop: '20px' }}>
      <WinnerClaimBanner onOpenClaimModal={(record) => setClaimModalRecord(record)} />
      <WinnerSlider />
      <WinnersTabs onOpenClaimModal={(record) => setClaimModalRecord(record)} />
      <TrustSection />

      <PrizeClaimModal
        isOpen={!!claimModalRecord}
        onClose={() => setClaimModalRecord(null)}
        winnerRecord={claimModalRecord}
      />
    </main>
  );
};
