import { createFileRoute } from "@tanstack/react-router";
import ReviewApp from "@/components/ReviewApp";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Punjabi Kitchenn — Share Your Review" },
      {
        name: "description",
        content: "Rate your experience at Punjabi Kitchenn and share your feedback in seconds.",
      },
      { property: "og:title", content: "Punjabi Kitchenn — Share Your Review" },
      {
        property: "og:description",
        content: "Quick 1-tap rating and review for Punjabi Kitchenn customers.",
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <ReviewApp />
      <Toaster position="top-center" />
    </>
  );
}
