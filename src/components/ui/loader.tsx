import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib/client/utils";

const loaderVariants = cva("", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
      xl: "size-12",
      "2xl": "size-16",
    },
  },
});

interface LoaderProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof loaderVariants> {}

export default function Loader({ size, ...props }: LoaderProps) {
  return (
    <span
      {...props}
      className={cn(
        loaderVariants({ size }),
        "animate-spin aspect-square",
        props.className,
      )}
    >
      <div className="relative">
        <svg
          viewBox="0 0 70 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("text-primary z-10 absolute inset-0")}
        >
          <path
            d="M67 34.9077C67 52.5808 52.6731 66.9077 35 66.9077C17.3269 66.9077 3 52.5808 3 34.9077C3 17.2346 17.3269 2.90771 35 2.90771C37.9641 2.90771 40.8341 3.31072 43.5581 4.06494"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        <div
          className={cn(
            "rounded-full border-4 border-secondary",
            loaderVariants({
              size,
            }),
          )}
        ></div>
      </div>
    </span>
  );
}
