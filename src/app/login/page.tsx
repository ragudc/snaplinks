"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Zap } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/lib/i18n"
import {
  signInSchema,
  signUpSchema,
  type SignInInput,
  type SignUpInput,
} from "@/lib/utils/auth-schemas"

// --- Google OAuth Button ------------------------------------------

function GoogleButton({
  label,
  isLoading,
  onClick,
}: {
  label: string
  isLoading: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-3"
      disabled={isLoading}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {label}
    </Button>
  )
}

// --- Sign In Form -------------------------------------------------

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const supabase = createClient()

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    })
    if (error) {
      setAuthError(error.message)
      setIsGoogleLoading(false)
    }
  }

  const onSubmit = async (data: SignInInput) => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setAuthError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message
      )
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <GoogleButton
        label={t.auth.signIn.googleButton}
        isLoading={isGoogleLoading}
        onClick={handleGoogle}
      />

      <div className="relative flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground shrink-0">
          {t.auth.signIn.divider}
        </span>
        <Separator className="flex-1" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signin-email">{t.auth.signIn.emailLabel}</Label>
          <Input
            id="signin-email"
            type="email"
            placeholder={t.auth.signIn.emailPlaceholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "signin-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="signin-email-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password">{t.auth.signIn.passwordLabel}</Label>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.auth.signIn.forgotPassword}
            </button>
          </div>
          <Input
            id="signin-password"
            type="password"
            placeholder={t.auth.signIn.passwordPlaceholder}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "signin-pw-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="signin-pw-error" role="alert" className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {authError && (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {authError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : t.auth.signIn.submitButton}
        </Button>
      </form>
    </div>
  )
}

// --- Sign Up Form -------------------------------------------------

function SignUpForm() {
  const { t } = useTranslation()
  const supabase = createClient()

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    if (error) {
      setAuthError(error.message)
      setIsGoogleLoading(false)
    }
  }

  const onSubmit = async (data: SignUpInput) => {
    setAuthError(null)
    setSuccessMsg(null)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    if (error) {
      setAuthError(error.message)
    } else {
      setSuccessMsg(
        "Check your email for a confirmation link to activate your account."
      )
    }
  }

  if (successMsg) {
    return (
      <div className="rounded-md bg-primary/10 border border-primary/20 p-4 text-center">
        <p className="text-sm font-medium">📧 Confirmation email sent!</p>
        <p className="mt-1 text-xs text-muted-foreground">{successMsg}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <GoogleButton
        label={t.auth.signUp.googleButton}
        isLoading={isGoogleLoading}
        onClick={handleGoogle}
      />

      <div className="relative flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground shrink-0">
          {t.auth.signUp.divider}
        </span>
        <Separator className="flex-1" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">{t.auth.signUp.emailLabel}</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder={t.auth.signUp.emailPlaceholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">{t.auth.signUp.passwordLabel}</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder={t.auth.signUp.passwordPlaceholder}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p role="alert" className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-confirm">Confirm Password</Label>
          <Input
            id="signup-confirm"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p role="alert" className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {authError && (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {authError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : t.auth.signUp.submitButton}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {t.auth.signUp.terms}
        </p>
      </form>
    </div>
  )
}

// --- Login Page ---------------------------------------------------

function LoginPageContent() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "signin"
  const errorParam = searchParams.get("error")

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-sm">

        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-bold text-lg"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          SnapLinks
        </Link>

        {errorParam && (
          <div
            role="alert"
            className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive text-center"
          >
            Authentication failed. Please try again.
          </div>
        )}

        <Card>
          <Tabs defaultValue={defaultTab}>
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="signin">
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-lg">{t.auth.signIn.title}</CardTitle>
                <CardDescription>{t.auth.signIn.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <SignInForm />
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <p className="text-xs text-muted-foreground">
                  {t.auth.signIn.noAccount}{" "}
                  <Link
                    href="/login?tab=signup"
                    className="font-medium text-primary hover:underline underline-offset-4"
                  >
                    {t.auth.signIn.signUpLink}
                  </Link>
                </p>
              </CardFooter>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-lg">{t.auth.signUp.title}</CardTitle>
                <CardDescription>{t.auth.signUp.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpForm />
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <p className="text-xs text-muted-foreground">
                  {t.auth.signUp.hasAccount}{" "}
                  <Link
                    href="/login?tab=signin"
                    className="font-medium text-primary hover:underline underline-offset-4"
                  >
                    {t.auth.signUp.signInLink}
                  </Link>
                </p>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  )
}
