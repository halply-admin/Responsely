import { Protect } from "@clerk/nextjs";

import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { ReportsView } from "@/modules/reports/ui/views/reports-view";

const ReportsPage = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <ReportsView />
        </PremiumFeatureOverlay>
      }
    >
      <ReportsView />
    </Protect>
  );
};

export default ReportsPage; 