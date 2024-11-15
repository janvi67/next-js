import dynamic from "next/dynamic";

const FamilyDetails = dynamic(() => import("@/views/familyDetails") ,{
  loading: () => <h1>loading..</h1>,
});

export default function Page() {
  return <FamilyDetails/>;
}
