import { Protect } from "@clerk/nextjs";

import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { ReportsView } from "@/modules/reports/ui/views/reports-view";

const ReportsPage = () => {
  const reportsView = <ReportsView />;
  
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          {reportsView}
        </PremiumFeatureOverlay>
      }
    >
      {reportsView}
    </Protect>
  );
};

export default ReportsPage; 