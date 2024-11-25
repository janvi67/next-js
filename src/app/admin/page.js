import dynamic from "next/dynamic";

const Admin = dynamic(() => import("@/views/admin") ,{
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <Admin/>;
}
