import dynamic from "next/dynamic";

const Register = dynamic(() => import("@/views/auth/register"), {
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <Register />;
}
