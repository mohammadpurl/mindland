"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, LockKeyhole, Plane } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginFormValues = z.infer<typeof loginSchema> & { remember?: boolean };

type LoginFormProps = {
  onSuccess?: (token: string) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "ورود ناموفق بود");
      }
      if (onSuccess) onSuccess(data.token as string);
    } catch (e) {
      // No-op UI error surface for brevity; integrate Notification if needed
      console.error(e);
      alert((e as Error).message);
    }
  };

  return (
    <div className="bg-navy-dark min-h-screen" dir="rtl">
      <div className="p-4 sm:p-6">
        <div className="max-w-md mx-auto space-y-4 sm:space-y-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <Card className="border-golden-accent border border-[#f5a623]/20 bg-[#0d0c1d] shadow-lg">
              <CardHeader className="text-center p-4 sm:p-6">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  <Plane className="text-golden-accent w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-center bg-gradient-to-r from-[#51baff] to-[#2fa4ff] bg-clip-text text-transparent">
                    ورود به سامانه
                  </span>
                  <Plane className="text-golden-accent w-6 h-6 sm:w-8 sm:h-8" />
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-golden-accent border border-[#f5a623]/20 bg-[#0d0c1d] shadow-course">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl text-foreground">
                  اطلاعات کاربری
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    ایمیل
                  </Label>
                  <div className="flex items-center gap-2">
                    <Mail className="text-golden-accent w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={`bg-input border-golden-accent text-foreground ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    رمز عبور
                  </Label>
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="text-golden-accent w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className={`bg-input border-golden-accent text-foreground ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      placeholder="******"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-accent-foreground text-sm shadow-course transition-transform duration-300 ease-out hover:scale-105 border border-blue-500 shadow-[0px_5px_20px_rgba(0,173,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="bg-gradient-to-r from-[#51baff] to-[#2fa4ff] bg-clip-text text-transparent text-base sm:text-lg">
                      {isSubmitting ? "در حال ورود..." : "ورود"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;


