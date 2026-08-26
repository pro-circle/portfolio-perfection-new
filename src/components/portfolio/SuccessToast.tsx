import { Heart } from "lucide-react";

const SuccessToast = () => {
  return (
    <div className="relative">
      <div className="rounded-xl bg-white border-2 border-yellow-400 px-4 py-3 text-sm font-medium text-neutral-900 shadow-none">
        <span className="font-semibold">John:</span> I received your message! I'll respond you in a while!!
      </div>
      <div className="pointer-events-none absolute -top-2 left-0 right-0 flex justify-center gap-4">
        {[0, 1, 2].map((i) => (
          <Heart
            key={i}
            size={14}
            className="text-pink-500 fill-pink-500 heart-float"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessToast;
