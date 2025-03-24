"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BiLoaderAlt, BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { CustomBtn } from "./customButtons";

export function LoginButton() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    try {
      //throw new Error("test");
      setLoading(true);
      await signIn("github", { callbackUrl: "/" });
    } catch {
      setErrorMessage("Échec de la connexion. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    /* const token = session?.accessToken;
    if (token) await createRevokedToken(token); */
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-12 w-12 rounded-lg border border-primary/20"
        aria-label="Login"
      />
    );
  }
  return (
    <>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <CustomBtn
        className={`top-16 right-0 z-50 pl-3 border-r-0 rounded-tr-none rounded-br-none ${
          session?.user?.role === "admin"
            ? "text-destructive border-destructive"
            : ""
        }`}
        theme="sticky"
        ariaLabel="Connection à mon compte"
        onClick={session ? handleLogout : handleSignIn}
      >
        {loading ? (
          <div className="animate-spin">
            <BiLoaderAlt className="size-[1.5rem]" />
          </div>
        ) : session?.user?.role === "admin" ? (
          <BiLogOutCircle className="size-[1.5rem]" />
        ) : (
          <BiLogInCircle className="size-[1.5rem]" />
        )}
      </CustomBtn>
    </>
  );
}
