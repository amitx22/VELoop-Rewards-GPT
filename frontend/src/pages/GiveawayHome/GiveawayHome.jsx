import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { GiveawayHero } from '../../components/GiveawayHero/GiveawayHero.jsx';
import { WinnerClaimBanner } from '../../components/WinnerClaimBanner/WinnerClaimBanner.jsx';
import { WinnerSlider } from '../../components/WinnerSlider/WinnerSlider.jsx';
import { GiveawayStats } from '../../components/GiveawayStats/GiveawayStats.jsx';
import { FeaturedGiveaways } from '../../components/FeaturedGiveaways/FeaturedGiveaways.jsx';
import { HowToParticipate } from '../../components/HowToParticipate/HowToParticipate.jsx';
import { WinnersTabs } from '../../components/WinnersTabs/WinnersTabs.jsx';
import { TrustSection } from '../../components/TrustSection/TrustSection.jsx';
import { RulesAndFAQ } from '../../components/RulesAndFAQ/RulesAndFAQ.jsx';
import { PrizeClaimModal } from '../../components/PrizeClaimModal/PrizeClaimModal.jsx';
import { ThemedLoader } from '../../components/ThemedLoader/ThemedLoader.jsx';

export const GiveawayHome = () => {
  const { currentGiveaway, loading } = useApp();
  const [claimModalRecord, setClaimModalRecord] = useState(null);

  if (loading && !currentGiveaway) {
    return <ThemedLoader fullScreen />;
  }

  return (
    <main>
      {/* Winner Spotlight Banner (Shown if user matches winner record) */}
      <WinnerClaimBanner onOpenClaimModal={(record) => setClaimModalRecord(record)} />

      {/* Hero Banner */}
      <GiveawayHero />

      {/* Social Proof Winner Slider */}
      <WinnerSlider />

      {/* Statistics */}
      <GiveawayStats />

      {/* Featured Rewards & Prize Cards Grid */}
      <FeaturedGiveaways />

      {/* Step-by-Step Participation Timeline */}
      <HowToParticipate />

      {/* Winners & Previous Winners Archive */}
      <WinnersTabs onOpenClaimModal={(record) => setClaimModalRecord(record)} />

      {/* Trust & Transparency */}
      <TrustSection />

      {/* Rules & Accordion FAQ */}
      <RulesAndFAQ />

      {/* Prize Claim Modal for Winners */}
      <PrizeClaimModal
        isOpen={!!claimModalRecord}
        onClose={() => setClaimModalRecord(null)}
        winnerRecord={claimModalRecord}
        onSuccess={() => {
          // Claim recorded
        }}
      />
    </main>
  );
};
