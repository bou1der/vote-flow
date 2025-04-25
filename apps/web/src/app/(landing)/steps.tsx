"use client";
import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useScroll } from "framer-motion";

export function Steps() {
	return (
		<div className="container space-y-16 py-16 sm:py-20">
			<div className="space-y-4">
				<h1 className="font-bold text-center">Простые шаги к вашему голосу</h1>
				<p className="text-center">Голосовать легко: четыре шага к результату</p>
			</div>

			<div className="flex justify-between items-stretch">
				<div className="w-1/2 space-y-8">
					<SeletedCard>
						<h4 className="font-bold">Поделитесь с друзьями</h4>
						<p>Предложите то, что важно для обсуждения.</p>
					</SeletedCard>
					<SeletedCard>
						<h4 className="font-bold">Поделитесь с друзьями</h4>
						<p>Предложите то, что важно для обсуждения.</p>
					</SeletedCard>
					<SeletedCard>
						<h4 className="font-bold">Поделитесь с друзьями</h4>
						<p>Предложите то, что важно для обсуждения.</p>
					</SeletedCard>
					<SeletedCard>
						<h4 className="font-bold">Поделитесь с друзьями</h4>
						<p>Предложите то, что важно для обсуждения.</p>
					</SeletedCard>
				</div>
				<Image width={400} height={400} src={"/handles.svg"} alt="" />
			</div>
		</div>
	);
}

function SeletedCard({
	children,
}: {
	children: ReactNode;
}) {
	const { scrollYProgress } = useScroll();

	return <motion.div style={{ opacity: scrollYProgress }}>{children}</motion.div>;
}
