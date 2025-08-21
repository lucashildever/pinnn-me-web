import { ReactNode, RefObject } from "react";

interface ProfileMeasurerProps {
  children: ReactNode;
  ref: RefObject<HTMLDivElement | null>;
}

export default function ProfileMeasurer({
  children,
  ref,
}: ProfileMeasurerProps) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
        left: 0,
        top: 0,
      }}
    >
      {children}
    </div>
  );
}
