import { PracticePicker } from "@/app/components/practices/PracticePicker";

export default function PracticesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PracticePicker mode="manage" />
    </div>
  );
}