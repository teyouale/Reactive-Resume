import { CreateResumeDto, ResumeDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createGuestResume = async (data: CreateResumeDto) => {
  const response = await axios.post<ResumeDto, AxiosResponse<ResumeDto>, CreateResumeDto>(
    "/resume/guest",
    data,
  );

  return response.data;
};

export const useCreateGuestResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createGuestResumeFn,
  } = useMutation({
    mutationFn: createGuestResume,
    onSuccess: (data) => {
      queryClient.setQueryData<ResumeDto>(["resume", { id: data.id }], data);

      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });

      // localStorage.setItem(`resume_${data.id}`, JSON.stringify(data));
    },
  });

  return { createGuestResume: createGuestResumeFn, loading, error };
};

export const useCachedResumes = (): ResumeDto[] | undefined => {
  // const resumeKeys = Object.keys(localStorage).filter((key) =>
  //   key.startsWith("resume_")
  // );
  //  const cachedResumes = resumeKeys.map((key) =>
  //   JSON.parse(localStorage.getItem(key) || "")
  // );

  // console.log("Cached Resumes:", cachedResumes);



  // return cachedResumes.length > 0 ? cachedResumes : undefined;
  return undefined;
};


