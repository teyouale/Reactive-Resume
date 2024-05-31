import { zodResolver } from "@hookform/resolvers/zod";
import { t, Trans } from "@lingui/macro";
import { ArrowRight } from "@phosphor-icons/react";
import { loginSchema, ResumeDto } from "@reactive-resume/dto";
import { usePasswordToggle } from "@reactive-resume/hooks";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@reactive-resume/ui";
import { cn, sortByDate } from "@reactive-resume/utils";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { useLogin } from "@/client/services/auth";
import { useAuthProviders } from "@/client/services/auth/providers";
import { CreateResumeListItem } from "../../home/components/create-item";
import { useResumes } from "@/client/services/resume";
import { BaseListItem } from "../../dashboard/resumes/_layouts/list/_components/base-item";
import { AnimatePresence, motion } from "framer-motion";
import { ResumeListItem } from "../../home/components/resume-item";
import { useCachedResumes } from "@/client/services/resume/guest";
import { queryClient } from "@/client/libs/query-client";

type FormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login, loading } = useLogin();
  // const cachedResumes = useCachedResumes();
  const { resumes, loading:resumesLoading } = useResumes();


//  useEffect(() => {
//     if (cachedResumes && resumes) {
//       console.log("Cached Resumes:", cachedResumes);
//       console.log("API Resumes:", resumes);

//       // Update queryClient with cached resumes
//       cachedResumes.forEach((resume) => {
//         queryClient.setQueryData<ResumeDto>(["resume", { id: resume.id }], resume);
//       });
//     }
//   }, [cachedResumes, resumes]); 
  
    
  const { providers } = useAuthProviders();
  const emailAuthDisabled = !providers?.includes("email");

  const formRef = useRef<HTMLFormElement>(null);
  usePasswordToggle(formRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data);
    } catch {
      form.reset();
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>
          {t`Sign in to your account`} - {t`Awaqi Resume`}
        </title>
      </Helmet>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{t`Sign in to your account`}</h2>
        <h6 className={cn(emailAuthDisabled && "hidden")}>
          <span className="opacity-75">{t`Don't have an account?`}</span>
          <Button asChild variant="link" className="px-1.5">
            <Link to="/auth/register">
              {t({ message: "Create one now", context: "This is a link to create a new account" })}{" "}
              <ArrowRight className="ml-1" />
            </Link>
          </Button>
        </h6>
      </div>

      <div className={cn(emailAuthDisabled && "hidden")}>
        <Form {...form}>
          <form
            ref={formRef}
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Email`}</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormDescription>{t`You can also enter your username.`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Password`}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    <Trans>
                      Hold <code className="text-xs font-bold">Ctrl</code> to display your password
                      temporarily.
                    </Trans>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex items-center gap-x-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {t`Sign in`}
              </Button>

              <Button asChild variant="link" className="px-4">
                <Link to="/auth/forgot-password">{t`Forgot Password?`}</Link>
              </Button>
            </div>
        <CreateResumeListItem />
        {resumesLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}

      {resumes && (
        <AnimatePresence>
          {resumes
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <ResumeListItem resume={resume} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}

          </form>
        </Form>
      </div>
    </div>
  );
};
