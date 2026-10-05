import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Logo } from "@/components/portal/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  requestOtp,
  verifyOtp,
} from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Sign in — Cornixe Employee Portal",
      },
      {
        name: "description",
        content:
          "Sign in to the Cornixe Employee Portal to mark attendance and apply for leave.",
      },
      {
        property: "og:title",
        content: "Sign in — Cornixe Employee Portal",
      },
      {
        property: "og:description",
        content:
          "Attendance and leave management for the Cornixe team.",
      },
    ],
  }),
  component: LoginPage,
});

type LoginStep = "email" | "checking" | "otp";

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

function LoginPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [requestId, setRequestId] = useState("");

  const [location, setLocation] =
    useState<LocationData | null>(null);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(0);

  /*
   * ----------------------------------------------------------
   * OTP COUNTDOWN
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [step, secondsLeft]);

  /*
   * ----------------------------------------------------------
   * GET CURRENT LOCATION
   * ----------------------------------------------------------
   */

  const getCurrentLocation =
    (): Promise<LocationData> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(
            new Error(
              "Location services are not supported by this browser."
            )
          );
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            let message =
              "Unable to get your location.";

            switch (error.code) {
              case error.PERMISSION_DENIED:
                message =
                  "Location permission was denied. Please allow location access and try again.";
                break;

              case error.POSITION_UNAVAILABLE:
                message =
                  "Your current location could not be determined. Please try again.";
                break;

              case error.TIMEOUT:
                message =
                  "Location request timed out. Please try again.";
                break;
            }

            reject(new Error(message));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      });
    };

  /*
   * ----------------------------------------------------------
   * REQUEST OTP
   * ----------------------------------------------------------
   */

  const handleRequestOtp = async () => {
    setError("");

    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError(
        "Please enter your Cornixe work email."
      );
      return;
    }

    if (!trimmedEmail.endsWith("@cornixe.in")) {
      setError(
        "Please use your Cornixe work email address."
      );
      return;
    }

    setLoading(true);
    setStep("checking");

    try {
      /*
       * Ask browser for location
       */
      const currentLocation =
        await getCurrentLocation();

      setLocation(currentLocation);

      /*
       * Send email + location to backend
       */
      const result = await requestOtp(
        trimmedEmail,
        currentLocation.latitude,
        currentLocation.longitude
      );

      console.log(
        "Cornixe OTP request:",
        result
      );

      if (!result.success) {
        /*
         * Outside office
         */
        if (
          result.code === "OUTSIDE_OFFICE"
        ) {
          const distance =
            result.distance
              ? `${Math.round(result.distance)} m`
              : "";

          setError(
            distance
              ? `You are approximately ${distance} from the Cornixe office. You must be within 100 metres to continue.`
              : "You must be within 100 metres of the Cornixe office to continue."
          );
        } else {
          setError(
            result.message ||
              "Unable to send OTP."
          );
        }

        setStep("email");
        return;
      }

      /*
       * OTP successfully generated
       */
      setRequestId(
        result.requestId || ""
      );

      setOtp("");

      setSecondsLeft(
        (result.expiresInMinutes || 5) *
          60
      );

      setStep("otp");
    } catch (error) {
      console.error(
        "OTP request failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to verify your location."
      );

      setStep("email");
    } finally {
      setLoading(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * VERIFY OTP
   * ----------------------------------------------------------
   */

  const handleVerifyOtp = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    setError("");

    const trimmedOtp =
      otp.replace(/\D/g, "");

    if (trimmedOtp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    if (!requestId) {
      setError(
        "Your OTP request has expired. Please request a new OTP."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * Get location AGAIN during verification.
       *
       * We don't rely on the location from
       * the first step.
       */
      const currentLocation =
        await getCurrentLocation();

      setLocation(currentLocation);

      const result = await verifyOtp(
        email.trim().toLowerCase(),
        trimmedOtp,
        requestId,
        currentLocation.latitude,
        currentLocation.longitude
      );

      console.log(
        "Cornixe OTP verification:",
        result
      );

      if (!result.success) {
        if (
          result.code === "OUTSIDE_OFFICE"
        ) {
          setError(
            "You are no longer within the 100-metre Cornixe office area."
          );
        } else if (
          result.code === "OTP_EXPIRED"
        ) {
          setError(
            "Your OTP has expired. Please request a new one."
          );
        } else if (
          result.code === "OTP_INVALID"
        ) {
          setError(
            result.message ||
              "Incorrect OTP. Please try again."
          );
        } else {
          setError(
            result.message ||
              "Unable to verify OTP."
          );
        }

        return;
      }

      /*
       * LOGIN SUCCESS
       *
       * Store ONLY employee information.
       * Never store OTP.
       */
      if (!result.employee) {
        setError(
          "Employee details were not returned by the server."
        );
        return;
      }

      localStorage.setItem(
        "cornixe_employee",
        JSON.stringify(result.employee)
      );

      /*
       * Go to dashboard
       */
      navigate({
        to: "/dashboard",
      });
    } catch (error) {
      console.error(
        "OTP verification failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * RESEND OTP
   * ----------------------------------------------------------
   */

  const handleResendOtp = async () => {
    if (resending) {
      return;
    }

    setError("");
    setResending(true);

    try {
      const currentLocation =
        await getCurrentLocation();

      setLocation(currentLocation);

      const result = await requestOtp(
        email.trim().toLowerCase(),
        currentLocation.latitude,
        currentLocation.longitude
      );

      console.log(
        "Cornixe OTP resend:",
        result
      );

      if (!result.success) {
        if (
          result.code === "OTP_COOLDOWN"
        ) {
          setError(
            result.message ||
              "Please wait before requesting another OTP."
          );
        } else {
          setError(
            result.message ||
              "Unable to resend OTP."
          );
        }

        return;
      }

      setRequestId(
        result.requestId || ""
      );

      setOtp("");

      setSecondsLeft(
        (result.expiresInMinutes || 5) *
          60
      );
    } catch (error) {
      console.error(
        "OTP resend failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * BACK TO EMAIL
   * ----------------------------------------------------------
   */

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setRequestId("");
    setLocation(null);
    setError("");
    setSecondsLeft(0);
  };

  /*
   * ----------------------------------------------------------
   * FORMAT TIMER
   * ----------------------------------------------------------
   */

  const formatTime = (
    totalSeconds: number
  ) => {
    const minutes = Math.floor(
      totalSeconds / 60
    );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-surface grid min-h-screen lg:grid-cols-2">

      {/* =====================================================
          LEFT SIDE
      ====================================================== */}

      <div className="flex items-center justify-center px-5 py-10 sm:px-10">

        <div className="w-full max-w-sm">

          <Logo />

          {/* =================================================
              EMAIL STEP
          ================================================== */}

          {step === "email" && (
            <>
              <h1 className="mt-8 text-2xl font-semibold text-foreground">
                Employee Portal
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in with your Cornixe work
                email to continue.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRequestOtp();
                }}
                className="mt-8 space-y-5"
              >

                {/* EMAIL */}

                <div className="space-y-2">

                  <Label htmlFor="email">
                    Work email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="name@cornixe.in"
                    autoComplete="email"
                    disabled={loading}
                  />

                </div>

                {/* LOCATION NOTICE */}

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">

                  <div className="flex gap-3">

                    <div className="mt-0.5">

                      <MapPin className="h-5 w-5 text-primary" />

                    </div>

                    <div>

                      <p className="text-sm font-medium text-foreground">
                        Location verification required
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        You must be within
                        100 metres of the
                        Cornixe office to
                        request a login OTP.
                      </p>

                    </div>

                  </div>

                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* CONTINUE */}

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-brand h-11 w-full text-base font-semibold text-white transition-opacity hover:opacity-90"
                >

                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Checking location…
                    </>
                  ) : (
                    <>
                      <MapPin />
                      Continue
                    </>
                  )}

                </Button>

              </form>

              <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">

                <ShieldCheck className="h-4 w-4" />

                Accounts are created by the
                Cornixe management team.

              </p>
            </>
          )}

          {/* =================================================
              LOCATION CHECKING
          ================================================== */}

          {step === "checking" && (
            <div className="mt-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">

                <MapPin className="h-7 w-7 animate-pulse text-primary" />

              </div>

              <h1 className="mt-6 text-2xl font-semibold text-foreground">
                Checking your location
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Please allow location access.
                We're verifying that you're
                within the Cornixe office area.
              </p>

              <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-primary" />

            </div>
          )}

          {/* =================================================
              OTP STEP
          ================================================== */}

          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="mt-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <h1 className="mt-6 text-2xl font-semibold text-foreground">
                Verify your email
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                We've sent a 6-digit OTP to
              </p>

              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                {email}
              </p>

              {/* LOCATION VERIFIED */}

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">

                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />

                <div>

                  <p className="text-sm font-medium text-green-700">
                    Location verified
                  </p>

                  {location && (
                    <p className="mt-0.5 text-xs text-green-600">
                      Your location has been
                      verified successfully.
                    </p>
                  )}

                </div>

              </div>

              <form
                onSubmit={handleVerifyOtp}
                className="mt-7 space-y-5"
              >

                {/* OTP */}

                <div className="space-y-2">

                  <Label htmlFor="otp">
                    Enter OTP
                  </Label>

                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 6);

                      setOtp(value);
                    }}
                    placeholder="000000"
                    className="h-12 text-center text-xl font-semibold tracking-[0.45em]"
                    disabled={loading}
                    autoFocus
                  />

                </div>

                {/* TIMER */}

                <div className="text-center text-sm text-muted-foreground">

                  {secondsLeft > 0 ? (
                    <>
                      OTP expires in{" "}
                      <span className="font-semibold text-foreground">
                        {formatTime(
                          secondsLeft
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-600">
                      OTP expired
                    </span>
                  )}

                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* VERIFY */}

                <Button
                  type="submit"
                  disabled={
                    loading ||
                    otp.length !== 6 ||
                    secondsLeft <= 0
                  }
                  className="bg-gradient-brand h-11 w-full text-base font-semibold text-white transition-opacity hover:opacity-90"
                >

                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <ShieldCheck />
                      Verify & Login
                    </>
                  )}

                </Button>

                {/* RESEND */}

                <div className="flex items-center justify-center">

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={
                      resending ||
                      secondsLeft > 0
                    }
                    className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50"
                  >

                    {resending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Resend OTP
                      </>
                    )}

                  </button>

                </div>

              </form>
            </>
          )}

        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="bg-gradient-brand relative hidden overflow-hidden lg:block">

        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-end p-12 text-white">

          <p className="text-sm font-medium tracking-[0.25em] uppercase opacity-80">
            Empowering your vision
          </p>

          <h2 className="mt-4 max-w-md text-3xl leading-snug font-semibold">
            Attendance, working hours and leave
            — all in one calm workspace.
          </h2>

          <p className="mt-4 max-w-sm text-sm opacity-85">
            Securely sign in with your work
            email and location verification,
            then manage your attendance and
            leave requests from one place.
          </p>

        </div>

      </div>

    </div>
  );
}