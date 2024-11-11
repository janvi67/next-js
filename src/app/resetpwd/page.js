import dynamic from "next/dynamic";

const Resetpwd = dynamic(() => import("@/views/auth/resetpwd"), {
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <Resetpwd />;
}
