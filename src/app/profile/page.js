import dynamic from "next/dynamic";

const Profile = dynamic(() => import("@/views/profile"), {
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <Profile />;
}
