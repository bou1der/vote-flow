import type { IconProps } from "./icon";

export function Gradient(props: IconProps) {
	return (
		<svg {...props} width="967" height="1045" viewBox="0 0 967 1045" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_f_2047_411)">
				<circle
					cx="468.138"
					cy="468.414"
					r="314.333"
					transform="rotate(-32.5116 468.138 468.414)"
					fill="url(#paint0_linear_2047_411)"
				/>
			</g>
			<g filter="url(#filter1_f_2047_411)">
				<rect
					x="328"
					y="529.548"
					width="302.067"
					height="428.567"
					transform="rotate(-32.5116 328 529.548)"
					fill="url(#paint1_linear_2047_411)"
				/>
			</g>
			<defs>
				<filter
					id="filter0_f_2047_411"
					x="0.43132"
					y="0.707932"
					width="935.413"
					height="935.412"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feGaussianBlur stdDeviation="76.6667" result="effect1_foregroundBlur_2047_411" />
				</filter>
				<filter
					id="filter1_f_2047_411"
					x="174.667"
					y="213.863"
					width="791.736"
					height="830.421"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feGaussianBlur stdDeviation="76.6667" result="effect1_foregroundBlur_2047_411" />
				</filter>
				<linearGradient
					id="paint0_linear_2047_411"
					x1="468.138"
					y1="154.081"
					x2="468.138"
					y2="782.747"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#00C2FF" stopOpacity="0" />
					<stop offset="1" stopColor="#FF29C3" />
				</linearGradient>
				<linearGradient
					id="paint1_linear_2047_411"
					x1="479.033"
					y1="529.548"
					x2="479.033"
					y2="958.115"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#184BFF" stopOpacity="0" />
					<stop offset="1" stopColor="#174AFF" />
				</linearGradient>
			</defs>
		</svg>
	);
}
