import dynamic from "next/dynamic";

const Showusers = dynamic(() => import("@/views/showusers"), {
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <Showusers />;
}
