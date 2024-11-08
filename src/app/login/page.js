import dynamic from "next/dynamic";

const Login = dynamic(() => import("@/views/auth/login"), {
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <Login />;
}
