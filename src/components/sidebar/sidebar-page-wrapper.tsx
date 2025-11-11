"use client";

import { GithubIcon } from "lucide-react";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type SidebarPageWrapperProps = {
	breadcrumbs: { label: string; url?: string }[];
};

export function SidebarPageWrapper({ breadcrumbs }: SidebarPageWrapperProps) {
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					className="mx-2 my-auto data-[orientation=vertical]:h-8"
					orientation="vertical"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((breadcrumb, index) => (
							<Fragment key={breadcrumb.label}>
								{index > 0 && (
									<BreadcrumbSeparator className="mx-2 data-[orientation=vertical]:h-4" />
								)}
								<BreadcrumbItem>
									{breadcrumb.url ? (
										<BreadcrumbLink href={breadcrumb.url}>
											{breadcrumb.label}
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
									)}
								</BreadcrumbItem>
							</Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="ml-auto flex items-center gap-2">
					<a
						className={buttonVariants({
							variant: "ghost",
							size: "sm",
							className: "hidden! sm:inline-flex! cursor-default",
						})}
						href="https://github.com/morganstovold/smrt-study"
						rel="noopener noreferrer"
						target="_blank"
					>
						<GithubIcon className="size-4" />
						<span>Github</span>
					</a>
				</div>
			</div>
		</header>
	);
}
