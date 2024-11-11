import dynamic from "next/dynamic";

const Forgetpwd = dynamic(() => import("@/views/auth/forgetpwd"), {
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <Forgetpwd />;
}
