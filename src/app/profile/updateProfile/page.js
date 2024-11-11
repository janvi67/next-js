import dynamic from "next/dynamic";

const UpdateProfile = dynamic(() => import("@/views/profile/updateProfile"), {
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <UpdateProfile />;
}
