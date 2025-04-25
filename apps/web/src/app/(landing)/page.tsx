import { Our } from "./our";
import { Questions } from "./questions";
import { Reviews } from "./reviews";
import { Steps } from "./steps";
import { Welcome } from "./welcome";

export default function LandingPage() {
	return (
		<>
			<Welcome />
			<Our />
			<Steps />
			<Reviews />
			<Questions />
		</>
	);
}
