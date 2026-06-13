"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { useStepNavigation } from "@/hooks/useStepNavigation";

export default function Step4DesignPage() {
  const navigation = useStepNavigation();

  return (
    <main>
      <StepIndicator currentStep={navigation.currentStep} />
      <section className="custom-flow-screen mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <CanvasEditor />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Button variant="secondary" onClick={navigation.goBack}>
            <ArrowLeft size={22} />
            Quay lại
          </Button>
          <Button onClick={navigation.goNext}>
            Tiếp theo
            <ArrowRight size={22} />
          </Button>
        </div>
      </section>
    </main>
  );
}
