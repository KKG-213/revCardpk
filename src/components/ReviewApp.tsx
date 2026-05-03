import { useState } from "react";
import { Star } from "lucide-react";
import logo from "@/assets/logo.png";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

// TODO: Replace with your deployed Google Apps Script Web App URL
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyWrILQh47OkutgvyT_2uKltzP_U_DM30U8VS0mqR5JUp1Qvbc52s0w9U-fl0JOyWrl/exec";
const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/place/PUNJABI+KITCHENN/@23.8326717,86.3954569,14z/data=!4m12!1m2!2m1!1spunjabi+kitchenn!3m8!1s0x39f6bbc73ee3e50d:0x7c10362832358b4c!8m2!3d23.8326717!4d86.4315058!9m1!1b1!15sCg9wdW5qYWJpIGtpdGNoZW5aESIPcHVuamFiaSBraXRjaGVukgEKcmVzdGF1cmFudOABAA!16s%2Fg%2F11yk98c6x4?entry=ttu&g_ep=EgoyMDI2MDQyNi4wIKXMDSoASAFQAw%3D%3D";

const SUGGESTIONS = [
  "Great food and quick service!",
  "Loved the ambiance and taste!",
  "Highly recommended!",
  "Amazing experience!",
];

export default function ReviewApp() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [openThanks, setOpenThanks] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [animNonce, setAnimNonce] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          rating,
          review,
          name,
          whatsapp,
        }),
      });
    } catch {
      // ignore — no-cors response is opaque
    } finally {
      setSubmitting(false);
      if (rating >= 4) {
        // Use top-level navigation so it works inside sandboxed iframes (e.g. preview).
        // Fallback chain: window.top → window.open → window.location
        try {
          if (window.top && window.top !== window.self) {
            window.top.location.href = GOOGLE_REVIEW_URL;
            return;
          }
        } catch {
          // cross-origin top access blocked — fall through
        }
        const opened = window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
        if (!opened) {
          window.location.href = GOOGLE_REVIEW_URL;
        }
      } else {
        setOpenThanks(true);
      }
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-3 py-3"
      style={{ backgroundImage: "var(--gradient-warm)" }}
    >
      <section className="w-full max-w-md rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] animate-in fade-in zoom-in-95 duration-500">
        <header className="flex flex-col items-center text-center mb-2">
          <div className="h-14 w-14 rounded-full bg-background ring-2 ring-brand/20 overflow-hidden flex items-center justify-center">
            <img src={logo} alt="City Hut logo" width={56} height={56} className="object-contain" />
          </div>
          <h1 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">
            Punjabi Kitchenn, Dhanbad
          </h1>
          <p className="text-xs text-muted-foreground">We&apos;d love your feedback</p>
        </header>

        <div className="flex justify-center gap-1 mb-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || rating) >= n;
            const bounce = animNonce > 0 && rating >= n;
            return (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => {
                  setRating(n);
                  setAnimNonce((x) => x + 1);
                }}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="p-0.5 transition-transform duration-150 hover:scale-125"
              >
                <Star
                  key={bounce ? `b-${animNonce}-${n}` : `s-${n}`}
                  className={`h-7 w-7 transition-colors duration-200 ${
                    active
                      ? "fill-star-active text-star-active drop-shadow-[0_0_6px_var(--star-active)]"
                      : "text-star-inactive"
                  } ${bounce ? "animate-[scale-in_0.35s_ease-out_both]" : ""}`}
                  style={bounce ? { animationDelay: `${(n - 1) * 60}ms` } : undefined}
                />
              </button>
            );
          })}
        </div>

        <div className="px-1 mb-2">
          <Slider
            value={[rating]}
            min={1}
            max={5}
            step={1}
            onValueChange={(v) => setRating(v[0])}
            aria-label="Rating slider"
          />
        </div>

        <Textarea
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={2}
          maxLength={1000}
          className="resize-none text-sm"
        />

        <div className="flex flex-wrap gap-1 mt-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setReview(s)}
              className="text-[11px] rounded-full border border-border bg-secondary px-2 py-0.5 text-secondary-foreground hover:bg-brand hover:text-brand-foreground hover:border-brand transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            placeholder="Name (optional)"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            placeholder="WhatsApp (optional)"
            value={whatsapp}
            maxLength={20}
            inputMode="tel"
            onChange={(e) => setWhatsapp(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ backgroundImage: "var(--gradient-warm)", boxShadow: "var(--shadow-soft)" }}
          className="w-full mt-3 h-10 text-sm font-semibold text-brand-foreground hover:opacity-95 transition-all active:scale-[0.98] border-0"
        >
          {submitting ? "Sending..." : "Submit Review"}
        </Button>
      </section>

      <Dialog open={openThanks} onOpenChange={setOpenThanks}>
        <DialogContent className="sm:max-w-sm max-h-[90vh] overflow-auto text-center p-5">
          <DialogHeader>
            <DialogTitle className="text-xl">Thanks for your feedback ❤️</DialogTitle>
            <DialogDescription className="text-sm">
              We appreciate you taking the time. We&apos;ll work on making things better.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setOpenThanks(false)} className="mt-2 h-9">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
