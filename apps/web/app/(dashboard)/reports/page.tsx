import { Protect } from "@clerk/nextjs";

import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { ReportsView } from "@/modules/reports/ui/views/reports-view";
import { StaticReportsPlaceholder } from "@/modules/reports/ui/components/static-reports-placeholder";

const ReportsPage = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <StaticReportsPlaceholder />
        </PremiumFeatureOverlay>
      }
    >
      <ReportsView />
    </Protect>
  );
};

export default ReportsPage; 