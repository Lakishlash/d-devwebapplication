// src/pages/PlansPage.jsx
// Plans page now reuses the PricingPlans component with CTAs visible.

import PricingPlans from "@/components/PricingPlans";

export default function PlansPage() {
    return <PricingPlans showCtas={true} />;
}
