import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { ResumeDto } from "@reactive-resume/dto";

import { useDialog } from "@/client/stores/dialog";

import { BaseListItem } from "./base-item";

export const CreateResumeListItem = () => {
  const { open } = useDialog<ResumeDto>("resume");

  return (
    <BaseListItem
      start={<Plus size={18} />}
      title={
        <>
          <span>{t`Create a new resume`}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
        </>
      }
      description={t`Try it without signing in"`}
      onClick={async() => (await open('guest'))}
      
    />
  );
};
