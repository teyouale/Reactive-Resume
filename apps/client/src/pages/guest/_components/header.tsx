import { t } from "@lingui/macro";
import { ArrowRight, HouseSimple, Lock, SidebarSimple } from "@phosphor-icons/react";
import { Badge, Button, Tooltip, buttonVariants } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { Link } from "react-router-dom";

import { useBuilderStore } from "@/client/stores/builder";
import { useResumeStore } from "@/client/stores/resume";

export const BuilderHeader = () => {
  const title = useResumeStore((state) => state.resume.title);
  const locked = useResumeStore((state) => state.resume.locked);

  const toggle = useBuilderStore((state) => state.toggle);
  const isDragging = useBuilderStore(
    (state) => state.panel.left.handle.isDragging || state.panel.right.handle.isDragging,
  );
  const leftPanelSize = useBuilderStore((state) => state.panel.left.size);
  const rightPanelSize = useBuilderStore((state) => state.panel.right.size);

  const onToggle = (side: "left" | "right") => {
    toggle(side);
  };

  return (
    <div
      style={{ left: `${leftPanelSize}%`, right: `${rightPanelSize}%` }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-16 bg-secondary-accent/50 backdrop-blur-lg lg:z-20",
        !isDragging && "transition-[left,right]",
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <Button
          size="icon"
          variant="ghost"
          className="flex lg:hidden"
          onClick={() => {
            onToggle("left");
          }}
        >
          <SidebarSimple />
        </Button>

        <div className="flex items-center justify-center gap-x-1 lg:mx-auto">
         
 <div className="hidden items-center gap-x-4 sm:flex">
          <Badge>{t`Guest User`}</Badge>

          <a
            href="/auth/login"
            className={cn(buttonVariants({ variant: "link" }), "space-x-2 text-left")}
          >
            <p>{t`Signup for full features`}</p>
            <ArrowRight />
          </a>
        </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="flex lg:hidden"
          onClick={() => {
            onToggle("right");
          }}
        >
          <SidebarSimple className="-scale-x-100" />
        </Button>
      </div>
    </div>
  );
};
