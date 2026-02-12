import { redirect } from "next/navigation";

export default function SignupPage(): never {
  redirect("/auth/login");
}
